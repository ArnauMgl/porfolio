// Lab: filtro por proyecto (chips) e índice de escritorio. Mejora progresiva: el HTML ya trae todas las entradas («Todos»);
// aquí solo se ocultan o muestran con [hidden]. El estado vive en la URL (?proyecto=bike-tool) para poder compartirlo.
// La lógica pura (válido, texto del resultado) está en lib/lab/bitacora.js y tiene pruebas.
import { proyectoValido, textoResultado } from '../../lib/lab/bitacora.js';

const raiz = document.querySelector('[data-lab]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const chips = [...raiz.querySelectorAll('[data-proyecto]')];
  const proyectos = chips.filter((c) => c.dataset.proyecto).map((c) => ({ slug: c.dataset.proyecto }));
  const estado = raiz.querySelector('[data-estado]');
  const entradas = [...raiz.querySelectorAll('[data-feed] > li')];
  const enlacesIndice = [...raiz.querySelectorAll('.lab-index__body li')];
  const grupos = [...raiz.querySelectorAll('[data-grupo]')];

  function aplicar(proyecto, { anunciar }) {
    const chip = chips.find((c) => c.dataset.proyecto === proyecto);
    for (const c of chips) c.setAttribute('aria-pressed', String(c === chip));
    // Bajo un proyecto solo salen sus entradas: las de «lab» se ocultan.
    const visible = (el) => !proyecto || el.dataset.project === proyecto;
    for (const el of [...entradas, ...enlacesIndice]) el.hidden = !visible(el);
    // Un grupo del índice (un mes) se oculta si ya no le queda ninguna entrada visible.
    for (const g of grupos) g.hidden = ![...g.querySelectorAll('li')].some((li) => !li.hidden);
    if (anunciar) {
      const cantidad = entradas.filter((e) => !e.hidden).length;
      estado.textContent = textoResultado(cantidad, proyecto ? chip.dataset.label : '');
    }
  }

  function escribirUrl(proyecto) {
    const url = new URL(location.href);
    if (proyecto) url.searchParams.set('proyecto', proyecto);
    else url.searchParams.delete('proyecto');
    history.replaceState(null, '', url);
  }

  for (const c of chips) {
    c.addEventListener('click', () => {
      aplicar(c.dataset.proyecto, { anunciar: true });
      escribirUrl(c.dataset.proyecto);
    });
  }

  // Estado inicial desde la URL (solo si el proyecto existe; si no, «Todos»).
  const inicial = proyectoValido(new URLSearchParams(location.search).get('proyecto') ?? '', proyectos);
  if (inicial) aplicar(inicial, { anunciar: true });

  // Índice de escritorio: marca con aria-current="location" la entrada que se está leyendo.
  const enlaces = new Map([...raiz.querySelectorAll('.lab-index__link')].map((a) => [a.getAttribute('href').slice(1), a]));
  const marcar = (id) => {
    for (const [clave, a] of enlaces) {
      if (clave === id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  };
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(
      (registros) => {
        for (const r of registros) if (r.isIntersecting) marcar(r.target.id);
      },
      { rootMargin: '-10% 0px -75% 0px' },
    );
    for (const e of raiz.querySelectorAll('[data-feed] .lab-entry')) observador.observe(e);
  }
}
