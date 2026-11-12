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
