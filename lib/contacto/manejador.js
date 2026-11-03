// Lógica completa de POST /api/contact. La función de Cloudflare (functions/api/contact.js) solo la llama.
// Orden: origen → formato → trampas antispam → validación → límite de envíos → Turnstile → Resend.
// Nunca se registra en los logs el nombre, el email ni el mensaje: solo el tipo de fallo.

import { origenPermitido } from './origen.js';
import { validar } from './validar.js';
import { verificarTurnstile } from './turnstile.js';
import { dentroDelLimite } from './limite.js';
import { componerCorreo, enviarCorreo } from './correo.js';

export const TAMANO_MAXIMO = 16 * 1024; // bytes
export const TIEMPO_MINIMO = 3000;     // ms entre abrir el formulario y enviarlo

const json = (estado, cuerpo) => new Response(JSON.stringify(cuerpo), {
  status: estado,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
const OK = () => json(200, { ok: true });
const FALLO = (estado) => json(estado, { ok: false });

/**
 * ¿Es un envío de robot que debemos ignorar en silencio?
 * - El campo trampa «website» llega relleno.
 * - Se envió menos de 3 s después de abrir el formulario.
 * startedAt lo pone el reloj del ordenador de quien escribe. Si ese reloj va desfasado
 * (el dato queda en el futuro o no tiene sentido), NO lo descartamos: decide Turnstile.
 */
export function esTrampa(datos, ahora = Date.now()) {
  if (typeof datos.website !== 'string' || datos.website !== '') return true;
  const inicio = Number(datos.startedAt);
  if (!Number.isFinite(inicio) || inicio <= 0) return true;
  const transcurrido = ahora - inicio;
  return transcurrido >= 0 && transcurrido < TIEMPO_MINIMO;
}

export async function manejar(request, env = {}, { fetchFn = fetch, ahora = Date.now } = {}) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  }

  // 1. Origen
  const host = origenPermitido(request.headers.get('Origin'), env);
  if (!host) return FALLO(403);

  // 2. Formato
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return FALLO(415);
  const declarado = Number(request.headers.get('Content-Length') || 0);
  if (declarado > TAMANO_MAXIMO) return FALLO(413);
  const bruto = await request.text();
  if (new TextEncoder().encode(bruto).length > TAMANO_MAXIMO) return FALLO(413);
  let datos;
  try { datos = JSON.parse(bruto); } catch { return FALLO(400); }
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return FALLO(400);

  // 3. Trampas: respondemos como si todo hubiera ido bien, para que el robot no se entere.
  if (esTrampa(datos, ahora())) return OK();

  // 4. Validación
  const { valores, errores } = validar(datos);
  if (Object.keys(errores).length) return json(400, { errors: errores });

  // Configuración obligatoria
  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY) {
    console.error('contacto: faltan variables de entorno (TURNSTILE_SECRET_KEY o RESEND_API_KEY)');
    return FALLO(500);
  }
  const local = env.ENTORNO === 'local';
  const ip = request.headers.get('CF-Connecting-IP') || '';

  // 5. Límite de envíos
  if (!(await dentroDelLimite({ kv: env.RATE_LIMIT, ip, clave: env.TURNSTILE_SECRET_KEY, ahora: ahora() }))) {
    return FALLO(429);
  }

  // 6. Turnstile
  const humano = await verificarTurnstile({
    token: datos.turnstileToken, ip, secreto: env.TURNSTILE_SECRET_KEY, host, local, fetchFn,
    url: local && env.TURNSTILE_VERIFY_URL ? env.TURNSTILE_VERIFY_URL : undefined,
  });
  if (!humano) return FALLO(403);

  // 7. Envío. En local se puede apuntar a un Resend simulado (RESEND_API_URL) para probar sin enviar correos.
  //    (Igual con TURNSTILE_VERIFY_URL en el paso 6.) Fuera de ENTORNO=local esas dos variables se ignoran.
  const enviado = await enviarCorreo({
    correo: componerCorreo(valores),
    apiKey: env.RESEND_API_KEY,
    url: local && env.RESEND_API_URL ? env.RESEND_API_URL : undefined,
    fetchFn,
  });
  return enviado ? OK() : FALLO(502);
}
