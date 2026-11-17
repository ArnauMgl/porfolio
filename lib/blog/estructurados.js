// Datos estructurados (JSON-LD de schema.org) del blog WIP. Funciones puras: reciben datos y devuelven objetos.
// `base` es la dirección de la web sin barra final (https://arnaularripa.com).
// Solo se escribe lo que se sabe: no hay fecha de modificación ni logotipo porque no existen datos para ellos.

export const NOMBRE_BLOG = 'WIP · Arnau Larripa';

// Arnau es a la vez autor y editor (publisher). Un mismo @id los une en el grafo.
export function personaArnau(base) {
  return { '@type': 'Person', '@id': `${base}/#arnau-larripa`, name: 'Arnau Larripa', url: `${base}/sobre-mi/`, jobTitle: 'Product Designer' };
}

// `art`: { slug, titulo, descripcion, fecha, filtros }. `imagen`: URL absoluta de la imagen para compartir.
export function articuloJsonLd(art, base, imagen) {
  const url = `${base}/blog/${art.slug}/`;
  const arnau = personaArnau(base);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: art.titulo,
    description: art.descripcion,
    image: [imagen],
    datePublished: art.fecha,
    inLanguage: 'es',
    keywords: art.filtros.map((f) => f.nombre).join(', '),
    author: arnau,
    publisher: arnau,
    isPartOf: { '@type': 'Blog', '@id': `${base}/blog/` },
  };
}

// `articulos`: publicados, con { slug, titulo, fecha }.
export function blogJsonLd(articulos, base, descripcion) {
  const arnau = personaArnau(base);
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${base}/blog/`,
    url: `${base}/blog/`,
    name: NOMBRE_BLOG,
    description: descripcion,
    inLanguage: 'es',
    author: arnau,
    publisher: arnau,
    blogPost: articulos.map((a) => ({ '@type': 'BlogPosting', headline: a.titulo, url: `${base}/blog/${a.slug}/`, datePublished: a.fecha })),
  };
}

// Para incrustar en <script type="application/ld+json">: el «<» se escribe como < para que un texto
// con «</script>» no pueda cerrar la etiqueta.
export function serializarJsonLd(datos) {
  return JSON.stringify(datos).replace(/</g, '\\u003c');
}
