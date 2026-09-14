# Certificación HC-016 · Domingo de Ramos de Sevilla

**Fecha:** 14 de septiembre de 2026

**Base auditada:** `f8cfc13ddd043a213c1382ea7f35afe7e3fee8c7`

**Ámbito:** cierre de la jornada completa mediante un único macrolote DML

## Selección

El recálculo situó primero al Domingo de Ramos: ocho fichas corporativas ya existentes, seis con deuda nuclear rematable, dos cierres preservables y fuentes institucionales suficientes para cerrar la jornada sin crear corporaciones ni cambiar el esquema. Viernes Santo quedó segundo y Jueves Santo tercero por exigir más promociones o altas desde cero y presentar mayor riesgo relacional.

| Puesto | Jornada | Total | Preservadas | Pendientes reales | Deuda | Fuentes | Potencial | Volumen estimado |
|---:|---|---:|---:|---:|---|---|---|---:|
| 1 | Domingo de Ramos | 8 corporaciones · 9 cortejos | 2 | 6 | Media | Alta | Alto | 250–320 |
| 2 | Viernes Santo | 7 | 2 | 5 | Alta | Alta | Alto | 400–500 |
| 3 | Jueves Santo | 7 | 1 | 6 | Alta | Alta | Alto | 450–550 |

La Paz y Jesús Despojado se preservaron. La Cena, Hiniesta, San Roque, Estrella, Amargura y Amor se completaron. La Borriquita se modela como la primera parte procesional de la Hermandad del Amor, no como una novena corporación.

## Resultado del lote

| Lote | Resultado | Composición efectiva |
|---|---:|---:|
| `c0160017-0000-4000-8000-000000000001` | 261/261 | 228 insert · 33 update |
| **Total** | **261/261** | **0 inválidas · 0 fallos** |

La simulación transaccional mediante `ROLLBACK` detectó y corrigió antes del Apply dos referencias musicales: una variante nominal ya canónica de la Banda del Nazareno de Huelva y un UUID obsoleto de la Banda de Música María Santísima de la Victoria. El staging eliminó además 18 filas residuales de una versión previa del generador antes de quedar `ready` en posiciones 0–260.

## Cobertura final

- 8 fichas corporativas publicadas y 9 cortejos correctamente representados;
- 34 Cultos recurrentes añadidos, 7 Salidas penitenciales de 2026 y 17 acompañamientos;
- 12 bienes patrimoniales y 6 hitos históricos nuevos;
- 3 formaciones musicales nuevas y reutilización de la formación canónica de Huelva;
- pasos existentes enriquecidos y referencias musicales dirigidas a los Pasos canónicos;
- 5 Fuentes nuevas y 90 vínculos documentales.

La Cena, La Paz y Jesús Despojado quedan al 100 % reproducible. Amargura, Estrella, Hiniesta, San Roque y Amor quedan al 93 %: todas sus señales nucleares son verdaderas salvo `crest`, que se mantiene como hueco legítimo por ausencia de licencia reutilizable.

## Fuentes principales

- [Nómina oficial de 2026](https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/)
- [Domingo de Ramos 2026 · horarios](https://semanasantaopendata.org/2026/dia/domingo-de-ramos/)
- fichas del Consejo de [Amargura](https://www.hermandades-de-sevilla.org/semanasanta/dramos_la_amargura.html), [Estrella](https://www.hermandades-de-sevilla.org/semanasanta/dramos_la_estrella.html), [Hiniesta](https://www.hermandades-de-sevilla.org/semanasanta/dramos_la_hiniesta.html), [San Roque](https://www.hermandades-de-sevilla.org/semanasanta/dramos_san_roque.html), [Amor](https://www.hermandades-de-sevilla.org/semanasanta/dramos_el_amor.html) y [Cena](https://www.hermandades-de-sevilla.org/semanasanta/dramos_la_cena.html);
- webs oficiales de [Amargura](https://www.amargura.org/), [Estrella](https://hermandad-estrella.org/), [Hiniesta](https://www.hermandaddelahiniesta.es/), [San Roque](https://hermandadsanroque.com/) y [Cena](https://lacenadesevilla.es/).

## QA y huecos legítimos

El postflight devuelve 0 slugs publicados duplicados, 0 huérfanos en Hermandad–Imagen, Hermandad–Paso, Imagen–Paso, Salida–Entidad, acompañamientos y Fuentes, y 0 imágenes contaminadas entre las seis corporaciones trabajadas. Los dos Jesús de las Penas conservan UUID y slugs distintos para Estrella y San Roque.

No se incorporan escudos o fotografías sin derechos, catálogos patrimoniales exhaustivos, fechas contractuales no publicadas ni continuidad musical de 2027. El Cristo del Amor permanece sin banda porque el dato oficial de 2026 así lo documenta.

Domingo de Ramos queda cerrado. Jueves y Viernes Santo permanecen en cola; no se abre otra jornada, HC-018 continúa bloqueada y `FIRST EDITION FREEZE` sigue activo.
