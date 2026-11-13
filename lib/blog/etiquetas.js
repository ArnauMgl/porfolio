// Palabras clave del blog. Solo estas cinco filtran y se muestran en pantalla.
// Las etiquetas secundarias (ux, ui, producto) existen en el contenido, pero ni filtran ni se muestran.
export const FILTROS = [
  { id: 'sporttech', nombre: 'Sporttech' },
  { id: 'healthtech', nombre: 'Healthtech' },
  { id: 'ia', nombre: 'IA' },
  { id: 'diseno', nombre: 'Diseño' },
  { id: 'accesibilidad', nombre: 'Accesibilidad' },
];
export const SECUNDARIAS = ['ux', 'ui', 'producto'];

export const IDS_FILTRO = FILTROS.map((f) => f.id);

export function etiquetasConocidas(tag) {
  return IDS_FILTRO.includes(tag) || SECUNDARIAS.includes(tag);
}

// De los `tags` de un artículo, solo las palabras clave visibles, en orden alfabético
// (el de las portadas). Los chips del listado mantienen su propio orden (FILTROS).
export function filtrosDe(tags) {
  return FILTROS.filter((f) => tags.includes(f.id)).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
