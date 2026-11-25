---
title: "Benchmark: qué preguntan y qué explican las marcas"
slug: multiherramientas-benchmark
date: 2026-11-27
project: bike-tool
projectLabel: "Bike tool"
type: Investigación
resumen: "Ninguna gran marca publica su fórmula completa. Repaso de lo que ofrece cada calculadora y qué aprovecho del flujo de Vittoria como referencia de diseño."
---

Antes de diseñar nada he mirado qué hacen los demás, y hay una conclusión que condiciona el resto del proyecto: ninguna gran marca publica su fórmula completa. La única relación abierta y reproducible que he encontrado es la carta de caída del neumático al 15 % de Frank Berto, difundida por Bicycle Quarterly. Solo Wolf Tooth publica una corrección por temperatura. Cada calculadora es, por tanto, una caja negra que solo se puede estudiar desde fuera.

| Herramienta | Qué ofrece | Metodología |
| --- | --- | --- |
| [Vittoria](https://int.vittoria.com/pages/tire-pressure) | Calculador por disciplina, flujo de 7 a 11 pasos, resultado delantero y trasero | Propietaria, sin publicar |
| [Silca](https://silca.cc/pages/pro-tire-pressure-calculator) | Peso total de 34 a 205 kg, 10 superficies y cuatro repartos de peso | Propietaria; concepto publicado en un [artículo técnico](https://silca.cc/blogs/silca/tire-pressure-calculator-explained) |
| [SRAM/Zipp](https://axs.sram.com/guides/tire/pressure) | Peso, ancho, ancho interior de llanta, tipo de llanta, carcasa y superficie | Propietaria |
| [Schwalbe](https://www.schwalbe.com/en/special-pages/road-bike-technology/) | Tablas por ancho y peso del ciclista, y [límites para llantas hookless](https://www.schwalbetires.com/technology-faq/hookless-rims/) | Tablas publicadas |
| [Rene Herse](https://www.renehersecycles.com/rh-x-cal-poly-pomona-tire-pressure-calculator-3-0/) | Calculador 3.0 con ancho, peso y terreno; modo avanzado con equipaje y postura | Propietaria, con datos declarados |
| [Wolf Tooth](https://www.wolftoothcomponents.com/pages/tire-pressure-calculator) | Corrección por temperatura de inflado y de rodaje | Propietaria; ecuación lineal según su cofundador |
| [Maxxis](https://www.maxxis.com/us/wp-content/uploads/sites/13/2023/02/2023-Bicycle-Tech.pdf) | Rangos por disciplina y ancho, sin peso | Rangos publicados |
| [Michelin](https://www.michelin.ca/en/bicycle/tips-and-advice/tips-and-advice-bicycle/pressure) | Tablas por modelo y peso | Tablas publicadas |

**El flujo de Vittoria, como referencia de diseño.** La tomo por su manera de preguntar, no por sus números. Tiene entre 7 y 11 pasos según la disciplina y siempre empieza por elegirla. Después agrupa las preguntas en bloques: bicicleta, neumático, ciclista, terreno y temperatura. Cada pantalla tiene una sola pregunta, un contador de pasos y un botón para volver. Al final hay una pantalla de revisión con cada respuesta editable y un resultado con la presión delantera y la trasera.

Lo que funciona bien: una pregunta por pantalla, controles con unidades reales (un dial para el peso y una regla para el ancho), la opción «No lo sé» en varias preguntas y la pantalla de revisión.

Lo que, en mi opinión, se puede mejorar:

- Hasta 11 pasos para algo que el usuario quiere saber en segundos.
- Textos que mezclan castellano e inglés, y un mismo concepto con dos nombres según la disciplina, «condiciones del terreno» y «condiciones de la superficie».
- Pantallas de dos columnas pensadas para escritorio más que para móvil.
- Una pregunta de temperatura que cuesta entender, que retomo en otra entrada.
- Un resultado con dos decimales, que sugiere una precisión que no existe: Silca cifra el error típico de un manómetro de bomba en ±5 %.

Me quedo con el orden de las preguntas, que me parece razonable, y con la idea de preguntar poco. En la siguiente entrada cuento qué dicen las fuentes públicas cuando se comparan con ese modelo.
