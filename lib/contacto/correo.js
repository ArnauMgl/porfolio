// Composición y envío del correo con Resend (https://resend.com/docs/api-reference/emails/send-email).
// El correo va SOLO en texto plano: así no hay HTML que se pueda inyectar.

export const REMITENTE = 'Web arnaularripa.com <formulario@arnaularripa.com>';
export const DESTINO = 'hola@arnaularripa.com';
const API = 'https://api.resend.com/emails';

/** Recibe valores ya validados y limpios (ver validar.js). */
export function componerCorreo({ name, email, message }) {
  // El nombre ya no tiene saltos de línea, así que no puede añadir cabeceras al asunto.
  return {
    from: REMITENTE,
    to: [DESTINO],
    reply_to: email,
    subject: `Nuevo mensaje de ${name} desde arnaularripa.com`,
    text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}\n\n--\nEnviado desde el formulario de contacto de arnaularripa.com.\nResponde a este correo para contestar a ${name}.\n`,
  };
}

/** Devuelve true si Resend acepta el correo. No registra nada del contenido. */
export async function enviarCorreo({ correo, apiKey, url = API, fetchFn = fetch }) {
  try {
    const resp = await fetchFn(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(correo),
      signal: AbortSignal.timeout(10000),
    });
    if (resp.ok) return true;
    console.error(`contacto: resend respondió ${resp.status}`);
    return false;
  } catch {
    console.error('contacto: resend no responde');
    return false;
  }
}
