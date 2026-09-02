# Auditoría global de Hermandades · 2 de septiembre de 2026

## Alcance y método

Se auditaron las 51 Hermandades publicadas en producción. La comparación combina:

- la señal reproducible `brotherhood_completeness` (identidad, escudo, sede, jornada, titulares, pasos, cultos, salidas, música asociada a salidas y Fuentes);
- recuentos reales de titulares, pasos, periodos musicales, patrimonio, Fuentes y media;
- una matriz editorial de 14 ejes para las cinco candidatas con mayor deuda y potencial relacional.

La indexabilidad no se almacena como campo: se calcula en tiempo de petición con
`meetsPublicEditorialMinimum`. Por eso la auditoría registra el estado
`published` y no inventa una marca persistente `index/noindex`.

La puntuación sirve para ordenar trabajo; no pretende precisión matemática.

## Inventario completo

| Banda | Hermandades | Total |
|---|---|---:|
| 🟢 Alta (≥ 80) | La Asunción de Cantillana (93), La Pastora de Cantillana (93), El Baratillo (86), San Esteban (86), La Cena (86), Padre Pío (86) | 6 |
| 🟡 Media (60–79) | Dulce Nombre (79), Dulce Nombre de Bellavista (79), La Misión (79), Las Cigarreras (79), Pasión y Muerte (79), San Benito (79), Las Aguas (79), Bendición y Esperanza (71), Pino Montano (71), Gran Poder (71), Cristo de la Corona (71) | 11 |
| 🟠 Baja (40–59) | Divina Misericordia · Rosario de Santiago (50), Cuatrovitas (43), Guadalupe de San Buenaventura (43), Jesús Despojado (43), La Macarena (43) | 5 |
| 🔴 Muy incompleta (< 40) | Consolación de Carrión (0), Encarnación de Aznalcázar (14), Mercedes de Mairena (14), Sastres (21), Virgen de la Luz (21), Santa Lucía (21), Castillo de Lebrija (21), Inmaculado Corazón de Torreblanca (21), Sacramental de Tomares (21), Dolores de Camas (21), Vera Cruz de Tocina (21), Aguas Santas de Villaverde (29), Divina Pastora de Marchena (29), Estrella de Coria (29), La Sed (29), Vera Cruz y Sangre de Huévar (29), Dolores de La Rinconada (29), Consolación de Utrera (29), Consolación de Osuna (29), Virgen del Valle de Écija (29), Valvanera (29), Setefilla (29), Maravillas de San Diego (29), Pastora de Santa Marina (29), Purísima de La Algaba (29), Mercedes de la Puerta Real (36), Juncal (36), Pastora de Padre Pío (36), Pastora de Triana (36) | 29 |

Total certificado: **51 Hermandades publicadas**.

## Top 5 por prioridad documental y relacional

| # | Hermandad | Base | Prioridad | Huecos determinantes | Relaciones que desbloquea |
|---:|---|---:|---|---|---|
| 1 | La Macarena | 43 | Muy alta | Titulares y pasos en borrador, autorías, hábito, capataces, patrimonio y media | Sentencia ↔ misterio ↔ Centuria; Esperanza ↔ palio ↔ Carmen de Salteras; Rosario ↔ Hermandad |
| 2 | Jesús Despojado | 43 | Muy alta | Titulares, pasos, autorías, hábito, capataces, patrimonio, música por paso y media | Jesús ↔ misterio ↔ Virgen de los Reyes; Dolores y San Juan ↔ palio |
| 3 | La Sed | 29 | Alta | Sin titulares ni pasos publicados; música ya existente sin extremos editoriales completos | Dos acompañamientos y futuros enlaces a imágenes/pasos |
| 4 | Pino Montano | 71 | Alta | Deuda concentrada en cultos, patrimonio, media y Fuentes por bloque | Dos titulares, dos pasos y dos acompañamientos ya publicados |
| 5 | San Benito | 79 | Alta | Historia, cultos, salidas y media; deuda menor pero grafo muy denso | Tres pasos, siete periodos musicales y nueve piezas patrimoniales |

La diferencia entre las dos primeras y el resto es material: ambas podían
cerrarse sin DDL y reutilizando entidades musicales ya consolidadas.

## Matriz de las seleccionadas

| Eje | Macarena · antes | Macarena · cierre | Jesús Despojado · antes | Jesús Despojado · cierre |
|---|---:|---:|---:|---:|
| Identidad | 85 | 90 | 85 | 90 |
| Sede | 90 | 90 | 90 | 90 |
| Historia | 85 | 95 | 80 | 95 |
| Titulares | 15 | 95 | 0 | 95 |
| Pasos | 10 | 95 | 0 | 95 |
| Autorías / intervenciones | 10 | 85 | 0 | 85 |
| Capataces | 0 | 90 | 0 | 90 |
| Música | 70 | 90 | 60 | 85 |
| Patrimonio | 10 | 80 | 0 | 80 |
| Cultos | 20 | 35 | 10 | 25 |
| Hábito | 0 | 95 | 0 | 95 |
| Salidas / extraordinarias | 30 | 45 | 20 | 40 |
| Multimedia | 0 | 0 | 0 | 0 |
| Fuentes | 65 | 95 | 60 | 95 |
| **Media comparativa** | **35** | **78** | **29** | **76** |

Los ejes de cultos y salidas solo conservan lo que ya estaba respaldado. No se
crearon calendarios temporales como recurrencias permanentes.

## Cierre del lote

- **La Macarena:** tres titulares, dos pasos, autoría original separada de
  figuras secundarias, dos hábitos, capataz, acompañamientos por paso, tres
  piezas patrimoniales y Fuentes directas.
- **Jesús Despojado:** tres titulares, dos pasos, autorías documentadas, hábito,
  dos capataces, Virgen de los Reyes relacionada con el misterio, tres piezas
  patrimoniales y Fuentes directas.
- **Media:** sin fotografía de portada. No se localizó licencia reutilizable;
  queda pendiente de recurso autorizado.
- **Liceo de Moguer y secciones juveniles:** documentados por la fuente, pero no
  se crearon Bandas nuevas ni relaciones ambiguas en este lote.
- **DDL / RLS / arquitectura / UX:** cero cambios.
