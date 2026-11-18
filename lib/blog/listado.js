// Lógica del listado: filtrar, ordenar, paginar y guardar el estado en la URL.
// Funciones puras (sin DOM) para poder probarlas con `npm test`.
import { IDS_FILTRO } from './etiquetas.js';
import { POR_PAGINA } from './config.js';

export const ORDENES = [
  { id: 'recientes', nombre: 'Más recientes' },
  { id: 'antiguos', nombre: 'Más antiguos' },
];
export const ORDEN_POR_DEFECTO = 'recientes';

// Más reciente primero; a igual fecha, por slug, para que el orden sea estable.
export function ordenar(articulos, orden = ORDEN_POR_DEFECTO) {
  const sentido = orden === 'antiguos' ? 1 : -1;
  return [...articulos].sort((a, b) => sentido * (a.fecha.localeCompare(b.fecha) || a.slug.localeCompare(b.slug)));
}

// «Cualquiera de las activas». Sin ninguna activa, todo.
export function filtrar(articulos, temas) {
  const activos = temas.filter((t) => IDS_FILTRO.includes(t)); // las etiquetas secundarias (ux, ui…) no filtran
  if (!activos.length) return [...articulos];
  return articulos.filter((a) => a.tags.some((t) => activos.includes(t)));
}

export function paginar(articulos, pagina, porPagina = POR_PAGINA) {
  const total = Math.max(1, Math.ceil(articulos.length / porPagina));
  const actual = Math.min(Math.max(1, Math.trunc(pagina) || 1), total);
  const inicio = (actual - 1) * porPagina;
  return { pagina: actual, total, ids: articulos.slice(inicio, inicio + porPagina) };
}

// Estado → resultado visible. `articulos` lleva { slug, fecha, tags }.
export function calcularVista(articulos, estado, porPagina = POR_PAGINA) {
  const coinciden = ordenar(filtrar(articulos, estado.temas), estado.orden);
  const p = paginar(coinciden, estado.pagina, porPagina);
  return { cantidad: coinciden.length, pagina: p.pagina, totalPaginas: p.total, visibles: p.ids.map((a) => a.slug) };
}

// ?tema=ia,accesibilidad&orden=antiguos&pagina=2 → estado. Valores desconocidos se ignoran sin romper nada.
export function leerEstado(busqueda) {
  const q = new URLSearchParams(busqueda);
  const pedidos = (q.get('tema') || '').split(',').map((t) => t.trim());
  const temas = IDS_FILTRO.filter((id) => pedidos.includes(id));
  const orden = ORDENES.some((o) => o.id === q.get('orden')) ? q.get('orden') : ORDEN_POR_DEFECTO;
  const n = Number.parseInt(q.get('pagina') || '1', 10);
  return { temas, orden, pagina: Number.isFinite(n) && n > 0 ? n : 1 };
}

// Estado → «?tema=…&orden=…&pagina=…» (sin lo que está por defecto). Vacío si todo es por defecto.
export function escribirEstado(estado) {
  const partes = [];
  if (estado.temas.length) partes.push('tema=' + IDS_FILTRO.filter((id) => estado.temas.includes(id)).join(','));
  if (estado.orden !== ORDEN_POR_DEFECTO) partes.push('orden=' + estado.orden);
  if (estado.pagina > 1) partes.push('pagina=' + estado.pagina);
  return partes.length ? '?' + partes.join('&') : '';
}

export function textoContador(n) {
  return `${n} ${n === 1 ? 'artículo' : 'artículos'}`;
}
