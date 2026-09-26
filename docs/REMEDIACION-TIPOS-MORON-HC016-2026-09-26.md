# Morón de la Frontera · remediación post-Apply · HC-016

**Fecha:** 26/09/2026. **Resultado: NO CERRADO.**
El correctivo mínimo de tipos está aplicado y certificado en datos. El cierre integral no se emite porque el QA público/SEO conserva las incidencias reproducibles descritas abajo.

## Plataforma verificada
- Base `main` y HEAD de producto: `9566caacde892d1a8d15c2abe862dbe4abdb1858`.
- Vercel: `dpl_5K7jcfLRJ7SgECC8WSLd1Mwpgq7n`, READY, producción sobre ese SHA; aliases `hilocofrade.es` y `www.hilocofrade.es` presentes.
- Runtime del deployment vigente: sin logs error/fatal en las ventanas consultadas; las solicitudes sitemap 20:22–20:23 UTC devolvieron 200.
- Supabase `kcevwkucqzcyrqaimyhl`: ACTIVE_HEALTHY, PostgreSQL 17.6.1.155, 17 migraciones.
- PR abierta al corte: #1000, HC-ANALYTICS, independiente y sin tocar.
- Esta entrega solo añade evidencia y reconcilia documentación viva. No modifica código de producto ni fuerza un deployment.

## Alcance y contrato
Municipio canónico: `c0160037-0201-4000-8000-000000000001`. Exactamente 10 filas de `public.brotherhoods`, todas con entidad `published`.
Columna: PostgreSQL `text[]` (`_text`), NOT NULL, DEFAULT `'{}'::text[]`; sin CHECK de valores ni triggers de usuario en la tabla.
El Panel normaliza `Penitencia`, `Sacramental`, `Gloria` y `Agrupación Parroquial`; los tres valores usados coinciden con los datos publicados (ejemplos: La Cena, El Museo, Santa Cruz de Sevilla).
El directorio lee el array como `tipos`; la indexabilidad exige tipo no vacío, identidad, localidad, resumen, relación y Fuente.

## Fotografía de las diez filas

Todas: municipio **Morón de la Frontera**, estado **published**, tipos previos **[]**.

| ID | Slug / Hermandad | Tipos posteriores |
|---|---|---|
| c0160037-0301-4000-8000-000000000001 | soberano-moron-de-la-frontera · El Soberano | Penitencia |
| c0160037-0302-4000-8000-000000000002 | borriquita-moron-de-la-frontera · La Borriquita | Penitencia |
| c0160037-0303-4000-8000-000000000003 | cautivo-moron-de-la-frontera · El Cautivo | Penitencia |
| c0160037-0304-4000-8000-000000000004 | calvario-moron-de-la-frontera · El Calvario | Penitencia |
| c0160037-0305-4000-8000-000000000005 | buena-muerte-moron-de-la-frontera · La Buena Muerte | Penitencia |
| c0160037-0306-4000-8000-000000000006 | loreto-moron-de-la-frontera · Loreto | Penitencia + Sacramental |
| c0160037-0307-4000-8000-000000000007 | santa-cruz-moron-de-la-frontera · Santa Cruz | Penitencia + Gloria |
| c0160037-0308-4000-8000-000000000008 | jesus-nazareno-moron-de-la-frontera · Jesús Nazareno | Penitencia |
| c0160037-0309-4000-8000-000000000009 | santo-entierro-moron-de-la-frontera · Santo Entierro | Penitencia |
| c0160037-0310-4000-8000-000000000010 | soledad-moron-de-la-frontera · La Soledad | Penitencia |

## Dry-run, rollback y Apply
- Lote principal `c0160037-0000-4000-8000-000000000001`: completed, **504/504**, 0 fallidas; 504 items con estado applied. No se reejecutó.
- Snapshot previo a las 19:11:56 UTC: 10/10 arrays vacíos, filas completas y entidades capturadas.
- Payload: 10 UPDATE explícitos por UUID, SET exclusivo de brotherhood_types; añade solo valores ausentes, conserva los previos y su orden. No DDL/RLS/migraciones ni timestamps manuales.
- El primer intento de simulación abortó en el primer UPDATE por ambigüedad de `n` en ORDER BY, con 0 persistencia. Se calificó `wanted.n` y se repitió todo el dry-run.
- Dry-run definitivo: `MORON_TYPES_DRY_RUN_OK_ROLLED_BACK`. Los asserts comprueban alcance exacto, identidad/municipio, 10 resultados, tipos esperados, ausencia de pérdidas, duplicados, NULL y cambios en otras filas/columnas. Sin COMMIT.
- Consulta independiente posterior: snapshot de las diez filas idéntico; hash de todas las Hermandades idéntico; entidades y lote principal idénticos. **Residuos: 0**.
- Apply: mismo cuerpo SQL definitivo; `MORON_TYPES_APPLY_OK_COMMITTED`.
- Post-Apply independiente: **10 filas cambiadas**, 10/10 Penitencia, Loreto Sacramental, Santa Cruz Gloria; 0 arrays vacíos, 0 tipos inesperados, 0 cambios en otras columnas o Hermandades.
- Entidades completas sin cambios: MD5 `9acbadc65d471df429d4424f5e6acee9`.
- Hermandades ajenas sin cambios: MD5 `4bcf2be90e2936b11112cc3fe7aeebef`.
- Lote principal, metadata e items conservados. El FAIL de metadata del control original se mantiene como evidencia histórica: no se autorizaron escrituras adicionales a tipos.
- No se tocó HC-AUTO-03, ni se abrieron municipios.

SHA-256 del cuerpo común: `3ed24b3fd1dea3aec597f9fcbb85341b00620b0afcec7052b0062d878a9d1470`.
Dry-run: `edd0e219a3f9b4b02bfe0ec25b9ed923b3ff3ece8bc94da4a0563484e568a54b`.
Apply: `6b10e7416594e24a099c8c50308e4767f5dc881078922a62dd65bd889957d326`.

## QA web y SEO
- 10/10 fichas HTTP 200, canonical exacto propio, robots index/follow, título y breadcrumb, municipio, titulares, Pasos, Salidas, acompañamientos y Fuentes visibles.
- Relaciones consultadas: 20 titulares, 18 Pasos, 10 Salidas, 19 posiciones musicales y una Fuente directa por Hermandad; sin edición de la deuda aceptada.
- Hub municipal: **404 antes → 200 después**, canonical propio e index/follow, contador 10 Hermandades y las 10 en los datos del hub. El diseño existente muestra seis tarjetas y enlace al directorio de las diez; no es exclusión por tipos.
- Directorio municipal: **10/10 enlaces**, Penitencia en las diez; Gloria y Sacramental correctos.
- Directorio general: Morón con 10, enlaces entrantes a las diez fichas.
- Navegador: filtro “Morón de la Frontera” → 10 corporaciones; búsqueda “Loreto” dentro del filtro → 1 corporación; clic a Loreto → URL de ficha correcta.
- Tira del hilo: “Hermandades de Morón de la Frontera” → 10 resultados canónicos; “Hermandades de Gloria de Morón de la Frontera” → Santa Cruz; “Sacramentales de Morón de la Frontera” → directorio sacramental con 1 ficha.
- **Fallo de buscador:** “Hermandades sacramentales de Morón de la Frontera” devuelve la marcha “Amén” de San Benito. El detector en `lib/tira-free-facts.js` no acepta ese adjetivo entre “hermandades” y “de” en el patrón nominal, y entra en otra resolución. Es código anterior al DML; no se modificó.
- **Sitemap no validado:** `/sitemaps/hermandades.xml` y `/sitemaps/agenda.xml` devolvieron 200, pero las respuestas repetidas de 20:22–20:23 UTC carecen de las fichas y hub de Morón (263/233 URLs totales). Se observa caché de familia y de ruta de 3600 s; la caché es una explicación compatible, no una reparación demostrada. No se fuerza deployment ni se amplía el alcance.
- El navegador sufrió un timeout inicial; después se recuperó y completó el filtro, la búsqueda y navegación. No se atribuye ese timeout a la web.

## Auditor · observación independiente del resultado transaccional
1. **Causa raíz demostrada:** las filas 107–116 de bulk_import_items no contienen la clave brotherhood_types; el INSERT del blob original también omite la columna y el ON CONFLICT no la incorpora. El DEFAULT vacío se aplicó correctamente.
2. **Recurrencia:** sí. `TABLE_CONTRACTS.brotherhoods.requiredOnInsert` exige entity_id, official_name y popular_name, pero no brotherhood_types. La base no tiene CHECK que impida el array vacío; la validación del Panel no protege un SQL directo.
3. **Preflight HC-016:** conviene exigir tipo no vacío y casing/valores canónicos para cada Hermandad del universo candidato, y comprobar su elegibilidad para directorio/hub/sitemap dentro del dry-run.
4. **Límite real:** 10 filas y una sola columna. Comparaciones de filas completas y hashes de filas ajenas/entidades lo verifican; no se modificó el lote principal.
5. **Otros cierres:** 0 arrays vacíos entre los registros vinculados por municipality_id a Gerena (3), Dos Hermanas (20), Alcalá de Guadaíra (14), Pilas (4), Cantillana (3), Coria (8), Lebrija (12), Osuna (12), Carmona (9) y Écija (16). Fuera de ellos quedan 1 registro en Marchena y 54 sin municipality_id; no se les asigna un municipio por coincidencia nominal ni se les considera cierres certificados.
6. **Corrección futura:** recomendable reforzar la validación sistémica en una orden posterior. No se implementa aquí, ni se corrigen los 55 registros ajenos.

## Evidencia y siguiente puerta
Snapshots, payloads y respuestas: [evidence/moron-types-2026-09-26](./evidence/moron-types-2026-09-26/).

**MORÓN DE LA FRONTERA · DÉCIMO MACROLOTE MUNICIPAL HC-016 · NO CERRADO.**

Única recomendación: resolver las dos puertas de QA pendientes (sitemap y consulta sacramental) antes de certificar Morón o recalcular el siguiente municipio.

