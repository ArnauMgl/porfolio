# arnaularripa.com

Web personal de Arnau Larripa, hecha con [Astro](https://astro.build) como web estática.

## Dónde está cada cosa

- `src/pages/`: una página por archivo. La ruta del archivo es la dirección de la web.
- `src/layouts/Base.astro`: plantilla común (cabecera `<head>`, menú y pie).
- `src/components/`: piezas reutilizables (`Header`, `Footer`, `Contacto`).
- `src/styles/`: sistema de diseño (`tokens.css`, `components.css`) y estilos generales.
- `public/`: archivos que se publican tal cual (favicon, robots.txt…).
- `diseno/`: el diseño original de Claude Design. Solo es referencia; no se publica.

## Publicación (Cloudflare Pages)

Proyecto en Cloudflare: `arnaularripa` (dirección provisional: https://arnaularripa.pages.dev).
Cada rama tiene además su propia vista previa en `https://<nombre-de-rama>.arnaularripa.pages.dev`.

- Comando de construcción: `npm run build`
- Carpeta de salida: `dist`
- Versión de Node: 22 (ver `.nvmrc`)
- Páginas que no existen: `src/pages/404.astro` genera `dist/404.html`. Con ese archivo en la raíz, Cloudflare Pages devuelve un 404 real (sin él, serviría la home con código 200). No hace falta configurar nada más. La página lleva `noindex`.

## Verlo en tu ordenador (opcional)

Requiere Node.js. En la carpeta del proyecto, ejecuta `npm install` una vez y
después `npm run dev`. Abre http://localhost:4321 en el navegador.

## Blog WIP (v1.2)

Blog del portfolio en `/blog/` (listado) y `/blog/<slug>/` (cada artículo). Una página «Work in progress» con amarillo `#F7BD03` como relleno y tinta negra.
**No está enlazado desde el menú**: la navegación nueva saldrá junto con el blog.

### Dónde está cada cosa

- `content/articulos/AAAA-MM-DD-slug.md`: los artículos. El nombre del archivo debe coincidir con `date` y `slug` del frontmatter (si no, la construcción falla con un aviso).
- `content/imagenes/`: imágenes de los artículos. En el Markdown, `<!-- IMAGEN n: archivo.webp — pie: «…» — alt: «…» -->` se convierte en `<figure>` (la imagen con «portada» en el nombre, o si no la primera, es la portada y la miniatura).
- `src/content.config.ts`: validación del frontmatter. `src/data/blog.js`: lee los artículos y decide cuáles están publicados.
- `src/pages/blog/[...slug].astro`: listado y artículos. `rss.xml.js` y `src/pages/sitemap-blog.xml.js`: feed y sitemap.
- `src/components/blog/`, `src/scripts/blog-listado.js` (filtros, orden, paginador), `src/scripts/blog-lectura.js` (barra de progreso), `src/styles/wip.css` (capa amarilla y componentes `bl-*`).
- `lib/blog/`: la lógica (fechas, filtros, orden, paginado, «Sigue leyendo», imágenes) con pruebas en `tests/blog*.test.js`. Los límites están en `lib/blog/config.js`: `POR_PAGINA` (6), `UMBRAL_CONTROLES` (6) y `MINIMO_SIGUE_LEYENDO` (3).

### Publicación programada

- Un artículo se publica a las 00:00 (Europe/Madrid) del día de su `date`. Mientras no llegue, no se genera su página, ni sale en el listado, el sitemap ni el RSS. Si no hay ningún artículo publicado, `/blog/` no existe.
- Como la web es estática, hay que reconstruirla ese día: `.github/workflows/publicar-articulos.yml` lo hace a las 00:05 de Madrid llamando a un *deploy hook* de Cloudflare Pages, solo si hay un artículo con la fecha de hoy. Instrucciones de configuración en la cabecera de ese archivo (un hook en Cloudflare y un secreto `CLOUDFLARE_DEPLOY_HOOK` en GitHub).
- Para adelantar un artículo, cambia `date` y el nombre del archivo.

### Verlo antes de tiempo (solo desarrollo y vistas previas)

| Comando | Qué ves |
|---|---|
| `npm run dev:blog` | Los 3 artículos reales, como si ya estuvieran publicados |
| `npm run dev:blog-1` | Solo el del 24 nov (blog con 1 artículo) |
| `npm run dev:blog-pruebas` | Los 3 reales + 7 de prueba (`content-dev/`): filtros, orden y paginador |
| `npm run build:blog` | Construcción con todo publicado, para `npm run preview` y `npm test` |

Con las variables `WIP_HOY=AAAA-MM-DD` (ver el blog como si hoy fuera ese día) y `WIP_PRUEBAS=1` (añade `content-dev/`). Para ver los artículos programados en las vistas previas de Cloudflare, define `WIP_HOY` en Settings → Variables de entorno → **solo Preview**. **No** la definas en Production ni uses `WIP_PRUEBAS` allí: los artículos de prueba nunca deben publicarse.

### Listado y artículo

- Sin JavaScript el listado se ve completo, ordenado por fecha. Los filtros, el orden y el paginador solo se activan desde 6 artículos publicados; su estado vive en la URL (`?tema=ia,accesibilidad&orden=antiguos&pagina=2`).
- Palabras clave que filtran y se muestran: `sporttech`, `healthtech`, `ia` («IA y diseño») y `accesibilidad`. `ux`, `ui` y `producto` quedan en el contenido pero no filtran ni se ven.

## Barra de navegación

- Marcado: `src/components/Header.astro`. Comportamiento: `src/scripts/navegacion.js`. Estilos: bloque «Navegación» de `src/styles/components.css`. Diseño y estados: `diseno/propuestas/navegacion/`.
- Escritorio (≥ 1024 px): nombre, Trabajo, Sobre mí y Blog a la izquierda; Lab. e idioma a la derecha. En móvil y tableta, botón de menú que abre una hoja desde abajo (`<dialog>`, `.ds-navsheet`).
- **Lab y el selector de idioma están ocultos.** En `Header.astro`, `MOSTRAR_LAB` y `MOSTRAR_IDIOMA` están en `false`; al ponerlos en `true` aparecen en escritorio y en la hoja móvil. Las rutas `/lab/`, `/ca/` y `/en/` son provisionales y aún no existen.
- El enlace «Blog» apunta a `/blog/` y **solo aparece si hay al menos un artículo publicado** (lo decide `Header.astro` con `src/data/blog.js`). Antes del primer artículo la barra no lo muestra y no hay enlaces rotos.
- Sin JavaScript, en móvil los enlaces se muestran en línea (`<noscript>` en `Base.astro`).
- Tokens de color de las marcas (Lab, Frame, Iridescent): final de `src/styles/tokens.css`.

## Modal de contacto (v1.1)

- Marcado: `src/components/Contacto.astro` (se incluye en `Base.astro`). Comportamiento: `src/scripts/contacto.js`. Estilos: final de `src/styles/components.css`; tokens nuevos al final de `src/styles/tokens.css`.
- Cualquier enlace con `data-contacto` abre el panel (sin JavaScript sigue siendo un `mailto:`). También se abre con la URL `#contacto`.
- La red está aislada en `enviarContacto(datos)` (`POST /api/contact`). El backend se explica en la sección siguiente.
- Simulador (solo fuera de arnaularripa.com, es decir, en localhost y vistas previas): añade `?simular=exito`, `error`, `lento` o `validacion` a la URL, por ejemplo `/?simular=error`. No llama al servidor.

## Backend del formulario de contacto

El resto de la web sigue siendo estática. Solo `/api/contact` es una **función de Cloudflare Pages**:
un trozo de código que Cloudflare ejecuta cuando llega un mensaje. No hay base de datos y los mensajes no se guardan:
se reenvían por correo a hola@arnaularripa.com con [Resend](https://resend.com).

### Dónde está

- `functions/api/contact.js`: la entrada. Cloudflare la publica sola en `/api/contact` (por estar en `functions/`).
- `lib/contacto/`: la lógica, en piezas pequeñas:
  - `manejador.js`: el orden de comprobaciones (abajo).
  - `origen.js`: desde qué webs se acepta el formulario.
  - `validar.js`: textos de error y límites de longitud.
  - `limite.js`: límite de envíos.
  - `turnstile.js`: comprobación antispam con Cloudflare.
  - `correo.js`: remitente, destino, asunto y cuerpo del correo.
- `tests/contacto.test.js`: pruebas automáticas.
- Cliente: `src/scripts/contacto.js` (objeto `turnstile`) y el contenedor `#contacto-turnstile` en `Contacto.astro`.

### Qué pasa con cada mensaje, en orden

| Paso | Si falla |
|---|---|
| 1. El origen es arnaularripa.com, www.arnaularripa.com o una vista previa `*.arnaularripa.pages.dev` | 403 → «No se ha podido enviar» |
| 2. Es JSON y ocupa como máximo 16 KB | 400/413/415 → «No se ha podido enviar» |
| 3. Trampas: el campo oculto `website` llega vacío y han pasado al menos 3 s desde que se abrió el panel | **200 falso**: el robot cree que ha funcionado, pero no se envía nada |
| 4. Validación (nombre ≤ 100, email ≤ 254, mensaje ≤ 5.000 caracteres) | 400 con el error de cada campo |
| 5. Límite: 5 intentos por hora desde la misma IP | 429 → «No se ha podido enviar» |
| 6. Turnstile confirma que es una persona y que viene de este dominio | 403 → «No se ha podido enviar» |
| 7. Resend acepta el correo | 502 → «No se ha podido enviar» |

Detalles:

- `startedAt` lo pone el reloj del ordenador de quien escribe. Si ese reloj va desfasado y el dato queda en el futuro, el mensaje no se descarta y decide Turnstile.
- El correo va **solo en texto plano**, así que no hay HTML que inyectar. El nombre pierde los saltos de línea antes de ir al asunto. `Reply-To` es el email de quien escribe: al pulsar «Responder» le contestas directamente.
- **Logs:** solo se registra el tipo de fallo (por ejemplo, `contacto: resend respondió 401`). Nunca el nombre, el email ni el mensaje.
- **Límite de envíos:** en Cloudflare KV se guarda una huella cifrada de la IP (nunca la IP en claro) con un contador que se borra solo. Si falta KV, el límite se desactiva y queda registrado en los logs.
- **Turnstile:** modo gestionado con `interaction-only`. Normalmente no se ve nada. Si Cloudflare tiene dudas, aparece una casilla encima del botón. El script de Cloudflare se carga solo al abrir el panel por primera vez.

### Variables de entorno (Cloudflare → Workers & Pages → arnaularripa → Settings)

Hay que crearlas **en Production y en Preview**.

| Nombre | Tipo | Para qué |
|---|---|---|
| `RESEND_API_KEY` | Secreto | Clave de Resend con permiso de envío solo para arnaularripa.com |
| `TURNSTILE_SECRET_KEY` | Secreto | Clave secreta del widget de Turnstile |
| `PUBLIC_TURNSTILE_SITE_KEY` | Texto (no secreto) | Clave de sitio de Turnstile. Se usa al **construir** la web, así que tras crearla o cambiarla hay que volver a desplegar |
| `RATE_LIMIT` | Binding de KV (en Bindings) | Almacén del límite de envíos |

Sin `RESEND_API_KEY` o `TURNSTILE_SECRET_KEY`, la función responde 500 y el formulario muestra el error. El email directo sigue en la modal.

Al cambiar variables o el binding de KV hay que **volver a desplegar** (Deployments → Retry deployment): solo se aplican a los despliegues nuevos.

### Turnstile: dominios del widget

En Cloudflare → Turnstile → tu widget → Hostname Management deben estar `arnaularripa.com`, `www.arnaularripa.com` y `arnaularripa.pages.dev`. Si falta alguno, el widget da el error **110200** («dominio no permitido») y el formulario muestra «No se ha podido enviar». Si una vista previa concreta diera ese error, añade su dirección completa (por ejemplo `feature-backend-contacto.arnaularripa.pages.dev`).

### Qué se ha comprobado en la vista previa

Envío real de punta a punta (formulario → Turnstile → función → Resend → Email Routing → bandeja), `Reply-To` correcto, sin cookies de Turnstile en el navegador, y «No se ha podido enviar» sin conexión conservando los datos. El primer correo desde un dominio nuevo puede tardar más de lo normal en llegar.

### Probarlo en tu ordenador

1. `npm install` (una vez).
2. `npm test`: pruebas automáticas de todos los casos (éxito, validación, trampas, Turnstile, origen, límite, fallo de Resend, logs). No envía correos.
3. Para probar con el servidor de verdad (Wrangler), copia `.dev.vars.ejemplo` como `.dev.vars`. Ese archivo no se sube a GitHub y usa las claves de prueba oficiales de Turnstile.
4. `npm run dev:funciones` y abre http://localhost:8788. Ojo: `npm run dev` (puerto 4321) **no** ejecuta la función.
   - En localhost el widget usa claves de prueba. Añade `?turnstile=falla` o `?turnstile=interactivo` a la URL para ver el rechazo o la casilla visible.
   - Con la clave de Resend falsa del ejemplo, el envío acaba en «No se ha podido enviar». Para probar el éxito sin mandar correos, activa `RESEND_API_URL` en `.dev.vars` y apúntala a un servidor que responda 200. `RESEND_API_URL` y `TURNSTILE_VERIFY_URL` solo funcionan con `ENTORNO=local`.
5. Vista previa: cada rama subida a GitHub se publica en `https://<rama>.arnaularripa.pages.dev`. El formulario funciona ahí si las variables de Preview están creadas.

