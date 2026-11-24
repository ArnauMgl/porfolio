// Pruebas de la lógica del Lab (bitácora, filtro, flag). Se ejecutan con `npm test`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { labPublico } from '../lib/lab/flag.js';
import { ordenar, vecinas, proyectos, filtrar, proyectoValido, textoResultado, diaMes, agruparPorMes, descripcionDe, fechaIso } from '../lib/lab/bitacora.js';

const e = (slug, fecha, project = 'bike-tool', projectLabel = 'Bike tool') => ({ slug, fecha, project, projectLabel });
const datos = [
  e('lab', '2026-10-28', 'lab', 'Lab'),
  e('a', '2026-11-02'),
  e('b', '2026-11-07'),
  e('c', '2026-11-24'),
];

test('el Lab es público por defecto y solo LAB_PUBLIC=false lo oculta', () => {
  assert.equal(labPublico({}), true);
  assert.equal(labPublico({ LAB_PUBLIC: '' }), true);
  assert.equal(labPublico({ LAB_PUBLIC: 'true' }), true);
  assert.equal(labPublico({ LAB_PUBLIC: 'false' }), false);
  assert.equal(labPublico({ LAB_PUBLIC: ' FALSE ' }), false);
});

test('la bitácora va de la más nueva a la más antigua', () => {
  assert.deepEqual(ordenar(datos).map((x) => x.slug), ['c', 'b', 'a', 'lab']);
});

test('Anterior es la más antigua inmediata y Siguiente la más nueva; los extremos no tienen uno', () => {
  const o = ordenar(datos);
  assert.deepEqual(vecinas(o, 'b'), { anterior: o[2], siguiente: o[0] });
  assert.equal(vecinas(o, 'lab').anterior, null);
  assert.equal(vecinas(o, 'c').siguiente, null);
  assert.deepEqual(vecinas(o, 'no-existe'), { anterior: null, siguiente: null });
});

test('los chips salen de los datos: un proyecto por slug distinto de «lab», con su recuento', () => {
  assert.deepEqual(proyectos(datos), [{ slug: 'bike-tool', label: 'Bike tool', count: 3 }]);
  assert.deepEqual(proyectos([e('x', '2026-12-01', 'otro', 'Otro'), ...datos]).map((p) => p.slug), ['otro', 'bike-tool']);
});

test('bajo un proyecto se ocultan las entradas de «lab»; bajo «Todos» salen todas', () => {
  assert.equal(filtrar(datos, '').length, 4);
  assert.deepEqual(filtrar(datos, 'bike-tool').map((x) => x.slug), ['a', 'b', 'c']);
});

test('?proyecto= solo vale si el proyecto existe', () => {
  const p = proyectos(datos);
  assert.equal(proyectoValido('bike-tool', p), 'bike-tool');
  assert.equal(proyectoValido('lab', p), '');
  assert.equal(proyectoValido('<script>', p), '');
});

test('texto del resultado para el lector de pantalla', () => {
  assert.equal(textoResultado(6, ''), '6 entradas');
  assert.equal(textoResultado(5, 'Bike tool'), '5 entradas de Bike tool');
  assert.equal(textoResultado(1, 'Bike tool'), '1 entrada de Bike tool');
});

test('índice por mes: «Nov 2026», «Oct 2026», con día y mes cortos', () => {
  const g = agruparPorMes(ordenar(datos));
  assert.deepEqual(g.map((x) => x.etiqueta), ['Nov 2026', 'Oct 2026']);
  assert.deepEqual(g[0].entradas.map((x) => x.slug), ['c', 'b', 'a']);
  assert.equal(diaMes('2026-11-07'), '7 nov');
});

test('la descripción es el resumen o el primer párrafo sin marcas de Markdown', () => {
  assert.equal(descripcionDe({ resumen: 'Resumen.', cuerpo: 'Otro' }), 'Resumen.');
  assert.equal(descripcionDe({ cuerpo: '**De dónde sale.** Texto con [enlace](x).\n\nSegundo.' }), 'De dónde sale. Texto con enlace.');
  assert.equal(descripcionDe({ cuerpo: 'Las razones son prácticas:\n\n- uno' }), 'Las razones son prácticas.');
  const larga = descripcionDe({ cuerpo: 'palabra '.repeat(60) });
  assert.ok(larga.length <= 162 && larga.endsWith('…'));
});

test('la fecha de YAML sin comillas (Date) se normaliza a AAAA-MM-DD', () => {
  assert.equal(fechaIso(new Date('2026-11-24T00:00:00Z')), '2026-11-24');
  assert.equal(fechaIso('2026-11-24'), '2026-11-24');
});

test('las entradas de content/lab cumplen el frontmatter y el nombre de archivo AAAA-MM-DD-slug.md', () => {
  const archivos = readdirSync(new URL('../content/lab/', import.meta.url)).filter((f) => f.endsWith('.md'));
  assert.equal(archivos.length, 6);
  for (const f of archivos) {
    const texto = readFileSync(new URL(`../content/lab/${f}`, import.meta.url), 'utf8');
    const fm = Object.fromEntries([...texto.match(/^---\n([\s\S]*?)\n---/)[1].matchAll(/^(\w+):\s*(.*)$/gm)].map((m) => [m[1], m[2].replace(/^"|"$/g, '')]));
    for (const campo of ['title', 'slug', 'date', 'project', 'projectLabel', 'type']) assert.ok(fm[campo], `${f}: falta «${campo}»`);
    assert.equal(f, `${fm.date}-${fm.slug}.md`);
  }
});
