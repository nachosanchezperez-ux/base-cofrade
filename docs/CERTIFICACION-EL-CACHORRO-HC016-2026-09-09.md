# Certificación editorial · El Cachorro · HC-016 · 9 de septiembre de 2026

## Resultado

**EL CACHORRO → CUARTO LOTE HC-016 COMPLETADO · 90/90 · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

Base Git y producción previa al remate documental: `58488e8632cbbb1d42557624c6d20f621d0d6d5b` · deployment `dpl_CAAncWj55viTd9RBzyfo1CrePE6R` · `READY`.

Lote aplicado: `19d2d74c-ff8d-42cd-9a4e-42c8e3a56a7d`.

## Preflight y ejecución

El lote quedó preparado con 90 registros en 18 tablas:

| Familia | Filas |
|---|---:|
| Fuentes | 7 |
| Entidades | 11 |
| Hermandad | 1 |
| Imágenes | 3 |
| Agentes | 2 |
| Pasos | 2 |
| Relaciones Hermandad–Imagen y Hermandad–Paso | 5 |
| Autorías y relaciones Imagen–Paso | 4 |
| Patrimonio e intervenciones | 7 |
| Cultos | 7 |
| Salidas y relaciones | 3 |
| Marchas | 4 |
| `source_links` | 34 |
| **Total** | **90** |

- preflight global: 90 válidas, 0 inválidas y 0 colisiones;
- plan efectivo: 77 insert · 12 update · 1 reuse;
- corrección editorial previa: `Hermanos Cruz Solís.agent_kind`, `person` → `workshop`;
- simulación completa en transacción revertida: correcta;
- Apply real atómico: 90 aplicadas, 0 inválidas y 0 fallos;
- el intento anterior inválido quedó cancelado con 0 escrituras;
- ambos cambios de estado quedaron registrados en `audit_log`.

## Inventario certificado

- identidad, denominación oficial, historia, sede, barrio, web y jornada procesional;
- 3 titulares publicados;
- 2 Pasos publicados y relacionados con sus imágenes;
- 2 autorías y 3 restauraciones documentadas;
- 4 bienes patrimoniales nucleares;
- 7 Cultos recurrentes;
- Vía Crucis del Consejo de 1978 publicado como Salida histórica;
- 3 periodos de acompañamiento musical y 4 marchas con cronología contrastada;
- 7 Fuentes oficiales preparadas y 34 vínculos de Fuente aplicados;
- 0 vínculos del lote huérfanos;
- 0 titulares o Pasos publicados duplicados;
- 0 entidades, relaciones de titulares o relaciones de Pasos del subgrafo nuclear en borrador.

## Fuentes y criterio editorial

Las fuentes principales son páginas de la propia Hermandad:

- [historia](https://hermandaddelcachorro.org/historia/);
- [Santísimo Cristo de la Expiración](https://hermandaddelcachorro.org/santisimocristodelaexpiracion/);
- [Nuestra Madre y Señora del Patrocinio Dolorosa](https://hermandaddelcachorro.org/nuestra-madre-y-senora-del-patrocinio-dolorosa/);
- [Nuestra Madre y Señora del Patrocinio Gloriosa](https://hermandaddelcachorro.org/nuestramadreysenoradelpatrociniogloriosa/);
- [Pasos procesionales](https://hermandaddelcachorro.org/pasosprocesionales/);
- [Cultos](https://hermandaddelcachorro.org/cultos/);
- [patrimonio musical](https://hermandaddelcachorro.org/patrimoniomusical/).

La lista institucional del [Consejo de Hermandades y Cofradías](https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/) fecha en 1978 la presidencia del Vía Crucis por el Cristo de la Expiración. La historia de la Hermandad contiene una referencia a 1977. El lote conserva **1978** para la Salida institucional porque el registro específico del organizador es la fuente más directa para ese acontecimiento; la discrepancia queda declarada y no se borra.

No se incorporaron escudo o fotografías sin trazabilidad de derechos, ni se convirtió una continuidad musical no fechada en una fecha inventada.

## Completitud y deuda legítima

La señal reproducible `brotherhood_completeness` pasa de **43 % a 86 %**. Quedan en falso únicamente:

- `crest`: no existe un recurso gráfico con derechos verificados;
- `music`: el medidor histórico exige una fila en `accompaniments` ligada a una Salida publicada.

La segunda señal no describe un hueco en el lector actual: la ficha pública muestra dos formaciones vigentes desde `music_accompaniment_periods`, ambas respaldadas por la fuente musical oficial. No se creó un acompañamiento ficticio para el Vía Crucis de 1978 con el único fin de elevar el porcentaje.

## QA de datos y producción

- Supabase: 3 titulares, 2 Pasos, 7 Cultos, 1 Salida histórica, 3 periodos musicales, 4 bienes y 34 vínculos de Fuente del lote;
- modelado de “Hermanos Cruz Solís”: `workshop`;
- ficha pública: HTTP 200;
- canonical: `https://hilocofrade.es/hermandades/hermandad-del-cachorro`;
- robots: `index, follow`;
- título y descripción social correctos;
- bloques visibles comprobados: información, titulares, Pasos, música, Vía Crucis, Cultos, patrimonio y Fuentes;
- el lector muestra 3 titulares, 2 Pasos y 2 formaciones actuales;
- Vercel: 0 errores de runtime en la hora posterior al Apply.
- `npm test`: 659/659;
- `next build`: correcto con Next.js 16.3.0 y TypeScript válido;
- `git diff --check`: limpio.

## Restricciones respetadas

No se incorporaron DDL, tablas, migraciones estructurales, cambios RLS, arquitectura, producto o UX. [#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) permanece abierta y aislada.

## Cierre

HC-016 queda probado en un cuarto contexto editorial real. El Cachorro no debe reabrirse para perseguir un 100 % artificial: solo ante una regresión, una fuente material nueva o un recurso visual legalmente reutilizable.
