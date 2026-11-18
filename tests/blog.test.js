// Pruebas de la lógica del blog WIP. Se ejecutan con `npm test`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { hoyMadrid, estaPublicado, formatearFecha } from '../lib/blog/fechas.js';
import { filtrosDe } from '../lib/blog/etiquetas.js';
import { ordenar, filtrar, paginar, calcularVista, leerEstado, escribirEstado, textoContador } from '../lib/blog/listado.js';
import { seguirLeyendo } from '../lib/blog/relacionados.js';
import { leerMarcadores, elegirPortada, procesarCuerpo } from '../lib/blog/imagenes.js';

const art = (slug, fecha, tags) => ({ slug, fecha, tags });

test('hoy en Madrid cambia a medianoche de Madrid, no de UTC', () => {
  // 23:30 UTC del 23 nov (invierno, UTC+1) ya es 00:30 del 24 en Madrid
  assert.equal(hoyMadrid(new Date('2026-11-23T23:30:00Z')), '2026-11-24');
  assert.equal(hoyMadrid(new Date('2026-11-23T22:30:00Z')), '2026-11-23');
  // verano (UTC+2): las 22:30 UTC del 23 jun ya son 00:30 del 24
  assert.equal(hoyMadrid(new Date('2026-06-23T22:30:00Z')), '2026-06-24');
});

test('la fecha simulada manda y se valida', () => {
  assert.equal(hoyMadrid(new Date(), '2026-12-08'), '2026-12-08');
  assert.throws(() => hoyMadrid(new Date(), '8/12/2026'));
});

test('un artículo con fecha futura no está publicado; el del mismo día sí', () => {
  assert.equal(estaPublicado('2026-11-24', '2026-11-23'), false);
  assert.equal(estaPublicado('2026-11-24', '2026-11-24'), true);
  assert.equal(estaPublicado('2026-11-24', '2027-01-01'), true);
});

test('formato de fecha «24 nov 2026»', () => {
  assert.equal(formatearFecha('2026-11-24'), '24 nov 2026');
  assert.equal(formatearFecha('2027-01-05'), '5 ene 2027');
});

test('solo las cinco palabras clave se muestran; las secundarias no', () => {
  assert.deepEqual(filtrosDe(['ux', 'accesibilidad', 'ui', 'ia', 'diseno']).map((f) => f.nombre), ['Accesibilidad', 'Diseño', 'IA']);
  assert.deepEqual(filtrosDe(['ux', 'ui']), []);
});

const lista = [
  art('a', '2026-10-01', ['ia']),
  art('b', '2026-11-01', ['accesibilidad']),
  art('c', '2026-09-01', ['sporttech', 'ux']),
  art('d', '2026-12-01', ['ia', 'healthtech']),
];

test('orden: recientes por defecto y antiguos', () => {
  assert.deepEqual(ordenar(lista).map((a) => a.slug), ['d', 'b', 'a', 'c']);
  assert.deepEqual(ordenar(lista, 'antiguos').map((a) => a.slug), ['c', 'a', 'b', 'd']);
});

test('filtro: cualquiera de las activas; sin activas, todo', () => {
  assert.equal(filtrar(lista, []).length, 4);
  assert.deepEqual(filtrar(lista, ['ia']).map((a) => a.slug), ['a', 'd']);
  assert.deepEqual(filtrar(lista, ['ia', 'accesibilidad']).map((a) => a.slug), ['a', 'b', 'd']);
  assert.equal(filtrar(lista, ['ux']).length, 4, 'las secundarias no filtran');
});

test('paginador: 6 por página y página fuera de rango se corrige', () => {
  const diez = Array.from({ length: 10 }, (_, i) => art('x' + i, `2026-01-${String(i + 1).padStart(2, '0')}`, ['ia']));
  assert.equal(paginar(diez, 1).ids.length, 6);
  assert.equal(paginar(diez, 2).ids.length, 4);
  assert.equal(paginar(diez, 99).pagina, 2);
  assert.equal(paginar(diez, -3).pagina, 1);
  assert.equal(paginar([], 1).total, 1);
});

test('estado en la URL: leer, escribir y valores inválidos', () => {
  assert.deepEqual(leerEstado('?tema=ia,accesibilidad&orden=antiguos&pagina=2'), { temas: ['ia', 'accesibilidad'], orden: 'antiguos', pagina: 2 });
  assert.deepEqual(leerEstado(''), { temas: [], orden: 'recientes', pagina: 1 });
  assert.deepEqual(leerEstado('?tema=ux,inventado,ia&orden=leidos&pagina=-4'), { temas: ['ia'], orden: 'recientes', pagina: 1 });
  assert.equal(escribirEstado({ temas: ['accesibilidad', 'ia'], orden: 'antiguos', pagina: 2 }), '?tema=ia,accesibilidad&orden=antiguos&pagina=2');
  assert.equal(escribirEstado({ temas: [], orden: 'recientes', pagina: 1 }), '');
});

test('vista: filtro + orden + página', () => {
  const diez = Array.from({ length: 10 }, (_, i) => art('x' + i, `2026-01-${String(i + 1).padStart(2, '0')}`, i % 2 ? ['ia'] : ['sporttech']));
  const v = calcularVista(diez, { temas: ['ia'], orden: 'recientes', pagina: 1 });
  assert.equal(v.cantidad, 5);
  assert.equal(v.totalPaginas, 1);
  assert.equal(v.visibles[0], 'x9');
});

test('contador en singular y plural', () => {
  assert.equal(textoContador(1), '1 artículo');
  assert.equal(textoContador(0), '0 artículos');
  assert.equal(textoContador(7), '7 artículos');
});

test('«Sigue leyendo»: no aparece con menos de 3 publicados', () => {
  assert.deepEqual(seguirLeyendo(lista[0], lista.slice(0, 2)), []);
});

test('«Sigue leyendo»: prioriza palabra clave compartida y luego lo más reciente, sin el actual', () => {
  const r = seguirLeyendo(lista[0], lista); // actual: a (ia). Comparte ia: d
  assert.deepEqual(r.map((a) => a.slug), ['d', 'b']);
});

const MD = `<p>hola</p>
<!-- IMAGEN 1: x-portada.webp — alt: «Portada con "comillas"» -->
<h2>Uno</h2>
<!-- IMAGEN 2: y.webp — pie: «Un pie.» — alt: «Dice «526 kcal» en el panel.» -->
<!-- nota interna que no debe salir -->`;

test('marcadores: lee archivo, pie y alt (aunque lleve comillas «» dentro)', () => {
  const m = leerMarcadores(MD);
  assert.equal(m.length, 2);
  assert.equal(m[1].archivo, 'y.webp');
  assert.equal(m[1].pie, 'Un pie.');
  assert.equal(m[1].alt, 'Dice «526 kcal» en el panel.');
  assert.equal(m[0].pie, '');
});

test('portada: la que lleva «portada»; si no, la primera', () => {
  assert.equal(elegirPortada(leerMarcadores(MD)).archivo, 'x-portada.webp');
  assert.equal(elegirPortada([{ archivo: 'a.webp' }, { archivo: 'b.webp' }]).archivo, 'a.webp');
  assert.equal(elegirPortada([]), null);
});

test('cuerpo: la portada sale del cuerpo, el resto es <figure> y no queda ningún comentario', () => {
  const r = procesarCuerpo(MD, (m) => `<img alt="${m.alt}">`);
  assert.equal(r.portada.archivo, 'x-portada.webp');
  assert.ok(!r.html.includes('<!--'));
  assert.ok(!r.html.includes('x-portada'));
  assert.match(r.html, /<figure class="ds-figure bl-figura"><img alt="Dice «526 kcal» en el panel."><figcaption class="t-meta">Un pie\.<\/figcaption><\/figure>/);
});
