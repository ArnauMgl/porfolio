# Propuesta de navegación (pendiente de implementar)

Maqueta de la barra de navegación para cuando llegue el blog. **No está aplicada a la web**: el componente real sigue siendo `src/components/Header.astro`. Se implementará cuando el blog esté listo.

## Cómo verla

Abre los `.html` de esta carpeta en el navegador (usan los estilos reales de `src/styles/` y la fuente de `public/fonts/`).

| Archivo | Qué es |
|---|---|
| `propuesta.html` | La barra y el bottom sheet, interactivos. Parámetros en la URL: `?lab&idioma` muestra Lab e idioma; `&lang` abre el desplegable; `&open` abre la hoja (en ancho móvil). |
| `estados.html` | Estados de interacción de todos los elementos. |
| `marcas.html` | Propuesta para el sistema de diseño: Iridescent., Lab. y Frame. |
| `nav.css` | Estilos de la barra (sustituyen al bloque «Navegación» de `components.css`). |
| `marcas.css` | Tokens y componente de las marcas. |
| `capturas/` | Imágenes de referencia. |

## Decisiones tomadas

**Escritorio (desde 1024 px)**
- Izquierda: **Arnau Larripa** (enlace a la home) · Trabajo · Sobre mí · Blog.
- Derecha: **Lab.** · separador fino · selector de idioma.
- Idioma: botón `ES ⌄` con desplegable de siglas (ES · CA · EN), recuadro centrado bajo el botón. La opción activa lleva subrayado terracota (sin punto). Se cierra con Escape y al hacer clic fuera.

**Móvil y tableta (menos de 1024 px): bottom sheet**
- Nombre a la izquierda y botón de hamburguesa **solo con icono** (48 × 48 px) a la derecha. El icono no cambia al abrirse: la hoja se cierra con su propia X.
- Al pulsarlo se abre una **hoja desde abajo** con velo oscuro, que ocupa solo la altura de su contenido. Se construye como el panel de contacto: un `<dialog>` con `showModal()` (foco atrapado, Escape y fondo inerte de forma nativa), borde superior de 2 px y esquinas superiores de 4 px.
- Dentro: etiqueta «Menú» y botón X de cierre (`.ds-close`, alineado donde estaba el icono de hamburguesa), enlaces a 24 px separados por líneas (punto terracota en la página actual), Lab. al final y, bajo una línea gruesa, el idioma en tres celdas iguales con siglas (ES · CA · EN, mínimo 56 px de alto).
- Se cierra con la X, tocando el velo o con Escape. Sin gesto de arrastrar (queda fuera de la primera versión).
- A 640–1023 px la hoja ocupa todo el ancho con márgenes de 48 px.

**Lab.** · separador fino · selector de idioma.
- Idioma: botón `ES ⌄` con desplegable de siglas (ES · CA · EN), recuadro centrado bajo el botón. La opción activa lleva subrayado terracota (sin punto). Se cierra con Escape y al hacer clic fuera.

**Móvil y tableta (menos de 1024 px)**
- Nombre a la izquierda y botón de hamburguesa **solo con icono** (48 × 48 px) a la derecha. Se convierte en X al abrirse.
- Menú desplegable: enlaces a 24 px separados por líneas; la página actual lleva punto terracota.
- Lab al final de la lista. Idioma en tres celdas iguales con siglas (ES · CA · EN), mínimo 56 px de alto.

**Lab.**
- Negrita (700) y en negro también en reposo. Punto verde (`--brand-lab`, `#52b558`) de 0,4 em en la barra, decorativo (`aria-hidden`).
- Hover: subrayado verde. Pulsado: terracota oscuro. Foco: amarillo del sistema.
- **Sin estado «actual» por ahora**: se decidirá cuando se plantee la página del Lab.

**Ocultos hasta el lanzamiento de cada uno**
- Lab y el selector de idioma van **ocultos del todo** (atributo `hidden`), sin «próximamente». Para activarlos basta con quitar el atributo.

## Pendiente

- Implementar en `Header.astro` y `components.css` cuando el blog esté listo (necesita la ruta `/blog/`).
- Añadir al sistema de diseño los tokens de marca (`--brand-lab`, `--brand-frame`, `--brand-iridescent`) y el componente de wordmark (`marcas.css`).
- Valores exactos del degradado de Iridescent (aquí aproximado desde una captura).
- Decidir si Lab tiene estado «actual».
- Accesibilidad: comprobar con lector de pantalla el desplegable de idioma (botón con `aria-expanded`, nombres completos en `aria-label`).
