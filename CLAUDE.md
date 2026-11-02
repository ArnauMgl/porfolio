# Portfolio de Arnau Larripa: instrucciones del proyecto

## Qué estamos construyendo

La web personal de **Arnau Larripa, Product Designer en Barcelona**, y más adelante su blog. Se publica en **arnaularripa.com**. El lanzamiento conjunto de la web y el blog está previsto para el **1 de diciembre de 2026**.

El diseño ya está terminado en **Claude Design**. Esta tarea es convertirlo en una web real que funcione, sin rediseñarlo.

## Cómo trabajar con Arnau

- Arnau es diseñador de producto, **no desarrollador**. Explica en lenguaje claro, sin jerga innecesaria, y di siempre qué has hecho y por qué.
- Antes de cualquier decisión grande (estructura del proyecto, herramientas, dependencias), **propón y espera su visto bueno**. Para decisiones pequeñas, adelante.
- Trabaja por pasos pequeños y comprobables. Cuando termines uno, explica cómo verlo en el navegador.
- Idioma de trabajo: **castellano**.
- **No cambies los textos** de la web salvo que Arnau lo pida. Están revisados y validados.

## Qué tipo de web es

Una **web estática**. No hace falta servidor, base de datos ni inicio de sesión.

- **Alojamiento:** Cloudflare Pages, conectado a un repositorio de GitHub (cada subida a la rama principal publica la web).
- **Dominio:** arnaularripa.com, ya gestionado en Cloudflare.
- Antes de elegir tecnología, propón una opción **simple** y explica sus pros y contras. Dos candidatas: HTML y CSS puros, o un generador estático como Astro (pensando en que el blog se escribirá en Markdown). No añadas frameworks pesados sin necesidad.

## Punto de partida: qué hay en el diseño

Todo el diseño está en la carpeta **`diseno/`** del repositorio. Lee primero `diseno/LEEME-DISENO.md`. Los archivos exportados de Claude Design son artboards con extensión `.dc.html`. Cada página existe en versión escritorio y versión móvil:

| Página | Escritorio | Móvil |
|---|---|---|
| Home | `Main` | `Mobile` |
| Trabajo seleccionado | `Trabajo` | `TrabajoMobile` |
| Sobre mí | `SobreMi` | `SobreMiMobile` |
| Caso eSBARD Edu | `CaseStudy` | `CaseStudyMobile` |
| Caso Buscador app sanitaria | `CaseBuscador` | `CaseBuscadorMobile` |
| Caso Planificador de medicación | `CasePlanificador` | `CasePlanificadorMobile` |

Además:

- `Estados`: documenta los estados de interacción (hover, foco, etc.). Es una referencia, no una página.
- `HomeTablet`, `SobreMiTablet`, `CaseBuscadorTablet`, `Home1024`: artboards de prueba para revisar el responsive. No son páginas de la web.
- `ds/arnau-portfolio/`: el **sistema de diseño**. `tokens.css` (colores, tipografía, espaciados), `components/bundle.css` (componentes) y `tokens.json`. Es la **fuente de verdad del aspecto visual**.

## Primera tarea (usa un modelo potente, por ejemplo Opus)

1. Proponer la estructura del proyecto y la tecnología (ver arriba) y esperar el visto bueno.
2. **Unificar escritorio y móvil en una sola página adaptable** por cada página de la web. Hoy son archivos separados, pero el marcado es casi idéntico. Los artboards de escritorio tienen algunos **estilos en línea** que no existen en los de móvil (por ejemplo, un tamaño de fuente fijo en el título de «Trabajo seleccionado»). Pásalos a CSS o descártalos si están de más. Usa el marcado móvil como base, más limpia, y comprueba después que a 1440 px el resultado coincide con el artboard de escritorio.
3. Sustituir los enlaces entre artboards (`*.dc.html`) por rutas normales de la web.
4. Las 37 imágenes del diseño (en `diseno/assets/`, ya en WebP) suman unos 2,4 MB. Revísalas: tamaños adecuados al ancho en que se muestran, atributos de ancho y alto para evitar saltos de maquetación y carga diferida en las que estén fuera de pantalla, **sin cambiar su aspecto**.

## Puntos de corte (ya decididos)

El responsive del diseño usa consultas de contenedor en `bundle.css`. En la web real, usa consultas de ancho de pantalla equivalentes.

| Ancho | Comportamiento |
|---|---|
| Menos de 640 px | Móvil: una columna, márgenes de 24 px. |
| Desde 640 px | Tableta: márgenes de 48 px y títulos algo mayores. Sigue en una columna. |
| Desde 760 px | La cabecera de «Sobre mí» pasa a dos columnas, con la foto reducida a 260 px. |
| Desde 1024 px | Escritorio: márgenes de 80 px y la maquetación de dos columnas completa. |

Anchos de prueba: **320, 390, 768, 820, 1024 y 1440 px**. En todos, sin textos cortados ni desbordes horizontales.

## Reglas de texto y marca (no romper)

- El proyecto de ciberseguridad se escribe siempre **«eSBARD Edu»** (con «Edu», no «EDU»).
- Arnau se presenta como **«Product Designer»**.
- En los casos de estudio se usa la **primera persona del plural** («diseñamos»). Se mantienen en singular algunos pasajes personales (por ejemplo, su salida de un proyecto) y la etiqueta «Mi papel».
- En los equipos de los casos aparecen **solo roles, sin género**: «Lead de diseño», «Product Manager», «Product Owner».
- «Sobre mí» va en primera persona del singular.

## Detalles de diseño ya cerrados

- Las listas llevan **viñeta redonda de color de acento** (terracota), tanto en la Trayectoria como en el texto de los casos.
- Los subtítulos del bloque «Resumen» de cada caso van en color de acento.
- Los números de los pasos de los casos tienen el mismo tamaño que el título del paso.
- Las imágenes que son páginas impresas (en el caso del planificador) llevan un borde gris claro y una sombra suave para distinguirlas del fondo.
- Tipografía: **Inter Tight** (500, 600 y 700). Está alojada en el propio proyecto (`public/fonts/`, definida en `src/styles/fuentes.css`), sin Google Fonts. Consulta con Arnau antes de cambiar el método de carga.

## Accesibilidad y calidad

- Objetivo: **WCAG 2.1 AA**. Contraste suficiente, foco visible con teclado, textos alternativos en las imágenes, marcado semántico y `lang="es"`.
- Respeta `prefers-reduced-motion`.
- Cada página necesita título, descripción, favicon e imagen para compartir en redes.
- Añade `sitemap.xml` y `robots.txt`.
- No añadas analítica ni cookies sin consultarlo.

## Cómo gestionar las sesiones

- Haz **una sesión por bloque de trabajo** (por ejemplo, una por página) y no una sola sesión interminable.
- Para el trabajo rutinario (ajustar estilos, convertir páginas, corregir) usa un modelo más ligero (Sonnet). Reserva el potente (Opus) para la estructura y para fallos difíciles.
- Si la conversación se alarga, resume y continúa en una sesión nueva.

## Orden de trabajo sugerido

1. Estructura del proyecto y sistema de diseño (tokens y componentes).
2. Home.
3. Trabajo seleccionado.
4. Sobre mí.
5. Los tres casos de estudio.
6. Revisión en todos los anchos de prueba y en un móvil real.
7. Optimización de imágenes, SEO y accesibilidad.
8. Conexión con Cloudflare Pages y publicación en el dominio.
9. El blog, **después** del lanzamiento de la web, salvo que Arnau indique lo contrario.
