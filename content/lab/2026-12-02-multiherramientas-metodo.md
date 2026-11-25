---
title: "Método: medir una calculadora variable a variable"
slug: multiherramientas-metodo
date: 2026-12-02
project: bike-tool
projectLabel: "Bike tool"
type: Método
resumen: "Cambiar una sola cosa cada vez y apuntar qué ocurre. Cómo diseñé una hoja de 46 pruebas para Gravel y qué tropiezos tuve."
draft: true
---

Para entender cómo decide una calculadora de presión hay una forma sencilla: cambiar una sola cosa cada vez y apuntar qué ocurre. Es el mismo principio con el que se aprende la exposición en fotografía: si quieres saber qué hace el diafragma, no mueves a la vez la velocidad y el ISO.

Primero capturé el flujo completo de las cinco disciplinas que me interesan. Eso me dio el mapa de variables: qué pregunta cada una y con qué opciones. MTB tiene 11 pasos, carretera y gravel 10, utility 9 y ciclocross 7.

Después diseñé una hoja de 46 pruebas para Gravel:

- Una configuración base.
- 33 pruebas de una sola variable.
- 12 pruebas de interacción.

La base es una bici de resistencia gravel no eléctrica, con rueda 700c de 45 mm, con cámara, estilo de conducción experto, 77 kg de peso total, terreno compacto, suelo seco y sin diferencia de temperatura. Cada fila marca en amarillo el único parámetro que cambia, y las columnas de ratio y de diferencia respecto a la base se calculan solas. Las pruebas de interacción responden a otra pregunta: si los efectos de dos variables se suman o se multiplican.

Hubo un tropiezo práctico. En un Excel en español, un resultado escrito como 2.07 se convierte en fecha. Hay que escribir los decimales con coma y dar formato numérico a las celdas antes de rellenar, o dejar que un script escriba los números directamente.

También descarté una segunda hoja de refinado, con más pruebas de ancho, de peso y de techos de presión. Tendría sentido si quisiera copiar el comportamiento de la calculadora, incluida la saturación del peso que no quiero reproducir. Con la primera hoja tenía suficiente para fijar la estructura.

En la siguiente entrada, qué salió de esas 46 pruebas.
