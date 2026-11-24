// Lógica de la bitácora del Lab (orden, vecinas, filtro por proyecto, índice por mes, textos).
// Sin dependencias de Astro, para poder probarla con `npm test`.
import { esDia } from '../blog/fechas.js';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const PROYECTO_LAB = 'lab';

// Más nueva primero; a igualdad de fecha, por slug para que el orden sea estable.
export function ordenar(entradas) {
  return [...entradas].sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
}

// Anterior = la inmediatamente más antigua; Siguiente = la inmediatamente más nueva (null si no existe).
export function vecinas(ordenadas, slug) {
  const i = ordenadas.findIndex((e) => e.slug === slug);
  if (i === -1) return { anterior: null, siguiente: null };
  return { anterior: ordenadas[i + 1] ?? null, siguiente: ordenadas[i - 1] ?? null };
}

// Chips de proyecto: uno por cada proyecto distinto de «lab», con su recuento (según los datos).
export function proyectos(entradas) {
  const mapa = new Map();
  for (const e of ordenar(entradas)) {
    if (e.project === PROYECTO_LAB) continue;
    const p = mapa.get(e.project) ?? { slug: e.project, label: e.projectLabel, count: 0 };
    p.count += 1;
    mapa.set(e.project, p);
  }
  return [...mapa.values()];
}

// Bajo «Todos» (proyecto vacío) se ven todas; bajo un proyecto, solo las de ese proyecto (las de «lab» no).
export function filtrar(entradas, proyecto) {
  return proyecto ? entradas.filter((e) => e.project === proyecto) : entradas;
}

// Valor de ?proyecto= admitido: solo un proyecto que exista; si no, «Todos» ('').
export function proyectoValido(valor, lista) {
  return lista.some((p) => p.slug === valor) ? valor : '';
}

export function textoResultado(cantidad, label) {
  const n = `${cantidad} ${cantidad === 1 ? 'entrada' : 'entradas'}`;
  return label ? `${n} de ${label}` : n;
}

// «2026-11-24» → «24 nov»
export function diaMes(dia) {
  const [, m, d] = dia.split('-').map(Number);
  return `${d} ${MESES[m - 1]}`;
}

// Índice de escritorio: grupos por mes, de más nuevo a más antiguo → [{ clave: '2026-11', etiqueta: 'Nov 2026', entradas }]
export function agruparPorMes(ordenadas) {
  const grupos = [];
  for (const e of ordenadas) {
    const clave = e.fecha.slice(0, 7);
    let g = grupos.at(-1);
    if (!g || g.clave !== clave) {
      const [a, m] = clave.split('-').map(Number);
      const mes = MESES[m - 1];
      g = { clave, etiqueta: `${mes[0].toUpperCase()}${mes.slice(1)} ${a}`, entradas: [] };
      grupos.push(g);
    }
    g.entradas.push(e);
  }
  return grupos;
}

// Descripción de la página: el resumen o, si no hay, el primer párrafo (sin marcas de Markdown), a ~160 caracteres.
export function descripcionDe({ resumen, cuerpo }) {
  if (resumen) return resumen;
  const parrafo = (cuerpo ?? '').trim().split(/\n\s*\n/)[0] ?? '';
  const limpio = parrafo
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/:$/, '.');
  if (limpio.length <= 160) return limpio;
  const corte = limpio.slice(0, 160);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
}

// El frontmatter trae la fecha como texto o, si YAML la lee sin comillas, como Date (a medianoche UTC).
export function fechaIso(valor) {
  const texto = valor instanceof Date ? valor.toISOString().slice(0, 10) : valor;
  return esDia(texto) ? texto : valor;
}
