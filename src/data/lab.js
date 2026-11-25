// Acceso a las entradas del Lab: lee la colección, descarta los borradores y las entradas con fecha futura, y prepara lo que necesitan las páginas.
// La lógica (orden, vecinas, filtro, índice) está en lib/lab/bitacora.js, con pruebas en tests/lab.test.js.
import { getCollection } from 'astro:content';
import { formatearFecha, hoyMadrid } from '../../lib/blog/fechas.js';
import { ordenar, vecinas, descripcionDe, visibles } from '../../lib/lab/bitacora.js';

// Como en el blog: WIP_HOY=AAAA-MM-DD (solo desarrollo y vistas previas) simula otro día para ver entradas programadas.
const hoy = hoyMadrid(new Date(), process.env.WIP_HOY || undefined);

let cache;
// Entradas visibles (sin borradores y con fecha de hoy o anterior), de la más nueva a la más antigua, con su Anterior/Siguiente.
export function entradasLab() {
  cache ??= (async () => {
    const entradas = (await getCollection('lab')).map((e) => ({
      draft: e.data.draft,
      slug: e.data.slug,
      titulo: e.data.title,
      fecha: e.data.date,
      fechaTexto: formatearFecha(e.data.date),
      project: e.data.project,
      projectLabel: e.data.projectLabel,
      tipo: e.data.type,
      resumen: e.data.resumen ?? null,
      descripcion: descripcionDe({ resumen: e.data.resumen, cuerpo: e.body }),
      html: e.rendered?.html ?? '',
    }));
    const listas = ordenar(visibles(entradas, hoy));
    return listas.map((e) => ({ ...e, ...vecinas(listas, e.slug) }));
  })();
  return cache;
}
