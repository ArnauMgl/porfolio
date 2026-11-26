// Progreso de lectura (docs/reading-progress-spec.md). Vanilla JS, sin dependencias.
// El HTML ya trae el índice (enlaces que funcionan sin JS); aquí solo se gestiona el estado y el relleno:
//  - Se mide poco: posiciones de los h2 al cargar, al redimensionar y desde un ResizeObserver sobre el cuerpo.
//  - En cada scroll (listener pasivo + requestAnimationFrame) solo se escribe --rp-p (el relleno es transform: scaleY)
//    y los atributos de estado, y solo cuando cambian.
//  - Pista y relleno son decorativos (aria-hidden). Nada de role="progressbar" ni regiones vivas: la sección actual se
//    marca con aria-current="location" en el enlace.
// El punto de corte (1280 px) se repite aquí y en src/styles/lectura.css (único sitio de CSS).
const ESCRITORIO = window.matchMedia('(min-width:1280px)');
const el = (sel, raiz = document) => raiz.querySelector(sel);
const acotar = (x) => Math.min(1, Math.max(0, x));
const absoluto = (nodo) => nodo.getBoundingClientRect().top + window.scrollY;

// Pide un único cuadro de animación por tanto de eventos de scroll.
function conCuadro(fn) {
  let esperando = false;
  return () => { if (!esperando) { esperando = true; requestAnimationFrame(() => { esperando = false; fn(); }); } };
}

// Medimos otra vez cuando cambia la altura del cuerpo (imágenes que cargan tarde), la ventana o las fuentes.
function vigilar(cuerpo, medir) {
  window.addEventListener('resize', medir);
  window.addEventListener('load', medir);
  document.fonts?.ready.then(medir);
  if ('ResizeObserver' in window && cuerpo) new ResizeObserver(medir).observe(cuerpo);
}

// ---------- Escritorio: índice con puntos (casos, blog) y marcas (Lab) ----------
function indice(nav) {
  const paso = Number(nav.dataset.rpPaso);
  const enlaces = [...nav.querySelectorAll('.rp__item')];
  const titulos = enlaces.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
  if (titulos.length < 2 || titulos.some((t) => !t)) return;
  const n = titulos.length;
  const rail = el('.rp__rail', nav);
  const contadores = document.querySelectorAll('[data-rp-cur]');
  const cuerpo = el('[data-rp-cuerpo]');
  let tops = [], alto = 0, actual = -2, pintado = -1;

  function medir() {
    tops = titulos.map(absoluto);
    alto = window.innerHeight;
    pintar();
  }

  function pintar() {
    if (!ESCRITORIO.matches) return;
    // Punto de lectura: el tercio superior de la pantalla (la cabecera no es fija, no hay que descontarla).
    const pos = window.scrollY + alto / 3;
    let i = -1;
    for (let k = 0; k < n; k++) if (tops[k] <= pos) i = k;
    // Al final de la página la última sección cuenta como actual aunque sea corta.
    if (window.scrollY + alto >= document.documentElement.scrollHeight - 2) i = n - 1;
    // Relleno por tramos: de y(i) a y(i+1) según lo que se ha leído de la sección i.
    let y = 0;
    if (i >= 0) {
      y = i * paso;
      if (i < n - 1) y += acotar((pos - tops[i]) / (tops[i + 1] - tops[i])) * paso;
    }
    const p = Math.round((y / ((n - 1) * paso)) * 1000) / 1000;
    if (p !== pintado) { pintado = p; rail.style.setProperty('--rp-p', String(p)); }
    if (i !== actual) {
      actual = i;
      enlaces.forEach((a, k) => {
        a.classList.toggle('is-visto', k < i);
        if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      contadores.forEach((c) => { c.textContent = i < 0 ? '–' : String(i + 1); });
    }
  }

  window.addEventListener('scroll', conCuadro(pintar), { passive: true });
  ESCRITORIO.addEventListener('change', medir);
  vigilar(cuerpo, medir);
  medir();
}

document.querySelectorAll('[data-rp]').forEach(indice);
