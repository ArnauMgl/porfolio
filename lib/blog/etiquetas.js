// Palabras clave del blog. Solo estas cuatro filtran y se muestran en pantalla.
// Las etiquetas secundarias (ux, ui, producto) existen en el contenido, pero ni filtran ni se muestran.
export const FILTROS = [
  { id: 'sporttech', nombre: 'Sporttech' },
  { id: 'healthtech', nombre: 'Healthtech' },
  { id: 'ia', nombre: 'IA y diseño' },
  { id: 'accesibilidad', nombre: 'Accesibilidad' },
];
export const SECUNDARIAS = ['ux', 'ui', 'producto'];

export const IDS_FILTRO = FILTROS.map((f) => f.id);

export function etiquetasConocidas(tag) {
  return IDS_FILTRO.includes(tag) || SECUNDARIAS.includes(tag);
}

// De los `tags` de un artículo, solo las palabras clave visibles (en el orden canónico).
export function filtrosDe(tags) {
  return FILTROS.filter((f) => tags.includes(f.id));
}
