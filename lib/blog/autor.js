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
  return {
    nombre,
    rol: texto(d.authorRole),
    bio: texto(d.authorBio),
    linkedin: enlace(d.authorLinkedin),
    portfolio: enlace(d.authorPortfolio),
    foto: texto(d.authorPhoto), // nombre de archivo en content/imagenes/
  };
}
