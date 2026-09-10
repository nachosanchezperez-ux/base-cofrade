# Certificación HC-016 · San Gonzalo

**Fecha:** 10 de septiembre de 2026  
**Contexto:** octavo lote editorial real  
**HEAD inicial real:** `2ec0c5f4e375659ecb0f5cc28f60ecfac737dff7`  
**HEAD funcional integrado:** `d4fa89cd91dce0bdccb3fa9632498b7976820187`  
**PR funcional:** [#738](https://github.com/nachosanchezperez-ux/base-cofrade/pull/738)  
**Producción funcional:** `READY` · `dpl_ANgo7Efw9UNwyad3kGjrpAkFHJ3A`

## Diagnóstico y criterio editorial

La ficha partía de una completitud útil aproximada del 43 %. Ya existían la Hermandad, la sede, la jornada, un Paso de misterio en borrador, la relación Hermandad–Paso en borrador, un periodo vigente de Las Cigarreras y la participación de 2011 en el Vía Crucis. La deuda real se concentraba en titulares, Paso de palio, autorías, responsables, Cultos, Salidas, patrimonio, acontecimientos, relaciones y Fuentes.

Se cerró con el modelo vigente, sin DDL. Se reutilizaron nodos canónicos cuando representaban la misma realidad, especialmente el Santísimo Sacramento, agentes, talleres, Bandas, lugares y el acontecimiento de 2011.

## Fuentes

Se publicaron 17 Fuentes visibles. El núcleo documental procede de:

- sitio oficial, Historia, Junta de Gobierno y fichas oficiales de los tres titulares, el Santísimo Sacramento y ambos Pasos;
- hojas informativas oficiales de enero y agosto de 2026;
- Consejo General de Hermandades y Cofradías de Sevilla;
- Cadena SER para el recorrido del Lunes Santo de 2026;
- Las Cigarreras y Pasión y Esperanza para acompañamientos y renovación musical.

La información anunciada se conserva como futura; la celebrada se identifica por evidencia posterior. La renovación por cuatro años no se convirtió en una fecha final inventada.

## Diseño y preflight

El lote completo se ordenó como Fuentes → entidades → Hermandad → titulares → Pasos → agentes → autorías → música → patrimonio → Cultos → Salidas → acontecimientos → relaciones → `source_links`.

El lote principal contenía 226 registros en 23 tablas. Su preflight global certificó:

- 226/226 válidos;
- 0 `INVALID`;
- 0 `UNRESOLVED_REFERENCE`;
- 0 `AMBIGUOUS_REFERENCE`;
- 0 `COLLISION`;
- 79 filas con referencias y 0 estados de referencia incorrectos;
- planificación efectiva: 218 insert, 7 update y 1 reuse.

## Apply e incidencia

El primer Apply ejecutó 212 registros y rechazó 14:

- 8 Imágenes por `images_current_condition_check`;
- 2 Pasos por `steps_current_condition_check`;
- 4 Acontecimientos por `events_category_check`.

La incidencia se clasificó como validación sistémica: la base imponía los valores `extant/lost/destroyed/unknown`, `preserved/partially_preserved/not_preserved` y `historical/crew_call`, pero HC-016 no los validaba antes de Apply. No se certificó el lote en ese estado.

Se corrigió el preflight común, se añadió una regresión y se preparó la reconciliación `22d1fea4-b7a3-4028-8f98-a7d7ecd04579`: 14/14 válidas, 0 referencias sin resolver, 0 ambigüedades, 0 colisiones y 14/14 aplicadas. Dos remates limpios de 4/4 y 3/3 completaron la titularidad sacramental, sus Fuentes y la banda de Cruz de Guía.

El balance lógico final es:

| Resultado | Total |
|---|---:|
| Operaciones efectivas | 233 |
| Insert | 225 |
| Update | 7 |
| Reuse | 1 |
| Aplicadas y reconciliadas | 233 |
| Pendientes | 0 |
| Fallos sin reconciliar | 0 |

## Estado final del grafo

| Ámbito | Resultado publicado |
|---|---:|
| Imágenes titulares | 3 |
| Titularidades conceptuales | 1 |
| Pasos | 2 |
| Autorías de Imágenes | 10 |
| Responsables actuales | 3 |
| Acompañamientos vigentes en 2026 | 3 |
| Cultos | 13 |
| Ediciones de Cultos en 2026 | 12 |
| Salidas | 5 |
| Patrimonio | 11 |
| Acontecimientos | 5 |
| Fuentes visibles | 17 |

Las comprobaciones globales devolvieron 0 slugs duplicados, 0 relaciones huérfanas, 0 relaciones troncales en borrador y 0 duplicados Hermandad–Imagen o Hermandad–Paso.

## Deuda clasificada

- **A · deuda real:** cerrada para identidad, sede, titulares, Pasos, autorías, responsables verificables, música 2026, Cultos, Salidas, patrimonio, acontecimientos, relaciones y Fuentes.
- **B · no aplicable:** no se modeló sede temporal ni cambio 2027 porque no existe evidencia aplicable al corte.
- **C · no publicado:** vestidor actual y otros oficios sin evidencia pública inequívoca.
- **D · pendiente de verificar:** año exacto de Caifás; se conserva la datación prudente «Década de 1970». La fecha inicial de Santa Ana no se infiere y queda «Vigente en 2026».
- **E · hueco legítimo:** escudo, cabecera, fotografías de titulares/Pasos y multimedia sin derechos verificables; catálogo no exhaustivo de marchas dedicadas.

La completitud útil final queda aproximadamente en **92 %**. No se persigue un 100 % artificial.

## QA público y técnico

- ficha de San Gonzalo: HTTP 200, canonical exacta, `index, follow`, OG/Twitter y 3 bloques JSON-LD;
- cabecera, identidad, sede, titulares, Pasos, música, patrimonio, Cultos, Salidas, acontecimientos, Fuentes y enlaces visibles;
- fichas públicas de ambos Pasos: 200, relaciones, imágenes procesionales, música, patrimonio y Fuente oficial;
- OG de San Gonzalo: PNG válido de 1200 × 630;
- desktop comprobado directamente; tablet y móvil cubiertos por los contratos responsive vigentes de la suite;
- el recurso físico de San Benito dejó de heredarse en la titularidad sacramental compartida;
- 673/673 tests;
- build completo de Next.js y TypeScript correcto;
- `git diff --check` limpio;
- deployment funcional: 11 respuestas 200 y 0 errores/fatales en logs.

## Auditor

El error de enums era sistémico y ya dispone de regresión; no se introdujo excepción por San Gonzalo. La fotografía sacramental cruzada era igualmente un problema común de presentación de nodos compartidos y se corrigió sin duplicar ni alterar el nodo canónico. El OG de San Gonzalo funciona y no activa el frente transversal de WEBP. No se creó esquema, no se abrió El Valle ni La Amargura y no quedó otro frente de Laboratorio activo.

**Certificación:** San Gonzalo queda cerrada, actual, fiable, relacional, indexable y documentada como octavo contexto real de HC-016.
