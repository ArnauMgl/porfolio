// Pruebas del backend del formulario de contacto. Se ejecutan con: npm test
// No envían correos reales: Turnstile y Resend se sustituyen por respuestas simuladas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { manejar, esTrampa } from '../lib/contacto/manejador.js';
import { MENSAJES } from '../lib/contacto/validar.js';
import { origenPermitido } from '../lib/contacto/origen.js';
import { componerCorreo } from '../lib/contacto/correo.js';
import { MAXIMO } from '../lib/contacto/limite.js';

const AHORA = 1_800_000_000_000;

// KV en memoria
function kvFalso() {
  const m = new Map();
  return { get: async (k) => m.get(k) ?? null, put: async (k, v) => { m.set(k, v); }, m };
}

// Simula Turnstile y Resend. Guarda lo que se envió para poder revisarlo.
function red({ turnstile = { success: true, hostname: 'arnaularripa.com' }, resend = 200 } = {}) {
  const llamadas = { turnstile: 0, resend: [] };
  const fetchFn = async (url, opciones) => {
    if (String(url).includes('siteverify')) {
      llamadas.turnstile++;
      if (turnstile === 'caido') throw new Error('red');
      return Response.json(turnstile);
    }
    llamadas.resend.push(JSON.parse(opciones.body));
    if (resend === 'caido') throw new Error('red');
    return new Response('{}', { status: resend });
  };
  return { fetchFn, llamadas };
}

const ENV = () => ({ TURNSTILE_SECRET_KEY: 'secreto', RESEND_API_KEY: 're_x', RATE_LIMIT: kvFalso() });

function peticion(cuerpo = {}, { origin = 'https://arnaularripa.com', ip = '1.2.3.4', tipo = 'application/json', metodo = 'POST' } = {}) {
  const datos = {
    name: 'Ana', email: 'ana@ejemplo.com', message: 'Hola, ¿hablamos?', website: '',
    startedAt: AHORA - 10_000, turnstileToken: 'token-bueno', ...cuerpo,
  };
  const headers = { 'Content-Type': tipo, 'CF-Connecting-IP': ip };
  if (origin) headers.Origin = origin;
  return new Request('https://arnaularripa.com/api/contact', {
    method: metodo, headers, body: metodo === 'POST' ? (typeof cuerpo === 'string' ? cuerpo : JSON.stringify(datos)) : undefined,
  });
}

async function llamar(req, env = ENV(), r = red()) {
  const resp = await manejar(req, env, { fetchFn: r.fetchFn, ahora: () => AHORA });
  const cuerpo = resp.status === 405 ? null : await resp.json();
  return { estado: resp.status, cuerpo, llamadas: r.llamadas };
}

test('éxito: 200 { ok: true } y un correo enviado con los datos correctos', async () => {
  const { estado, cuerpo, llamadas } = await llamar(peticion());
  assert.equal(estado, 200);
  assert.deepEqual(cuerpo, { ok: true });
  assert.equal(llamadas.turnstile, 1);
  assert.equal(llamadas.resend.length, 1);
  const c = llamadas.resend[0];
  assert.equal(c.from, 'Web arnaularripa.com <formulario@arnaularripa.com>');
  assert.deepEqual(c.to, ['hola@arnaularripa.com']);
  assert.equal(c.reply_to, 'ana@ejemplo.com');
  assert.equal(c.subject, 'Nuevo mensaje de Ana desde arnaularripa.com');
  assert.match(c.text, /Hola, ¿hablamos\?/);
  assert.equal(c.html, undefined, 'solo texto plano');
});

test('validación: 400 con el mensaje de cada campo vacío', async () => {
  const { estado, cuerpo, llamadas } = await llamar(peticion({ name: ' ', email: '', message: '' }));
  assert.equal(estado, 400);
  assert.deepEqual(cuerpo, { errors: { name: MENSAJES.nombreVacio, email: MENSAJES.emailVacio, message: MENSAJES.mensajeVacio } });
  assert.equal(llamadas.resend.length, 0);
});

test('validación: email con formato incorrecto', async () => {
  for (const email of ['ana', 'ana@', 'ana@dominio', 'a b@c.com', 'ana@x.com, otro@y.com', 'Ana <ana@x.com>']) {
    const { estado, cuerpo } = await llamar(peticion({ email }));
    assert.equal(estado, 400, email);
    assert.deepEqual(cuerpo, { errors: { email: MENSAJES.emailInvalido } }, email);
  }
  const ok = await llamar(peticion({ email: "o'brien+web@sub.dominio.es" }));
  assert.equal(ok.estado, 200);
});

test('validación: límites de longitud', async () => {
  const { estado, cuerpo } = await llamar(peticion({ name: 'a'.repeat(101), email: `${'a'.repeat(250)}@x.es`, message: 'm'.repeat(5001) }));
  assert.equal(estado, 400);
  assert.deepEqual(cuerpo, { errors: { name: MENSAJES.nombreLargo, email: MENSAJES.emailLargo, message: MENSAJES.mensajeLargo } });
  const justo = await llamar(peticion({ name: 'a'.repeat(100), message: 'm'.repeat(5000) }));
  assert.equal(justo.estado, 200);
});

test('validación: campos que no son texto cuentan como vacíos', async () => {
  const { estado, cuerpo } = await llamar(peticion({ name: 42, email: ['a@b.es'], message: { a: 1 } }));
  assert.equal(estado, 400);
  assert.deepEqual(Object.keys(cuerpo.errors), ['name', 'email', 'message']);
});

test('honeypot relleno: 200 falso sin enviar nada ni consultar Turnstile', async () => {
  const { estado, cuerpo, llamadas } = await llamar(peticion({ website: 'http://spam.example' }));
  assert.equal(estado, 200);
  assert.deepEqual(cuerpo, { ok: true });
  assert.equal(llamadas.turnstile, 0);
  assert.equal(llamadas.resend.length, 0);
});

test('envío demasiado rápido (< 3 s) o sin startedAt: 200 falso sin enviar', async () => {
  for (const startedAt of [AHORA - 1000, AHORA, undefined, 'abc', 0]) {
    const { estado, llamadas } = await llamar(peticion({ startedAt }));
    assert.equal(estado, 200, String(startedAt));
    assert.equal(llamadas.resend.length, 0, String(startedAt));
  }
});

test('reloj de quien escribe adelantado: el mensaje NO se descarta', async () => {
  assert.equal(esTrampa({ website: '', startedAt: AHORA + 120_000 }, AHORA), false);
  const { estado, llamadas } = await llamar(peticion({ startedAt: AHORA + 120_000 }));
  assert.equal(estado, 200);
  assert.equal(llamadas.resend.length, 1);
});

test('Turnstile inválido, ausente, de otro dominio o caído: 403 sin enviar', async () => {
  const casos = [
    [{}, red({ turnstile: { success: false, 'error-codes': ['invalid-input-response'] } })],
    [{ turnstileToken: '' }, red()],
    [{}, red({ turnstile: { success: true, hostname: 'otra-web.com' } })],
    [{}, red({ turnstile: 'caido' })],
  ];
  for (const [cuerpo, r] of casos) {
    const { estado, cuerpo: c, llamadas } = await llamar(peticion(cuerpo), ENV(), r);
    assert.equal(estado, 403);
    assert.deepEqual(c, { ok: false });
    assert.equal(llamadas.resend.length, 0);
  }
});

test('origen: solo arnaularripa.com y las vistas previas del proyecto', () => {
  assert.equal(origenPermitido('https://arnaularripa.com'), 'arnaularripa.com');
  assert.equal(origenPermitido('https://www.arnaularripa.com'), 'www.arnaularripa.com');
  assert.equal(origenPermitido('https://arnaularripa.pages.dev'), 'arnaularripa.pages.dev');
  assert.equal(origenPermitido('https://feature-backend-contacto.arnaularripa.pages.dev'), 'feature-backend-contacto.arnaularripa.pages.dev');
  for (const o of ['https://otro.pages.dev', 'https://arnaularripa.com.evil.com', 'http://arnaularripa.com',
    'https://evilarnaularripa.pages.dev', 'https://arnaularripa.com:8443', 'null', '', null, 'http://localhost:8788']) {
    assert.equal(origenPermitido(o), null, String(o));
  }
  assert.equal(origenPermitido('http://localhost:8788', { ENTORNO: 'local' }), 'localhost');
});

test('origen no permitido o ausente: 403 sin enviar', async () => {
  for (const origin of ['https://otro.pages.dev', null]) {
    const { estado, llamadas } = await llamar(peticion({}, { origin }));
    assert.equal(estado, 403);
    assert.equal(llamadas.turnstile + llamadas.resend.length, 0);
  }
});

test('límite de envíos: el intento 6 en la misma hora desde la misma IP recibe 429', async () => {
  const env = ENV();
  for (let i = 0; i < MAXIMO; i++) assert.equal((await llamar(peticion(), env)).estado, 200);
  const sexto = await llamar(peticion(), env);
  assert.equal(sexto.estado, 429);
  assert.equal(sexto.llamadas.resend.length, 0);
  // Otra IP sí puede enviar
  assert.equal((await llamar(peticion({}, { ip: '5.6.7.8' }), env)).estado, 200);
  // En KV no se guarda la IP en claro
  for (const clave of env.RATE_LIMIT.m.keys()) assert.ok(!clave.includes('1.2.3.4'));
});

test('fallo de Resend (rechazo o caída): 502, que el cliente muestra como error', async () => {
  for (const resend of [401, 422, 500, 'caido']) {
    const { estado, cuerpo } = await llamar(peticion(), ENV(), red({ resend }));
    assert.equal(estado, 502, String(resend));
    assert.deepEqual(cuerpo, { ok: false });
  }
});

test('faltan variables de entorno: 500', async () => {
  const { estado } = await llamar(peticion(), { RATE_LIMIT: kvFalso() });
  assert.equal(estado, 500);
});

test('formato: método, tipo de contenido, JSON roto y tamaño', async () => {
  assert.equal((await llamar(peticion({}, { metodo: 'GET' }))).estado, 405);
  assert.equal((await llamar(peticion({}, { tipo: 'text/plain' }))).estado, 415);
  assert.equal((await llamar(peticion('{roto'))).estado, 400);
  assert.equal((await llamar(peticion('[1,2]'))).estado, 400);
  const enorme = await llamar(peticion({ message: 'x'.repeat(20_000) }));
  assert.equal(enorme.estado, 413);
});

test('inyección: el nombre no puede añadir cabeceras al asunto y no hay HTML', () => {
  // validar() ya convierte los saltos de línea del nombre en espacios; aquí se comprueba el resultado final
  return llamar(peticion({ name: 'Ana\r\nBcc: victima@x.com', message: '<script>alert(1)</script>' })).then(({ estado, llamadas }) => {
    assert.equal(estado, 200);
    const c = llamadas.resend[0];
    assert.ok(!/[\r\n]/.test(c.subject));
    assert.equal(c.subject, 'Nuevo mensaje de Ana Bcc: victima@x.com desde arnaularripa.com');
    assert.equal(c.html, undefined);
    assert.deepEqual(Object.keys(componerCorreo({ name: 'a', email: 'a@b.es', message: 'm' })).sort(), ['from', 'reply_to', 'subject', 'text', 'to']);
  });
});

test('logs: nunca aparecen el nombre, el email ni el mensaje', async () => {
  const lineas = [];
  const original = console.error;
  console.error = (...a) => lineas.push(a.join(' '));
  try {
    await llamar(peticion({ name: 'NombreSecreto', email: 'secreto@privado.es', message: 'TextoSecreto' }), ENV(), red({ resend: 500 }));
    await llamar(peticion({ name: 'NombreSecreto', email: 'secreto@privado.es', message: 'TextoSecreto' }), ENV(), red({ turnstile: 'caido' }));
  } finally { console.error = original; }
  assert.ok(lineas.length >= 2);
  for (const l of lineas) assert.ok(!/Secreto|secreto@privado/.test(l), l);
});
