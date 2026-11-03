// Desde qué webs se acepta el formulario.
// - La web real: arnaularripa.com (y www).
// - Las vistas previas de ESTE proyecto de Cloudflare Pages: *.arnaularripa.pages.dev
//   (no cualquier *.pages.dev: ese dominio lo comparten miles de proyectos ajenos).
// - localhost, solo cuando se ejecuta en el ordenador (ENTORNO=local en .dev.vars).

const PRODUCCION = new Set(['arnaularripa.com', 'www.arnaularripa.com']);
const VISTA_PREVIA = /^([a-z0-9-]+\.)?arnaularripa\.pages\.dev$/;
const LOCAL = new Set(['localhost', '127.0.0.1']);

/** Devuelve el nombre de dominio permitido (p. ej. «arnaularripa.com») o null. */
export function origenPermitido(origin, env = {}) {
  if (!origin) return null;
  let url;
  try { url = new URL(origin); } catch { return null; }
  const host = url.hostname;
  if (url.protocol === 'https:' && !url.port && (PRODUCCION.has(host) || VISTA_PREVIA.test(host))) return host;
  if (env.ENTORNO === 'local' && LOCAL.has(host)) return host;
  return null;
}
