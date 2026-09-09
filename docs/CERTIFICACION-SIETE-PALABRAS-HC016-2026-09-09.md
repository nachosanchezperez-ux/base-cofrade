# Certificación editorial · Las Siete Palabras · HC-016 · 9 de septiembre de 2026

## Resultado

**LAS SIETE PALABRAS → SÉPTIMO CONTEXTO REAL HC-016 COMPLETADO · 270/270 · INDEXABLE · GRAFO PÚBLICO AMPLIADO.**

El preflight comenzó con GitHub y producción en `de55d81b8ad33035ec8b44120b7e2bec23b84bf5`. Durante la ejecución apareció un `main` posterior y prevaleció: `cd4b5e4ba1d71363e4943d405a0c7202731cbd30`, desplegado `READY` mediante `dpl_GHjp2NQBFNN4M5W8veJLQ67Susef`.

Lote aplicado: `f97aef97-12f9-4ed5-b1dd-201dd7c6f877`.

## Reconciliación, deuda y TOP 3 nuevo

Antes de cargar se reconciliaron `main`, PR, últimos merges, Orquestador, Estado, producción y #492. GitHub confirmó 0 PR abiertas y #492 siguió aislada. La deuda se recalculó sobre Hermandades publicadas no certificadas; el ranking histórico no se reutilizó como decisión.

| Candidata | Completitud aprox. | Deuda real y fuentes | Potencial relacional | Dificultad | Cierre HC-016 y riesgos |
|---|---:|---|---|---|---|
| **Las Siete Palabras** | 43 % | Deuda nuclear; 13 páginas oficiales útiles | Muy alto: titulares, cuatro Pasos, música, patrimonio, Cultos y Salidas | Alta | Viable sin esquema; riesgo de confundir titulares, etapas musicales y anuncios futuros |
| **El Valle** | 43 % | Deuda nuclear; web oficial profunda | Alto: cuatro titulares, tres Pasos y dos periodos musicales reutilizables | Alta | Viable, pero con mayor carga de conciliación artística |
| **La Amargura** | 71 % | Deuda concentrada en Cultos, Salidas, patrimonio y trazabilidad | Medio-alto; ya conserva imágenes, Pasos, música y relaciones | Media | Cierre rutinario corto; menor ganancia documental que las dos primeras |

Se eligió **Las Siete Palabras** por la combinación más fuerte de deuda documental real, fuentes oficiales, riqueza relacional, reutilización de nodos y valor editorial. La elección nace del grafo actualizado y no de la posición que ocupase en un corte anterior.

## Diagnóstico A–E

- **A · deuda real resuelta:** identidad e historia, titulares, Pasos, autorías, hábito, música vigente e histórica, patrimonio, Cultos, Salidas, relaciones y Fuentes.
- **B · no aplicable:** no se exigió que cada imagen, pieza o salida tuviera todos los campos opcionales cuando su naturaleza no los requería.
- **C · no publicado:** escudo y fotografías ambientales sin un recurso autorizado.
- **D · pendiente de verificar:** capataces, vestidores y composición vigente de la junta sin una fuente oficial inequívoca; cualquier continuidad musical de 2027 no confirmada expresamente.
- **E · hueco legítimo:** autoría desconocida de Nuestra Señora del Rosario, dataciones abiertas conservadas como tales y ausencia de media con derechos comprobados.

## Diseño del lote

El inventario siguió Fuentes → entidades → Hermandad → titulares → Pasos → agentes → autorías → música → patrimonio → Cultos → Salidas → relaciones → `source_links`.

| Familia | Filas |
|---|---:|
| Fuentes | 13 |
| Entidades | 53 |
| Agentes | 10 |
| Hermandad | 1 |
| Imágenes y relaciones con Hermandad | 24 |
| Autorías y relaciones Imagen–Paso | 21 |
| Pasos y relaciones con Hermandad | 8 |
| Hábito | 1 |
| Patrimonio | 27 |
| Cultos | 16 |
| Salidas y participantes | 6 |
| Periodos musicales | 5 |
| Relaciones entre entidades | 11 |
| `source_links` | 74 |
| **Total** | **270** |

El plan efectivo fue **252 insert · 18 update · 0 reuse**. Los 18 `update` fueron revisados antes de Apply: dos Fuentes oficiales existentes, la Hermandad, ocho entidades/agentes compartidos, tres filas ya existentes de Nuestra Señora de la Cabeza y cuatro periodos musicales a los que se resolvió el Paso. No se duplicaron Bandas, agentes, Pasos, Fuentes equivalentes ni Salidas.

## Preflight, Apply e incidencias

- carga y Staging: 270/270 estructuralmente válidas, en cuatro fragmentos de transporte;
- preflight global: 270 comprobadas, 270 válidas, 0 inválidas, 0 referencias sin resolver, 0 ambigüedades y 0 colisiones;
- dependencias resueltas y operaciones efectivas conocidas: 252 insert, 18 update y 0 reuse;
- revisión humana completada antes de confirmar Apply;
- Apply: 270/270 aplicadas, 0 inválidas y 0 fallos; lote `completed`.

La única incidencia fue de **presentación**: una hidratación del Panel perdió la etiqueta descriptiva y el lote quedó con el rótulo genérico «Importación masiva». Se certifica por UUID. El contenido, el preflight y el Apply no se vieron afectados; no se abrió una corrección SQL fuera del circuito.

## Inventario certificado y actualidad

- identidad, denominación oficial, historia, sede, web y Miércoles Santo;
- 12 titulares/imágenes publicados, 11 autorías documentadas o atribuidas y una autoría desconocida conservada explícitamente;
- 4 Pasos y 9 relaciones Imagen–Paso;
- 1 hábito, 16 Cultos, 2 Salidas, 27 piezas patrimoniales y 5 periodos musicales;
- 74 vínculos de Fuente del lote, todos con Fuente resoluble;
- 0 duplicados nucleares y 0 referencias huérfanas reales.

La procesión del Rosario del 1 de noviembre de 2026 permanece `announced`, no celebrada. El Réquiem del calendario 2026-2027 conserva únicamente «19 de noviembre» y no inventa hora. La relación anunciada hasta 2027 no se presenta como vigente por el mero hecho de estar confirmada para ese año, y ningún contrato recibe una fecha final deducida.

| Paso o salida | Formación | Periodo | Estado en el corte |
|---|---|---:|---|
| Divina Misericordia | Quinteto de metal de la Agrupación Musical Virgen de los Reyes | 2026 | Vigente en 2026 |
| Misterio | Esencia | Desde 2011 | Vigente |
| Palio | Carmen de Villalba | Desde 2016 | Vigente |
| Rosario | Maestro Tejera | Relación anual | Vigente |
| Misterio | Presentación al Pueblo | 1992–2006 | Histórico |

## Completitud y huecos legítimos

La señal reproducible `brotherhood_completeness` pasa de **43 % a 86 %**. Identidad, sede, jornada, imágenes, Pasos, Cultos, Salidas y Fuentes están presentes. Quedan en falso:

- `crest`, por no existir un escudo autorizado cargado;
- `music`, porque el medidor heredado exige una fila en `accompaniments`, aunque la ficha pública consume correctamente los cinco `music_accompaniment_periods`.

No se duplicó música en una tabla heredada para perseguir un 100 % artificial. Capataces, vestidores, junta y recursos visuales quedan como deuda legítima o pendiente de verificar.

## QA final

- Supabase: lote `completed`, 270/270, 0 inválidas, 0 fallos, 0 referencias huérfanas y 0 duplicados nucleares;
- ficha pública: HTTP 200, canonical exacto, `index, follow`, Open Graph y Twitter Card;
- contenido visible comprobado: identidad, sede, titulares, Pasos, música, túnica, Salidas, Cultos, patrimonio, histórico musical y Fuentes;
- navegador real: estructura y contenido íntegros; desktop comprobado directamente y tablet/móvil cubiertos por los contratos responsive de la suite;
- Vercel: 0 errores de runtime en `/hermandades/siete-palabras-sevilla` durante la ventana auditada;
- suite completa vigente: **662/662**;
- `next build`: correcto con Next.js 16.3.0 y TypeScript válido;
- `git diff --check`: limpio antes de publicación.

## Restricciones y cierre

No hubo DDL, nuevas tablas, migraciones estructurales ni cambios RLS. [#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) permanece abierta y aislada.

Las Siete Palabras queda cerrada como séptimo contexto editorial real de HC-016. No se abre una octava Hermandad.
