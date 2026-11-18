// Feed RSS del blog WIP (/blog/rss.xml), en español. Solo lleva los artículos ya publicados.
import { articulosPublicados } from '../../data/blog.js';
import { fechaRss } from '../../../lib/blog/fechas.js';
import { escapar } from '../../../lib/blog/imagenes.js';

export async function GET({ site }) {
  const publicados = await articulosPublicados();
  const base = site.href.replace(/\/$/, '');
  const items = publicados.map((a) => `
    <item>
      <title>${escapar(a.titulo)}</title>
      <link>${base}/blog/${a.slug}/</link>
      <guid isPermaLink="true">${base}/blog/${a.slug}/</guid>
      <pubDate>${fechaRss(a.fecha)}</pubDate>
      <description>${escapar(a.descripcion)}</description>
    </item>`).join('');
  const ultima = publicados[0] ? `\n    <lastBuildDate>${fechaRss(publicados[0].fecha)}</lastBuildDate>` : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WIP · Arnau Larripa</title>
    <link>${base}/blog/</link>
    <description>Work in progress. Diseño de producto, accesibilidad e IA, contados a medida que se aprende.</description>
    <language>es</language>${ultima}
    <atom:link href="${base}/blog/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
