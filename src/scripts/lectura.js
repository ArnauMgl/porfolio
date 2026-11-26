// Progreso de lectura (docs/reading-progress-spec.md). Vanilla JS, sin dependencias.
// El HTML ya trae el índice (enlaces que funcionan sin JS); aquí solo se gestiona el estado y el relleno:
//  - Se mide poco: posiciones de los h2 y del cuerpo al cargar, al redimensionar y desde un ResizeObserver sobre el cuerpo.
//  - En cada scroll (listener pasivo + requestAnimationFrame) solo se escribe --rp-p / --rp-b (el relleno es transform)
//    y los atributos de estado, y solo cuando cambian.
//  - Pista, relleno y barras son decorativos (aria-hidden). Nada de role="progressbar" ni regiones vivas: la sección actual
//    se marca con aria-current="location" en el enlace.
// El punto de corte (1280 px) se repite aquí y en src/styles/lectura.css (único sitio de CSS).
const ESCRITORIO = window.matchMedia('(min-width:1280px)');
const el = (sel, raiz = document) => raiz.querySelector(sel);
const acotar = (x) => Math.min(1, Math.max(0, x));
const absoluto = (nodo) => nodo.getBoundingClientRect().top + window.scrollY;
const idDe = (a) => decodeURIComponent(a.hash.slice(1));

// ---------- Seguimiento compartido: qué sección es la actual y cuánto se ha leído de ella ----------
// ids: los h2 en orden. cuerpo: el elemento que contiene el texto (su altura puede cambiar al cargar imágenes).
// Los suscriptores reciben { i, f, pos, y0, y1 }: sección actual (-1 si aún no se llega a la primera), fracción leída de ese tramo,
// punto de lectura, y el recorrido del cuerpo (y0 = su inicio, y1 = su final menos la altura de la pantalla).
function seguimiento(ids, cuerpo) {
  const titulos = ids.map((id) => document.getElementById(id));
  if (titulos.length < 2 || titulos.some((t) => !t)) return null;
  const n = titulos.length;
  const suscritos = [];
  let tops = [], alto = 0, y0 = 0, y1 = 1, esperando = false;

  function medir() {
    tops = titulos.map(absoluto);
    alto = window.innerHeight;
    if (cuerpo) { y0 = absoluto(cuerpo); y1 = y0 + cuerpo.offsetHeight - alto; }
    pintar();
  }
  function pintar() {
    // Punto de lectura: el tercio superior de la pantalla (la cabecera no es fija, no hay que descontarla).
    const pos = window.scrollY + alto / 3;
    let i = -1;
    for (let k = 0; k < n; k++) if (tops[k] <= pos) i = k;
    // Al final de la página la última sección cuenta como actual aunque sea corta.
    if (window.scrollY + alto >= document.documentElement.scrollHeight - 2) i = n - 1;
    const f = i >= 0 && i < n - 1 ? acotar((pos - tops[i]) / (tops[i + 1] - tops[i])) : 0;
    const estado = { i, f, pos, y0, y1 };
    suscritos.forEach((fn) => fn(estado));
  }
  const pedir = () => { if (!esperando) { esperando = true; requestAnimationFrame(() => { esperando = false; pintar(); }); } };

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', medir);
  window.addEventListener('load', medir);
  ESCRITORIO.addEventListener('change', medir);
  document.fonts?.ready.then(medir);
  if ('ResizeObserver' in window && cuerpo) new ResizeObserver(medir).observe(cuerpo);
  medir();
  return { n, suscribir: (fn) => { suscritos.push(fn); fn({ i: -1, f: 0, pos: 0, y0, y1 }); } };
}

// Marca las secciones vistas y la actual en una lista de enlaces.
function marcar(enlaces, i, alCambiar) {
  enlaces.forEach((a, k) => {
    a.classList.toggle('is-visto', k < i);
    if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  alCambiar?.();
}

// ---------- Escritorio: índice con puntos (casos, blog) y marcas (Lab) ----------
function indice(nav, seg) {
  const paso = Number(nav.dataset.rpPaso);
  const enlaces = [...nav.querySelectorAll('.rp__item')];
  const rail = el('.rp__rail', nav);
  const contadores = document.querySelectorAll('[data-rp-cur]');
  let actual = -2, pintado = -1;

  seg.suscribir(({ i, f }) => {
    if (!ESCRITORIO.matches) return;
    // Relleno por tramos: de y(i) a y(i+1) según lo que se ha leído de la sección i (en la última sección, lleno).
    const y = i < 0 ? 0 : i * paso + (i < seg.n - 1 ? f * paso : 0);
    const p = Math.round((y / ((seg.n - 1) * paso)) * 1000) / 1000;
    if (p !== pintado) { pintado = p; rail.style.setProperty('--rp-p', String(p)); }
    if (i !== actual) {
      actual = i;
      marcar(enlaces, i);
      contadores.forEach((c) => { c.textContent = i < 0 ? '–' : String(i + 1); });
    }
  });
}

// ---------- Ancho estrecho, casos: selector sticky «3 / 6 · Decisiones» con barra y lista desplegable ----------
function selector(sel, seg) {
  const boton = el('.rp-sel__boton', sel);
  const panel = el('.rp-sel__panel', sel);
  const velo = el('.rp-sel__velo', sel);
  const relleno = el('.rp-sel__relleno', sel);
  const cuenta = el('[data-rp-sel-cur]', sel);
  const titulo = el('[data-rp-sel-titulo]', sel);
  const enlaces = [...panel.querySelectorAll('a')];
  const inicial = el('[data-rp-lista]');
  const cuerpo = el('[data-rp-cuerpo]');
  let actual = -2, pintado = -1, listaFuera = false, cuerpoDentro = false;

  const abierto = () => boton.getAttribute('aria-expanded') === 'true';
  function abrir() { panel.hidden = false; velo.hidden = false; boton.setAttribute('aria-expanded', 'true'); }
  function cerrar(foco) {
    if (!abierto()) return;
    panel.hidden = true; velo.hidden = true; boton.setAttribute('aria-expanded', 'false');
    if (foco) boton.focus({ preventScroll: true });
  }
  function visible() {
    const ver = listaFuera && cuerpoDentro && !ESCRITORIO.matches;
    sel.classList.toggle('is-visible', ver);
    if (!ver) cerrar(false);
  }

  boton.addEventListener('click', () => (abierto() ? cerrar(true) : abrir()));
  // Es un desplegable, no un diálogo: Esc, pulsar fuera o elegir una sección lo cierran y devuelven el foco al selector.
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(true); });
  document.addEventListener('pointerdown', (e) => { if (abierto() && (e.target === velo || !sel.contains(e.target))) cerrar(true); });
  // Al elegir una sección el navegador salta al ancla después del clic: el foco vuelve al selector justo después.
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) { cerrar(false); setTimeout(() => boton.focus({ preventScroll: true }), 0); } });

  // Aparece cuando el índice inicial sale de la pantalla por arriba, y mientras el cuerpo del caso está a la vista.
  if ('IntersectionObserver' in window) {
    if (inicial) new IntersectionObserver(([e]) => { listaFuera = !e.isIntersecting && e.boundingClientRect.top < 0; visible(); }).observe(inicial);
    if (cuerpo) new IntersectionObserver(([e]) => { cuerpoDentro = e.isIntersecting; visible(); }).observe(cuerpo);
  }
  ESCRITORIO.addEventListener('change', visible);

  seg.suscribir(({ i, y0, y1 }) => {
    if (ESCRITORIO.matches) return;
    const p = Math.round(acotar((window.scrollY - y0) / Math.max(1, y1 - y0)) * 1000) / 1000;
    if (p !== pintado) { pintado = p; relleno.style.setProperty('--rp-b', String(p)); }
    if (i !== actual) {
      actual = i;
      marcar(enlaces, i, () => {
        const k = Math.max(i, 0);
        cuenta.textContent = String(k + 1);
        titulo.textContent = enlaces[k].dataset.titulo;
      });
    }
  });
}

// ---------- Ancho estrecho: barra superior de 3 px (blog y Lab) ----------
// Progreso = del inicio del artículo a que el final del cuerpo llegue al borde inferior de la pantalla (sin cabecera, pie ni «Sigue leyendo»).
function barra(b) {
  const relleno = el('.rp-barra__relleno', b);
  const cuerpo = el('[data-rp-cuerpo]');
  const inicio = el('[data-rp-inicio]') ?? cuerpo;
  const fin = el('[data-rp-fin]');
  if (!cuerpo || !inicio) return;
  let y0 = 0, y1 = 1, pintado = -1, esperando = false;

  function medir() {
    y0 = absoluto(inicio);
    y1 = absoluto(cuerpo) + cuerpo.offsetHeight - window.innerHeight;
    pintar();
  }
  function pintar() {
    if (ESCRITORIO.matches && !b.classList.contains('rp-barra--siempre')) return;
    const p = Math.round(acotar((window.scrollY - y0) / Math.max(1, y1 - y0)) * 1000) / 1000;
    if (p !== pintado) { pintado = p; relleno.style.setProperty('--rp-b', String(p)); }
  }
  // Se desvanece (200 ms) cuando el bloque que sigue al artículo entra en la pantalla.
  if (fin && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => b.classList.toggle('is-fin', e.isIntersecting), { threshold: 0 }).observe(fin);
  }
  window.addEventListener('scroll', () => { if (!esperando) { esperando = true; requestAnimationFrame(() => { esperando = false; pintar(); }); } }, { passive: true });
  window.addEventListener('resize', medir);
  window.addEventListener('load', medir);
  ESCRITORIO.addEventListener('change', medir);
  document.fonts?.ready.then(medir);
  if ('ResizeObserver' in window) new ResizeObserver(medir).observe(cuerpo);
  b.setAttribute('data-listo', '');
  medir();
}

// ---------- Arranque ----------
const nav = el('[data-rp]');
const sel = el('[data-rp-sel]');
const ref = nav ?? sel;
if (ref) {
  const ids = [...ref.querySelectorAll('a[href^="#"]')].map(idDe);
  const seg = seguimiento(ids, el('[data-rp-cuerpo]'));
  if (seg) {
    if (nav) indice(nav, seg);
    if (sel) selector(sel, seg);
  }
}
document.querySelectorAll('[data-rp-barra]').forEach(barra);
