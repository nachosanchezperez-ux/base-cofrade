# Utrera · GO PARA STAGING · 27/09/2026

**GO PARA STAGING DE UTRERA. DETENERSE AQUÍ.** Staging no creado; Apply no
ejecutado. Este resultado no certifica Utrera cargada ni QA web post-Apply.

## Precheck y producto

Main `e86ba888c34ad7121be181708a2194815ea78ef2`, tras #1014 y el avance concurrente #1015
(paletas heredadas), reconciliado antes de publicar la PR. Producción
`dpl_9QaCTZcRowb33vq3rgXyeyWu3gKa` READY sobre ese
SHA, aliases hilocofrade.es y www.hilocofrade.es. Supabase ACTIVE_HEALTHY,
17 migraciones. #1009 reconciliada con ese main; permanece draft, sin fusionar.

QA productivo de la corrección: Angustias de Utrera HTTP 200, canonical propio,
index/follow e incluida en sitemap de imágenes (541 URLs). Sitemap de
Hermandades HTTP 200, 293 URLs. Regresión Paso de Angustias de Estepa: HTTP 200,
index/follow. Runtime vigente: sin filas error/fatal entre 10:40:18 y 10:55:18 UTC.
Tras #1015 se repite Angustias: HTTP 200, canonical propio e index/follow.
Runtime nuevo sin filas error/fatal en consulta hasta 11:00:17 UTC, acotada
a la edad del deployment. H13 todavía no está en producción; su validación es estática sobre el candidato.

## Cuatro decisiones y contrato público

I44 Resucitado, I45 Estrella, S25 Paso Resucitado y H17 Marismas conservan sus
identidades en review, sin ficha pública independiente. Sin relaciones inventadas.
La corrección transversal publicada elimina las excepciones H13/I13. Auditoría
del candidato reconciliado: **PASS, 85/85**, con 16 corporaciones, 45 imágenes y
24 Pasos públicos; cero excepciones bloqueantes. Las cuatro exclusiones persisten.

## Candidato

| Medida | Resultado |
|---|---:|
| Corporaciones / imágenes / Pasos conservados | 17 / 47 / 25 |
| Bienes / Bandas | 6 / 17 |
| Salidas nuevas / posiciones | 20 / 25 |
| held / announced | 7 / 13 |
| INSERT / UPDATE / DELETE | 1.166 / 7 / 0 |
| TOTAL DML | 1.173 |
| REUSE distintos | 33 |

Operaciones y UUID idénticos a la resolución anterior de las cuatro fichas.
Deriva ajena reconciliada: 13 entidades, 6 perfiles de agentes, 1 Banda,
15 Fuentes y 2 municipios nuevos; actualización de municipio de Julián Cerdán.
No colisionan con el candidato. Las tres Hermandades REUSE, las filas locales
existentes y las siete actualizaciones mantienen sus valores previos.
No se interpreta el snapshot parcial de tres Hermandades como censo global.
Columnas y constraints contrastadas contra PostgreSQL: cero diferencias.
Colisiones por UUID de INSERT: cero. Siete objetivos UPDATE presentes.

## PostgreSQL real y rollback

1. Primer intento abortado por precedencia de operadores JSON. Se parentetiza
   la extracción JSON en cuatro comprobaciones; no cambia el payload.
2. Segundo intento abortado al alcanzar 60 segundos en el guard de duplicados
   de source_links. Se sustituyen conversiones repetidas de filas completas a
   JSON por comparación de columnas tipadas con IS NOT DISTINCT FROM. Se
   conserva NULL seguro y el timeout de 60 segundos.
3. Candidato corregido ejecutado completo: **UTRERA_DRY_RUN_PASS_ROLLED_BACK**,
   1.173 operaciones, 1.166 INSERT, 7 UPDATE, 0 DELETE, 33 REUSE comprobados.

Las comparaciones posteriores a ambos abortos confirmaron igualdad exacta.
El intento final comprueba postcondiciones por operación, conteos por tabla,
REUSE, guard de tipos de las 17 corporaciones, cuatro estados review, constraints
inmediatas, claves naturales y preservación de filas/columnas ajenas.

**ROLLBACK PASS · 0 RESIDUOS.** Nueva lectura independiente: conteos y hashes
de las 19 tablas completos iguales antes/después, incluidos los siete UPDATE.
Import Utrera inexistente. No se deduce cero del texto del fichero SQL.

Idempotencia PostgreSQL: se aplica el mismo bloque dos veces dentro de una
transacción y se comparan las 19 tablas después de la primera y segunda pasada.
Resultado **UTRERA_IDEMPOTENCE_PASS_ROLLED_BACK**. Nuevo rollback y lectura
independiente iguales, cero residuos. Generador reproducible:
`node scripts/render-utrera-idempotence.mjs` (solo emite SQL).

## QA y evidencia

30/30 específicas; 1.366/1.366 suite tras reconciliar #1015; build PASS; diff-check PASS.
No DDL, RLS, migraciones, staging ni Apply. Morón completed 504/504; HC-AUTO-03
ready 55/55, 0 aplicado. Carmona, Écija y las otras corporaciones quedan fuera
del DML; sus filas en las tablas comparadas no cambian.

Evidencia canónica de ejecución: `evidence/modelado-utrera-2026-09-27/execution-certificate.json`.
La preparación y ejecución SQL se certificaron sobre `2d088746`; #1015 no
altera el SQL, los datos, UUID ni los predicados de indexabilidad. Se repitieron
auditoría, suite y build sobre el main posterior con resultados verdes.
El manifiesto conserva la metadata del momento de preparación; el certificado,
ligado a sus hashes, es la autoridad sobre la ejecución posterior.

- SQL SHA256: `a9c629b3e822116821fbb6c6e629fe51da919cd16f2a44f1ef9f97607988f6a3`.
- Manifiesto SHA256: `cbd9df1abd9654fd19894f48e4300aa4d986b4833ea1efb827d5bacc007f82ae`.

## Auditor

Las pruebas Node no habían ejecutado el contrato SQL real: no detectaron la
precedencia JSON ni el coste del guard basado en to_jsonb. Los dos abortos
quedan documentados, corregidos y seguidos de nuevas ejecuciones completas.
La incertidumbre de autoría y las cuatro publicaciones diferidas son deuda
editorial legítima. No requieren relaciones inventadas, DDL ni nuevas
excepciones nominales de producto. Las correcciones generales ya están publicadas.

**Siguiente movimiento único:** nueva orden para STAGING UTRERA → preflight
global → dry-run del candidato staged → GO/NO-GO APPLY. No ejecutarlo aquí.
