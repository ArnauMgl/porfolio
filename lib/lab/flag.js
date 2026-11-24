// Interruptor del Lab. Se lee al construir la web (npm run build).
//   sin definir (por defecto) o cualquier valor salvo «false»: el Lab es público (enlace «Lab.» en el menú, sin noindex,
//   con sus páginas en el sitemap).
//   LAB_PUBLIC=false   oculto: las páginas /lab/ existen pero sin enlace, con noindex y fuera del sitemap.
// Era oculto por defecto hasta el lanzamiento; se publicó antes del 15 dic 2026. «false» sigue sirviendo de interruptor de emergencia
// (por ejemplo, en Cloudflare Pages → Settings → Variables de entorno, o para una vista previa que no deba indexarse).
export function labPublico(env = process.env) {
  return String(env.LAB_PUBLIC ?? '').trim().toLowerCase() !== 'false';
}
