// Acceso a las entradas del Lab: lee la colección, descarta los borradores y prepara lo que necesitan las páginas.
// La lógica (orden, vecinas, filtro, índice) está en lib/lab/bitacora.js, con pruebas en tests/lab.test.js.
import { getCollection } from 'astro:content';
import { formatearFecha } from '../../lib/blog/fechas.js';
import { ordenar, vecinas, descripcionDe } from '../../lib/lab/bitacora.js';

let cache;
// Entradas visibles (sin borradores), de la más nueva a la más antigua, con su Anterior/Siguiente.
export function entradasLab() {
  cache ??= (async () => {
    const entradas = (await getCollection('lab')).filter((e) => !e.data.draft);
    const listas = ordenar(
      entradas.map((e) => ({
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
      })),
    );
    return listas.map((e) => ({ ...e, ...vecinas(listas, e.slug) }));
  })();
  return cache;
}
