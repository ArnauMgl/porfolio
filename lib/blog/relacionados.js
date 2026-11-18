// «Sigue leyendo»: los dos artículos más recientes distintos del actual, priorizando los que comparten palabra clave.
import { IDS_FILTRO } from './etiquetas.js';
import { MINIMO_SIGUE_LEYENDO } from './config.js';

export function seguirLeyendo(actual, publicados, cuantos = 2) {
  if (publicados.length < MINIMO_SIGUE_LEYENDO) return [];
  const clave = (a) => a.tags.filter((t) => IDS_FILTRO.includes(t));
  const comunes = (a) => clave(a).filter((t) => clave(actual).includes(t)).length > 0 ? 1 : 0;
  return publicados
    .filter((a) => a.slug !== actual.slug)
    .sort((a, b) => comunes(b) - comunes(a) || b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug))
    .slice(0, cuantos);
}
