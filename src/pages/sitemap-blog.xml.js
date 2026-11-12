// Sitemap del blog WIP (/sitemap-blog.xml). Separado del sitemap.xml del portfolio para no tocarlo:
// solo incluye /blog/ y los artículos ya publicados (con su fecha), y robots.txt lo anuncia.
import { articulosPublicados } from '../data/blog.js';

export async function GET({ site }) {
  const publicados = await articulosPublicados();
  const base = site.href.replace(/\/$/, '');
  const filas = publicados.length === 0 ? '' : [
    `  <url><loc>${base}/blog/</loc><lastmod>${publicados[0].fecha}</lastmod></url>`,
    ...publicados.map((a) => `  <url><loc>${base}/blog/${a.slug}/</loc><lastmod>${a.fecha}</lastmod></url>`),
  ].join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas}${filas ? '\n' : ''}</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
