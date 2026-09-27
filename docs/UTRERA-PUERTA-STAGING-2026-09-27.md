# Utrera · puerta para staging · 27/09/2026

**NO-GO PARA STAGING.** Cuatro casos originales resueltos mediante exclusión
legítima de publicación; dos excepciones adicionales del contrato público
impiden continuar. No se ha ejecutado SQL de escritura.

## Precheck

Main `15710dd5bcde2a4bd6dc87dc5d8c8846e213e406`, producción
`dpl_B9Nk4BkELsCK8EPQKMXRg1Ym8XLL` READY sobre ese SHA; Supabase ACTIVE_HEALTHY,
17 migraciones. Runtime vigente: consulta de 2 h sin filas error/fatal, limitada
por la edad del deployment. #1009 draft; main reconciliado mediante merge,
resolviendo únicamente el conflicto documental con el estado canónico vigente.

## Cuatro decisiones cerradas para esta edición

| Caso | Decisión | Consecuencia |
|---|---|---|
| I44 · Resucitado | review / sin ficha pública | Custodia y organizador preservados; ninguna Hermandad inventada |
| I45 · Estrella | review / sin ficha pública | Sin Paso ni participación de 2026 inferida |
| S25 · Paso Resucitado | review / sin ficha independiente | Relación documentada con I44 conservada en review |
| H17 · Marismas | review / publicación profunda diferida | Sin sede inferida ni apropiación de procesión de septiembre |

Fuentes y razones: `evidence/modelado-utrera-2026-09-27/publication-decisions.json`.
Son decisiones de publicación, no afirmaciones de inexistencia documental.
Se mantienen las identidades, UUID, perfiles, trazabilidad y datos del Vía Lucis.
Los lectores de entidades exigen published; las tarjetas musicales no generan
enlace de Paso cuando la entidad no está publicada.

La comparación contra el manifiesto original encuentra exactamente nueve cambios,
todos `status: published → review`: cuatro entities, dos entity_locations,
dos image_authorships y una image_steps. No se añade ninguna relación corporativa.

## Auditoría pública estática

Reproducción: `node scripts/audit-utrera-public-contract.mjs`.
Ejecuta el selector de sitemap y los predicados editoriales reales contra la
proyección del candidato y los snapshots. Pasos usa además el lector de Fuentes
ya corregido en #1012. No representa QA HTTP de entidades aún no cargadas.

- 16 corporaciones, 45 imágenes y 24 Pasos previstos como publicados.
- Los 24 Pasos superan la selección del sitemap y el predicado de metadata.
- H13, Rocío: dispone de Simpecado, carreta y Fuentes. El predicado de ficha
  acepta patrimonio, pero la proyección del sitemap impone `patrimonio: []`.
  Resultado: metadata con patrimonio válida, sitemap excluido.
- I13, Angustias: el resumen productivo comienza por «Imagen de autoría no
  documentada». El mínimo editorial detecta esa expresión dentro de un texto
  sustantivo y lo rechaza. SELECT del 27/09 a las 08:30:45 UTC confirma que la
  descripción productiva sigue coincidiendo con el snapshot. No se ha reescrito
  la incertidumbre de autoría para forzar indexabilidad.

El resultado JSON contiene las 85 filas públicas evaluadas y las cuatro
exclusiones. Ninguna de estas dos incidencias se corrige cambiando producto en
esta orden. El defecto de Fuentes de Pasos ya resuelto no vuelve a declararse abierto.

## Candidato y QA

| Medida | Resultado |
|---|---:|
| Corporaciones conservadas | 17 |
| Imágenes conservadas | 47 |
| Pasos conservados | 25 |
| Bienes | 6 |
| Bandas | 17 |
| Salidas nuevas / posiciones | 20 / 25 |
| held / announced | 7 / 13 |
| INSERT / UPDATE / DELETE | 1.166 / 7 / 0 |
| TOTAL DML | 1.173 → 1.173 |
| REUSE distintos | 33 |
| Pruebas Utrera | 30/30 PASS |
| Suite de la rama reconciliada | 1.333/1.333 PASS |
| Build / diff-check | PASS / PASS |

Builder y validador ejecutados. El validador antiguo reproduce deliberadamente
los cortes documentales previos; sus 38 imágenes/22 Pasos y gates históricos no
son el estado del manifiesto final. `manifest-validation.json` describe el
manifiesto actual y `public-contract-audit.json` gobierna la puerta pública.

## Dry-run y protección

Dry-run: **NO EJECUTADO** por NO-GO público. El SQL regenerado aborta con
`UTRERA_PUBLIC_CONTRACT_NO_GO` antes de tocar filas. No COMMIT.
Rollback: no procede. Residuos: **no medidos**, nunca se certifica cero sin lectura
posterior a una ejecución real. Conciliación global de drift, colisiones, FK y
QA dentro de transacción: pendientes; no se declara producción restaurada.

SQL de control: import Utrera inexistente; HC-AUTO-03 ready 55/55, 0 aplicado;
Morón completed 504/504. No DDL, RLS, migraciones, staging ni Apply.

## Auditor

La causa de recurrencia es que las validaciones genéricas no reproducían la
construcción de datos de los lectores públicos. La auditoría nueva ejecuta la
selección completa y deja de revisar únicamente las cuatro excepciones conocidas.
El patrimonio del Rocío y la autoría incierta de Angustias son datos legítimos;
no deben convertirse en relaciones falsas ni certezas editoriales artificiales.
No se demuestra necesidad de DDL. H13 exige revisar la coherencia transversal
entre ficha y sitemap; I13 requiere revisar el alcance del filtro de placeholders
sin debilitar el rechazo de fichas vacías. No se ejecutan aquí esas correcciones.

**Único siguiente movimiento recomendado:** revisión separada del contrato de
indexabilidad que cubra patrimonio corporativo e incertidumbre editorial legítima.
