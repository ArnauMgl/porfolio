// Comprobación de Cloudflare Turnstile en el servidor (siteverify).
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Devuelve true solo si Cloudflare confirma el token y (fuera de local) que se generó
 * en el mismo dominio desde el que llega la petición.
 */
export async function verificarTurnstile({ token, ip, secreto, host, local = false, url = SITEVERIFY, fetchFn = fetch }) {
  if (!token || typeof token !== 'string' || token.length > 2048) return false;
  const cuerpo = new FormData();
  cuerpo.append('secret', secreto);
  cuerpo.append('response', token);
  if (ip) cuerpo.append('remoteip', ip);
  let r;
  try {
    const resp = await fetchFn(url, { method: 'POST', body: cuerpo, signal: AbortSignal.timeout(8000) });
    r = await resp.json();
  } catch {
    console.error('contacto: turnstile no responde');
    return false;
  }
  if (!r || r.success !== true) return false;
  // Las claves de prueba de Cloudflare devuelven un dominio ficticio, por eso en local no se compara.
  if (!local && r.hostname !== host) return false;
  return true;
}
