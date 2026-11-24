// robots.txt. Era un archivo fijo en public/; ahora se genera para que el sitemap del Lab solo se anuncie con LAB_PUBLIC=true.
// No se pone «Disallow: /lab/» a propósito: para que un buscador vea el noindex tiene que poder entrar en la página.
import { labPublico } from '../../lib/lab/flag.js';

export function GET({ site }) {
  const base = site.href.replace(/\/$/, '');
  const lineas = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    `Sitemap: ${base}/sitemap-blog.xml`,
    ...(labPublico() ? [`Sitemap: ${base}/sitemap-lab.xml`] : []),
  ];
  return new Response(lineas.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
