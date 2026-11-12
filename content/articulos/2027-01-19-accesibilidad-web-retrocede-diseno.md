---
title: "La web es menos accesible que hace un año, y buena parte se decide en diseño"
seoTitle: "Accesibilidad web en 2026: por qué empeora y qué hacer"
description: "El informe WebAIM Million 2026 muestra que la accesibilidad web ha empeorado. Los errores más comunes son casi siempre los mismos, y muchos nacen en diseño."
slug: "accesibilidad-web-retrocede-diseno"
date: "2027-01-19"
lang: "es"
readingTime: 4
tags: ["accesibilidad", "ui", "ux"]
---

Seguro que te suena la escena: un texto secundario en gris claro sobre fondo blanco, porque «queda más limpio». O un botón que es solo un icono, porque todo el mundo sabe qué significa una lupa. Son decisiones pequeñas que tomamos a diario en diseño, y casi siempre con buena intención. El problema es que, sumadas, explican buena parte de por qué la web sigue siendo difícil de usar para muchas personas.

## Primer retroceso en seis años

Cada año, WebAIM, una organización de la Universidad Estatal de Utah, analiza de forma automática la accesibilidad de las páginas de inicio del millón de webs más visitadas. Es una de las referencias más citadas del sector, y el informe de 2026 trae una mala noticia: por primera vez en seis años, los datos han ido a peor.

El 95,9 % de las páginas analizadas tenía errores detectables de las pautas WCAG, frente al 94,8 % del año anterior. La media de errores por página subió un 10,1 %, hasta 56,1. Y hay que tener en cuenta que un análisis automático solo detecta una parte de los problemas: el porcentaje real de páginas accesibles es, con toda seguridad, todavía menor.

El error más frecuente es el de siempre: texto con contraste insuficiente, presente en el 83,9 % de las páginas (un año antes era el 79,1 %). De media, cada página tenía 34 textos con poco contraste.

<!-- IMAGEN 1: accesibilidad-grafico-webaim.webp — alt: «Gráfico de líneas con el porcentaje de páginas de inicio con fallos WCAG detectables según WebAIM: 97,8 % en 2019, 98,1 % en 2020, 97,4 % en 2021, 96,8 % en 2022, 96,3 % en 2023, 95,9 % en 2024, 94,8 % en 2025 y 95,9 % en 2026. Sube un poco en 2020, baja poco a poco hasta 2025 y en 2026 vuelve a subir. El eje vertical empieza en el 92 %.» -->

## Más complejidad, más errores

WebAIM apunta a una causa principal: las páginas son cada vez más complejas. El número medio de elementos por página creció un 14,3 % en un solo año y casi se ha duplicado desde 2019. También se ha disparado el uso de ARIA, el código que sirve para dar información extra a las tecnologías de apoyo, como los lectores de pantalla: un 27 % más que el año anterior. Paradójicamente, las páginas que usan ARIA tienen más errores de media (59,1) que las que no lo usan (42).

Los autores relacionan estas tendencias con el uso creciente de frameworks y librerías de terceros, y también con la programación asistida por IA, el llamado *vibe coding*. Lo plantean como una explicación probable, no como una relación demostrada, pero encaja con algo que se ve en muchos equipos: generar interfaces nunca había sido tan rápido, y revisarlas sigue llevando el mismo tiempo.

Dos datos me llamaron especialmente la atención. Las webs de deportes fueron la categoría con más errores de todo el estudio, un 27 % por encima de la media. Y las páginas en español tenían de media un 15 % más de errores que el conjunto. Ninguno de los dos es para presumir.

## Siempre son los mismos errores

Lo más revelador del informe es que el 96 % de los errores detectados caen en solo seis categorías, y son las mismas desde hace siete años: contraste insuficiente, imágenes sin texto alternativo, campos de formulario sin etiqueta, enlaces vacíos, botones vacíos y páginas sin el idioma declarado.

Entrenando a categorías base de hockey sobre hielo veo algo parecido cada temporada. Cuando un equipo de niños pierde un partido, casi nunca es porque falle una jugada ensayada; es por los fundamentos: un pase mal dado, un disco que no se controla, alguien que no se levanta rápido del hielo. Por eso, cuanto más se complica el juego, más tiempo dedicamos a lo básico. Con la accesibilidad pasa lo mismo: no fallan las soluciones sofisticadas, fallan los fundamentos.

Y muchos de esos fundamentos se deciden antes de escribir una sola línea de código:

- **Contraste.** Es una decisión cien por cien de diseño. Comprobar que el texto cumple la ratio mínima de las WCAG (4,5:1 para texto normal) lleva segundos con cualquier plugin de Figma.
- **Etiquetas de formulario.** Un placeholder que desaparece al escribir no sustituye a una etiqueta visible. Si el diseño no la incluye, es difícil que aparezca después.
- **Botones e iconos.** Un botón que solo tiene un icono necesita un nombre accesible. Indicarlo en el diseño («este botón se anuncia como Buscar») evita que llegue vacío a producción.
- **Imágenes.** Decidir qué imágenes aportan información y cuáles son decorativas, y proponer el texto alternativo de las primeras, también es trabajo de diseño.

<!-- IMAGEN 2: accesibilidad-contraste.webp — alt: «Comparación del mismo texto en dos grises sobre fondo blanco. A la izquierda, un gris claro con un contraste de 2,4:1, que no cumple las WCAG. A la derecha, un gris más oscuro con un contraste de 7,0:1, que sí las cumple. El mínimo para texto normal es 4,5:1.» -->

## Ya no es solo una buena práctica

En la Unión Europea, además, la accesibilidad ha dejado de ser solo una recomendación para muchos productos digitales: desde el 28 de junio de 2025 se aplica la European Accessibility Act, que exige requisitos de accesibilidad a servicios como el comercio electrónico o la banca.

Pero más allá de la normativa, creo que el informe deja una idea útil para el día a día: no hace falta ser especialista en accesibilidad para evitar la mayoría de estos errores. Basta con incluir unas pocas comprobaciones en el proceso de diseño y en el traspaso a desarrollo.

El próximo informe de WebAIM llegará previsiblemente en la primavera de 2027, y dirá si este retroceso fue un bache o el principio de una tendencia. Que sea una cosa o la otra no depende solo de quien escribe el código: buena parte de lo que mide el informe se decide antes, en diseño. Por eso, empezar el año con esas comprobaciones, el contraste, las etiquetas de los formularios y los nombres de los botones, es una de las formas más baratas de que la historia de 2027 sea distinta.

La próxima vez que elijas ese gris clarito para un texto, vale la pena comprobar el contraste antes de darlo por bueno.

## Referencias

- WebAIM (2026). *The WebAIM Million: The 2026 report on the accessibility of the top 1,000,000 home pages*. https://webaim.org/projects/million/
- Bird & Bird (2025). *EU accessibility deadline: the European Accessibility Act comes into force*. https://www.twobirds.com/en/insights/2025/eu-accessibility-deadline--the-european-accessibility-act-comes-into-force
