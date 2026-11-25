---
title: "Hallazgos de las pruebas en Gravel"
slug: multiherramientas-hallazgos
date: 2026-12-04
project: bike-tool
projectLabel: "Bike tool"
type: Hallazgos
resumen: "Las 46 pruebas dejaron cuatro resultados claros: los efectos se multiplican, el trasero es el delantero por 1,052, el ancho y el peso mandan, y la calculadora trabaja por escalones."
draft: true
---

Las 46 pruebas dejaron cuatro resultados claros. Los he medido solo en Gravel y en una calculadora concreta, así que son lo que dicen los datos de esta disciplina, no una regla general.

**1. Los efectos se multiplican, no se suman.** En las 12 pruebas de interacción, multiplicar el factor de cada variable acierta la presión delantera con un error máximo de 0,01 bar (media de 0,004). Sumar los efectos falla hasta 0,06 bar. Es la propiedad que permite construir el modelo como una presión base por una cadena de factores, y por eso cada variable puede tratarse por separado.

**2. El neumático trasero es el delantero por 1,052.** El cociente se mantiene en todas las configuraciones, con un rango de 1,048 a 1,057 que cabe en el redondeo a 0,01 bar. No hace falta calcular dos presiones: se calcula una y se deriva la otra.

**3. El ancho y el peso mandan; casi todo lo demás mueve poco.** El montaje, el estilo de conducción, el tipo de bici, el terreno y las condiciones cambian el resultado entre un 1 y un 9 % cada uno en las pruebas de Gravel. El ancho del neumático es lo que más pesa, y ya me lo anticipaban las fuentes públicas. De ahí sale el criterio de diseño que cuento en la entrada siguiente: preguntar por lo que mueve el resultado y dejar el resto para quien quiera afinar.

**4. La calculadora trabaja por escalones.** Dos configuraciones distintas dan exactamente el mismo par de presiones, algo que ocurre en varias parejas y entre bloques de pruebas distintos, así que no parecen erratas. Además, a partir de unos 120 kg el efecto del peso deja de crecer. No es un tope absoluto de presión, porque otras configuraciones llegan bastante más arriba: lo que se frena es el efecto del peso. Si existe un tope absoluto más alto, queda sin comprobar.

De aquí salen dos decisiones. Conservo la estructura multiplicativa y la relación entre rueda trasera y delantera. No copio la meseta del peso, porque ninguna fuente pública la respalda, y dejo el exponente de peso como un ajuste provisional que calibraré con pruebas de campo.

Queda medir las otras cuatro disciplinas, con unas 15 a 20 pruebas por disciplina y tres pesos de control para ver si el exponente de peso cambia de una a otra.
