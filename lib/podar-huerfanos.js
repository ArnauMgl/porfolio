// Integración de Astro: al terminar la construcción borra de dist/ las imágenes que ninguna página usa.
//
// Para qué: Astro publica TODAS las imágenes de content/imagenes/ y todo public/og/, aunque el artículo al que
// pertenecen aún no esté publicado (fecha futura u oculto). Esas imágenes llevan el titular dentro y revelarían el
// artículo antes de tiempo. Aquí se conserva solo lo que alguna página, hoja de estilos o script nombra.
// Solo toca dist/_astro/ y dist/og/; el resto (favicon, PDF, fuentes…) no se mira.
import { readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEXTO = new Set(['.html', '.css', '.js', '.mjs', '.xml', '.json', '.webmanifest', '.txt']);

function archivos(carpeta) {
  const salida = [];
  for (const nombre of readdirSync(carpeta)) {
    const ruta = join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) salida.push(...archivos(ruta));
    else salida.push(ruta);
  }
  return salida;
}

export function podarHuerfanos(dist) {
  const todos = archivos(dist);
  const corpus = todos.filter((f) => TEXTO.has(extname(f))).map((f) => readFileSync(f, 'utf8')).join('\n');
  const borrados = [];
  for (const f of todos) {
    const relativa = f.slice(dist.length).replace(/\\/g, '/').replace(/^\//, '');
    if (!(relativa.startsWith('_astro/') || relativa.startsWith('og/'))) continue;
    if (TEXTO.has(extname(f))) continue;
    if (!corpus.includes(basename(f))) {
      rmSync(f);
      borrados.push(relativa);
    }
  }
  return borrados;
}

export default function podarImagenesHuerfanas() {
  return {
    name: 'podar-imagenes-huerfanas',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const borrados = podarHuerfanos(fileURLToPath(dir));
        logger.info(`${borrados.length} imágenes sin usar quitadas de dist/ (artículos aún no publicados, tamaños sobrantes…)`);
      },
    },
  };
}
