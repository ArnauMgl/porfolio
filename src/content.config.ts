// Colecciones de contenido. El blog WIP lee los Markdown de content/articulos/.
// Si algo no cuadra (nombre de archivo, fecha, etiquetas…), la construcción falla con un mensaje claro
// en lugar de publicar algo roto.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { esDia } from '../lib/blog/fechas.js';
import { etiquetasConocidas } from '../lib/blog/etiquetas.js';

const esquema = z.object({
  title: z.string().min(1),
  seoTitle: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'El slug solo admite minúsculas, números y guiones'),
  date: z.string().refine(esDia, 'La fecha debe tener el formato AAAA-MM-DD'),
  lang: z.literal('es'),
  readingTime: z.number().int().positive(),
  tags: z.array(z.string().refine(etiquetasConocidas, 'Etiqueta desconocida')).min(1),
});

// El archivo se llama AAAA-MM-DD-slug.md y debe coincidir con `date` y `slug` del frontmatter.
function generarId({ entry, data }: { entry: string; data: Record<string, unknown> }) {
  const esperado = `${data.date}-${data.slug}.md`;
  const real = entry.split('/').pop();
  if (real !== esperado) {
    throw new Error(`El archivo «${real}» debería llamarse «${esperado}» (fecha y slug del frontmatter).`);
  }
  return String(data.slug);
}

const articulos = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/articulos', generateId: generarId }),
  schema: esquema,
});

// Artículos de prueba para desarrollo (paginador, filtros). Solo se usan con WIP_PRUEBAS=1; nunca en la web real.
const pruebas = defineCollection({
  loader: glob({ pattern: '*.md', base: './content-dev/articulos', generateId: generarId }),
  schema: esquema,
});

export const collections = { articulos, pruebas };
