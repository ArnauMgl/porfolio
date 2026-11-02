// Configuración de Astro. Web estática: el resultado se genera en la carpeta dist/.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://arnaularripa.com',
  trailingSlash: 'always',
});
