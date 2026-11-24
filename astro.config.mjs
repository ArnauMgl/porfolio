// Configuración de Astro. Web estática: el resultado se genera en la carpeta dist/.
import { defineConfig } from 'astro/config';
import { appendFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { labPublico } from './lib/lab/flag.js';

// Lab oculto (LAB_PUBLIC=false): Cloudflare Pages añade X-Robots-Tag: noindex a /lab*.
// Se escribe en dist/_headers al terminar la construcción (public/_headers es fijo y no puede depender del interruptor).
const labOculto = {
  name: 'lab-noindex',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (labPublico()) return;
      const archivo = fileURLToPath(new URL('_headers', dir));
      const previo = existsSync(archivo) ? '\n' : '';
      appendFileSync(archivo, `${previo}# Lab oculto (LAB_PUBLIC=false)\n/lab\n  X-Robots-Tag: noindex, nofollow\n/lab/*\n  X-Robots-Tag: noindex, nofollow\n`);
    },
  },
};

export default defineConfig({
  site: 'https://arnaularripa.com',
  trailingSlash: 'always',
  integrations: [labOculto],
});
