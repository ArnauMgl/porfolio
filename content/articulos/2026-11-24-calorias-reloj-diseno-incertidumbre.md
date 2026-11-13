---
title: "Las calorías de tu reloj son una estimación, y la interfaz debería decirlo"
seoTitle: "Calorías del reloj: cómo diseñar datos que son estimaciones"
description: "Los relojes deportivos miden bien el pulso, pero las calorías son una estimación. Qué significa eso para quien diseña interfaces con datos inciertos."
slug: "calorias-reloj-diseno-incertidumbre"
date: "2026-11-24"
lang: "es"
readingTime: 4
tags: ["sporttech", "diseno", "ux", "ui"]
---

Cuando salgo a correr, durante el entrenamiento miro sobre todo dos cosas: el ritmo y las pulsaciones. El ritmo, porque antes de salir ya sé qué tengo que hacer ese día; las pulsaciones, para comprobar que el esfuerzo encaja con lo previsto. Las calorías, los kilómetros y el tiempo total los miro después, ya en casa, cuando la salida ha terminado.

Hace poco me di cuenta de que trato esos números de forma muy distinta sin habérmelo planteado nunca. La pantalla del reloj, en cambio, los trata a todos igual.

<!-- IMAGEN 1: calorias-reloj-portada.webp — alt: «» -->

## No todos los datos se obtienen igual

Un reloj deportivo hace dos cosas muy diferentes que en la pantalla parecen la misma. Algunos datos los **mide**: la frecuencia cardiaca, por ejemplo, la obtiene un sensor óptico que detecta los cambios del flujo sanguíneo en la muñeca. Otros los **calcula**: las calorías no se miden en ningún sitio, sino que se estiman con un algoritmo que combina el pulso, el peso, la edad y una serie de supuestos sobre cómo funciona un cuerpo medio.

Esa diferencia tiene consecuencias. En un estudio de la Universidad de Stanford con 60 voluntarios y siete relojes de muñeca, seis de los siete midieron la frecuencia cardiaca con un error inferior al 5 % en bicicleta estática, pero ninguno estimó el gasto energético con un error por debajo del 20 %. El más preciso se desviaba de media un 27 %, y el menos preciso, un 93 %. Una revisión sistemática posterior, que analizó 158 publicaciones sobre nueve marcas, llegó a una conclusión parecida: los dispositivos son razonablemente fiables con los pasos y el pulso en condiciones de laboratorio, pero ninguna marca resultó precisa con el gasto energético.

Los modelos cambian cada año y es probable que los algoritmos actuales hayan mejorado algo. Aun así, el motivo de fondo sigue ahí: el pulso se mide directamente y las calorías se deducen, y cada persona se aleja a su manera de ese cuerpo medio.

## El problema no es el dato, sino cómo se presenta

Como diseñador, lo que me interesa no es que la estimación falle, porque calcular el gasto energético de una persona concreta es difícil. Lo que me interesa es que la interfaz no lo diga. Las calorías suelen aparecer con la misma tipografía, el mismo tamaño y la misma exactitud que la frecuencia cardiaca. «526 kcal» transmite la misma seguridad que «138 ppm», aunque una cifra sea una medición bastante fiable y la otra una aproximación que puede desviarse una cuarta parte o más.

En una interfaz, la forma también comunica. Un número exacto y sin matices le dice al usuario «esto es así», y el usuario actúa en consecuencia: decide qué comer según lo que ha «quemado», compara días entre sí o se preocupa por una diferencia de 50 calorías que queda muy por debajo del margen de error.

Con las predicciones pasa algo similar. Mi reloj me calcula un ritmo para la media maratón que me parece bastante optimista, y yo me planteo uno más prudente. No tengo nada en contra de la predicción en sí; lo que echo en falta es que se presente como lo que es: una previsión con supuestos detrás, y no como un dato.

## Lo que la fotografía ya tenía resuelto

Durante años trabajé como fotógrafo, y el exposímetro de la cámara funciona con una lógica parecida. No sabe qué estás fotografiando: asume que la escena, de media, tiene una luminosidad de gris medio y calcula la exposición a partir de ahí. Casi siempre acierta. Pero si fotografías un paisaje nevado, el exposímetro «corrige» tanto blanco y la nieve sale grisácea.

Cualquier fotógrafo aprende pronto que la lectura del exposímetro es un buen punto de partida, no la verdad, y sabe en qué situaciones desconfiar de ella. La diferencia es que a nosotros nos lo enseñaban. Al usuario de un reloj nadie le explica qué supuestos hay detrás de sus calorías, así que, si no lo hace la interfaz, no lo hará nadie.

## Algunas ideas para diseñar datos inciertos

No hace falta reinventar nada. Con decisiones bastante sencillas, una interfaz puede ser honesta con lo que sabe y con lo que supone:

- **Jerarquía según la fiabilidad y el momento de uso.** Mi propia costumbre es una buena pista: durante la actividad, lo medido y lo que me ayuda a decidir (ritmo, pulso); después, el resumen con los datos estimados.
- **Decir que es una estimación.** Un «aprox.» o un símbolo «≈» delante de la cifra es un cambio mínimo que cambia cómo se lee.
- **Evitar la falsa precisión.** «Unas 530 kcal» o un rango como «420–660 kcal» son más honestos que «526 kcal». Si el margen de error es grande, las unidades no aportan información.
- **Explicar bajo demanda.** Un icono de información que, al tocarlo, cuente en dos frases cómo se calcula el dato. Quien no lo necesita no lo ve; quien quiere entenderlo, lo tiene a un toque.
- **Presentar las predicciones como escenarios.** «Entre 4:55 y 5:20/km según cómo llegues» ayuda más a planificar que una única cifra cerrada.

<!-- IMAGEN 2: calorias-antes-despues.webp — pie: «A la izquierda, el resumen de la salida tal como lo muestra la app. A la derecha, una propuesta de cambio en las calorías (maqueta, no es la app real).» — alt: «Dos paneles de resumen de una salida de 7,59 km en la app del reloj, antes y después. A la izquierda, tal como los muestra la app, las calorías aparecen como «526 kcal», una cifra exacta y sin explicación. A la derecha, una propuesta de cambio: «≈ 530 kcal», con un rango de 420 a 660 y un icono de información. El resto de datos no cambia.» -->

## Saber cuánto puedes fiarte de cada número

No creo que la solución sea quitar las calorías de la pantalla ni llenarla de advertencias. Son útiles para ver tendencias y comparar una semana con otra, siempre que se lean como lo que son.

Esto no solo afecta a los relojes deportivos. Cualquier producto que muestre datos, desde un panel de métricas hasta una app de salud, mezcla cifras medidas y cifras estimadas. Si alguna vez diseñas una pantalla así, vale la pena preguntarse cuáles son cuáles y si el usuario puede notarlo. Yo, mientras tanto, seguiré mirando el ritmo durante la salida y las calorías al llegar a casa, con el margen de error en mente.

## Referencias

- Shcherbina, A. et al. (2017). *Accuracy in Wrist-Worn, Sensor-Based Measurements of Heart Rate and Energy Expenditure in a Diverse Cohort*. Journal of Personalized Medicine, 7(2). Resumen de Stanford Medicine: https://med.stanford.edu/news/all-news/2017/05/fitness-trackers-accurately-measure-heart-rate-but-not-calories-burned.html
- Fuller, D. et al. (2020). *Reliability and Validity of Commercially Available Wearable Devices for Measuring Steps, Energy Expenditure, and Heart Rate: Systematic Review*. JMIR mHealth and uHealth, 8(9). https://mhealth.jmir.org/2020/9/e18694
