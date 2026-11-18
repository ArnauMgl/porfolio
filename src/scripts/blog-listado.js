// Listado de WIP: filtros por palabra clave, orden, paginador y estado en la URL.
// Mejora progresiva: el HTML ya trae todos los artículos; aquí solo se ocultan o se muestran filas.
// La lógica pura (filtrar, ordenar, paginar, leer/escribir la URL) está en lib/blog/listado.js y tiene pruebas.
import { calcularVista, leerEstado, escribirEstado, textoContador, ORDENES } from '../../lib/blog/listado.js';

const raiz = document.querySelector('[data-listado]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const porPagina = Number(raiz.dataset.porPagina) || 6;
  const filas = [...raiz.querySelectorAll('[data-lista] > .bl-item')];
  const articulos = filas.map((f) => ({ slug: f.dataset.slug, fecha: f.dataset.fecha, tags: (f.dataset.temas || '').split(' ').filter(Boolean) }));
  const lista = raiz.querySelector('[data-lista]');
  const controles = raiz.querySelector('[data-controles]');
  const contadorCaja = raiz.querySelector('[data-contador-caja]');
  const contador = raiz.querySelector('[data-contador]');
  const vacio = raiz.querySelector('[data-vacio]');
  const pager = raiz.querySelector('[data-pager]');
  const chips = [...raiz.querySelectorAll('[data-tema]')];
  const quitar = [...raiz.querySelectorAll('[data-quitar]')];
  const quitarArriba = quitar[0];
  const cajaOrden = raiz.querySelector('[data-orden]');
  const disparador = cajaOrden.querySelector('.bl-trigger');
  const menu = cajaOrden.querySelector('.bl-menu');
  const opciones = [...menu.querySelectorAll('.bl-opt')];
  const textoOrden = cajaOrden.querySelector('[data-orden-actual]');

  controles.hidden = false;
  contadorCaja.hidden = false;

  let estado = leerEstado(location.search);
  pintar();

  // ---- Estado → pantalla ----
  function pintar(foco) {
    const vista = calcularVista(articulos, estado, porPagina);
    estado.pagina = vista.pagina; // corrige una página fuera de rango
    const visibles = new Set(vista.visibles);
    filas.forEach((f) => { f.hidden = !visibles.has(f.dataset.slug); });
    lista.hidden = vista.cantidad === 0;
    vacio.hidden = vista.cantidad !== 0;
    contador.textContent = textoContador(vista.cantidad);

    chips.forEach((c) => c.setAttribute('aria-pressed', String(estado.temas.includes(c.dataset.tema))));
    quitarArriba.classList.toggle('is-off', estado.temas.length === 0);
    textoOrden.textContent = ORDENES.find((o) => o.id === estado.orden).nombre;
    opciones.forEach((o) => o.setAttribute('aria-current', String(o.dataset.valor === estado.orden)));

    // El orden se aplica reordenando las filas en el DOM (así el orden de lectura y de tabulación coincide con lo que se ve)
    const ordenadas = calcularVista(articulos, { ...estado, pagina: 1 }, articulos.length || 1).visibles;
    ordenadas.forEach((slug) => lista.append(filas.find((f) => f.dataset.slug === slug)));

    pintarPaginador(vista, foco);
  }

  function pintarPaginador(vista, foco) {
    if (vista.totalPaginas <= 1) { pager.hidden = true; pager.replaceChildren(); return; }
    pager.hidden = false;
    const flecha = (d) => `<svg class="ds-icon" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const numeros = Array.from({ length: vista.totalPaginas }, (_, i) => i + 1)
      .map((n) => `<button type="button" class="bl-page t-nav-strong" data-ir="${n}" aria-label="Página ${n}"${n === vista.pagina ? ' aria-current="page"' : ''}>${n}</button>`).join('');
    pager.innerHTML =
      `<p class="bl-pager__status t-meta">Página ${vista.pagina} de ${vista.totalPaginas}</p>` +
      `<div class="bl-pager__nav">` +
      `<button type="button" class="bl-step bl-step--prev t-nav-strong" data-ir="${vista.pagina - 1}"${vista.pagina <= 1 ? ' disabled' : ''}>${flecha('<line x1="216" y1="128" x2="40" y2="128"></line><polyline points="112 56 40 128 112 200"></polyline>')}Anterior</button>` +
      numeros +
      `<button type="button" class="bl-step bl-step--next t-nav-strong" data-ir="${vista.pagina + 1}"${vista.pagina >= vista.totalPaginas ? ' disabled' : ''}>Siguiente${flecha('<line x1="40" y1="128" x2="216" y2="128"></line><polyline points="144 56 216 128 144 200"></polyline>')}</button>` +
      `</div>`;
    // Al repintar se pierde el foco: lo devolvemos al botón equivalente
    if (foco) {
      const destino = pager.querySelector(`[data-ir="${foco}"]:not(:disabled)`) || pager.querySelector('[aria-current="page"]');
      destino?.focus();
    }
  }

  // ---- Cambios de estado (cada uno añade una entrada al historial, para que funcione «atrás») ----
  function cambiar(nuevo, { foco, subir } = {}) {
    estado = { ...estado, ...nuevo };
    history.pushState(null, '', location.pathname + escribirEstado(estado) + location.hash);
    pintar(foco);
    if (subir) lista.scrollIntoView({ block: 'start' });
  }

  chips.forEach((c) => c.addEventListener('click', () => {
    const id = c.dataset.tema;
    const temas = estado.temas.includes(id) ? estado.temas.filter((t) => t !== id) : [...estado.temas, id];
    cambiar({ temas, pagina: 1 });
  }));
  quitar.forEach((b) => b.addEventListener('click', () => {
    cambiar({ temas: [], pagina: 1 });
    // El botón pulsado se oculta: el foco pasa al primer chip para no perderse
    chips[0].focus();
  }));
  pager.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ir]');
    if (!b || b.disabled) return;
    const n = Number(b.dataset.ir);
    cambiar({ pagina: n }, { foco: n, subir: true });
  });
  window.addEventListener('popstate', () => { estado = leerEstado(location.search); pintar(); });

  // ---- Desplegable de orden ----
  const abierto = () => disparador.getAttribute('aria-expanded') === 'true';
  function abrir(cual) {
    menu.hidden = false;
    disparador.setAttribute('aria-expanded', 'true');
    const lista = cual === 'ultima' ? opciones.at(-1) : cual === 'primera' ? opciones[0] : (opciones.find((o) => o.getAttribute('aria-current') === 'true') || opciones[0]);
    lista.focus();
  }
  function cerrar(devolverFoco) {
    if (!abierto()) return;
    menu.hidden = true;
    disparador.setAttribute('aria-expanded', 'false');
    if (devolverFoco) disparador.focus();
  }
  disparador.addEventListener('click', () => (abierto() ? cerrar(false) : abrir()));
  disparador.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); abrir('primera'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); abrir('ultima'); }
  });
  menu.addEventListener('keydown', (e) => {
    const i = opciones.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); opciones[(i + 1) % opciones.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); opciones[(i - 1 + opciones.length) % opciones.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); opciones[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); opciones.at(-1).focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(true); }
  });
  opciones.forEach((o) => o.addEventListener('click', () => {
    cerrar(true);
    if (o.dataset.valor !== estado.orden) cambiar({ orden: o.dataset.valor, pagina: 1 });
  }));
  // Se cierra al salir (Tab, clic fuera)
  cajaOrden.addEventListener('focusout', (e) => { if (!cajaOrden.contains(e.relatedTarget)) cerrar(false); });
  document.addEventListener('click', (e) => { if (!cajaOrden.contains(e.target)) cerrar(false); });
}
