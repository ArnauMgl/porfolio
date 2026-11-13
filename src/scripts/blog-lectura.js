// Barra de progreso de lectura del artículo.
//  - Escritorio (≥1024 px): barra vertical sticky, a la altura del H1, con un punto por título (H2). Móvil/tableta: barra fina de 4 px en el borde derecho.
//  - El relleno sigue el scroll real. La posición de cada punto se calcula con la posición real de su H2
//    y se recalcula cuando cambia el tamaño de la página (giro, fuentes, imágenes que terminan de cargar).
//  - Un punto pasa a amarillo cuando la «línea de lectura» (35 % de la altura de la pantalla) llega a su H2.
const raiz = document.querySelector('[data-lectura]');
const cuerpo = raiz?.querySelector('[data-cuerpo]');
const titulo = raiz?.querySelector('[data-titulo]');
if (raiz && cuerpo && titulo) iniciar();

function iniciar() {
  const barra = raiz.querySelector('[data-progreso]');
  const relleno = raiz.querySelector('[data-relleno]');
  const borde = raiz.querySelector('[data-borde]');
  const bordeRelleno = raiz.querySelector('[data-borde-relleno]');
  const marcas = [...raiz.querySelectorAll('[data-seccion]')].map((li) => ({
    li, punto: li.querySelector('.bl-mark__dot'), titulo: cuerpo.querySelector('#' + CSS.escape(li.dataset.seccion)), f: 0,
  })).filter((m) => m.titulo);
  const LINEA = 0.35;
  let inicio = 0, fin = 1, esperando = false;

  const absoluto = (el) => el.getBoundingClientRect().top + window.scrollY;

  function medir() {
    // El recorrido empieza en el H1 (donde arranca la barra) y acaba al final del cuerpo.
    // Nunca antes de la línea de lectura con la página arriba, para que el relleno arranque en 0.
    inicio = Math.max(absoluto(titulo), window.innerHeight * LINEA);
    fin = Math.max(inicio + 1, absoluto(cuerpo) + cuerpo.offsetHeight);
    const largo = Math.max(1, fin - inicio);
    for (const m of marcas) {
      m.f = Math.min(1, Math.max(0, (absoluto(m.titulo) - inicio) / largo));
      m.li.style.top = (m.f * 100).toFixed(2) + '%';
    }
    pintar();
  }

  function pintar() {
    esperando = false;
    const linea = window.scrollY + window.innerHeight * LINEA;
    const p = Math.min(1, Math.max(0, (linea - inicio) / Math.max(1, fin - inicio)));
    const pct = (p * 100).toFixed(2) + '%';
    relleno.style.height = pct;
    bordeRelleno.style.height = pct;
    barra.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    for (const m of marcas) m.punto.classList.toggle('is-passed', p >= m.f);
  }

  const pedir = () => { if (!esperando) { esperando = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', medir);
  new ResizeObserver(medir).observe(cuerpo);
  window.addEventListener('load', medir);
  document.fonts?.ready.then(medir);

  raiz.setAttribute('data-listo', '');
  borde.setAttribute('data-listo', '');
  medir();
}
