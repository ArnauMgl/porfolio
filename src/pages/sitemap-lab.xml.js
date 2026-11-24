// Sitemap del Lab (/sitemap-lab.xml). Con LAB_PUBLIC=false (por defecto) va vacío: el Lab no se anuncia a los buscadores.
// Con LAB_PUBLIC=true incluye /lab/ y cada entrada, y robots.txt lo enlaza.
import { entradasLab } from '../data/lab.js';
import { labPublico } from '../../lib/lab/flag.js';

export async function GET({ site }) {
  const base = site.href.replace(/\/$/, '');
  let filas = '';
  if (labPublico()) {
    const entradas = await entradasLab();
    filas = [
      `  <url><loc>${base}/lab/</loc><lastmod>${entradas[0].fecha}</lastmod></url>`,
      ...entradas.map((e) => `  <url><loc>${base}/lab/${e.slug}/</loc><lastmod>${e.fecha}</lastmod></url>`),
    ].join('\n') + '\n';
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas}</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
