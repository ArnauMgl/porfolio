# Barra de progreso de lectura · especificación de implementación

Versión 1.1 · 26 nov 2026 · Actualizada para que coincida con lo implementado en el portfolio (arnaularripa.com). La v1 original se diseñó en el lienzo de Claude Design; donde esta versión difiere, manda esta.

Referencia visual del diseño original (lienzo de Claude Design, solo para personas): https://claude.ai/artifact/L7CpufULuY7EuHVqtfzy45. Esta especificación es autosuficiente.

Qué cambia respecto a la v1: sin contador «3 / 6», sin números en las etiquetas, sin rótulo («En este caso» / «En este artículo») ni metadato al pie en escritorio, los `h2` del cuerpo no se numeran, y la cabecera de la web no es fija, lo que cambia la barra móvil (§5.1).

---

## 1. Alcance

Un componente de progreso de lectura para tres contextos, cada uno con su versión de escritorio y de ancho estrecho:

| Contexto | Escritorio (≥ 1280 px) | Ancho estrecho (< 1280 px) |
|---|---|---|
| **Casos de estudio** | Índice vertical sticky con puntos y etiquetas siempre visibles | Índice al principio del contenido (rótulo «En este caso») + selector sticky con el título de la sección actual y barra fina |
| **Blog (WIP)** | Mismo índice que los casos, con amarillo | Barra horizontal de 3 px en el borde superior |
| **Lab (bitácora)** | Marcas en el margen + barra vertical verde que se rellena. Si la entrada tiene menos de 3 `h2`, no hay marcas y se usa la barra horizontal de 3 px (verde) | Barra horizontal de 3 px en el borde superior (verde) |

El criterio de «estrecho» es el **ancho disponible**, no el tipo de dispositivo. Con zoom del 200–400 % el viewport CSS se estrecha y debe aparecer la versión estrecha.

## 2. Decisiones ya tomadas (no reabrir)

- El elemento principal es un **índice de secciones con progreso**, no una barra de porcentaje suelta.
- **Sin tiempo de lectura** dentro del componente. El «N min de lectura» de las fichas y los listados del blog no se toca.
- **Sin contador «3 / 6»**, en escritorio ni en el selector móvil.
- **Sin números en las etiquetas** del índice (ni en escritorio, ni en el índice inicial y la lista del selector móvil). La sección actual se distingue por forma, tamaño y peso.
- **Sin rótulo ni metadato al pie** del índice de escritorio (ni «En este caso» / «En este artículo», ni el sector, ni «WIP · Blog»).
- **Los `h2` del cuerpo no se numeran.** Blog: punto amarillo en el margen, como ya estaba. Casos: `h2` sin marcador. Los números solo van en listados dentro de una sección.
- Un punto o marca por cada `h2` del contenido. Se excluye «Referencias» (blog) y «Más proyectos» (casos).
- Raíl en el **lado izquierdo**, dentro de la columna lateral de 320 px (no sobre el texto).
- La pista y el relleno son decorativos (`aria-hidden`). Lo interactivo y semántico es la lista de enlaces.
- Descartado: anillo circular con porcentaje, contador de minutos en vivo, panel flotante estilo Substack.

## 3. Tokens

Todo sale del sistema de diseño «Arnau Larripa» (Inter Tight, 4 px de radio, múltiplos de 8). Se reutilizan las variables de `src/styles/tokens.css` y `src/styles/lectura.css` añade solo las nuevas (prefijo `--rp-`).

### 3.1 Claro (casos de estudio)

| Token | Valor | Uso |
|---|---|---|
| `--rp-bg` | `var(--bg)` (`#FFFFFF`) | Fondo |
| `--rp-text` | `var(--text)` (`#111111`) | Etiqueta de sección vista o actual |
| `--rp-text-secondary` | `var(--text-secondary)` (`#6B6B6B`) | Etiquetas pendientes, aro de punto pendiente |
| `--rp-track` | `#E2E2E2` | Pista (2 px) |
| `--rp-fill` | `#111111` | Relleno (2 px) |
| `--rp-accent` | `var(--accent)` (`#B5502A`) | Aro del punto actual |
| `--rp-focus-bg` / `--rp-focus-ink` | `#FFDD00` / `#0B0C0C` | Foco de teclado |

### 3.2 Blog (WIP): mismo componente, acento amarillo

| Token | Valor | Uso |
|---|---|---|
| `--rp-yellow` | `#F7BD03` | Relleno de los puntos vistos y aro del actual |
| `--rp-on-yellow` | `#111111` | Aro negro de los puntos |
| `--rp-accent` | `#111111` (en `.tema-wip`) | Aro de contraste del punto actual |

Regla: el amarillo **nunca va como color de texto ni como único indicador** sobre blanco (contraste ≈ 1,7:1). Se usa como relleno con aro negro. Sin pastillas amarillas detrás de números ni de etiquetas.

### 3.3 Lab (oscuro)

| Token | Valor | Uso |
|---|---|---|
| `--rp-bg` | `#0A0C0B` | Fondo |
| `--rp-text` | `#ECEEED` | Texto |
| `--rp-text-secondary` | `#98A29E` | Metadatos |
| `--rp-green` | `#3EE08F` | Marcas vistas y actual |
| `--rp-fill` | `#3EE08F` | Relleno de la barra |
| `--rp-track` | `rgba(255,255,255,0.22)` | Pista |
| `--rp-pending` | `#7B8581` | Marca pendiente (≥ 3:1 sobre `#0A0C0B`) |

Estos valores solo se aplican al componente (clase `.lab`); no cambian la paleta del Lab.

## 4. Escritorio

### 4.1 Retícula

- Contenido máximo 1120 px, centrado: **columna lateral 320 px + hueco 80 px + texto 720 px**.
- Los casos no tenían columna lateral: se añade solo desde 1280 px (`.rp-layout`). Por debajo, el maquetado no cambia.
- El índice vive en la columna lateral con `position: sticky; top: 128px`. La cabecera de la web **no es fija** (se va al hacer scroll); los 128 px se mantienen como aire superior.
- Visible solo con ancho ≥ 1280 px. Por debajo, se usa el patrón estrecho (§5). El punto de corte de 1280 px vive solo en `src/styles/lectura.css` y `src/scripts/lectura.js`; el repo usa además 640, 760 y 1024 px.
- Se muestra con **3 o más `h2`** (blog y Lab). Los casos tienen siempre 7.

### 4.2 Índice con puntos (casos y blog)

Estructura, de arriba abajo en la columna lateral: **solo el raíl**, alineado con el primer título (raíl a 24 px del borde superior del bloque, de modo que el primer punto cae en el centro de la primera línea).

Raíl:

- Contenedor `position: relative`, 320 px de ancho, alto = `56 × (n − 1)` px.
- **Pista**: 2 px de ancho, `left: 23px`, de arriba abajo, `--rp-track`.
- **Relleno**: igual, `--rp-fill`, con `transform-origin: top` y `transform: scaleY(var(--rp-p))`. Nunca animar `height`.
- **Elementos**: un `<a>` por sección, `position: absolute`, alto 48 px, ancho 320 px, `top = i × 56 − 24` px. El centro de cada punto cae en `i × 56` px. Paso de 56 px entre puntos, zona táctil de 48 px.
- Dentro de cada enlace: una celda de 48 px con el punto centrado, y la etiqueta (16 px) a su derecha. La etiqueta es solo el título de la sección (puede ocupar dos líneas).

Estados del punto:

| Estado | Casos (claro) | Blog (amarillo) |
|---|---|---|
| Visto | 12 px, relleno `#111` | 12 px, relleno `#F7BD03`, aro 2 px `#111` |
| **Actual** | 20 px, relleno blanco, aro 4 px acento | 20 px, relleno blanco, aro 4 px `#F7BD03` y filo exterior de 2 px `#111` |
| Pendiente | 12 px, relleno blanco, aro 2 px `#6B6B6B` | 12 px, relleno blanco, aro 2 px `#6B6B6B` |

Estados de la etiqueta (todas visibles siempre):

| Estado | Peso y color |
|---|---|
| Vista | 500, `#111` |
| **Actual** | 600, `#111` |
| Pendiente | 500, `#6B6B6B` |

La sección actual se distingue por **tamaño, peso y forma del punto**, no solo por color.

**Relleno de la pista** (interpolación por tramos): sea `y(i) = i × 56` la posición del punto `i` y `top(i)` la posición de su `h2` en el documento. Con `i` la sección actual y `f = clamp((pos − top(i)) / (top(i+1) − top(i)), 0, 1)`, el relleno mide `y(i) + f × (y(i+1) − y(i))`. Antes del primer `h2` el relleno mide 0 y no hay sección actual. En la última sección el relleno está completo. `pos = scrollY + 1/3 del alto de la pantalla` (el punto de lectura; la cabecera no es fija, no se descuenta). Al llegar al final de la página, la última sección cuenta como actual.

**Títulos de sección del cuerpo:** no llevan número. Blog: punto amarillo colgado en el margen (`wip.css`). Casos: sin marcador.

### 4.3 Lab: marcas y barra verde

Solo en la página de una entrada (`/lab/<slug>/`) con 3 o más `h2`. Columna de marcas en el margen izquierdo, centrada verticalmente en el viewport (`position: fixed`, `top: 50%`, `left: max(16px, (100vw − 1120px) / 2 − 104px)`).

- Una marca horizontal por sección, en celdas de 48 px de alto y 48 px de ancho (zona táctil).
- **Marca vista**: 16 × 2 px, `--rp-green`. **Actual**: 28 × 4 px, `--rp-green`. **Pendiente**: 16 × 2 px, `--rp-pending`.
- **Barra vertical** detrás de las marcas: 2 px, `left: 23px`, desde el centro de la primera marca hasta el de la última (alto `48 × (n − 1)` px). Pista `--rp-track`; relleno `--rp-green`. El relleno avanza con el scroll hacia la siguiente marca (misma interpolación por tramos que en §4.2, con paso de 48 px).
- Etiqueta (solo el título, 16 px / 600) junto a la marca **actual**, a 56 px de la columna, con fondo del color de la página. También se muestra al pasar el ratón o al enfocar cualquier otra marca (nunca depender solo del hover). El título está siempre en el HTML como texto visualmente oculto, sin `aria-label` distinto.
- La página de la entrada pasa a retícula 320 + 80 + 720. En la columna lateral va, sticky, solo el nombre del proyecto (sin contador).

Las secciones se generan a partir de los `h2` reales. Hoy ninguna entrada del Lab tiene `h2`, así que las marcas no aparecen hasta que alguna tenga 3 o más. Mientras tanto, la entrada lleva la barra horizontal de 3 px (§5.1) también en escritorio.

## 5. Ancho estrecho (< 1280 px)

### 5.1 Barra superior (blog y Lab)

- Altura 3 px, ancho completo, `position: fixed; top: 0`. Pista `--rp-track`, relleno negro (blog) o `--rp-green` (Lab). Va en todos los artículos del blog y en todas las entradas del Lab (`/lab/<slug>/`, no en el listado).
- **La cabecera de la web no es fija ni se oculta**, así que la barra va siempre en `top: 0` (no cuelga del borde de la cabecera).
- **Mide el progreso del cuerpo del artículo**, no de la página: de 0 cuando el inicio del `<article>` toca el borde superior a 1 cuando el final del cuerpo llega al borde inferior de la pantalla. Sin pie, «Sigue leyendo» ni comentarios.
- Al entrar en la pantalla el bloque «Sigue leyendo» (blog) o «Siguiente entrada» (Lab), la barra se desvanece (200 ms). En el blog, si no hay «Sigue leyendo» (menos de 3 artículos publicados), la barra se queda completa.
- Decorativa: `aria-hidden="true"`. Sin JS no se muestra.
- Se escala con `transform: scaleX`; solo se animan `transform` y `opacity`.

### 5.2 Casos de estudio: índice + selector

1. **Al principio del caso**, dentro de la ficha, tras Sector, Rol, etc.: un bloque con línea de 2 px `#111` arriba, el rótulo «En este caso» y una lista de secciones. Cada fila: 48 px de alto, línea de 1 px `#E2E2E2` encima y el título en 16 px / 500. Los títulos son enlaces. **Sin números ni tiempos de lectura.**
2. **Selector sticky** (`position: fixed; top: 0`): aparece, solo con JS, cuando el bloque inicial sale de la pantalla por arriba y mientras el cuerpo del caso está a la vista. Fila de 48 px con el título de la sección actual en 600 y un chevron a la derecha (sin contador). Es un `<button>` con `aria-expanded` y `aria-controls`. Debajo, la barra de 3 px (relleno negro) con el progreso del cuerpo del caso.
3. **Lista desplegada**: al pulsar el selector, un panel pegado debajo con las secciones (filas de 48 px). Las vistas muestran un icono de check de 24 px (stroke 2); la actual, su título en 600 y la etiqueta «Estás aquí» (borde 1 px `#111`, 4 px de radio, 15 px / 500); las pendientes, solo el título. El panel lleva línea inferior de 2 px `#111` y se desplaza si no cabe. El contenido bajo el panel se atenúa con un velo `rgba(255,255,255,0.82)`.
4. Se cierra con Esc, al pulsar fuera o al elegir una sección. Devuelve el foco al selector. Es un desplegable (disclosure), no un diálogo modal.

## 6. Accesibilidad (WCAG 2.2 AA)

- **Semántica**: `<nav aria-label="Secciones del artículo">` (en casos: «Secciones del caso de estudio»; en el Lab: «Secciones de la entrada») con `<ol>` de enlaces. A la sección actual: `aria-current="location"`. Pista, relleno y barras: `aria-hidden="true"`. **Nunca** `role="progressbar"` ni regiones vivas.
- **Nombre accesible = texto visible**: el título de la sección es el contenido del enlace (sin `aria-label`). En el Lab, donde la etiqueta solo aparece en la actual / hover / foco, el título va como texto visualmente oculto y se revela.
- **Zonas táctiles**: 48 × 48 px por punto o marca, sin solaparse (paso de 56 px en puntos, 48 px en marcas).
- **Contraste no textual (1.4.11) ≥ 3:1**: puntos pendientes `#6B6B6B` sobre blanco (5,3:1); marca pendiente `#7B8581` sobre `#0A0C0B`; relleno `#111` y verde `#3EE08F` sobre sus fondos. En el blog, el amarillo va siempre con aro negro. La pista es complementaria: la información está en puntos y relleno.
- **No solo color**: el estado actual cambia también tamaño, grosor y peso tipográfico.
- **Foco de teclado** (patrón del sistema): etiqueta con fondo `#FFDD00`, texto `#0B0C0C` y línea inferior de 4 px `#0B0C0C`; el punto o marca enfocado con el doble anillo `0 0 0 3px #FFDD00, 0 0 0 6px #0B0C0C`. Solo con `:focus-visible`.
- **Foco no oculto (2.4.11)**: en ancho estrecho, `html:has(.rp-sel) { scroll-padding-top }` = alto del selector + 16 px, para que el selector sticky no tape el `h2` de destino ni el foco. En escritorio la cabecera no es fija y no hace falta.
- **Movimiento**: con `prefers-reduced-motion: reduce`, sin transición en el desvanecido de la barra. El relleno sigue al scroll (no es una animación autónoma). No se usa `scroll-behavior: smooth`.
- **Alto contraste** (`forced-colors: active`): relleno `CanvasText`, pista `GrayText`, y `outline` de 2 px en puntos y marcas para que no desaparezcan.
- **Reflow (1.4.10)**: a 320 px de ancho y con zoom de 400 % aparece el patrón estrecho; sin scroll horizontal.
- **Sin JS o sin soporte**: el artículo se lee perfectamente y el índice de escritorio y la lista inicial de los casos (enlaces) existen en el HTML. El relleno, el estado actual, la barra superior y el selector sticky son mejora.

## 7. Implementación técnica

- **Generación del índice**: en tiempo de build. Blog y Lab: de los `h2` del Markdown (ids estables de Astro, sin «Referencias»). Casos: lista `secciones` en cada página (`src/pages/trabajo/*.astro`), de sus `h2`, sin «Más proyectos».
- **Piezas**: `src/components/IndiceLectura.astro` (índice de escritorio), `BarraLectura.astro` (barra de 3 px), `IndiceCasoEstrecho.astro` (índice inicial y selector de los casos), `src/styles/lectura.css` y `src/scripts/lectura.js`.
- **Medir poco, escribir poco**: se miden las posiciones de los `h2` y del cuerpo al cargar, al redimensionar y desde un `ResizeObserver` sobre el cuerpo (las imágenes que cargan tarde cambian la altura). En cada frame solo se escribe `--rp-p` / `--rp-b` y los atributos de estado, y solo cuando cambian. Una sola medición compartida entre el índice, el selector y la barra.
- **Estado «actual»**: cálculo por tramos del §4.2 con el punto de lectura en el tercio superior (no `IntersectionObserver`). `IntersectionObserver` solo se usa para el desvanecido de la barra y para mostrar u ocultar el selector.
- **Scroll**: listener `{ passive: true }` + `requestAnimationFrame`. Se anima solo `transform` y `opacity`.
- **Relleno por tramos**: requiere JS. La barra horizontal es también JS (sin `animation-timeline`).
- **Sin dependencias nuevas.** Vanilla JS y CSS, integrados con la estructura del repo.

## 8. Criterios de aceptación y verificación

1. Casos y blog a ≥ 1280 px muestran el índice sticky con etiquetas, sin números, sin contador, sin rótulo y sin tiempos de lectura, y el punto actual cambia al cruzar cada `h2`.
2. El relleno de la pista avanza de forma continua entre un punto y el siguiente, y está completo en la última sección.
3. Blog usa amarillo `#F7BD03` solo como relleno con aro negro; casos y Lab no lo usan.
4. Lab, en entradas con 3 o más `h2`, muestra las marcas con la barra vertical verde que se rellena hacia la siguiente marca. Sin `h2`, muestra la barra de 3 px.
5. < 1280 px: blog y Lab muestran la barra de 3 px (se desvanece al final); casos muestran el índice inicial y el selector sticky con su lista.
6. Teclado: Tab recorre los enlaces con foco visible y sin quedar tapado.
7. VoiceOver y NVDA: se anuncian la navegación y la sección actual; no hay anuncios durante el scroll.
8. Zoom 400 %, `forced-colors`, `prefers-reduced-motion`, Firefox ≥ 159 y un navegador sin soporte: todo funciona o degrada sin romper la lectura.
9. Sin JS: el contenido se lee y los enlaces del índice funcionan.
10. Los `h2` del cuerpo no tienen números correlativos.

Comprobado en Chromium (anchos 320, 390, 1279, 1280 y 1440 px, teclado, `prefers-reduced-motion`, `forced-colors` y sin JS). Pendiente de comprobar: VoiceOver, NVDA, Firefox ≥ 159 y un móvil real.

## 9. Supuestos y puntos abiertos

- Los nombres de secciones salen del contenido real (`h2`).
- Barra móvil del blog en negro (el amarillo sobre blanco no pasa el contraste en una línea de 3 px).
- En los casos, el rótulo «En este caso» se mantiene solo en el índice inicial del ancho estrecho.
- Si más adelante la cabecera pasa a ser fija o a ocultarse al bajar, la barra superior debería colgar de su borde inferior y volver a `top: 0` al ocultarse, y habría que sumar su altura al punto de lectura y a `scroll-padding-top`.
- El repo no tiene `HANDOFF.md`: el resumen de este componente está en `LEEME.md`, que apunta a este documento.
