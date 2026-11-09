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
- Páginas que no existen: `src/pages/404.astro` genera `dist/404.html`. Con ese archivo en la raíz, Cloudflare Pages devuelve un 404 real (sin él, serviría la home con código 200). No hace falta configurar nada más. La página lleva `noindex`.

## Verlo en tu ordenador (opcional)

Requiere Node.js. En la carpeta del proyecto, ejecuta `npm install` una vez y
después `npm run dev`. Abre http://localhost:4321 en el navegador.

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

