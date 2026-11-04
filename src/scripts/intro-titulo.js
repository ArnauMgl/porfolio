// Intro del título de la home: lanza una vez por sesión el degradado sobre «Arnau Larripa».
const CLAVE = 'intro-title-seen';
const nombre = document.querySelector('.ds-hero__name');

function yaVista() {
  try { return sessionStorage.getItem(CLAVE) !== null; } catch { return false; }
}

function lanzar() {
  try { sessionStorage.setItem(CLAVE, '1'); } catch { /* sin sessionStorage: se reproduce igual */ }
  nombre.classList.add('is-intro');
  // Al acabar, se quita la clase: el nombre vuelve a ser texto normal, sin transparencia.
  nombre.addEventListener('animationend', () => nombre.classList.remove('is-intro'), { once: true });
}

if (nombre && !yaVista() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const fuentes = document.fonts
    ? Promise.all([document.fonts.load('700 1em "Inter Tight"'), document.fonts.ready])
    : Promise.resolve();
  fuentes.catch(() => {}).then(lanzar);
}
