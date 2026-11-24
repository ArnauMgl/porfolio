---
title: "El flujo de Vittoria como referencia"
slug: flujo-vittoria
date: 2026-11-18
project: bike-tool
projectLabel: "Bike tool"
type: Investigación
resumen: "La calculadora de presión de Vittoria es la referencia de la app. Esta entrada recoge cómo funciona su flujo, qué funciona bien, qué funciona peor y qué se mantiene y qué se cambia."
---

La calculadora de Vittoria sirve de base para la de la app. Se revisó su flujo completo, con 46 capturas. Empieza por la disciplina (MTB, carretera, gravel, ciclocross, utilitaria, pista y BMX) y, a partir de ahí, el número de pasos cambia: 11 en MTB, 10 en gravel y en carretera, 9 en utilitaria y 7 en ciclocross. El orden es siempre parecido: la bici, el neumático, el ciclista, el terreno y la temperatura.

**Qué datos pide.** El peso es un solo dato, la suma de ciclista, bici y equipo, que se elige con un dial de 30 a 150 kg. El ancho del neumático se elige con un deslizador con regla, y los dos controles permiten cambiar de unidades. Además pide si la bici es eléctrica, el tipo de neumático, cómo está montado, el estilo de conducción, las condiciones del terreno y la temperatura. Algunos datos dependen de la disciplina: el diámetro de rueda solo en MTB y gravel, la preferencia de tacto del neumático solo en carretera y la frecuencia con que se revisa la presión solo en utilitaria.

**Cómo da el resultado.** Una presión para la rueda delantera y otra para la trasera, sin rango, siempre con dos decimales (por ejemplo, 2,05 y 2,15), en bar por defecto y con un interruptor bar/psi.

**Qué funciona bien**

- Empezar por la disciplina: ordena el resto del flujo y evita preguntar lo que no corresponde.
- Una pregunta por pantalla, con contador de pasos y botón para volver atrás.
- En el tipo de bici, opciones con icono y una descripción corta.
- La opción «No lo sé» en el neumático y en la temperatura.
- Controles con unidades reales: un dial para el peso y una regla para el ancho.
- Una pantalla final de revisión, donde se puede editar cada respuesta.

**Qué funciona peor**

- La pregunta de la temperatura es confusa: solo ofrece «más cálida», sin cifra, o 10, 20 o 30 °C más fría.
- Los dos decimales dan una falsa precisión con un manómetro de bomba, que tiene un error del orden del ±5 %.
- El flujo es largo: hasta 11 pasos en MTB.
- Hay textos mezclados en español y en inglés.
- El mismo concepto se llama «condiciones del terreno» en unas disciplinas y «condiciones de la superficie» en otras.
- Las pantallas son de dos columnas, pensadas para escritorio y no para móvil.

**Qué se mantiene y qué se cambia**

- Se mantiene el flujo por disciplina, con cinco: MTB, carretera, gravel, ciclocross y utilitaria.
- Se dejan fuera pista y BMX.
- Se amplían los rangos de medida del neumático: 32" en MTB y gravel, y 45 mm en carretera.
- Se separan los modos básico y experto.
- Si la bici ya está registrada, se saltan los pasos que ya se conocen.
- La temperatura se toma de la ubicación del dispositivo.
- El hookless pasa de pregunta a aviso.
- El cálculo es propio, con el aviso de que los valores son estimados.
