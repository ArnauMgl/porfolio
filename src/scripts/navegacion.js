// Navegación: hoja de menú (móvil y tableta) y desplegable de idioma (escritorio).
// Marcado en src/components/Header.astro. Sin JavaScript, en móvil se muestran los enlaces en línea (ver <noscript> en Base.astro).

const html = document.documentElement;

// ---------- Hoja de menú ----------
const hoja = document.getElementById('menu-movil');
const abrirBtn = document.querySelector('[data-menu-abrir]');

if (hoja && abrirBtn && typeof hoja.showModal === 'function') {
  const escritorio = window.matchMedia('(min-width: 1024px)');

  abrirBtn.addEventListener('click', () => {
    if (hoja.open) return;
    // Bloquea el scroll de fondo compensando el ancho de la barra para que la página no salte
    html.style.setProperty('--ds-sbw', window.innerWidth - html.clientWidth + 'px');
    html.classList.add('ds-lock');
    hoja.showModal();
  });

  hoja.addEventListener('close', () => {
    html.classList.remove('ds-lock');
    html.style.removeProperty('--ds-sbw');
  });

  // Cierra con la X, tocando el velo (el panel ocupa todo el <dialog>, así que solo el velo llega como target)
  // o al elegir un enlace (los enlaces a un ancla de la misma página no recargan).
  hoja.addEventListener('click', (e) => {
    if (e.target === hoja || e.target.closest('[data-cerrar], a')) hoja.close();
  });

  // Si se ensancha la ventana hasta escritorio con la hoja abierta, se cierra
  escritorio.addEventListener('change', () => { if (escritorio.matches && hoja.open) hoja.close(); });
}

// ---------- Desplegable de idioma ----------
const idioma = document.querySelector('[data-idioma]');
if (idioma) {
  const boton = idioma.querySelector('[data-idioma-boton]');
  const panel = idioma.querySelector('.ds-lang__panel');
  const poner = (abierto) => { boton.setAttribute('aria-expanded', String(abierto)); panel.hidden = !abierto; };

  boton.addEventListener('click', () => poner(boton.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', (e) => { if (!idioma.contains(e.target)) poner(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') { poner(false); boton.focus(); }
  });
  // Al salir del desplegable con el teclado, se cierra
  idioma.addEventListener('focusout', (e) => { if (!idioma.contains(e.relatedTarget)) poner(false); });
}
