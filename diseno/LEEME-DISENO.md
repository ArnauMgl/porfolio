# Diseño del portfolio de Arnau Larripa (exportado de Claude Design)

Esta carpeta contiene el diseño terminado del portfolio. Es el **punto de partida** para construir la web real. Las instrucciones del proyecto están en `CLAUDE.md`, en la raíz del repositorio.

## Qué hay aquí

- `*.dc.html`: las páginas del diseño, como "artboards" de Claude Design. Cada página existe en versión escritorio y móvil (ver tabla en `CLAUDE.md`). `HomeTablet`, `SobreMiTablet`, `CaseBuscadorTablet` y `Home1024` son solo pruebas de responsive.
- `ds/arnau-portfolio/`: el sistema de diseño. `tokens.css` (colores, tipografía, espaciados), `components/bundle.css` (componentes y reglas responsive) y `tokens.json`. Es la fuente de verdad del aspecto visual.
- `assets/`: las 37 imágenes del diseño, en formato WebP, nombradas por un identificador. `assets/manifest.json` indica, para cada imagen, en qué páginas se usa y su texto alternativo.
- `canvas.json`: la disposición de los artboards en el lienzo de Claude Design. No hace falta para la web.

## Cosas que conviene saber

1. **Rutas de imágenes ya corregidas.** En Claude Design las imágenes se referenciaban como `/_blob/<id>`. En esta carpeta ya están reescritas como `assets/<id>.webp`, así que las páginas encuentran sus imágenes.
2. **Formato propio de Claude Design.** Los `.dc.html` usan elementos propios del lienzo (`<x-dc>`, `<helmet>` y un `<script type="text/x-dc">`) y referencian un `support.js` que **no** se incluye porque no es parte de la web. Hay que tratarlos como plantillas: el marcado interior (`<header>`, `<main>`, `<footer>`…) y las clases `ds-*` son lo que cuenta.
3. **Las clases `*-mobile` no significan "solo móvil".** Las páginas de escritorio y de móvil usan casi el mismo marcado; el cambio de maquetación ocurre en `bundle.css` con reglas de contenedor (≥640, ≥760 y ≥1024 px).
4. **Estilos en línea.** Los artboards de escritorio tienen algunos `style="..."` que los de móvil no tienen. Hay que pasarlos a CSS o descartarlos.
5. **Tipografía:** Inter Tight (500, 600 y 700), cargada desde Google Fonts en la cabecera de cada página.
