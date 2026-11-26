// Autoría de los artículos escritos por otra persona (colaboraciones).
// Campos opcionales del frontmatter: author, authorRole, authorBio, authorLinkedin, authorPortfolio, authorPhoto.
// Lo que aún está por confirmar se escribe «[PENDIENTE: …]» en el Markdown y NO llega a la web: se ignora.

const PENDIENTE = /^\s*\[PENDIENTE/i;
const texto = (v) => (typeof v === 'string' && v.trim() && !PENDIENTE.test(v) ? v.trim() : null);
// Los enlaces solo pueden ser http(s) (nunca javascript: ni otros esquemas)
const enlace = (v) => {
  const t = texto(v);
  return t && /^https?:\/\//i.test(t) ? t : null;
};

export function leerAutor(d) {
  const nombre = texto(d.author);
  if (!nombre) return null;
  const linkedin = enlace(d.authorLinkedin);
  const portfolio = enlace(d.authorPortfolio);
  return {
    nombre,
    rol: texto(d.authorRole),
    bio: texto(d.authorBio),
    linkedin,
    portfolio,
    foto: texto(d.authorPhoto), // nombre de archivo en content/imagenes/
    enlaces: [
      linkedin && { texto: 'LinkedIn', href: linkedin, externo: true },
      portfolio && { texto: 'Portfolio', href: portfolio, externo: true },
    ].filter(Boolean),
  };
}

// Quien firma los artículos que no tienen `author` en el frontmatter: Arnau.
// Bio escrita por Arnau (primera persona). La foto es su retrato de «Sobre mí». «Portfolio» lleva a la home: desde el blog (WIP)
// puede pasar inadvertido que forma parte del portfolio.
export const AUTOR_POR_DEFECTO = {
  nombre: 'Arnau Larripa',
  rol: 'Product Designer en Barcelona',
  bio: 'Desde 2022 diseño productos digitales en Aktios, una consultora tecnológica de Barcelona. Me interesa especialmente el diseño aplicado al deporte, la salud y la accesibilidad, y cómo usar la IA para diseñar mejor.',
  linkedin: null,
  portfolio: null,
  foto: 'arnau-larripa.webp',
  enlaces: [
    { texto: 'Portfolio', href: '/', externo: false },
    { texto: 'Sobre mí', href: '/sobre-mi/', externo: false },
    { texto: 'LinkedIn', href: 'https://www.linkedin.com/in/arnaularripa/', externo: true },
  ],
};
