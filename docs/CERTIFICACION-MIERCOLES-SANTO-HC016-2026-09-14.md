# Certificación HC-016 · Miércoles Santo de Sevilla

**Fecha:** 14 de septiembre de 2026  
**Base auditada:** `848d0c058208d1f4421b4d964cb0a156f4c13761`  
**Ámbito:** cierre de la jornada mediante El Buen Fin, sin DDL, tablas nuevas ni cambios RLS

## Resultado

El directorio público reúne las nueve cofradías del Miércoles Santo. El lote completa la única ausencia real, la Hermandad del Buen Fin, y preserva El Carmen, La Sed, San Bernardo, La Sagrada Lanzada, El Baratillo, Los Panaderos, Cristo de Burgos y Las Siete Palabras.

| Lote | Resultado | Operación efectiva |
|---|---:|---:|
| `c0160016-0000-4000-8000-000000000001` | 153/153 | 149 insert · 4 update |
| **Total ejecutado** | **153/153** | **0 inválidas · 0 fallos** |

Los cuatro `update` publican la entidad preexistente del Buen Fin y conectan con sus tres periodos musicales ya canónicos. No se duplica ninguna banda ni se toca la ficha de la Sagrada Lanzada.

## Cobertura publicada

- identidad, denominación oficial, historia, sede y web;
- 2 titulares penitenciales: Santísimo Cristo del Buen Fin y Nuestra Señora de la Palma Coronada;
- 4 figuras secundarias del misterio recuperado en 2024, de Darío Fernández;
- 2 Pasos y 6 relaciones Imagen–Paso;
- 10 Cultos recurrentes;
- Estación de Penitencia del 1 de abril de 2026, con seis imágenes participantes y dos acompañamientos;
- 3 periodos musicales vigentes: Centuria tras el misterio, Las Nieves de Olivares tras el palio y sección juvenil de la Centuria en la Cruz de Guía;
- 5 bienes patrimoniales y 8 hitos históricos vinculados;
- 13 Fuentes directas visibles en la Hermandad y 47 vínculos documentales creados.

La señal reproducible `brotherhood_completeness` queda en 93 %. El único indicador falso es `crest`: la web describe la heráldica, pero no se incorpora un archivo gráfico sin licencia de reutilización acreditada.

## Separación Buen Fin / Lanzada

La Hermandad del Buen Fin conserva como titular mariana a **Nuestra Señora de la Palma Coronada**. **María Santísima del Buen Fin** continúa vinculada exclusivamente a la Hermandad de la Sagrada Lanzada.

El postflight confirma:

- 0 relaciones desde la Hermandad del Buen Fin hacia la Dolorosa de la Lanzada;
- 1 única titularidad para María Santísima del Buen Fin, perteneciente a la Sagrada Lanzada;
- 0 imágenes del nuevo grafo del Buen Fin enlazadas desde otra Hermandad;
- slugs diferenciados para ambas imágenes y sus Pasos.

## Fuentes y decisiones editoriales

La investigación se apoya principalmente en la web oficial del Buen Fin:

- [orígenes](https://hermandadbuenfin.es/origenes/);
- [sede canónica](https://hermandadbuenfin.es/sede-canonica/);
- [Santísimo Cristo del Buen Fin](https://hermandadbuenfin.es/stmo-cristo-del-buen-fin/);
- [Nuestra Señora de la Palma Coronada](https://hermandadbuenfin.es/virgen-de-la-palma/);
- [cortejo y Pasos](https://hermandadbuenfin.es/cortejo/);
- [Cultos y actos de 2026](https://hermandadbuenfin.es/cultos-y-actos/);
- [Estación de Penitencia de 2026](https://hermandadbuenfin.es/2026/03/datos-de-la-cofradia-para-la-estacion-de-penitencia-del-miercoles-santo-de-2026/);
- [efemérides](https://hermandadbuenfin.es/efemerides/).

La [presentación del misterio de Darío Fernández](https://periodicodigital.eusa.es/2024/03/21/el-buen-fin-presenta-su-nuevo-misterio-obra-de-dario-fernandez/) documenta la recuperación de la escena en 2024. La salida oficial de 2026 vuelve a denominarlo paso de misterio, por lo que se conserva como configuración vigente.

## Postflight de datos

- directorio `Miércoles Santo · 9`;
- lote `completed`, 153 válidas, 153 aplicadas, 0 inválidas y 0 fallos;
- 6 imágenes, 2 Pasos, 10 Cultos, 1 Salida, 3 periodos musicales vigentes, 5 bienes, 8 hitos y 13 Fuentes directas;
- 0 slugs duplicados de entidades y lugares;
- 0 imágenes, Pasos, autorías, música o vínculos de Fuente huérfanos;
- simulación completa mediante `ROLLBACK` antes del Apply real.

## Huecos legítimos

No se incorpora escudo o fotografía sin licencia reutilizable, no se fuerza un año inicial exacto para la vinculación de la Centuria adulta y no se convierte el inventario patrimonial oficial en un catálogo exhaustivo. La falta de esos datos no bloquea el cierre editorial.

## Cierre

El macrolote queda `completed`. Miércoles Santo queda cerrado, HC-018 continúa bloqueada y `FIRST EDITION FREEZE` permanece activo. No se abre Jueves Santo ni otro frente editorial.
