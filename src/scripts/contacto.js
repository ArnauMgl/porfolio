// Panel de contacto: apertura/cierre, historial (#contacto), validación, envío y copiar email.
// La capa de red está aislada en enviarContacto(datos). El backend (Cloudflare + Resend) llega después.

const EMAIL = 'hola@arnaularripa.com';

const MENSAJES = {
  nombreVacio: 'Dime cómo te llamas para saber a quién responder.',
  emailVacio: 'Necesito tu email para poder responderte.',
  emailInvalido: 'Parece que falta algo en el email. Prueba con un formato como nombre@dominio.com.',
  mensajeVacio: 'Escribe unas líneas sobre lo que tienes en mente.',
};

const ICONO_AVISO = '<svg class="ds-icon-sm" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" aria-hidden="true"><circle cx="128" cy="128" r="96"></circle><line x1="128" y1="80" x2="128" y2="136"></line><circle cx="128" cy="172" r="12" fill="currentColor" stroke="none"></circle></svg>';
const ICONO_COPIAR = '<svg class="ds-icon" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="40" y="88" width="128" height="128" rx="8"></rect><polyline points="168 88 168 40 216 40 216 168 168 168"></polyline></svg>';
const ICONO_CHECK = '<svg class="ds-icon ds-check" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="40 144 96 200 224 72"></polyline></svg>';

// ---------------------------------------------------------------------------
// Red. Única función que habla con el servidor (o con el simulador).
// Devuelve { ok: true } | { ok: false, errores?: { campo: 'mensaje' } }
// ---------------------------------------------------------------------------
const ES_PRODUCCION = /(^|\.)arnaularripa\.com$/.test(location.hostname);

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function simular(modo) {
  if (modo === 'exito') { await esperar(1200); return { ok: true }; }
  if (modo === 'lento') { await esperar(4000); return { ok: true }; }
  if (modo === 'error') { await esperar(1000); return { ok: false }; }
  if (modo === 'validacion') {
    await esperar(800);
    return { ok: false, errores: { name: MENSAJES.nombreVacio, email: MENSAJES.emailInvalido, message: MENSAJES.mensajeVacio } };
  }
  return null;
}

export async function enviarContacto(datos) {
  // Simulador: solo fuera de arnaularripa.com (localhost y vistas previas). Ej.: ?simular=error
  if (!ES_PRODUCCION) {
    const modo = new URLSearchParams(location.search).get('simular');
    const r = modo ? await simular(modo) : null;
    if (r) return r;
  }
  try {
    const resp = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (resp.status === 200) {
      const json = await resp.json().catch(() => null);
      return json && json.ok === true ? { ok: true } : { ok: false };
    }
    if (resp.status === 400) {
      const json = await resp.json().catch(() => null);
      if (json && json.errors && typeof json.errors === 'object') return { ok: false, errores: json.errors };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

// ---------------------------------------------------------------------------
// Interfaz
// ---------------------------------------------------------------------------
const dialogo = document.getElementById('contacto');
if (dialogo && typeof dialogo.showModal === 'function') iniciar(dialogo);

function iniciar(dialogo) {
  const form = dialogo.querySelector('#contacto-form');
  const boton = dialogo.querySelector('#contacto-enviar');
  const etiquetaBoton = dialogo.querySelector('.ds-contact__submit-label');
  const alerta = dialogo.querySelector('#contacto-alerta');
  const estadoSr = dialogo.querySelector('#contacto-estado');
  const copiar = dialogo.querySelector('[data-copiar]');
  const copiaSr = dialogo.querySelector('#contacto-copia');
  const emailTexto = dialogo.querySelector('#contacto-email-texto');
  const html = document.documentElement;

  const campos = {
    name: { el: form.elements.name, error: dialogo.querySelector('#contacto-nombre-error') },
    email: { el: form.elements.email, error: dialogo.querySelector('#contacto-email-error') },
    message: { el: form.elements.message, error: dialogo.querySelector('#contacto-mensaje-error') },
  };
  const orden = ['name', 'email', 'message'];

  let abierta = false;
  let empezado = 0;      // marca de tiempo de apertura (startedAt)
  let intentado = false; // ya se intentó enviar: a partir de ahí se valida al salir de cada campo
  let enviando = false;
  let hubo_error_envio = false;

  // ---- Vistas y estado ----
  function vista(nombre) {
    dialogo.querySelectorAll('[data-vista]').forEach((el) => { el.hidden = el.dataset.vista !== nombre; });
    dialogo.setAttribute('aria-labelledby', nombre === 'exito' ? 'contacto-titulo-exito' : 'contacto-titulo');
  }

  function poner(estado) {
    dialogo.dataset.estado = estado;
    const sending = estado === 'enviando';
    if (sending) { form.setAttribute('aria-busy', 'true'); boton.setAttribute('aria-disabled', 'true'); }
    else { form.removeAttribute('aria-busy'); boton.removeAttribute('aria-disabled'); }
    orden.forEach((n) => { campos[n].el.readOnly = sending; });
    etiquetaBoton.textContent = sending ? 'Enviando…' : (hubo_error_envio ? 'Reintentar envío' : 'Enviar mensaje');
    estadoSr.textContent = sending ? 'Enviando tu mensaje' : '';
  }

  // ---- Validación ----
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function mensajeDe(nombre) {
    const v = campos[nombre].el.value.trim();
    if (nombre === 'name') return v ? '' : MENSAJES.nombreVacio;
    if (nombre === 'email') return !v ? MENSAJES.emailVacio : (EMAIL_RE.test(v) ? '' : MENSAJES.emailInvalido);
    return v ? '' : MENSAJES.mensajeVacio;
  }
  function pintar(nombre, texto) {
    const { el, error } = campos[nombre];
    if (texto) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', error.id);
      error.innerHTML = ICONO_AVISO;
      const sr = document.createElement('span');
      sr.className = 'ds-sr';
      sr.textContent = 'Error: ';
      const t = document.createElement('span');
      t.textContent = texto;
      error.append(sr, t);
    } else {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
      error.textContent = '';
    }
  }
  function validar(nombre) { const m = mensajeDe(nombre); pintar(nombre, m); return !m; }
  function validarTodo() {
    let primero = null;
    orden.forEach((n) => { if (!validar(n) && !primero) primero = n; });
    return primero;
  }

  orden.forEach((n) => {
    campos[n].el.addEventListener('blur', () => { if (intentado && !enviando && abierta) validar(n); });
  });

  // ---- Envío ----
  function datos() {
    return {
      name: campos.name.el.value.trim(),
      email: campos.email.el.value.trim(),
      message: campos.message.el.value.trim(),
      website: form.elements.website.value,
      startedAt: empezado,
      turnstileToken: '', // TODO: Cloudflare Turnstile se integra después
    };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (enviando) return;
    intentado = true;
    const primero = validarTodo();
    if (primero) { campos[primero].el.focus(); return; }

    alerta.textContent = '';
    enviando = true;
    poner('enviando');
    const payload = datos();
    const r = await enviarContacto(payload);
    enviando = false;

    if (r.ok) {
      hubo_error_envio = false;
      if (!abierta) { reiniciar(); return; } // la cerraron mientras se enviaba
      poner('exito');
      dialogo.querySelector('#contacto-gracias').textContent = `Gracias, ${payload.name}. Te responderé desde ${EMAIL}.`;
      vista('exito');
      dialogo.querySelector('#contacto-titulo-exito').focus();
      return;
    }
    if (r.errores) {
      hubo_error_envio = false;
      poner('form');
      let primero2 = null;
      orden.forEach((n) => { if (r.errores[n]) { pintar(n, String(r.errores[n])); if (!primero2) primero2 = n; } });
      if (primero2) { campos[primero2].el.focus(); return; }
    }
    hubo_error_envio = true;
    poner('error');
    alerta.innerHTML = ICONO_AVISO;
    const cuerpo = document.createElement('div');
    const fuerte = document.createElement('strong');
    fuerte.textContent = 'No se ha podido enviar tu mensaje.';
    cuerpo.append(fuerte, `Tus datos siguen aquí. Vuelve a intentarlo o escríbeme a ${EMAIL}.`);
    alerta.append(cuerpo);
    boton.focus();
  });

  // ---- Copiar email ----
  let temporizadorCopia = 0;
  function pintarCopiar(copiado) {
    copiar.innerHTML = copiado ? `${ICONO_CHECK}<span>Copiado</span>` : `${ICONO_COPIAR}<span>Copiar email</span>`;
  }
  copiar.addEventListener('click', async () => {
    clearTimeout(temporizadorCopia);
    try {
      await navigator.clipboard.writeText(EMAIL);
      pintarCopiar(true);
      copiaSr.textContent = 'Email copiado';
      temporizadorCopia = setTimeout(() => { pintarCopiar(false); copiaSr.textContent = ''; }, 2000);
    } catch {
      const rango = document.createRange();
      rango.selectNodeContents(emailTexto);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(rango);
      copiaSr.textContent = '';
      requestAnimationFrame(() => { copiaSr.textContent = 'No se pudo copiar. Selecciona el email manualmente.'; });
    }
  });

  // ---- Abrir / cerrar ----
  function reiniciar() {
    form.reset();
    orden.forEach((n) => pintar(n, ''));
    alerta.textContent = '';
    intentado = false;
    hubo_error_envio = false;
    poner('form');
    vista('form');
    pintarCopiar(false);
    copiaSr.textContent = '';
  }

  function abrir() {
    if (abierta) return;
    abierta = true;
    empezado = Date.now();
    const barra = window.innerWidth - html.clientWidth;
    html.style.setProperty('--ds-sbw', barra + 'px');
    html.classList.add('ds-lock');
    dialogo.showModal();
    ajustarTeclado();
  }

  dialogo.addEventListener('close', () => {
    abierta = false;
    html.classList.remove('ds-lock');
    html.style.removeProperty('--ds-sbw');
    if (dialogo.dataset.estado === 'exito') reiniciar();
    // Limpia la URL: si la entrada de historial es nuestra, volvemos atrás; si no, quitamos el hash.
    if (location.hash === '#contacto') {
      if (history.state && history.state.contacto) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
  });

  // Clic en el velo (el panel interior ocupa todo el <dialog>, así que solo el velo llega como target)
  dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  dialogo.addEventListener('click', (e) => { if (e.target.closest('[data-cerrar]')) dialogo.close(); });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-contacto]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (!abierta) {
      history.pushState({ contacto: true }, '', '#contacto');
      abrir();
    }
  });

  function sincronizar() {
    if (location.hash === '#contacto') abrir();
    else if (abierta) dialogo.close();
  }
  window.addEventListener('hashchange', sincronizar);
  window.addEventListener('popstate', sincronizar);

  // ---- Teclado móvil: la hoja se ajusta a la parte visible ----
  function ajustarTeclado() {
    // Alto del pie fijo: el campo activo no debe quedar tapado por él al hacer scroll
    dialogo.style.setProperty('--foot-h', dialogo.querySelector('.ds-contact__foot').offsetHeight + 'px');
    const vv = window.visualViewport;
    if (!vv) return;
    dialogo.style.setProperty('--vv-h', vv.height + 'px');
    dialogo.style.setProperty('--vv-top', vv.offsetTop + 'px');
  }
  if (window.visualViewport) {
    const alCambiar = () => {
      if (!abierta) return;
      ajustarTeclado();
      const activo = document.activeElement;
      if (activo && dialogo.contains(activo) && /^(INPUT|TEXTAREA)$/.test(activo.tagName)) {
        activo.scrollIntoView({ block: 'nearest' });
      }
    };
    visualViewport.addEventListener('resize', alCambiar);
    visualViewport.addEventListener('scroll', alCambiar);
  }

  reiniciar();
  sincronizar(); // #contacto en la carga
}
