// Interruptor del Lab. Se lee al construir la web (npm run build).
//   LAB_PUBLIC=true   el Lab es público: enlace «Lab.» en el menú, sin noindex y con sus páginas en el sitemap.
//   cualquier otra cosa (o sin definir)   oculto: las páginas /lab/ existen pero sin enlace, con noindex y fuera del sitemap.
// En Cloudflare Pages se define en Settings → Variables de entorno (Production).
export function labPublico(env = process.env) {
  return String(env.LAB_PUBLIC ?? '').trim().toLowerCase() === 'true';
}
