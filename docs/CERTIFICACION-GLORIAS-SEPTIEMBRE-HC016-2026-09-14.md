# Certificación HC-016 · Glorias de septiembre de Sevilla

**Fecha:** 14 de septiembre de 2026

**HEAD inicial reconciliado:** `70046e4922820b2bdfa6e9f8fa51e7e147d377fc`

**Ámbito:** las once corporaciones incluidas por el Consejo en el bloque de Glorias de septiembre de Sevilla

## Inventario y alcance

El macrolote preserva los cierres suficientes de Guadalupe de San Buenaventura, El Juncal, Nuestra Señora de la Luz, Divina Pastora de Santa Marina y Mercedes de la Puerta Real. Completa Pastora de Triana, Valvanera, Santa Lucía, Nuestra Señora de los Reyes de los Sastres, Inmaculado Corazón de María de Torreblanca y Pastora de Padre Pío.

No se fuerza una salida donde no existe anuncio verificable. Santa Lucía conserva como hueco legítimo la ausencia de una edición 2026 publicada. La cita de Torreblanca del 27 de septiembre es una **Romería** y no se incorpora al directorio como `Procesión de Gloria`.

## Resultado

| Lote | Resultado | Composición |
|---|---:|---:|
| `c0160020-0000-4000-8000-000000000001` | 114/114 | 106 insert/upsert · 8 update |
| **Errores** | **0 inválidas** | **0 fallos** |

El lote incorpora cinco titulares y sus relaciones, una autoría reutilizada, una sede, once bienes patrimoniales, la procesión 2026 de los Sastres, la Romería 2026 de Torreblanca y el acompañamiento de la Banda de Música Ciudad de Dos Hermanas tras la Pastora de Padre Pío. También completa las horas oficiales ya anunciadas para Pastora de Triana y Valvanera.

El primer simulacro transaccional se detuvo antes de escribir al detectar que la sede nueva de Torreblanca debía preceder a la actualización de la Hermandad. Se corrigió únicamente el orden de dependencia; el segundo simulacro terminó con `ROLLBACK` limpio y el preflight gobernado alcanzó 114 válidas, 0 inválidas antes del Apply.

## Actualidad y homónimos

- las citas del 19, 20, 26 y 27 de septiembre permanecen `announced`;
- la procesión de Padre Pío del 12 de septiembre conserva `held` porque existe crónica posterior;
- no se cambia a celebrado Juncal ni Guadalupe sin evidencia posterior suficiente;
- la Hermandad del Inmaculado Corazón de María queda separada de la Hermandad penitencial de Torreblanca;
- su titular tampoco reutiliza la imagen homónima de la Misión;
- no se inventan recorridos, horas de entrada, autorías, continuidad musical ni multimedia.

## Fuentes principales

- [Directorio institucional de Glorias de septiembre](https://www.hermandades-de-sevilla.org/hermandades/gloria/septiembre/)
- [Pastora de Triana · ficha institucional](https://www.hermandades-de-sevilla.org/hermandades/gloria/septiembre/pastora-de-santa-ana/)
- [Valvanera · ficha institucional](https://www.hermandades-de-sevilla.org/hermandades/gloria/septiembre/nuestra-senora-de-valvanera/)
- [Padre Pío · ficha institucional](https://www.hermandades-de-sevilla.org/hermandades/gloria/septiembre/pastora-de-padre-pio/)
- [Procesiones del 19 de septiembre de 2026](https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-19-de-septiembre-2026/)
- [Procesiones del 26 de septiembre de 2026](https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-26-de-septiembre-2026/)
- [Romería de Torreblanca del 27 de septiembre de 2026](https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-27-de-septiembre-2026/)
- webs oficiales y Fuentes ya canónicas de Santa Lucía, los Sastres y las restantes corporaciones preservadas.

## QA

- 11/11 Hermandades del censo institucional con ficha pública;
- seis fichas intervenidas responden 200;
- nueve `Procesión de Gloria` de Sevilla capital publicadas en septiembre de 2026 y una Romería separada;
- 0 slugs duplicados en entidades y Salidas;
- 0 relaciones Hermandad–Imagen, Imagen–Paso o Fuentes huérfanas;
- 0 contaminación entre los tres contextos homónimos del Inmaculado Corazón/Torreblanca;
- 0 DDL, tablas nuevas, migraciones estructurales o cambios RLS.

Huecos legítimos: edición 2026 de Santa Lucía no anunciada, horarios de entrada e itinerarios aún no publicados, Cultos no documentados de Valvanera y Torreblanca, catálogos patrimoniales no exhaustivos y multimedia sin licencia reutilizable.

Glorias de septiembre queda cerrado como macrolote transversal. Octubre, noviembre y diciembre permanecen en cola y no se abren automáticamente.
