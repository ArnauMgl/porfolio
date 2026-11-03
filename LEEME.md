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

## Modal de contacto (v1.1)

- Marcado: `src/components/Contacto.astro` (se incluye en `Base.astro`). Comportamiento: `src/scripts/contacto.js`. Estilos: final de `src/styles/components.css`; tokens nuevos al final de `src/styles/tokens.css`.
- Cualquier enlace con `data-contacto` abre el panel (sin JavaScript sigue siendo un `mailto:`). También se abre con la URL `#contacto`.
- La red está aislada en `enviarContacto(datos)` (`POST /api/contact`). El backend (Cloudflare + Resend) y Turnstile (`turnstileToken`, marcado con `TODO`) llegan después.
- Simulador (solo fuera de arnaularripa.com, es decir, en localhost y vistas previas): añade `?simular=exito`, `error`, `lento` o `validacion` a la URL, por ejemplo `/?simular=error`.
