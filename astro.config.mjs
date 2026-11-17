// Configuración de Astro. Web estática: el resultado se genera en la carpeta dist/.
import { defineConfig } from 'astro/config';
import podarImagenesHuerfanas from './lib/podar-huerfanos.js';

export default defineConfig({
  site: 'https://arnaularripa.com',
  trailingSlash: 'always',
  integrations: [podarImagenesHuerfanas()],
});
