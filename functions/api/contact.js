// Función de Cloudflare Pages: responde en /api/contact.
// La lógica está en lib/contacto/manejador.js (explicada en LEEME.md).
import { manejar } from '../../lib/contacto/manejador.js';

export const onRequest = ({ request, env }) => manejar(request, env);
