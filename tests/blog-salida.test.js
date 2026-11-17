// Comprueba la web ya construida (dist/blog). Si no hay build, se salta.
// Para ejecutarla con artículos: `npm run build:blog` y después `npm test`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const hayBlog = existsSync('dist/blog/index.html');
const paginas = hayBlog
  ? ['dist/blog/index.html', ...readdirSync('dist/blog', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `dist/blog/${d.name}/index.html`)]
  : [];

test('los marcadores de imagen no llegan al HTML público', { skip: !hayBlog }, () => {
  for (const f of paginas) assert.ok(!/<!--\s*IMAGEN/.test(readFileSync(f, 'utf8')), f);
});

test('todas las imágenes del cuerpo tienen alt, ancho y alto', { skip: !hayBlog }, () => {
  for (const f of paginas) {
    const html = readFileSync(f, 'utf8');
    const cuerpo = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    for (const img of cuerpo.match(/<img\b[^>]*>/g) ?? []) {
      assert.match(img, /\balt\b/, `${f}: ${img.slice(0, 60)}`); // alt="" en las miniaturas (decorativas) es válido
      assert.match(img, /\bwidth="\d+"/, f);
      assert.match(img, /\bheight="\d+"/, f);
    }
  }
});

test('cada artículo tiene título, descripción, canonical y Open Graph', { skip: !hayBlog }, () => {
  for (const f of paginas.filter((p) => !p.endsWith('/blog/index.html'))) {
    const html = readFileSync(f, 'utf8');
    for (const patron of [/<title>[^<]+<\/title>/, /<meta name="description" content="[^"]+"/, /<link rel="canonical" href="https:\/\/arnaularripa\.com\/blog\/[^"]+\/"/, /<meta property="og:image" content="https:/, /<meta property="article:published_time" content="\d{4}-\d{2}-\d{2}"/]) {
      assert.match(html, patron, f);
    }
  }
});

// ---------- SEO (se comprueba sobre dist/, igual que arriba) ----------
const BASE = 'https://arnaularripa.com';
const leer = (f) => readFileSync(f, 'utf8');
const rutaDe = (f) => f.replace('dist', '').replace('index.html', '');
const meta = (html, clave) => html.match(new RegExp(`<meta (?:name|property)="${clave}" content="([^"]*)"`))?.[1];

// Tamaño de un JPEG o PNG leyendo su cabecera (sin dependencias).
function tamano(ruta) {
  const b = readFileSync(ruta);
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  let i = 2;
  while (i < b.length) {
    const marca = b[i + 1];
    if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`No se pudo leer el tamaño de ${ruta}`);
}

test('cada página del blog: lang es, un solo h1, canonical absoluto con barra final', { skip: !hayBlog }, () => {
  for (const f of paginas) {
    const html = leer(f);
    assert.match(html, /<html lang="es">/, f);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${f}: debe haber un único h1`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${BASE}${rutaDe(f)}">`), f);
  }
});

test('título y descripción únicos en todo el blog', { skip: !hayBlog }, () => {
  const titulos = paginas.map((f) => leer(f).match(/<title>([^<]+)<\/title>/)[1]);
  const descripciones = paginas.map((f) => meta(leer(f), 'description'));
  assert.equal(new Set(titulos).size, titulos.length, 'títulos repetidos');
  assert.equal(new Set(descripciones).size, descripciones.length, 'descripciones repetidas');
});

test('Open Graph y Twitter card completos, con imágenes absolutas de 1200×630 que existen', { skip: !hayBlog }, () => {
  for (const f of paginas) {
    const html = leer(f);
    const esArticulo = !f.endsWith('dist/blog/index.html');
    assert.equal(meta(html, 'og:type'), esArticulo ? 'article' : 'website', f);
    assert.equal(meta(html, 'twitter:card'), 'summary_large_image', f);
    for (const clave of ['og:title', 'og:description', 'og:url', 'twitter:title', 'twitter:description']) assert.ok(meta(html, clave), `${f}: falta ${clave}`);
    const og = meta(html, 'og:image');
    assert.match(og, /^https:\/\/arnaularripa\.com\/og\/[^/]+\.(jpg|png)$/, f);
    assert.equal(meta(html, 'twitter:image'), og, f);
    assert.deepEqual(tamano(`dist${og.replace(BASE, '')}`), [1200, 630], `${f}: ${og}`);
    if (esArticulo) assert.ok(og.endsWith('.jpg') && !og.includes('og-general') && !og.includes('og-wip'), `${f}: el artículo debe llevar su propia imagen`);
    else assert.ok(og.endsWith('og-wip.png'), `${f}: el listado lleva la imagen de WIP`);
  }
});

test('JSON-LD: BlogPosting en cada artículo y Blog en el listado', { skip: !hayBlog }, () => {
  for (const f of paginas) {
    const html = leer(f);
    const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(bloques.length, 1, f);
    const d = JSON.parse(bloques[0][1]);
    assert.equal(d['@context'], 'https://schema.org');
    if (f.endsWith('dist/blog/index.html')) {
      assert.equal(d['@type'], 'Blog');
      assert.equal(d.blogPost.length, paginas.length - 1, 'el Blog lista todos los artículos publicados');
    } else {
      assert.equal(d['@type'], 'BlogPosting');
      assert.equal(d.headline, html.match(/<h1[^>]*data-titulo>([^<]+)</)[1]);
      assert.equal(d.author.name, 'Arnau Larripa');
      assert.deepEqual(d.publisher, d.author);
      assert.equal(d.datePublished, meta(html, 'article:published_time'));
      assert.equal(d.image[0], meta(html, 'og:image'));
      assert.equal(d.mainEntityOfPage['@id'], `${BASE}${rutaDe(f)}`);
      assert.equal(d.description, meta(html, 'description'));
    }
  }
});

test('RSS: autodescubrimiento absoluto y un item por artículo publicado', { skip: !hayBlog }, () => {
  for (const f of paginas) assert.match(leer(f), /<link rel="alternate" type="application\/rss\+xml" title="[^"]+" href="https:\/\/arnaularripa\.com\/blog\/rss\.xml">/, f);
  const rss = leer('dist/blog/rss.xml');
  assert.equal((rss.match(/<item>/g) ?? []).length, paginas.length - 1);
  for (const m of rss.matchAll(/<link>([^<]+)<\/link>/g)) assert.match(m[1], /^https:\/\/arnaularripa\.com\/blog\//);
});

test('el sitemap y las páginas del blog cuentan lo mismo: o todo visible o todo noindex', { skip: !hayBlog }, () => {
  const sitemap = leer('dist/sitemap.xml');
  const enSitemap = [...sitemap.matchAll(/<loc>([^<]+\/blog\/[^<]*)<\/loc>/g)].map((m) => m[1]).sort();
  const noindex = paginas.map((f) => /<meta name="robots" content="[^"]*noindex/.test(leer(f)));
  if (enSitemap.length === 0) {
    assert.ok(noindex.every(Boolean), 'blog fuera del sitemap: todas sus páginas deben llevar noindex');
  } else {
    assert.ok(noindex.every((n) => !n), 'blog en el sitemap: ninguna página puede llevar noindex (¿noindex olvidado?)');
    assert.deepEqual(enSitemap, paginas.map((f) => `${BASE}${rutaDe(f)}`).sort());
  }
  assert.match(leer('dist/robots.txt'), /^Sitemap: https:\/\/arnaularripa\.com\/sitemap\.xml$/m);
});

test('en dist/ no quedan imágenes para compartir de artículos que no están publicados', { skip: !existsSync('dist/og') }, () => {
  const usadas = new Set(paginas.map((f) => meta(leer(f), 'og:image')?.split('/').pop()));
  const deBlog = ['og-calorias-reloj.jpg', 'og-ia-mas-rapido.jpg', 'og-accesibilidad-web.jpg', 'og-wip.png'];
  for (const nombre of deBlog) assert.equal(existsSync(`dist/og/${nombre}`), usadas.has(nombre), nombre);
});
