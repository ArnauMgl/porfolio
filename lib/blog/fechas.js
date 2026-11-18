// Fechas del blog. Las fechas de los artículos son «AAAA-MM-DD» (día de publicación en Madrid).
import { ZONA_HORARIA } from './config.js';

const FORMATO_DIA = /^\d{4}-\d{2}-\d{2}$/;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function esDia(texto) {
  return typeof texto === 'string' && FORMATO_DIA.test(texto) && !Number.isNaN(Date.parse(texto));
}

// Día de hoy en Madrid, como «AAAA-MM-DD».
// «simulada» (variable WIP_HOY) permite ver el blog como si fuera otro día, solo para pruebas.
export function hoyMadrid(ahora = new Date(), simulada) {
  if (simulada) {
    if (!esDia(simulada)) throw new Error(`WIP_HOY debe tener el formato AAAA-MM-DD (recibido: «${simulada}»)`);
    return simulada;
  }
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(ahora);
}

// Un artículo se ve desde las 00:00 (Madrid) del día de su fecha.
export function estaPublicado(fecha, hoy) {
  return fecha <= hoy;
}

// «2026-11-24» → «24 nov 2026»
export function formatearFecha(dia) {
  const [a, m, d] = dia.split('-').map(Number);
  return `${d} ${MESES[m - 1]} ${a}`;
}

// «Fri, 24 Nov 2026 00:05:00 +0100» para el RSS (medianoche de Madrid como referencia, en UTC).
export function fechaRss(dia) {
  return new Date(`${dia}T00:05:00+01:00`).toUTCString();
}
