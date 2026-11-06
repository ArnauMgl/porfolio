// Los cuatro proyectos que aparecen en la Home y en «Trabajo seleccionado».
// Ancho y alto de cada imagen vienen del propio archivo y reservan el hueco para evitar saltos de maquetación.
import esbard from '../assets/proyectos/esbard-edu.webp';
import buscador from '../assets/proyectos/buscador-app-sanitaria.webp';
import planificador from '../assets/proyectos/planificador-medicacion.webp';
import portfolio from '../assets/proyectos/portfolio-arnau-larripa.webp';

export const proyectos = [
  { href: '/trabajo/esbard-edu/', titulo: 'eSBARD Edu', desc: 'De los wireframes de un experto a una plataforma que se entiende.', etiquetas: ['Ciberseguridad', 'Educación', 'Lanzado'], img: esbard },
  { href: '/trabajo/buscador-app-sanitaria/', titulo: 'Buscador para una app sanitaria', desc: 'Encontrar tu información de salud sin perderte.', etiquetas: ['Salud pública', 'Propuesta de diseño'], img: buscador },
  { href: '/trabajo/planificador-medicacion/', titulo: 'Planificador de medicación imprimible', desc: 'Del "papelito" de la nevera a un plan claro para cada día.', etiquetas: ['Salud pública', 'Proyecto de exploración'], img: planificador },
  { href: '/trabajo/portfolio-arnau-larripa/', titulo: 'Portfolio de Arnau Larripa', desc: 'De la dirección de arte al código de mi propia web.', etiquetas: ['Dirección de arte', 'Design system', 'MVP publicado'], img: portfolio, borde: true },
];
