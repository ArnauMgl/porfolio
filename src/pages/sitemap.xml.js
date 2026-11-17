// sitemap.xml: las páginas del portfolio y, cuando el blog está lanzado, /blog/ y los artículos ya publicados.
// Mientras BLOG_OCULTO (lib/blog/config.js) sea true, el blog no aparece aquí aunque se construya en vista previa.
import { articulosPublicados, blogEnSitemap } from '../data/blog.js';

const PAGINAS = [
  '/',
  '/trabajo/',
  '/trabajo/esbard-edu/',
  '/trabajo/buscador-app-sanitaria/',
  '/trabajo/planificador-medicacion/',
  '/trabajo/portfolio-arnau-larripa/',
  '/sobre-mi/',
];

export async function GET({ site }) {
  const base = site.href.replace(/\/$/, '');
  const publicados = blogEnSitemap ? await articulosPublicados() : [];
  const filas = [
    ...PAGINAS.map((ruta) => `  <url><loc>${base}${ruta}</loc></url>`),
    ...(publicados.length ? [`  <url><loc>${base}/blog/</loc><lastmod>${publicados[0].fecha}</lastmod></url>`] : []),
    ...publicados.map((a) => `  <url><loc>${base}/blog/${a.slug}/</loc><lastmod>${a.fecha}</lastmod></url>`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
