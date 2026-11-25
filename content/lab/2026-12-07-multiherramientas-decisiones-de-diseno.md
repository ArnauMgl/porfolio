---
title: "Decisiones de diseño: modo básico y modo experto"
slug: multiherramientas-decisiones-de-diseno
date: 2026-12-07
project: bike-tool
projectLabel: "Bike tool"
type: Decisión
resumen: "Preguntar solo lo que cambia el resultado de forma notable y lo que el usuario sabe contestar: seis pantallas en modo básico y los ajustes finos en experto."
---

La regla que he fijado es preguntar solo lo que cambia el resultado de forma notable y lo que el usuario sabe contestar. Cada pregunta lleva una opción «No lo sé» con un valor por defecto razonable, para que nadie se quede bloqueado. Entrenando a categorías base aprendes pronto que se da una indicación cada vez: aquí pasa lo mismo con las preguntas.

Respecto a lo que planteé el 13 de noviembre, cambian dos cosas: el peso ya no es un solo dato, sino dos (el del ciclista y el de la bici con el equipo), y el montaje y las condiciones del suelo pasan del modo experto al básico.

**Modo básico: seis pantallas**

1. Disciplina y, en la misma pantalla, si la bici es eléctrica.
2. Ancho del neumático, con una ayuda para leerlo en el lateral.
3. Montaje: con cámara, tubeless o tubeless con inserto.
4. Peso del ciclista.
5. Peso de bici y equipo, con la casilla «No lo sé». Si la marcas, se estiman 10 kg en una bici normal, 14 kg en una eléctrica ligera y 20 kg en una de potencia total. Son estimaciones provisionales.
6. Superficie y condiciones del suelo.

**Modo experto**

- Tipo de bici (carrera, resistencia o bikepacking), con resistencia por defecto.
- Estilo de conducción, con entusiasta por defecto.
- Temperatura de inflado y temperatura exterior.
- Presión máxima y mínima impresas en el neumático.
- Si la llanta es hookless.

**Por qué cada decisión**

- **El peso de la bici no necesita precisión.** Un error de 5 kg mueve el resultado entre 0,05 y 0,07 bar, menos que el error de un manómetro de bomba, que ronda el ±5 %.
- **El tipo de bici va en experto.** Su efecto es de ±5 %, dentro de ese mismo margen de error.
- **El estilo de conducción queda en experto, pero cuenta.** Lo medí en dos configuraciones y entre un ciclista principiante y uno de nivel pro hay una diferencia de un 17 %, bastante más que el ruido de la medición. La proporción se mantiene igual en las dos, así que es un factor más de la cadena. En básico asumo entusiasta, que es el punto medio.
- **El hookless no se pregunta.** El resultado nunca supera la presión máxima del neumático y, si pasa del límite hookless para ese ancho, aparece un aviso. La mayoría de ciclistas no sabe qué llanta tiene, así que la pregunta solo llega a quien la necesita.
- **La temperatura se pregunta de otra forma.** En lugar de pedir dos temperaturas, la app pregunta solo la de fuera, supone un inflado a unos 20 °C y en experto permite cambiarlo. El resultado dice a qué presión inflar y cuál se tendrá ya rodando.
- **El ancho interior de la llanta queda fuera.** No tengo datos para meterlo en el cálculo y no quiero aparentar una precisión que no existe.

El resultado se muestra redondeado a 0,1 bar y con un rango, como «2,1 bar (2,0–2,2)», y en PSI sin decimales. Una aguja de bomba no distingue 2,05 de 2,10. Con 10 °C de diferencia el cambio a 2 bar es de unos 0,1 bar, así que la corrección por temperatura solo importa cuando la diferencia es grande. El consejo en pantalla es empezar por el valor y ajustar de 0,1 en 0,1 bar según la sensación.

Con estas decisiones el motor de Gravel está ya en su versión 1. Sus resultados quedan dentro de ±0,2 bar en los cuatro puntos publicados que puedo comparar y en las seis medidas de estilo, con una diferencia máxima de 0,11 bar. Falta la prueba de campo para ajustar el exponente de peso, y ampliar el motor a las otras cuatro disciplinas.
