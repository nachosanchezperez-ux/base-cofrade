# Profundización · San Benito · cierre 2/10/2026

## Resultado

**CERRADA Y CERTIFICADA.**

La ficha pública de San Benito se profundiza sin rehacer su grafo existente. El auditor HC-DEPTH pasa de **75/100 a 95/100**.

## Cambios de datos

- `brotherhood_types`: Penitencia + Sacramental.
- web oficial incorporada.
- `history_text` estructurado a partir de la reseña histórica oficial.
- **7 Cultos** recurrentes nucleares.
- **7 ediciones 2026**, conservando `announced` cuando solo existe convocatoria y elevando a `held` únicamente Quinario y Función Principal, que disponen de evidencia posterior.
- **1 Estación de Penitencia 2026** única, estado `held`, con horario e itinerario oficiales.
- **3 titulares** relacionados con la Salida.
- **4 posiciones musicales** y **4 asignaciones** reutilizando Bandas y Pasos ya existentes.
- guía editorial **Conoce San Benito** con relaciones a la Hermandad y sus tres titulares.
- Fuentes oficiales vinculadas a Hermandad, Cultos, ediciones, Salida, música y guía.

## Integridad

Dry-run completo bajo `BEGIN/ROLLBACK`: PASS.

Post-rollback:
- tipos originales preservados;
- Historia sin persistir;
- 0 Cultos nuevos;
- 0 Salidas nuevas;
- 0 guías nuevas;
- 0 Fuentes nuevas.

Apply posterior con el mismo payload: PASS.

Postflight:
- 7 Cultos públicos;
- 7 ediciones 2026;
- 1 Salida con slug `san-benito-estacion-penitencia-2026`;
- 3 titulares en la Salida;
- 4 posiciones y 4 asignaciones musicales;
- 4 Fuentes directas;
- 1 guía editorial;
- 0 duplicado de la Salida 2026.

## QA público y SEO

- HTTP 200.
- canonical: `https://hilocofrade.es/hermandades/san-benito`.
- robots: `index, follow`.
- un H1.
- visibles Historia, Cultos, Estación de Penitencia 2026, carácter sacramental y Conoce San Benito.
- Google URL Inspection: **PASS · Submitted and indexed · INDEXING_ALLOWED**.

## Deuda legítima

No se elevan a `held` las ediciones históricas de 2026 para las que solo existe convocatoria previa. No se persigue patrimonio exhaustivo ni multimedia adicional como condición de cierre.

## Regla

San Benito queda fuera de los rankings automáticos de profundización salvo nueva información material, error demostrado o regresión.
