# Manifiesto determinista · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** MANIFIESTO DETERMINISTA · pre-SQL  
**Base:** `1997d61f7fe0f38b3df3398dba85c01a90572e39`  
**Namespace:** `c0160033-*`  
**Contrato:** **465 DML = 463 upsert + 2 update + 0 delete**  
**REUSE:** **32/32 presentes**  
**Staging:** 0 · **Apply:** 0  
**Manifest MD5:** `12ab6ebe15a4f38459133352b5c4a88d`

## 1. Colisiones finales

Revalidación directa contra producción:

- 64 IDs de entidad: **0 colisiones**;
- 64 slugs de entidad: **0 colisiones**;
- 6 IDs de lugares: **0 colisiones**;
- 6 slugs de lugares: **0 colisiones**;
- 2 IDs de municipios soporte: **0 colisiones**;
- 2 slugs de municipios soporte: **0 colisiones**;
- 401 IDs auxiliares restantes: **0 colisiones**;
- namespace `c0160033-*`: **0 filas**;
- REUSE: **32/32 presentes**.

La revisión de Fuentes del row-by-row permanece:
- 31 URLs planificadas;
- 1 URL REUSE · Congregación Nazarena;
- 30 Fuentes nuevas;
- 0 colisiones no reconciliadas.

## 2. Regla determinista de IDs

Las operaciones nuevas usan:

`c0160033-GGGG-4000-8000-NNNNNNNNNNNN`

Los futuros `bulk_import_items.id` se calcularán como:

`md5('HC016-LEBRIJA-20260919-' || position)::uuid`

El manifiesto abstracto se serializa por:

`position|table|operation|target_id`

y produce:

`12ab6ebe15a4f38459133352b5c4a88d`

## 3. Posiciones 1–465

| Posiciones | Tabla | Operación | Filas | IDs |
|---:|---|---|---:|---|
| 1–2 | municipalities | upsert | 2 | `0201–0202` |
| 3–32 | sources | upsert | 30 | `0101–0130` |
| 33–38 | places | upsert | 6 | `0211–0216` |
| 39–102 | entities | upsert | 64 | `0301–0723` por familia |
| 103–113 | brotherhoods | upsert | 11 | entity IDs `0301–0311` |
| 114–117 | bands | upsert | 4 | entity IDs `0401–0404` |
| 118–120 | agents | upsert | 3 | entity IDs `0501–0503` |
| 121–123 | agent_names | upsert | 3 | `0811–0813` |
| 124–126 | agent_disciplines | upsert | 3 | `0821–0823` |
| 127–149 | images | upsert | 23 | entity IDs `0601–0623` |
| 150–172 | brotherhood_images | upsert | 23 | `0831–0853` |
| 173–178 | image_authorships | upsert | 6 | `0861–0866` |
| 179–201 | steps | upsert | 23 | entity IDs `0701–0723` |
| 202–224 | brotherhood_steps | upsert | 23 | `0871–0893` |
| 225–247 | image_steps | upsert | 23 | `0901–0923` |
| 248–249 | entity_relations | upsert | 2 | `0931–0932` |
| 250–265 | outing_series | upsert | 16 | `0941–0956` |
| 266–278 | outings | upsert | 13 | `0961–0973` |
| 279–301 | outing_entities | upsert | 23 | `0981–1003` |
| 302–312 | outing_music_positions | upsert | 11 | `1011–1021` |
| 313–323 | outing_music_assignments | upsert | 11 | `1031–1041` |
| 324–334 | music_accompaniment_periods | upsert | 11 | `1051–1061` |
| 335–339 | cults | upsert | 5 | `1071–1075` |
| 340–342 | cult_occurrences | upsert | 3 | `1081–1083` |
| 343–463 | source_links | upsert | 121 | `2001–2121` |
| 464 | brotherhoods | update | 1 | Castillo existente |
| 465 | outings | update | 1 | patronal Castillo 12/09/2026 |

## 4. Municipios soporte

| ID | Municipio | slug | Estado |
|---|---|---|---|
| `c0160033-0201-4000-8000-000000000001` | Puente Genil | `puente-genil` | INSERT |
| `c0160033-0202-4000-8000-000000000002` | El Cuervo de Sevilla | `el-cuervo-de-sevilla` | INSERT |

REUSE:
- Lebrija · `07281b21-d892-4e5d-aa63-24ec0e9bf4d2`;
- San Fernando · `eb9b5d34-f926-4cde-ab3f-06ad57687016`.

## 5. Lugares nuevos

| ID | Lugar | slug |
|---|---|---|
| `c0160033-0211-4000-8000-000000000001` | Parroquia de Santa María de Jesús | `parroquia-santa-maria-jesus-lebrija` |
| `c0160033-0212-4000-8000-000000000002` | Capilla de la Aurora | `capilla-aurora-lebrija` |
| `c0160033-0213-4000-8000-000000000003` | Iglesia de Belén | `iglesia-belen-lebrija` |
| `c0160033-0214-4000-8000-000000000004` | Iglesia de San Francisco | `iglesia-san-francisco-lebrija` |
| `c0160033-0215-4000-8000-000000000005` | Capilla de la Vera-Cruz | `capilla-vera-cruz-lebrija` |
| `c0160033-0216-4000-8000-000000000006` | Ermita de San Benito | `ermita-san-benito-lebrija` |

## 6. Entidades nuevas · 64

| ID | Tipo | Nombre | slug |
|---|---|---|---|
| `c0160033-0301-4000-8000-000000000001` | Hermandad | Entrada Triunfal | `entrada-triunfal-lebrija` |
| `c0160033-0302-4000-8000-000000000002` | Hermandad | Oración en el Huerto | `oracion-huerto-lebrija` |
| `c0160033-0303-4000-8000-000000000003` | Hermandad | Humildad | `humildad-lebrija` |
| `c0160033-0304-4000-8000-000000000004` | Hermandad | Ecce-Homo | `ecce-homo-lebrija` |
| `c0160033-0305-4000-8000-000000000005` | Hermandad | Dolores | `dolores-lebrija` |
| `c0160033-0306-4000-8000-000000000006` | Hermandad | Vera-Cruz | `vera-cruz-lebrija` |
| `c0160033-0307-4000-8000-000000000007` | Hermandad | Santo Sepulcro | `santo-sepulcro-lebrija` |
| `c0160033-0308-4000-8000-000000000008` | Hermandad | Soledad | `soledad-lebrija` |
| `c0160033-0309-4000-8000-000000000009` | Hermandad | Rocío | `rocio-lebrija` |
| `c0160033-0310-4000-8000-000000000010` | Hermandad | San Benito | `san-benito-lebrija` |
| `c0160033-0311-4000-8000-000000000011` | Hermandad | Sacramental | `sacramental-lebrija` |
| `c0160033-0401-4000-8000-000000000001` | Banda | AM Afligidos de Puente Genil | `agrupacion-musical-afligidos-puente-genil` |
| `c0160033-0402-4000-8000-000000000002` | Banda | BM Maestro Agripino Lozano de San Fernando | `banda-musica-maestro-agripino-lozano-san-fernando` |
| `c0160033-0403-4000-8000-000000000003` | Banda | BM Ntra. Sra. del Rosario de El Cuervo | `banda-musica-rosario-el-cuervo` |
| `c0160033-0404-4000-8000-000000000004` | Banda | Banda Amor y Sacrificio de Lebrija | `banda-amor-sacrificio-lebrija` |
| `c0160033-0501-4000-8000-000000000001` | Agente | Juan Herrera Cala | `juan-herrera-cala` |
| `c0160033-0502-4000-8000-000000000002` | Agente | Juan Antonio González García «Ventura» | `juan-antonio-gonzalez-garcia-ventura` |
| `c0160033-0503-4000-8000-000000000003` | Agente | Diego Roldán y Serrallonga | `diego-roldan-serrallonga` |
| `c0160033-0601-4000-8000-000000000001` | Imagen | Jesús en su Entrada Triunfal | `jesus-entrada-triunfal-lebrija` |
| `c0160033-0602-4000-8000-000000000002` | Imagen | Nuestra Señora de la Estrella | `nuestra-senora-estrella-lebrija` |
| `c0160033-0603-4000-8000-000000000003` | Imagen | San Juan Evangelista · Borriquita | `san-juan-evangelista-borriquita-lebrija` |
| `c0160033-0604-4000-8000-000000000004` | Imagen | Jesús Orando en el Huerto | `jesus-orando-huerto-lebrija` |
| `c0160033-0605-4000-8000-000000000005` | Imagen | Santísimo Cristo de la Buena Muerte | `cristo-buena-muerte-lebrija` |
| `c0160033-0606-4000-8000-000000000006` | Imagen | Santa María de Jesús | `santa-maria-jesus-lebrija` |
| `c0160033-0607-4000-8000-000000000007` | Imagen | Jesús de la Humildad | `jesus-humildad-lebrija` |
| `c0160033-0608-4000-8000-000000000008` | Imagen | Nuestra Señora de la Victoria | `nuestra-senora-victoria-lebrija` |
| `c0160033-0609-4000-8000-000000000009` | Imagen | Nuestra Señora de la Aurora | `nuestra-senora-aurora-lebrija` |
| `c0160033-0610-4000-8000-000000000010` | Imagen | San Juan Evangelista · Humildad | `san-juan-evangelista-humildad-lebrija` |
| `c0160033-0611-4000-8000-000000000011` | Imagen | Jesús del Ecce-Homo | `jesus-ecce-homo-lebrija` |
| `c0160033-0612-4000-8000-000000000012` | Imagen | Nuestra Señora del Mayor Dolor | `nuestra-senora-mayor-dolor-lebrija` |
| `c0160033-0613-4000-8000-000000000013` | Imagen | Jesús Atado a la Columna | `jesus-atado-columna-lebrija` |
| `c0160033-0614-4000-8000-000000000014` | Imagen | San Pedro Apóstol · Castillo | `san-pedro-apostol-castillo-lebrija` |
| `c0160033-0615-4000-8000-000000000015` | Imagen | Jesús Nazareno · Dolores | `jesus-nazareno-dolores-lebrija` |
| `c0160033-0616-4000-8000-000000000016` | Imagen | María Santísima de los Dolores | `maria-santisima-dolores-lebrija` |
| `c0160033-0617-4000-8000-000000000017` | Imagen | Santa Mujer Verónica | `santa-mujer-veronica-lebrija` |
| `c0160033-0618-4000-8000-000000000018` | Imagen | San Juan Evangelista · Dolores | `san-juan-evangelista-dolores-lebrija` |
| `c0160033-0619-4000-8000-000000000019` | Imagen | Santísimo Cristo de la Vera-Cruz | `cristo-vera-cruz-lebrija` |
| `c0160033-0620-4000-8000-000000000020` | Imagen | Nuestra Señora de Consolación | `nuestra-senora-consolacion-lebrija` |
| `c0160033-0621-4000-8000-000000000021` | Imagen | Cristo de las Cinco Llagas / Yacente | `cristo-cinco-llagas-yacente-lebrija` |
| `c0160033-0622-4000-8000-000000000022` | Imagen | Nuestra Señora de la Soledad | `nuestra-senora-soledad-lebrija` |
| `c0160033-0623-4000-8000-000000000023` | Imagen | San Benito Abad | `san-benito-abad-lebrija` |
| `c0160033-0701-4000-8000-000000000001` | Paso | Misterio de la Entrada Triunfal | `paso-misterio-entrada-triunfal-lebrija` |
| `c0160033-0702-4000-8000-000000000002` | Paso | Palio de la Estrella | `paso-palio-estrella-lebrija` |
| `c0160033-0703-4000-8000-000000000003` | Paso | Paso de Jesús Orando en el Huerto | `paso-jesus-orando-huerto-lebrija` |
| `c0160033-0704-4000-8000-000000000004` | Paso | Paso del Cristo de la Buena Muerte | `paso-cristo-buena-muerte-lebrija` |
| `c0160033-0705-4000-8000-000000000005` | Paso | Paso de Santa María de Jesús | `paso-santa-maria-jesus-lebrija` |
| `c0160033-0706-4000-8000-000000000006` | Paso | Misterio de la Humildad | `paso-misterio-humildad-lebrija` |
| `c0160033-0707-4000-8000-000000000007` | Paso | Palio de la Victoria | `paso-palio-victoria-lebrija` |
| `c0160033-0708-4000-8000-000000000008` | Paso | Paso de Gloria de la Aurora | `paso-gloria-aurora-lebrija` |
| `c0160033-0709-4000-8000-000000000009` | Paso | Paso del Ecce-Homo | `paso-ecce-homo-lebrija` |
| `c0160033-0710-4000-8000-000000000010` | Paso | Palio del Mayor Dolor | `paso-palio-mayor-dolor-lebrija` |
| `c0160033-0711-4000-8000-000000000011` | Paso | Misterio de Jesús Atado a la Columna | `paso-misterio-atado-columna-lebrija` |
| `c0160033-0712-4000-8000-000000000012` | Paso | Palio de la Virgen del Castillo | `paso-palio-virgen-castillo-lebrija` |
| `c0160033-0713-4000-8000-000000000013` | Paso | Paso de San Pedro Apóstol | `paso-san-pedro-apostol-lebrija` |
| `c0160033-0714-4000-8000-000000000014` | Paso | Paso de Jesús Nazareno | `paso-jesus-nazareno-lebrija` |
| `c0160033-0715-4000-8000-000000000015` | Paso | Palio de María Santísima de los Dolores | `paso-palio-dolores-lebrija` |
| `c0160033-0716-4000-8000-000000000016` | Paso | Paso de la Santa Mujer Verónica | `paso-santa-mujer-veronica-lebrija` |
| `c0160033-0717-4000-8000-000000000017` | Paso | Paso de San Juan Evangelista · Dolores | `paso-san-juan-evangelista-dolores-lebrija` |
| `c0160033-0718-4000-8000-000000000018` | Paso | Paso de S.D.M. · Corpus de San Francisco | `paso-sdm-corpus-san-francisco-lebrija` |
| `c0160033-0719-4000-8000-000000000019` | Paso | Paso del Cristo de la Vera-Cruz | `paso-cristo-vera-cruz-lebrija` |
| `c0160033-0720-4000-8000-000000000020` | Paso | Paso de Nuestra Señora de Consolación | `paso-nuestra-senora-consolacion-lebrija` |
| `c0160033-0721-4000-8000-000000000021` | Paso | Urna del Santo Sepulcro | `urna-santo-sepulcro-lebrija` |
| `c0160033-0722-4000-8000-000000000022` | Paso | Paso de Nuestra Señora de la Soledad | `paso-nuestra-senora-soledad-lebrija` |
| `c0160033-0723-4000-8000-000000000023` | Paso | Paso de San Benito Abad | `paso-san-benito-abad-lebrija` |

## 7. IDs auxiliares

- sources: `c0160033-0101-4000-8000-000000000001` → `c0160033-0130-4000-8000-000000000030`;
- agent_names: `c0160033-0811-4000-8000-000000000001` → `c0160033-0813-4000-8000-000000000003`;
- agent_disciplines: `c0160033-0821-4000-8000-000000000001` → `c0160033-0823-4000-8000-000000000003`;
- brotherhood_images: `c0160033-0831-4000-8000-000000000001` → `c0160033-0853-4000-8000-000000000023`;
- image_authorships: `c0160033-0861-4000-8000-000000000001` → `c0160033-0866-4000-8000-000000000006`;
- brotherhood_steps: `c0160033-0871-4000-8000-000000000001` → `c0160033-0893-4000-8000-000000000023`;
- image_steps: `c0160033-0901-4000-8000-000000000001` → `c0160033-0923-4000-8000-000000000023`;
- entity_relations: `c0160033-0931-4000-8000-000000000001` → `c0160033-0932-4000-8000-000000000002`;
- outing_series: `c0160033-0941-4000-8000-000000000001` → `c0160033-0956-4000-8000-000000000016`;
- outings: `c0160033-0961-4000-8000-000000000001` → `c0160033-0973-4000-8000-000000000013`;
- outing_entities: `c0160033-0981-4000-8000-000000000001` → `c0160033-1003-4000-8000-000000000023`;
- outing_music_positions: `c0160033-1011-4000-8000-000000000001` → `c0160033-1021-4000-8000-000000000011`;
- outing_music_assignments: `c0160033-1031-4000-8000-000000000001` → `c0160033-1041-4000-8000-000000000011`;
- music_accompaniment_periods: `c0160033-1051-4000-8000-000000000001` → `c0160033-1061-4000-8000-000000000011`;
- cults: `c0160033-1071-4000-8000-000000000001` → `c0160033-1075-4000-8000-000000000005`;
- cult_occurrences: `c0160033-1081-4000-8000-000000000001` → `c0160033-1083-4000-8000-000000000003`;
- source_links: `c0160033-2001-4000-8000-000000000001` → `c0160033-2121-4000-8000-000000000121`.

## 8. UPDATE congelados

### 464 · Hermandad del Castillo

Target:
`b88c97c3-d979-414f-bdc4-145d4f337703`

Solo:
- denominación institucional;
- jornada/carácter penitencial + patronal;
- notas editoriales estrictamente necesarias.

No cambia UUID ni slug.

### 465 · Salida patronal del Castillo

Target:
`8f15dc9a-697a-4639-8243-17a8d683c420`

Solo:
- asignación a la nueva `outing_series` patronal.

No cambia fecha, estado `held`, slug, horarios, imagen ni música existente.

## 9. REUSE · 32/32

1. Lebrija.
2. San Fernando.
3. Hermandad del Castillo.
4. Virgen del Castillo.
5. Banda Virgen del Castillo.
6. Parroquia de la Oliva.
7. Ermita del Castillo.
8. Convento de la Purísima Concepción.
9. Santísimo Sacramento global.
10. Juan Manuel Miñarro.
11. Juan Abascal.
12. Pedro Roldán.
13. Salida patronal Castillo.
14. relación Castillo–Virgen.
15. relación salida–Virgen.
16. posición musical patronal.
17. asignación musical patronal.
18–25. ocho Fuentes existentes de Castillo.
26. Fuente Congregación Nazarena.
27–29. tres Cultos existentes de Castillo.
30–32. tres occurrences 2026 existentes de Castillo.

Resultado en producción: **32 presentes · 0 ausentes**.

## 10. Fuente y trazabilidad

El orden de las 30 nuevas Fuentes queda ligado al registro del row-by-row. El payload deberá respetar exactamente ese orden y no reinsertar:

- las 8 Fuentes existentes del universo Castillo;
- la Fuente Congregación Nazarena ya existente.

`source_links` queda congelado en **121 filas**, posiciones 343–463.

## 11. Puerta

**MANIFIESTO 465/465 CERRADO.**

Sigue prohibido:
- staging;
- Apply;
- DDL;
- RLS;
- segundo municipio.

Siguiente movimiento autorizado:

**generar el payload SQL exacto desde este manifiesto → ejecutar en una única transacción → QA interno → ROLLBACK → certificar 0 residuos.**
