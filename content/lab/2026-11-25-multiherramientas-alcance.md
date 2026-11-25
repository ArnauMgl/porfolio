---
title: "Alcance: una multiherramientas para quien rueda"
slug: multiherramientas-alcance
date: 2026-11-25
project: bike-tool
projectLabel: "Bike tool"
type: Alcance
resumen: "Una app que reúne herramientas pequeñas para el taller y la ruta de quien va en bici. Qué entra en la primera versión, qué se queda fuera y por qué empieza en Android."
---

Estoy diseñando una app que reúne herramientas pequeñas para el taller y la ruta de quien va en bici. Empezará en Android y después llegará a iPhone. Los motivos son prácticos y los cuento a continuación. La primera herramienta, y la que estoy desarrollando ahora, es un calculador de presión de neumáticos.

**Por qué Android primero**

- Android es el móvil que uso a diario, así que puedo probar la app en un dispositivo real desde el primer día.
- Permite instalar una versión de prueba directamente en el móvil, sin esperar la revisión de una tienda, lo que facilita compartirla con otros ciclistas y recoger su opinión.
- Publicar en Google Play requiere un pago único de 25 dólares, mientras que el programa de desarrolladores de Apple cuesta 99 dólares al año.

Para iPhone no hay fecha todavía: llegará después.

La idea viene de mi etapa en la fotografía. PhotoPills no pretende ser una app de fotografía en general: resuelve bien cosas muy concretas para quien practica esa actividad. Esa es la referencia, de concepto y no visual. Quiero lo mismo para el ciclismo: pocas herramientas, cada una bien resuelta.

**Qué entra en la primera versión**

- Perfil de bici: neumáticos, platos y cassette guardados una vez y usados por todas las herramientas, con los kilómetros desde Strava o a mano.
- Componentes con vida estimada: neumáticos, cassette y cadena, con el desgaste de la cadena ligado a ellos.
- Calculador de presión para MTB, carretera, gravel, ciclocross y utility.
- Relación de marchas, muy sencilla: la más ligera, la más dura y el desarrollo.
- Conversor de medidas de neumático: ETRTO, pulgadas y milímetros.
- Pares de apriete como un dato por pantalla, eligiendo la pieza, sin tabla.
- Linterna y notas, con un modo taller: interruptor arriba, pantalla encendida, texto grande y luz baja.

**Qué se queda fuera, y por qué**

He descartado, por ahora, el checklist de antes de salir y la altura del sillín. El registro de mantenimiento también: los avisos de vida de los componentes cubren lo importante sin pedir al usuario que apunte nada. Track y BMX quedan fuera del calculador. El asistente de normativa vial y mecánica básica queda para una segunda fase, con fichas propias y no con manuales con copyright.

**Un límite técnico que ya conozco.** La API de Strava devuelve la distancia de cada bici, pero según una nota de un desarrollador no expone los componentes. Los kilómetros de cada pieza se calcularían en la app, como los de la bici menos los que tenía al montarla. Por si cambian las condiciones de la API, los kilómetros también podrán introducirse a mano.

Todos los valores que dará el calculador serán estimados y la app lo dirá así. La app completa queda en pausa hasta que avancen esta web y el Lab, y el calculador de presión se trabaja en paralelo como prototipo. En la próxima entrada abro la calculadora de Vittoria y repaso, paso a paso, qué pregunta.
