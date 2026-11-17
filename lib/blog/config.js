// Ajustes del blog WIP en un solo sitio.

// Artículos por página en el listado.
export const POR_PAGINA = 6;

// Desde cuántos artículos publicados se muestran filtros, orden y paginador.
// Con menos, el listado es una lista simple.
export const UMBRAL_CONTROLES = 6;

// «Sigue leyendo» solo aparece si hay al menos este número de artículos publicados (incluido el actual).
export const MINIMO_SIGUE_LEYENDO = 3;

// Zona horaria con la que se decide si un artículo ya está publicado.
export const ZONA_HORARIA = 'Europe/Madrid';

// ============================================================================
// INTERRUPTOR DE LANZAMIENTO. Es el ÚNICO sitio que mantiene oculto el blog.
//
//   true  → el blog NO existe en la web publicada: no se genera /blog/, ni los artículos, ni el RSS; la cabecera no
//           tiene «Blog» y el sitemap no lo menciona. Da igual la fecha de los artículos.
//           (Para revisarlo en local o en una vista previa se construye con WIP_HOY=…; ver package.json. Esas páginas
//           salen con «noindex, nofollow» automáticamente, y no entran en el sitemap.)
//   false → el blog se publica: cada artículo aparece en su fecha (ver «Artículos programados» en LEEME.md).
//
// Al lanzar: poner false aquí y subir. No hay ningún noindex más que quitar: el de la vista previa depende de esta línea.
// ============================================================================
export const BLOG_OCULTO = true;
