# Barra de progreso de lectura · especificación de implementación

Versión 1 · 26 nov 2026 · Para implementar en el portfolio (arnaularripa.com) con Claude Code.

Referencia visual (lienzo de Claude Design, solo para personas): https://claude.ai/artifact/L7CpufULuY7EuHVqtfzy45
Esta especificación es autosuficiente: Claude Code no necesita abrir el lienzo.

---

## 1. Alcance

Un componente de progreso de lectura para tres contextos, cada uno con su versión de escritorio y de móvil:

| Contexto | Escritorio (≥ 1280 px) | Móvil / ancho estrecho (< 1280 px) |
|---|---|---|
| **Casos de estudio** | Índice vertical sticky con puntos y etiquetas siempre visibles | Índice al principio del contenido + selector sticky «3 / 6 · Decisiones» con barra fina |
| **Blog (WIP)** | Mismo índice que los casos, en amarillo | Barra horizontal de 3 px en el borde superior |
| **Lab (bitácora)** | Marcas en el margen + barra vertical verde que se rellena | Barra horizontal de 3 px en el borde superior (verde) |

El criterio de «móvil» es el **ancho disponible**, no el tipo de dispositivo. Con zoom del 200–400 % el viewport CSS se estrecha y debe aparecer la versión estrecha.

## 2. Decisiones ya tomadas (no reabrir)

- El elemento principal es un **índice de secciones con progreso**, no una barra de porcentaje suelta.
- **Sin tiempo de lectura** dentro del componente (ni por sección ni «quedan X min»). El «N min de lectura» de las fichas y los listados del blog no se toca.
- Un punto o marca por cada `h2` del contenido. Se excluye «Referencias» si existe.
- Raíl en el **lado izquierdo**, dentro de la columna lateral de 320 px de la retícula (no sobre el texto).
- La pista y el relleno son decorativos (`aria-hidden`). Lo interactivo y semántico es la lista de enlaces.
- Descartado: anillo circular con porcentaje, contador de minutos en vivo, panel flotante estilo Substack (queda en el lienzo solo como alternativa archivada).

## 3. Tokens

Todo sale del sistema de diseño «Arnau Larripa» (Inter Tight, 4 px de radio, múltiplos de 8). Si el repo ya tiene `tokens.css`, reutiliza sus variables y añade solo las nuevas.

### 3.1 Claro (casos de estudio)

| Token | Valor | Uso |
|---|---|---|
| `--rp-bg` | `#FFFFFF` | Fondo |
| `--rp-text` | `#111111` | Etiqueta de sección vista o actual, relleno de la pista |
| `--rp-text-secondary` | `#6B6B6B` | Etiquetas pendientes, numeración, aro de punto pendiente |
| `--rp-track` | `#E2E2E2` | Pista (2 px) |
| `--rp-fill` | `#111111` | Relleno (2 px) |
| `--rp-accent` | `#B5502A` | Aro del punto actual, número actual, «3» del contador |
| `--rp-focus-bg` / `--rp-focus-ink` | `#FFDD00` / `#0B0C0C` | Foco de teclado |

### 3.2 Blog (WIP): mismo componente, acento amarillo

| Token | Valor | Uso |
|---|---|---|
| `--rp-yellow` | `#F7BD03` | Relleno de los puntos vistos y del actual, pastilla del número actual, subrayado de la pestaña activa (3 px) |
| `--rp-on-yellow` | `#111111` | Aro negro de los puntos y texto sobre amarillo (contraste ≈ 11:1) |
| `--rp-image-tint` / `--rp-image-tint-text` | `#FFF1BF` / `#5C4500` | Placeholder de imagen del blog |

Regla: el amarillo **nunca va como color de texto ni como único indicador** sobre blanco (contraste ≈ 1,7:1). Se usa como relleno con aro o texto negro.

### 3.3 Lab (oscuro)

| Token | Valor | Uso |
|---|---|---|
| `--rp-bg` | `#0A0C0B` | Fondo |
| `--rp-text` | `#ECEFED` | Texto |
| `--rp-text-secondary` | `#98A29E` | Metadatos |
| `--rp-green` | `#3EE08F` | Marcas vistas y actual, relleno de la barra, número actual |
| `--rp-track` | `rgba(255,255,255,0.22)` | Pista |
| `--rp-pending` | `#7B8581` | Marca pendiente (≥ 3:1 sobre `#0A0C0B`) |
| `--rp-line` | `rgba(255,255,255,0.14)` | Líneas secundarias |

## 4. Escritorio

### 4.1 Retícula

- Contenido máximo 1120 px, centrado: **columna lateral 320 px + hueco 80 px + texto 720 px**.
- El índice vive en la columna lateral con `position: sticky; top: 128px` (cabecera de 72 px + 56 px de aire).
- Cabecera de 72 px con línea inferior de 1 px.
- Visible solo con ancho ≥ 1280 px. Por debajo, se usa el patrón estrecho (§5).
- Blog: ocultar si el artículo tiene menos de 3 `h2`.

### 4.2 Índice con puntos (casos de estudio y blog)

Estructura visual, de arriba abajo en la columna lateral:

1. Etiqueta «En este caso» (casos) o «En este artículo» (blog): 15 px / 500 / `--rp-text-secondary`.
2. Contador «3 / 6»: 24 px / 600. El número actual en acento (casos) o dentro de una pastilla amarilla de 4 px de radio con 6 px de relleno lateral (blog). El « / 6» en secundario.
3. 40 px de espacio y el **raíl**.
4. Al pie (72 px más abajo): metadato en 15 px secundario. Casos: «Healthtech» (el sector). Blog: «WIP · Blog».

Raíl:

- Contenedor `position: relative`, 320 px de ancho, alto = `56 × (n − 1)` px.
- **Pista**: 2 px de ancho, `left: 23px`, de arriba abajo, `--rp-track`.
- **Relleno**: igual, `--rp-fill`, con `transform-origin: top` y `transform: scaleY(var(--rp-p))`. Nunca animar `height`.
- **Elementos**: un `<a>` por sección, `position: absolute`, alto 48 px, ancho 320 px, `top = i × 56 − 24` px. El centro de cada punto cae en `i × 56` px. Paso de 56 px entre puntos, zona táctil de 48 px.
- Dentro de cada enlace: una celda de 48 px con el punto centrado, y la etiqueta (16 px) a su derecha.

Estados del punto:

| Estado | Casos (claro) | Blog (amarillo) |
|---|---|---|
| Visto | 12 px, relleno `#111` | 14 px, relleno `#F7BD03`, aro 2 px `#111` |
| **Actual** | 20 px, relleno blanco, aro 4 px acento | 22 px, relleno `#F7BD03`, aro 3 px `#111` |
| Pendiente | 12 px, relleno blanco, aro 2 px `#6B6B6B` | 14 px, relleno blanco, aro 2 px `#6B6B6B` |

Estados de la etiqueta (todas visibles siempre; «N» es el número de sección sin cero inicial):

| Estado | Peso y color | Número |
|---|---|---|
| Vista | 500, `#111` | secundario, `#6B6B6B` |
| **Actual** | 600, `#111` | casos: acento `#B5502A`. Blog: sobre pastilla amarilla con texto `#111` |
| Pendiente | 500, `#6B6B6B` | secundario |

La sección actual se distingue por **tamaño, peso y forma del punto**, no solo por color.

**Relleno de la pista** (interpolación por tramos): sea `y(i) = i × 56` la posición del punto `i`, `top(i)` la posición de su `h2` en el documento y `top(n)` el final del cuerpo del artículo (fin del último párrafo antes de «Referencias» o «Sigue leyendo»). Con `i` la sección actual y `f = clamp((scrollY + offset − top(i)) / (top(i+1) − top(i)), 0, 1)`, el relleno mide `y(i) + f × (y(i+1) − y(i))`. Antes del primer `h2`, el relleno mide 0. `offset` = altura de la cabecera + 1/3 del viewport (el punto de lectura).

Los títulos de sección del cuerpo van en la columna de texto (`h2` de 40 px / 600, con su número en acento en los casos o en pastilla amarilla en el blog). Esto es una desviación consciente de `ds-case-section` (título a la izquierda), porque esa columna la ocupa el índice.

### 4.3 Lab: marcas y barra verde

Columna de marcas en el margen izquierdo, centrada verticalmente en el viewport (`position: sticky` o `fixed`, `left: 56px`, `top: 330px` en el mockup de 900 px de alto).

- Una marca horizontal por sección, en celdas de 48 px de alto y 48 px de ancho (zona táctil).
- **Marca vista**: 16 × 2 px, `--rp-green`. **Actual**: 28 × 4 px, `--rp-green`. **Pendiente**: 16 × 2 px, `--rp-pending`.
- **Barra vertical** detrás de las marcas: 2 px, `left: 23px` dentro de la columna, desde el centro de la primera marca hasta el de la última (`top: 24px`, alto `48 × (n − 1)` px). Pista `--rp-track`; relleno `--rp-green`.
- El relleno **avanza con el scroll hacia la siguiente marca** (misma interpolación por tramos que en §4.2, con paso de 48 px). Se detiene a medio camino si el lector está a medio camino.
- Etiqueta junto a la marca actual: «3 Marchas», 16 px / 600, número en verde, texto `--rp-text`, a 56 px de la columna. Recomendado: mostrar también la etiqueta al pasar el ratón o al enfocar cualquier otra marca (nunca depender solo del hover).
- A la izquierda del texto, en la columna lateral (`left: 160px`): «Bitácora 02 · Garsa» (15 px secundario) y el contador «3 / 5» con el «3» en verde.

Los nombres de sección del mockup del Lab («Qué es Garsa», «Presión de neumáticos», «Marchas», «Perfil de bici», «Modo taller») son ejemplos. Se generan a partir de los `h2` reales.

## 5. Móvil / ancho estrecho

Márgenes laterales de 24 px, cabecera de 56 px con el logo y un botón «Menú» de 48 × 48 px.

### 5.1 Barra superior (blog y Lab)

- Altura 3 px, ancho completo. Pista `--rp-track`, relleno negro (blog) o `--rp-green` (Lab).
- **Mide el progreso del cuerpo del artículo**, no de la página: del inicio del `<article>` al final del contenido, sin cabecera, pie, «Sigue leyendo» ni comentarios.
- Con la cabecera visible (arriba del todo o al subir), la barra cuelga de su borde inferior. Al bajar, la cabecera se oculta (slide de 300–400 ms) y la barra queda en `top: 0`. Al subir, la cabecera reaparece y la barra vuelve a su borde inferior.
- Al entrar en el viewport el bloque «Sigue leyendo» (blog) o «Siguiente entrada» (Lab), la barra se desvanece (200 ms). En el lienzo se dibuja al 30 % de opacidad para mostrar el momento intermedio.
- Decorativa: `aria-hidden="true"`.
- Mejora progresiva posible: relleno con `animation-timeline: view()` (+ `timeline-scope`) y `animation-range: entry 100% exit 0%`, con respaldo de scroll listener pasivo + `requestAnimationFrame`. Escalar con `transform: scaleX`.

### 5.2 Casos de estudio: índice + selector

1. **Al principio del caso**, dentro del contenido: tras la ficha (Sector, Rol), un bloque «En este caso» con línea de 2 px `#111` arriba y una lista de secciones. Cada fila: 48 px de alto, línea de 1 px `#E2E2E2` encima, número en secundario a la izquierda y título en 16 px / 500. Los números y títulos son enlaces. **Sin tiempos de lectura.**
2. **Selector sticky**: aparece cuando el índice inicial sale del viewport (y la cabecera ya se ha ocultado). Fila de 48 px con relleno lateral de 24 px: «3 / 6» en acento y 600, título de la sección actual en 600, chevron a la derecha. Es un `<button>` con `aria-expanded` y `aria-controls`. Debajo, la barra de 3 px (relleno negro) con el progreso del caso.
3. **Lista desplegada**: al pulsar el selector, un panel pegado debajo con las secciones (filas de 48 px). Las vistas muestran un icono de check de 24 px (stroke 2); la actual, su número en acento y la etiqueta «Estás aquí» (borde 1 px `#111`, 4 px de radio, 15 px / 500); las pendientes, el número en secundario. El panel lleva línea inferior de 2 px `#111`. El contenido bajo el panel se atenúa con un velo `rgba(255,255,255,0.82)`.
4. Se cierra con Esc, al pulsar fuera o al elegir una sección. Devuelve el foco al selector. Es un desplegable (disclosure), no un diálogo modal.

## 6. Accesibilidad (WCAG 2.2 AA)

- **Semántica**: `<nav aria-label="Secciones del artículo">` (en casos: «Secciones del caso de estudio») con `<ol>` de enlaces. A la sección actual: `aria-current="location"`. Pista, relleno y barra superior: `aria-hidden="true"`. **Nunca** `role="progressbar"` con `aria-valuenow` actualizado en cada scroll ni regiones vivas.
- **Nombre accesible = texto visible**. Preferir el título como contenido del enlace (visible en casos y blog) en vez de `aria-label` genérico. En el Lab, donde la etiqueta solo aparece en la actual / hover / foco, el título va como texto visualmente oculto y se revela, sin `aria-label` distinto.
- **Zonas táctiles**: 48 × 48 px por punto o marca, sin solaparse (paso de 56 px en puntos, 48 px en marcas).
- **Contraste no textual (1.4.11) ≥ 3:1**: puntos pendientes `#6B6B6B` sobre blanco (5,3:1); marca pendiente `#7B8581` sobre `#0A0C0B`; relleno `#111` y verde `#3EE08F` sobre sus fondos. La pista es complementaria: la información está en puntos y relleno.
- **No solo color**: el estado actual cambia también tamaño, grosor y peso tipográfico.
- **Foco de teclado** (patrón del sistema): enlaces y etiquetas con fondo `#FFDD00`, texto `#0B0C0C` y línea inferior de 4 px `#0B0C0C`; el punto o marca enfocado con el doble anillo `0 0 0 3px #FFDD00, 0 0 0 6px #0B0C0C`. Solo con `:focus-visible`.
- **Foco no oculto (2.4.11)**: `html { scroll-padding-top }` igual a la altura de cabecera (72 px escritorio; en móvil, la altura del selector o la cabecera visible). Que ni el selector sticky ni la barra tapen el `h2` de destino ni el foco.
- **Movimiento**: con `prefers-reduced-motion: reduce`, sin `scroll-behavior: smooth`, sin transiciones en puntos, desvanecido ni slide de cabecera. El relleno sigue al scroll (no es una animación autónoma).
- **Alto contraste** (`forced-colors: active`): relleno `CanvasText`, pista `GrayText`, y `outline` de 2 px en puntos y marcas para que no desaparezcan.
- **Reflow (1.4.10)**: a 320 px de ancho y con zoom de 400 % aparece el patrón estrecho; sin scroll horizontal.
- **Sin JS o sin soporte**: el artículo debe leerse perfectamente; el índice de escritorio (enlaces) debería existir en el HTML generado; el relleno y el estado actual son mejora.

## 7. Implementación técnica

- **Generación del índice**: a partir de `article h2[id]` (con ids estables a partir del título). Idealmente, en tiempo de build desde el Markdown, para que haya enlaces sin JS. El JS solo gestiona estado y relleno.
- **Medir poco, escribir poco**: medir posiciones de los `h2` y del final del cuerpo al cargar, al redimensionar y desde un `ResizeObserver` sobre el cuerpo (las imágenes que cargan tarde cambian la altura). En cada frame solo se escribe `--rp-p` o `transform`, y los atributos de estado cuando cambia la sección.
- **Estado «actual»**: `IntersectionObserver` con `rootMargin: '0px 0px -66% 0px'` (punto de lectura en el tercio superior), o el cálculo por tramos del §4.2.
- **Scroll**: listener `{ passive: true }` + `requestAnimationFrame`. Animar solo `transform` y `opacity`.
- **Relleno por tramos**: requiere JS (una `view-timeline` única no produce el relleno por secciones). La barra horizontal móvil sí puede ir en CSS con respaldo en JS.
- **Datos de soporte** (nov 2026): `animation-timeline`, `view-timeline` y `timeline-scope` funcionan en todos los motores desde Firefox 159 (27 oct 2026), pero hay versiones antiguas; mantener respaldo en JS durante 2027. `scroll-target-group` / `:target-current` es solo Chromium 140+ y no expone `aria-current`: no usarlo.
- **Sin dependencias nuevas.** Vanilla JS y CSS, integrados con la estructura del repo.

## 8. Criterios de aceptación y verificación

1. Casos y blog a ≥ 1280 px muestran el índice sticky con etiquetas, sin tiempos de lectura, y el punto actual cambia al cruzar cada `h2`.
2. El relleno de la pista avanza de forma continua entre un punto y el siguiente, y llega al último al final del cuerpo (no del pie).
3. Blog usa amarillo `#F7BD03` solo como relleno con aro negro o con texto negro; casos y Lab no lo usan.
4. Lab muestra las marcas con la barra vertical verde, que se rellena hacia la siguiente marca.
5. < 1280 px: blog y Lab muestran la barra de 3 px (se oculta con la cabecera, se desvanece al final); casos muestran el índice inicial y el selector sticky con su lista.
6. Teclado: Tab recorre los enlaces con foco visible y sin quedar tapado.
7. VoiceOver y NVDA: se anuncian la navegación y la sección actual; no hay anuncios durante el scroll.
8. Zoom 400 %, `forced-colors`, `prefers-reduced-motion`, Firefox ≥ 159 y un navegador sin soporte: todo funciona o degrada sin romper la lectura.
9. Sin JS: el contenido se lee y los enlaces del índice (si están en el HTML) funcionan.

## 9. Supuestos y puntos abiertos

- Los nombres de secciones, el título «Planificador de medicación» y las cifras de los mockups son ejemplos. Se sustituyen por el contenido real.
- Barra móvil del blog en negro (el amarillo sobre blanco no pasa el contraste en una línea de 3 px). Si se quiere amarillo, solo con borde o relleno oscuro.
- Umbral de 1280 px para pasar a patrón estrecho: confirmar contra los breakpoints del repo.
- En los casos, el sector («Healthtech») sustituye al tiempo de lectura en el pie del índice. Alternativa: quitar la línea.
- Posición exacta de las marcas del Lab (centrado vertical con `top: 330px` en 900 px de alto): decidir si es `fixed` o `sticky` según la estructura de la página del Lab.
- Si el repo ya tiene HANDOFF.md con un apartado de barra de progreso (4.4 en la v1.2), este documento lo **sustituye**: la barra móvil de 4 px en el borde derecho y los puntos sin etiquetas visibles quedan obsoletos.
