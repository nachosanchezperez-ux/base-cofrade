# Certificación HC-016 · Lunes Santo de Sevilla

**Fecha:** 14 de septiembre de 2026  
**Base auditada:** `b43bf1319adb90f22fe80d9dfe86ac9b235fa5e7`  
**Ámbito:** cierre transversal de la jornada completa, sin DDL, tablas nuevas ni cambios RLS

## Resultado

El directorio público de Sevilla capital reúne las nueve cofradías del Lunes Santo. El lote completa Redención, Santa Genoveva, Santa Marta y Vera+Cruz y preserva sin reapertura El Museo, San Gonzalo, San Pablo, Las Aguas y Las Penas de San Vicente.

| Lote | Resultado | Operación efectiva |
|---|---:|---:|
| `c0160014-0000-4000-8000-000000000001` | 307/307 | 299 insert · 8 update |
| `c0160014-1000-4000-8000-000000000001` | 1/1 | 1 insert · vínculo del Rosario de Santa Genoveva |
| `c0160014-2000-4000-8000-000000000001` | 1/1 | 1 update · fuente musical de Vera+Cruz |
| **Total ejecutado** | **309/309** | **0 inválidas · 0 fallos** |

La receta idempotente final contiene 308 filas: el tercer lote corrige una fuente incluida ya en el principal y no añade otra entidad al estado final.

## Cobertura publicada

| Hermandad | Imágenes | Pasos | Cultos | Salidas | Hitos | Patrimonio | Música vigente | Fuentes directas |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Redención | 2 | 2 | 6 | 1 | 5 | 1 | 2 | 7 |
| Santa Genoveva | 5 | 2 | 7 | 2 | 5 | 2 | 3 | 7 |
| Santa Marta | 4 | 1 | 6 | 1 | 3 | 1 | 0 | 4 |
| Vera+Cruz | 2 | 2 | 7 | 1 | 3 | 2 | 1 | 5 |

Santa Marta conserva expresamente su estación en silencio. Vera+Cruz registra música de capilla con formulación editorial cauta. Santa Genoveva conserva separadas su estación de penitencia y el Rosario matutino.

## Postflight

- directorio `Lunes Santo · 9` y nueve enlaces públicos válidos;
- 0 slugs duplicados en las cuatro fichas intervenidas;
- 0 imágenes, Pasos o acompañamientos musicales huérfanos;
- 0 Salidas publicadas sin participante;
- fuentes oficiales enlazadas a identidad, titulares, Cultos, patrimonio, Salidas y acontecimientos;
- suite completa: 730/730 pruebas;
- compilación de producción de Next.js superada.

## Huecos legítimos

No se incorporan fotografías ni escudos sin licencia de reutilización comprobable. Tampoco se fuerzan autorías, dataciones, catálogos patrimoniales exhaustivos o históricos musicales cuya existencia o vigencia no quede respaldada por una fuente fiable.

## Cierre

El macrolote queda `completed`. No activa HC-018, no modifica el esquema y no abre otro frente editorial. La siguiente jornada requiere un recálculo nuevo antes de cualquier Apply.
