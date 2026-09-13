# Certificación HC-016 · Guadalupe de San Buenaventura

**Corte:** 13 de septiembre de 2026

**Ámbito:** décimo contexto editorial de HC-016

**Base reconciliada:** `e208625e6416a5852108439fcf12b2585774edc6`

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

La ficha de Guadalupe de San Buenaventura queda cerrada como lote corto y verificable. El contenido se aplicó en Supabase, se contrastó en las fichas públicas de Hermandad, Imagen y Paso y se archivó de forma reproducible en `20260913161000_cierra_guadalupe_san_buenaventura.sql`.

El cierre conserva intactos la procesión de Gloria de 2026, la igualá, José Manuel Rechi, el acompañamiento de la Banda de Música Liceo de Sevilla y la curiosidad sobre la cesión del paso a la Hermandad de la Corona. Sobre esa base añade:

- identidad canónica e historia institucional de la Franciscana Hermandad;
- Nuestra Señora de Guadalupe como titular publicada, con autoría de Juan Abascal Fuentes, datación de 1960, madera de encina, iconografía y ubicación de culto;
- relación completa Hermandad–Imagen–Paso;
- ficha barroca del paso, en cedro real americano y pan de oro, con fase de diseño y ejecución del taller de Manuel Guzmán Bejarano;
- nueve cultos principales y cinco próximas convocatorias de 2026;
- cronología pública de 1960, 1992, 2007, 2017 y 2023;
- web oficial vigente y canal oficial en X;
- doce fuentes visibles en la ficha matriz.

## Control editorial

- 1 Hermandad, 1 Imagen titular y 1 Paso publicados y relacionados.
- 1 autoría documentada de la Imagen y 1 fase técnica documentada del Paso.
- 9 cultos publicados.
- 5 hitos históricos visibles.
- 2 canales oficiales.
- 0 DDL, tablas, políticas, funciones, índices o cambios de UX.
- 0 duplicados nucleares detectados en el postflight.
- 0 relaciones troncales huérfanas.

Las próximas fechas incorporadas son las misas mensuales del 10 de octubre, 7 de noviembre y 5 de diciembre, la misa de difuntos del 14 de noviembre y la misa por las personas afectadas por el cáncer del 5 de diciembre. No se importó de forma masiva el histórico de convocatorias vencidas.

## Verificación pública

- `/hermandades/guadalupe-san-buenaventura`: identidad, titular, Paso, música, cinco hitos, Salida, nueve Cultos, curiosidad, canales y Fuentes visibles.
- `/imagenes/nuestra-senora-guadalupe-san-buenaventura`: autoría, datación, Hermandad, Paso y Fuente oficial visibles.
- `/pasos/paso-procesional-nuestra-senora-guadalupe-san-buenaventura`: materiales, capataz, Imagen, Banda y fase de Guzmán Bejarano visibles.

## Huecos legítimos

- No se publica una fotografía propia de la ficha de la Imagen sin derechos de reutilización comprobados.
- No se fija la fecha de ejecución del paso porque la fuente oficial consultada no la precisa.
- No se añaden dimensiones, restauraciones o canales sociales no acreditados de forma inequívoca.

La ausencia de esos datos no bloquea el cierre y no debe resolverse mediante inferencias. Tras integrar este documento, el SHA final de `main` y el deployment productivo correspondiente prevalecerán sobre la base reconciliada indicada arriba.
