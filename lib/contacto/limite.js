// Límite de envíos: como máximo MAXIMO intentos por hora desde la misma conexión (IP).
// Se guarda en Cloudflare KV solo una huella cifrada de la IP (nunca la IP en claro ni el mensaje),
// y cada contador se borra solo al terminar la hora.

export const MAXIMO = 5;
const HORA = 3600;

async function huella(texto, clave) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(clave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const firma = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(texto));
  return [...new Uint8Array(firma)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Suma un intento y devuelve true si todavía está dentro del límite. */
export async function dentroDelLimite({ kv, ip, clave, ahora = Date.now() }) {
  if (!kv) {
    console.error('contacto: falta el binding RATE_LIMIT (KV); límite desactivado');
    return true;
  }
  const ventana = Math.floor(ahora / 1000 / HORA);
  const id = `contacto:${await huella(`${ip || 'sin-ip'}|${ventana}`, clave)}`;
  try {
    const actual = Number(await kv.get(id)) || 0;
    if (actual >= MAXIMO) return false;
    await kv.put(id, String(actual + 1), { expirationTtl: HORA * 2 });
    return true;
  } catch {
    console.error('contacto: KV no responde; límite desactivado en esta petición');
    return true;
  }
}
