# Actualización del diseño (v1.1): lo que cambió en la web real

Esta carpeta lleva a Claude Design los cambios que se hicieron al construir la web. Contiene **solo los archivos que cambian**, con las mismas rutas que `diseno/`. No incluye `assets/` (las imágenes no han cambiado).

## Cómo importarlo en Claude Design

1. Abre tu proyecto de Claude Design.
2. Sube el contenido de esta carpeta **encima** del proyecto, respetando las rutas (`ds/arnau-portfolio/...` y los `.dc.html` en la raíz). Los archivos con el mismo nombre se reemplazan.
3. Revisa los artboards nuevos y los actualizados (lista abajo). Si quieres que aparezcan en el lienzo, colócalos a mano.

## Qué cambia

| Archivo | Cambio |
|---|---|
| `ds/arnau-portfolio/tokens.css` y `tokens.json` | Tokens nuevos de la modal: `--panel-w`, `--border-field`, `--border-thick`, `--icon-sm`, `--icon-lg`, `--textarea-min`, `--duration-panel`, `--scrim`. |
| `ds/arnau-portfolio/components/bundle.css` | Componentes nuevos: `ds-btn--sm`, `ds-work--index`, `ds-close`, `ds-btn-secondary`, `ds-field`, `ds-error`, `ds-alert`, `ds-contact` (panel), visor de imagen ampliada (`ds-zoom`, `ds-lightbox`) y estados forzados (`is-hover`, `is-focus`, `is-pressed`, `is-mouse`). Las reglas responsive siguen siendo de contenedor, como en el original. |
| `ContactoModal.dc.html`, `ContactoModalMobile.dc.html` | **Nuevos.** Cuatro vistas de la modal: formulario vacío, errores de validación, error de envío y mensaje enviado. Escritorio (panel lateral de 520 px) y móvil (hoja inferior). |
| `Estados.dc.html` | Secciones nuevas: campo de formulario, botón secundario y cierre del panel. |
| Todas las páginas (`Main`, `Mobile`, `HomeTablet`, `Home1024`, `Trabajo*`, `SobreMi*`, `Case*`) | Footer: botón «Contacto» compacto, LinkedIn `arnaularripa`, CV como descarga del PDF. «Product Designer» con D mayúscula. |
| `Main`, `Mobile`, `HomeTablet`, `Home1024` | La lista de proyectos usa el formato índice (`ds-work--index`): miniatura al lado del texto desde 1024 px. |

## Cosas que no están en el diseño (viven solo en la web)

- El comportamiento de la modal (abrir, validar, enviar, copiar email): `src/scripts/contacto.js`.
- El visor de imagen ampliada de los casos: se incluye su CSS, pero no tiene artboard.
- El backend del formulario (Cloudflare + Resend).

## Pendiente de revisar a mano

Estos archivos no se han podido abrir en el lienzo de Claude Design desde Claude Code. Se han revisado renderizándolos en un navegador, pero conviene echarles un vistazo al importarlos.
