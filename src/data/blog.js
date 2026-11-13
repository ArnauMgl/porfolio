// Acceso a los artículos del blog: lee la colección, decide cuáles están publicados y prepara
// lo que necesitan las páginas (fecha, etiquetas, portada, miniatura, cuerpo con imágenes y títulos).
//
// Variables de entorno (solo para desarrollo y vistas previas; en la web real no se definen):
//   WIP_HOY=AAAA-MM-DD   ver el blog como si hoy fuera ese día (para ver artículos programados)
//   WIP_PRUEBAS=1        añade los artículos de prueba de content-dev/
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { hoyMadrid, estaPublicado, formatearFecha } from '../../lib/blog/fechas.js';
import { filtrosDe } from '../../lib/blog/etiquetas.js';
import { procesarCuerpo, leerMarcadores, elegirPortada } from '../../lib/blog/imagenes.js';
import { UMBRAL_CONTROLES } from '../../lib/blog/config.js';

export const hoy = hoyMadrid(new Date(), process.env.WIP_HOY || undefined);
const conPruebas = process.env.WIP_PRUEBAS === '1';

// Todas las imágenes del blog, ya procesadas por Astro (tamaños, WebP, ancho y alto).
const imagenes = import.meta.glob('/content/imagenes/*.{webp,jpg}', { eager: true, import: 'default' });
export function imagenDe(archivo) {
  const meta = imagenes[`/content/imagenes/${archivo}`];
  if (!meta) throw new Error(`Falta la imagen «${archivo}» en content/imagenes/.`);
  return meta;
}

// Imagen para compartir de cada artículo (la portada de la tarjeta de LinkedIn, WhatsApp, etc.)
const COMPARTIR = {
  'calorias-reloj-diseno-incertidumbre': '/og/og-calorias-reloj.jpg',
  'ia-ux-mas-rapido-no-mejor': '/og/og-ia-mas-rapido.jpg',
  'accesibilidad-web-retrocede-diseno': '/og/og-accesibilidad-web.jpg',
};

const ANCHOS = [480, 720, 1080, 1440];
const SIZES = '(min-width:1024px) 704px, (min-width:640px) calc(100vw - 96px), calc(100vw - 48px)';

async function etiquetaImg({ archivo, alt }) {
  const meta = imagenDe(archivo);
  const g = await getImage({ src: meta, widths: ANCHOS, format: 'webp', quality: 85, sizes: SIZES });
  return `<img src="${g.src}" srcset="${g.srcSet.attribute}" sizes="${SIZES}" width="${meta.width}" height="${meta.height}" alt="${alt.replace(/"/g, '&quot;')}" loading="lazy" decoding="async">`;
}

async function prepararArticulo(entrada) {
  const d = entrada.data;
  const html = entrada.rendered?.html ?? '';
  // Las imágenes se resuelven antes de reemplazarlas (procesarCuerpo es síncrono)
  const marcadores = leerMarcadores(html);
  const etiquetas = new Map();
  for (const m of marcadores) etiquetas.set(m.archivo + m.alt, await etiquetaImg(m));
  const cuerpo = procesarCuerpo(html, (m) => etiquetas.get(m.archivo + m.alt));
  const portada = cuerpo.portada ? { ...cuerpo.portada, meta: imagenDe(cuerpo.portada.archivo) } : null;
  const secciones = (entrada.rendered?.metadata?.headings ?? []).filter((h) => h.depth === 2 && h.slug !== 'referencias');
  return {
    slug: d.slug,
    titulo: d.title,
    seoTitle: d.seoTitle,
    descripcion: d.description,
    fecha: d.date,
    fechaTexto: formatearFecha(d.date),
    lectura: d.readingTime,
    tags: d.tags,
    filtros: filtrosDe(d.tags),
    portada,
    html: cuerpo.html,
    secciones: secciones.map((h, i) => ({ n: i + 1, id: h.slug, texto: h.text })),
    // Imagen para compartir en redes (1200×630, en public/og/). Los artículos sin una propia usan la general del sitio.
    compartir: COMPARTIR[d.slug] ?? null,
  };
}

let cache;
// Artículos publicados, del más reciente al más antiguo.
export function articulosPublicados() {
  cache ??= (async () => {
    const entradas = [...(await getCollection('articulos')), ...(conPruebas ? await getCollection('pruebas') : [])];
    const publicados = entradas.filter((e) => estaPublicado(e.data.date, hoy));
    const listos = await Promise.all(publicados.map(prepararArticulo));
    return listos.sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
  })();
  return cache;
}

// ¿Se muestran filtros, orden y paginador?
export function mostrarControles(cantidad) {
  return cantidad >= UMBRAL_CONTROLES;
}
