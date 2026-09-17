# Banco de preguntas · Tira del Hilo

Este banco protege el comportamiento determinista del buscador relacional frente a regresiones al añadir nuevas capas.

## Cobertura actual

- Agenda y colecciones públicas: 10 formulaciones.
- Datos directos de Marchas: 8 formulaciones.
- V2 · relaciones precisas, históricas y Bandas: 10 formulaciones.
- V3 · hilo musical de Marchas: 8 formulaciones.
- V4 · Autores y Patrimonio: 9 formulaciones.
- V5 · Hermandades, Cultos e Historia: 9 formulaciones.
- V6 · búsquedas multicriterio: 7 formulaciones.

**Total: 61 preguntas.**

La fuente ejecutable es `test/tira-relational-regression-bank.test.mjs`.

## Principios

1. Cada pregunta comprueba la intención determinista que debe recibirla, no un texto de respuesta literal.
2. El banco incluye formulaciones equivalentes para detectar regresiones lingüísticas.
3. También incluye casos negativos para impedir que una capa secuestre preguntas de otra.
4. Los límites documentales son parte del contrato: por ejemplo, V4 no debe convertir «¿Quién restauró esta imagen?» en una atribución si el restaurador no está estructurado.
5. Al añadir una nueva capacidad relacional se deben añadir al menos un caso positivo, una variante natural y un caso de no regresión.

## Casos ancla

- `¿Qué banda toca detrás de la Virgen de la Salud de San Gonzalo?`
- `¿A qué hermandades acompaña Santa Ana?`
- `¿Y antes?`
- `¿Qué marchas aparecen en la cruceta de San Gonzalo 2026?`
- `¿En qué crucetas aparece Salud Siempre?`
- `¿Qué imágenes hizo Luis Ortega Bru?`
- `¿Qué tiene próximamente San Gonzalo?`
- `Hermandades del Lunes Santo con Santa Ana`
- `Imágenes de Castillo Lastrucci que procesionan el Miércoles Santo`
- `Marchas de Manuel Marvizón interpretadas por Santa Ana`
