// Marcadores de imagen de los Markdown:
//   <!-- IMAGEN n: archivo.webp — pie: «…» — alt: «…» -->      (el pie es opcional)
// Se convierten en <figure> con su alt y su pie. Los comentarios no llegan al HTML público.

const MARCADOR = /<!--\s*IMAGEN\s+(\d+)\s*:\s*(\S+?)\s*(?:—\s*pie:\s*«([\s\S]*?)»\s*)?—\s*alt:\s*«([\s\S]*?)»\s*-->/g;
const CUALQUIER_COMENTARIO = /<!--[\s\S]*?-->/g;

export function escapar(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function leerMarcadores(html) {
  return [...html.matchAll(MARCADOR)].map((m) => ({ n: Number(m[1]), archivo: m[2], pie: m[3]?.trim() || '', alt: m[4].trim(), texto: m[0] }));
}

// Portada: la imagen cuyo nombre contiene «portada»; si no hay, la primera del cuerpo.
export function elegirPortada(marcadores) {
  return marcadores.find((m) => m.archivo.includes('portada')) ?? marcadores[0] ?? null;
}

// Devuelve { html, portada, imagenes }.
//  - La portada se quita del cuerpo (se pinta aparte, una sola vez).
//  - El resto se convierte en <figure>. `pintar({archivo, alt})` devuelve el <img …> con su srcset.
//  - Cualquier otro comentario HTML se elimina.
export function procesarCuerpo(html, pintar) {
  const marcadores = leerMarcadores(html);
  const portada = elegirPortada(marcadores);
  let salida = html;
  for (const m of marcadores) {
    let reemplazo = '';
    if (m !== portada) {
      const pie = m.pie ? `<figcaption class="t-meta">${escapar(m.pie)}</figcaption>` : '';
      reemplazo = `<figure class="ds-figure bl-figura">${pintar(m)}${pie}</figure>`;
    }
    salida = salida.replace(m.texto, () => reemplazo);
  }
  salida = salida.replace(CUALQUIER_COMENTARIO, '');
  return { html: salida, portada, imagenes: marcadores };
}
