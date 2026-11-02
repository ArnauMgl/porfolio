# arnaularripa.com

Web personal de Arnau Larripa, hecha con [Astro](https://astro.build) como web estática.

## Dónde está cada cosa

- `src/pages/`: una página por archivo. La ruta del archivo es la dirección de la web.
- `src/layouts/Base.astro`: plantilla común (cabecera `<head>`, menú y pie).
- `src/components/`: piezas reutilizables (`Header`, `Footer`).
- `src/styles/`: sistema de diseño (`tokens.css`, `components.css`) y estilos generales.
- `public/`: archivos que se publican tal cual (favicon, robots.txt…).
- `diseno/`: el diseño original de Claude Design. Solo es referencia; no se publica.

## Publicación (Cloudflare Pages)

Proyecto en Cloudflare: `arnaularripa` (dirección provisional: https://arnaularripa.pages.dev).
Cada rama tiene además su propia vista previa en `https://<nombre-de-rama>.arnaularripa.pages.dev`.

- Comando de construcción: `npm run build`
- Carpeta de salida: `dist`
- Versión de Node: 22 (ver `.nvmrc`)

## Verlo en tu ordenador (opcional)

Requiere Node.js. En la carpeta del proyecto, ejecuta `npm install` una vez y
después `npm run dev`. Abre http://localhost:4321 en el navegador.
