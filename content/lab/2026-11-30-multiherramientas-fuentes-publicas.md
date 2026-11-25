---
title: "Investigación con fuentes públicas: qué cuadra y qué no"
slug: multiherramientas-fuentes-publicas
date: 2026-11-30
project: bike-tool
projectLabel: "Bike tool"
type: Investigación
resumen: "La estructura del modelo medido se sostiene frente a las fuentes públicas, pero hay tres comportamientos que no pienso copiar: la temperatura, la saturación por peso y un efecto del peso demasiado bajo fuera del MTB."
draft: true
---

La estructura del modelo que he medido se sostiene frente a las fuentes públicas, pero hay tres comportamientos que no pienso copiar: el tratamiento de la temperatura, la saturación por peso y un efecto del peso demasiado bajo fuera del MTB.

**Lo que cuadra**

- **Los efectos se multiplican y el ancho pesa mucho.** El exponente de ancho que sale de las medidas, −0,89, cae dentro del rango que implica la tabla general de Schwalbe, de −0,83 a −1,07 (cálculo del informe).
- **El reparto delantero y trasero.** Un cociente de unos 1,05 entre la rueda trasera y la delantera es coherente con Silca, que usa repartos de 48/52 a 46,5/53,5, y con Schwalbe. No sirve para bicis de utility, cargo o touring con alforjas: Bicycle Quarterly cita repartos de hasta 35/65 en bici de ciudad.
- **Un punto de validación.** Un dato de BikeRadar para gravel de 40 mm y 85 kg coincide con la estimación del modelo con una diferencia de unos 0,04 bar (cálculo propio).

**Lo que no cuadra**

- **El peso.** El efecto que sale de las medidas es mucho menor que el que apuntan Schwalbe y la carta de Berto para carretera y gravel, que implican un exponente de 0,7 a 1,0. En MTB, las tablas de Michelin y Maxxis son tan planas como lo medido. Y la calculadora que medí parece frenar el efecto del peso a partir de cierto valor, algo que ninguna fuente que he encontrado hace.
- **La temperatura.** Si ruedas con más frío del que tenías al inflar, el aire se contrae y la presión baja, así que para rodar a la presión que quieres hay que inflar más. Con 2,05 bar manométricos y un inflado a 20 °C, la física da esto:

| Al rodar hace… | Presión al rodar sin corregir | Inflado necesario para rodar a 2,05 bar |
| --- | --- | --- |
| 10 °C más frío | 1,95 bar (−5 %) | 2,16 bar (+5 %) |
| 20 °C más frío | 1,84 bar (−10 %) | 2,27 bar (+11 %) |
| 30 °C más frío | 1,74 bar (−15 %) | 2,40 bar (+17 %) |

La calculadora que medí parece ir en sentido contrario y, además, no cambia nada si el entorno es más cálido. Vittoria no documenta cómo trata la temperatura, así que lo planteo como una duda y no como una conclusión.

**Los límites para llantas hookless.** Schwalbe publica un máximo escalonado por ancho de neumático, pero las fuentes se contradicen: Challenge Tech sostiene que las normas solo fijan 5 bar para llantas hookless, sin importar el ancho. Las normas ETRTO e ISO son de pago y no las he consultado. Mientras tanto me quedo con la tabla más conservadora.

Dos apuntes más. El efecto de tubeless frente a cámara se explica mejor por un suelo mínimo de presión con cámara que por un factor porcentual. Y un manómetro de bomba, como el de un hinchador doméstico, tiene un error típico de ±5 %, según Silca.

Con esto tengo una estructura que se sostiene y tres puntos donde no voy a copiar. Para saber cuánto pesa cada variable hacía falta medirlo, y eso es lo que cuento en la siguiente entrada.
