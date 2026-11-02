// Los tres proyectos que aparecen en la Home y en «Trabajo seleccionado».
// Ancho y alto de cada imagen vienen del propio archivo y reservan el hueco para evitar saltos de maquetación.
import esbard from '../assets/proyectos/esbard-edu.webp';
import buscador from '../assets/proyectos/buscador-app-sanitaria.webp';
import planificador from '../assets/proyectos/planificador-medicacion.webp';

export const proyectos = [
  { num: '01', href: '/trabajo/esbard-edu/', titulo: 'eSBARD Edu', desc: 'De los wireframes de un experto a una plataforma que se entiende.', etiquetas: ['Ciberseguridad', 'Educación', 'Lanzado'], img: esbard },
  { num: '02', href: '/trabajo/buscador-app-sanitaria/', titulo: 'Buscador para una app sanitaria', desc: 'Encontrar tu información de salud sin perderte.', etiquetas: ['Salud pública', 'Propuesta · No implementada'], img: buscador },
  // La descripción se escribe distinta en el diseño de la Home (con comillas) y en el de Trabajo (sin ellas). Se respeta cada una.
  { num: '03', href: '/trabajo/planificador-medicacion/', titulo: 'Planificador de medicación imprimible', desc: 'Del "papelito" de la nevera a un plan claro para cada día.', descTrabajo: 'Del papelito de la nevera a un plan claro para cada día.', etiquetas: ['Salud pública', 'Propuesta · No implementada'], img: planificador },
];
