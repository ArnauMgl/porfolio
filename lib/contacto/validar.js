// Validación del formulario de contacto en el servidor. Nunca nos fiamos de lo que valida el navegador.
// Los cuatro primeros mensajes son los mismos que muestra el cliente (src/scripts/contacto.js).

export const MENSAJES = {
  nombreVacio: 'Dime cómo te llamas para saber a quién responder.',
  emailVacio: 'Necesito tu email para poder responderte.',
  emailInvalido: 'Parece que falta algo en el email. Prueba con un formato como nombre@dominio.com.',
  mensajeVacio: 'Escribe unas líneas sobre lo que tienes en mente.',
  nombreLargo: 'Tu nombre es demasiado largo. Usa como máximo 100 caracteres.',
  emailLargo: 'Este email es demasiado largo. Revisa que esté bien escrito.',
  mensajeLargo: 'Tu mensaje es demasiado largo. Resúmelo en 5.000 caracteres como máximo o escríbeme a hola@arnaularripa.com.',
};

export const LIMITES = { name: 100, email: 254, message: 5000 };

// Mismo patrón que el cliente, más una lista de caracteres que no aceptamos en un email
// (sirven para colar varias direcciones o cabeceras en el Reply-To).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_PROHIBIDOS = /[<>()[\]\\,;:"`]/;
// Caracteres de control (salvo salto de línea y tabulador, que se permiten en el mensaje).
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const texto = (v) => (typeof v === 'string' ? v : '');
const largo = (s) => [...s].length; // cuenta caracteres reales (emojis = 1)

/**
 * Devuelve { valores, errores }. «errores» está vacío si todo es correcto.
 * «valores» ya viene limpio (sin espacios sobrantes ni caracteres de control).
 */
export function validar(datos) {
  const name = texto(datos.name).replace(CONTROL, '').replace(/[\r\n\t]+/g, ' ').trim();
  const email = texto(datos.email).replace(CONTROL, '').trim();
  const message = texto(datos.message).replace(CONTROL, '').replace(/\r\n?/g, '\n').trim();

  const errores = {};
  if (!name) errores.name = MENSAJES.nombreVacio;
  else if (largo(name) > LIMITES.name) errores.name = MENSAJES.nombreLargo;

  if (!email) errores.email = MENSAJES.emailVacio;
  else if (email.length > LIMITES.email) errores.email = MENSAJES.emailLargo;
  else if (!EMAIL_RE.test(email) || EMAIL_PROHIBIDOS.test(email)) errores.email = MENSAJES.emailInvalido;

  if (!message) errores.message = MENSAJES.mensajeVacio;
  else if (largo(message) > LIMITES.message) errores.message = MENSAJES.mensajeLargo;

  return { valores: { name, email, message }, errores };
}
