# Manifiesto determinista · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** MANIFIESTO DETERMINISTA · IDs congelados / sin staging  
**Base:** `5fbd8c72a4fb8d18368d0188052683263820c0da`  
**Namespace:** `c0160033-*`  
**Bulk import reservado:** `c0160033-0000-4000-8000-000000000001`  
**TOTAL DML:** **473** = **471 upsert + 2 update + 0 delete**  
**REUSE:** **32**  
**Staging:** 0 · **Apply:** 0

> El UUID del import queda reservado documentalmente. No existe fila en `bulk_imports` ni `bulk_import_items`.

## 1. Puerta de colisiones antes de congelar

Revalidado contra producción antes de reservar IDs:

- namespace `c0160033-*`: **0 filas**;
- 64 slugs nuevos de `entities`: **0 colisiones**;
- 6 slugs nuevos de `places`: **0 colisiones**;
- 2 slugs de municipios soporte: **0 colisiones**;
- 3 nombres de agentes nuevos: **0 colisiones exactas**;
- 32 URLs planificadas: 1 REUSE exacto + **31 nuevas**;
- Castle y sus relaciones existentes: presentes;
- bulk imports `c0160033-*`: **0**.

## 2. Regla de IDs

Familia:

`c0160033-GGGG-4000-8000-NNNNNNNNNNNN`

Los futuros `bulk_import_items.id` se calcularán como:

`md5('HC016-LEBRIJA-20260919-' || position)::uuid`

No se materializa ningún ID de este documento hasta una fase de staging expresamente autorizada.

## 3. Municipios soporte · 2

1. `c0160033-0201-4000-8000-000000000001` · Puente Genil · `puente-genil` · Córdoba.
2. `c0160033-0202-4000-8000-000000000002` · El Cuervo de Sevilla · `el-cuervo-de-sevilla` · Sevilla.

REUSE:
- Lebrija · `07281b21-d892-4e5d-aa63-24ec0e9bf4d2`.
- San Fernando · `eb9b5d34-f926-4cde-ab3f-06ad57687016`.

## 4. Fuentes nuevas · 31

| # | ID | Fuente / URL |
|---:|---|---|
| 1 | `c0160033-0101-4000-8000-000000000001` | Consejo · Penitencia · https://www.hermandadesdelebrija.org/index.php/87-penitencia |
| 2 | `c0160033-0102-4000-8000-000000000002` | Consejo · itinerarios I · https://www.hermandadesdelebrija.org/index.php/86-consejo?start=25 |
| 3 | `c0160033-0103-4000-8000-000000000003` | Consejo · itinerarios II · https://www.hermandadesdelebrija.org/index.php/86-consejo?start=20 |
| 4 | `c0160033-0104-4000-8000-000000000004` | Consejo · Glorias/Sacramental · https://www.hermandadesdelebrija.org/index.php/86-consejo?start=45 |
| 5 | `c0160033-0105-4000-8000-000000000005` | Parroquia de la Oliva · Hermandades · https://santamariadelaoliva.org/hermandades/ |
| 6 | `c0160033-0106-4000-8000-000000000006` | Ayuntamiento · balance Semana Santa 2026 · https://lebrija.es/es/actualidad/noticias/Concluye-una-Semana-Santa-marcada-por-las-buenas-temperaturas-y-con-una-destacada-participacion-ciudadana/ |
| 7 | `c0160033-0107-4000-8000-000000000007` | Borriquita · historia · https://www.hermandadborriquitalebrija.org/historia/ |
| 8 | `c0160033-0108-4000-8000-000000000008` | Ayuntamiento · Oración · https://www.lebrija.es/es/temas/empresas/noticias-tema/Martes-Santo-en-Lebrija/ |
| 9 | `c0160033-0109-4000-8000-000000000009` | Humildad · Miércoles Santo 2026 · https://humildaddelebrija.es/datos-de-interes-miercoles-santo-de-2026/ |
| 10 | `c0160033-0110-4000-8000-000000000010` | Humildad · Aurora 2026 · https://humildaddelebrija.es/convocatoria-de-actos-y-cultos-aurora-2026/ |
| 11 | `c0160033-0111-4000-8000-000000000011` | Humildad · El Cuervo · https://humildaddelebrija.es/firma-del-contrato-banda-municipal-de-el-cuervo/ |
| 12 | `c0160033-0112-4000-8000-000000000012` | Humildad · Agripino · https://humildaddelebrija.es/renovacion-banda-de-musica-agripino-lozano-san-fernando/ |
| 13 | `c0160033-0113-4000-8000-000000000013` | Dolores · web oficial · https://hermandaddelosdolores.com/ |
| 14 | `c0160033-0114-4000-8000-000000000014` | Ayuntamiento · Corpus de San Francisco · https://e.lebrija.es/agenda/i/1ac642f40137e6c58297699a41da53b0/celebracion-del-corpus-de-san-francisco |
| 15 | `c0160033-0115-4000-8000-000000000015` | El Pespunte · Agripino en Lebrija · https://www.elpespunte.es/articulo/cofrade/banda-musica-agripino-lozano-mantiene-presencia-lebrija-seguira-victoria-dolores/20260714160041141287.html |
| 16 | `c0160033-0116-4000-8000-000000000016` | Ayuntamiento · San Benito 2026 · https://e.lebrija.es/amp/noticias/c/0/i/97299034/san-benito-abad-patron-de-lebrija-procesionara-esta-noche-por-las-calles-de-la-ciudad |
| 17 | `c0160033-0117-4000-8000-000000000017` | Ayuntamiento · Rocío 2026 · https://lebrija.es/es/actualidad/noticias/La-Hermandad-del-Rocio-de-Lebrija-inicia-su-camino-hacia-El-Rocio/ |
| 18 | `c0160033-0118-4000-8000-000000000018` | Ayuntamiento · Corpus 2026 posterior · https://www.lebrija.es/es/temas/deportes/noticias-tema/Las-tradicionales-alfombras-vuelven-a-engalanar-las-calles-de-Lebrija-con-motivo-del-Corpus-Christi/ |
| 19 | `c0160033-0119-4000-8000-000000000019` | Consejo · Vera-Cruz · https://www.hermandadesdelebrija.org/index.php/noticiassc/104-penitencia/veracruz?start=10 |
| 20 | `c0160033-0120-4000-8000-000000000020` | Consejo · Santo Sepulcro · https://www.hermandadesdelebrija.org/index.php/105-penitencia/santosepulcro?start=10 |
| 21 | `c0160033-0121-4000-8000-000000000021` | Consejo · Soledad · https://www.hermandadesdelebrija.org/index.php/106-penitencia/soledad?start=5 |
| 22 | `c0160033-0122-4000-8000-000000000022` | Consejo · Rocío · https://www.hermandadesdelebrija.org/index.php/107-gloria/rocio |
| 23 | `c0160033-0123-4000-8000-000000000023` | Consejo · San Benito · https://www.hermandadesdelebrija.org/index.php/fotossb/110-gloria/sanbenito |
| 24 | `c0160033-0124-4000-8000-000000000024` | Consejo · Sacramental · https://www.hermandadesdelebrija.org/index.php/111-sacramentales/sacramental?start=5 |
| 25 | `c0160033-0125-4000-8000-000000000025` | Ayuntamiento · Amor y Sacrificio · https://www.lebrija.es/es/actualidad/noticias/III-Certamen-de-Bandas-Senor-de-la-Salud/ |
| 26 | `c0160033-0126-4000-8000-000000000026` | Radio Lebrija · Trabajadera 2026 · https://www.ivoox.com/podcast-trabajadera-radio-lebrija_sq_f1266468_1.html |
| 27 | `c0160033-0127-4000-8000-000000000027` | Radio Lebrija · Santa María de Jesús 2026 · https://www.ivoox.com/momentos-trabajadera-2026-santa-maria-jesus-audios-mp3_rf_171403456_1.html |
| 28 | `c0160033-0128-4000-8000-000000000028` | Radio Lebrija · Atado a la Columna 2026 · https://www.ivoox.com/momentos-trabajadera-2026-atado-a-columna-audios-mp3_rf_171491969_1.html |
| 29 | `c0160033-0129-4000-8000-000000000029` | Radio Lebrija · Dolores 2026 · https://www.ivoox.com/momentos-trabajadera-2026-virgen-dolores-audios-mp3_rf_171499543_1.html |
| 30 | `c0160033-0130-4000-8000-000000000030` | Castillo · web oficial · https://hermandaddelcastillo.org/ |
| 31 | `c0160033-0131-4000-8000-000000000031` | El Pespunte · San Pedro 2026 · https://www.elpespunte.es/articulo/cofrade/procesion-san-pedro-lebrija-2026-horario-recorrido-banda/20260629123343139582.html |

REUSE por URL exacta:
- Congregación Nazarena · Hermandades · `a6b01a96-2c4c-4125-bf2a-13c22ca0a7a2`.

## 5. Lugares nuevos · 6

1. `c0160033-0211-4000-8000-000000000001` · Parroquia de Santa María de Jesús · `parroquia-santa-maria-jesus-lebrija`.
2. `c0160033-0212-4000-8000-000000000002` · Capilla de la Aurora · `capilla-aurora-lebrija`.
3. `c0160033-0213-4000-8000-000000000003` · Iglesia de Belén · `iglesia-belen-lebrija`.
4. `c0160033-0214-4000-8000-000000000004` · Iglesia de San Francisco · `iglesia-san-francisco-lebrija`.
5. `c0160033-0215-4000-8000-000000000005` · Capilla de la Vera-Cruz · `capilla-vera-cruz-lebrija`.
6. `c0160033-0216-4000-8000-000000000006` · Ermita de San Benito · `ermita-san-benito-lebrija`.

## 6. Hermandades nuevas · 11

| # | entity_id | Nombre | slug |
|---:|---|---|---|
| 1 | `c0160033-0301-4000-8000-000000000001` | Entrada Triunfal de Lebrija | `entrada-triunfal-lebrija` |
| 2 | `c0160033-0302-4000-8000-000000000002` | Oración en el Huerto de Lebrija | `oracion-huerto-lebrija` |
| 3 | `c0160033-0303-4000-8000-000000000003` | Humildad de Lebrija | `humildad-lebrija` |
| 4 | `c0160033-0304-4000-8000-000000000004` | Ecce-Homo de Lebrija | `ecce-homo-lebrija` |
| 5 | `c0160033-0305-4000-8000-000000000005` | Dolores de Lebrija | `dolores-lebrija` |
| 6 | `c0160033-0306-4000-8000-000000000006` | Vera-Cruz de Lebrija | `vera-cruz-lebrija` |
| 7 | `c0160033-0307-4000-8000-000000000007` | Santo Sepulcro de Lebrija | `santo-sepulcro-lebrija` |
| 8 | `c0160033-0308-4000-8000-000000000008` | Soledad de Lebrija | `soledad-lebrija` |
| 9 | `c0160033-0309-4000-8000-000000000009` | Rocío de Lebrija | `rocio-lebrija` |
| 10 | `c0160033-0310-4000-8000-000000000010` | San Benito de Lebrija | `san-benito-lebrija` |
| 11 | `c0160033-0311-4000-8000-000000000011` | Sacramental de Lebrija | `sacramental-lebrija` |

REUSE/UPDATE:
- Hermandad del Castillo · `b88c97c3-d979-414f-bdc4-145d4f337703`.

## 7. Bandas nuevas · 4

1. `c0160033-0401-4000-8000-000000000001` · Agrupación Musical Nuestro Padre Jesús de los Afligidos de Puente Genil · `agrupacion-musical-afligidos-puente-genil`.
2. `c0160033-0402-4000-8000-000000000002` · Banda de Música Maestro Agripino Lozano de San Fernando · `banda-musica-agripino-lozano-san-fernando`.
3. `c0160033-0403-4000-8000-000000000003` · Banda de Música Nuestra Señora del Rosario de El Cuervo · `banda-musica-rosario-el-cuervo`.
4. `c0160033-0404-4000-8000-000000000004` · Banda Amor y Sacrificio de Lebrija · `banda-amor-sacrificio-lebrija`.

REUSE:
- Banda de Música Virgen del Castillo de Lebrija · `c34e984b-bb36-4424-a0a5-85b22ab71f72`.

## 8. Agentes nuevos · 3

1. `c0160033-0501-4000-8000-000000000001` · Juan Herrera Cala · `juan-herrera-cala`.
2. `c0160033-0502-4000-8000-000000000002` · Juan Antonio González García «Ventura» · `juan-antonio-gonzalez-garcia-ventura`.
3. `c0160033-0503-4000-8000-000000000003` · Diego Roldán y Serrallonga · `diego-roldan-serrallonga`.

Auxiliares:
- agent_names: `c0160033-0811-...` → `c0160033-0813-...`.
- agent_disciplines: `c0160033-0821-...` → `c0160033-0823-...`.

REUSE:
- Juan Manuel Miñarro López · `67ccc278-fa71-4aaf-87a7-d42093a6ad7e`.
- Juan Abascal Fuentes · `25abc551-3611-4c9f-8176-ee1b569ef8d6`.
- Pedro Roldán · `262d4bc3-0c79-4344-b40c-9a2f689aafb5`.

## 9. Imágenes nuevas · 23

| # | entity_id | Nombre | slug |
|---:|---|---|---|
| 1 | `c0160033-0601-4000-8000-000000000001` | Nuestro Padre Jesús en su Entrada Triunfal | `jesus-entrada-triunfal-lebrija` |
| 2 | `c0160033-0602-4000-8000-000000000002` | Nuestra Señora de la Estrella | `virgen-estrella-lebrija` |
| 3 | `c0160033-0603-4000-8000-000000000003` | San Juan Evangelista · Borriquita | `san-juan-evangelista-borriquita-lebrija` |
| 4 | `c0160033-0604-4000-8000-000000000004` | Nuestro Padre Jesús Orando en el Huerto | `jesus-orando-huerto-lebrija` |
| 5 | `c0160033-0605-4000-8000-000000000005` | Santísimo Cristo de la Buena Muerte | `cristo-buena-muerte-lebrija` |
| 6 | `c0160033-0606-4000-8000-000000000006` | Santa María de Jesús | `santa-maria-jesus-lebrija` |
| 7 | `c0160033-0607-4000-8000-000000000007` | Nuestro Padre Jesús de la Humildad | `jesus-humildad-lebrija` |
| 8 | `c0160033-0608-4000-8000-000000000008` | Nuestra Señora de la Victoria | `virgen-victoria-lebrija` |
| 9 | `c0160033-0609-4000-8000-000000000009` | Nuestra Señora de la Aurora | `virgen-aurora-lebrija` |
| 10 | `c0160033-0610-4000-8000-000000000010` | San Juan Evangelista · Humildad | `san-juan-evangelista-humildad-lebrija` |
| 11 | `c0160033-0611-4000-8000-000000000011` | Nuestro Padre Jesús del Ecce-Homo | `jesus-ecce-homo-lebrija` |
| 12 | `c0160033-0612-4000-8000-000000000012` | Nuestra Señora del Mayor Dolor | `virgen-mayor-dolor-lebrija` |
| 13 | `c0160033-0613-4000-8000-000000000013` | Nuestro Padre Jesús Atado a la Columna | `jesus-atado-columna-lebrija` |
| 14 | `c0160033-0614-4000-8000-000000000014` | San Pedro Apóstol · Castillo | `san-pedro-apostol-castillo-lebrija` |
| 15 | `c0160033-0615-4000-8000-000000000015` | Nuestro Padre Jesús Nazareno · Dolores | `jesus-nazareno-dolores-lebrija` |
| 16 | `c0160033-0616-4000-8000-000000000016` | María Santísima de los Dolores | `maria-santisima-dolores-lebrija` |
| 17 | `c0160033-0617-4000-8000-000000000017` | Santa Mujer Verónica | `santa-mujer-veronica-lebrija` |
| 18 | `c0160033-0618-4000-8000-000000000018` | San Juan Evangelista · Dolores | `san-juan-evangelista-dolores-lebrija` |
| 19 | `c0160033-0619-4000-8000-000000000019` | Santísimo Cristo de la Vera-Cruz | `cristo-vera-cruz-lebrija` |
| 20 | `c0160033-0620-4000-8000-000000000020` | Nuestra Señora de Consolación | `virgen-consolacion-lebrija` |
| 21 | `c0160033-0621-4000-8000-000000000021` | Santísimo Cristo de las Cinco Llagas | `cristo-cinco-llagas-lebrija` |
| 22 | `c0160033-0622-4000-8000-000000000022` | Nuestra Señora de la Soledad | `virgen-soledad-lebrija` |
| 23 | `c0160033-0623-4000-8000-000000000023` | San Benito Abad | `san-benito-abad-lebrija` |

REUSE:
- Nuestra Señora del Castillo Coronada · `06e486fe-c229-4686-a0ec-fca6650b281b`.

Relaciones:
- brotherhood_images: `c0160033-0831-...` → `c0160033-0853-...`.
- image_authorships: `c0160033-0861-...` → `c0160033-0866-...`.

## 10. Pasos nuevos · 23

| # | entity_id | Paso | slug |
|---:|---|---|---|
| 1 | `c0160033-0701-4000-8000-000000000001` | Misterio de la Entrada Triunfal | `paso-misterio-entrada-triunfal-lebrija` |
| 2 | `c0160033-0702-4000-8000-000000000002` | Palio de Nuestra Señora de la Estrella | `paso-palio-estrella-lebrija` |
| 3 | `c0160033-0703-4000-8000-000000000003` | Paso de Jesús Orando en el Huerto | `paso-oracion-huerto-lebrija` |
| 4 | `c0160033-0704-4000-8000-000000000004` | Paso del Cristo de la Buena Muerte | `paso-cristo-buena-muerte-lebrija` |
| 5 | `c0160033-0705-4000-8000-000000000005` | Paso de Santa María de Jesús | `paso-santa-maria-jesus-lebrija` |
| 6 | `c0160033-0706-4000-8000-000000000006` | Misterio de la Humildad | `paso-misterio-humildad-lebrija` |
| 7 | `c0160033-0707-4000-8000-000000000007` | Palio de Nuestra Señora de la Victoria | `paso-palio-victoria-lebrija` |
| 8 | `c0160033-0708-4000-8000-000000000008` | Paso de Gloria de Nuestra Señora de la Aurora | `paso-aurora-lebrija` |
| 9 | `c0160033-0709-4000-8000-000000000009` | Paso del Ecce-Homo | `paso-ecce-homo-lebrija` |
| 10 | `c0160033-0710-4000-8000-000000000010` | Palio de Nuestra Señora del Mayor Dolor | `paso-palio-mayor-dolor-lebrija` |
| 11 | `c0160033-0711-4000-8000-000000000011` | Misterio de Jesús Atado a la Columna | `paso-misterio-atado-columna-lebrija` |
| 12 | `c0160033-0712-4000-8000-000000000012` | Palio de Nuestra Señora del Castillo | `paso-palio-castillo-lebrija` |
| 13 | `c0160033-0713-4000-8000-000000000013` | Paso de San Pedro Apóstol | `paso-san-pedro-castillo-lebrija` |
| 14 | `c0160033-0714-4000-8000-000000000014` | Paso de Nuestro Padre Jesús Nazareno | `paso-jesus-nazareno-dolores-lebrija` |
| 15 | `c0160033-0715-4000-8000-000000000015` | Palio de María Santísima de los Dolores | `paso-palio-dolores-lebrija` |
| 16 | `c0160033-0716-4000-8000-000000000016` | Paso de la Santa Mujer Verónica | `paso-veronica-lebrija` |
| 17 | `c0160033-0717-4000-8000-000000000017` | Paso de San Juan Evangelista · Dolores | `paso-san-juan-dolores-lebrija` |
| 18 | `c0160033-0718-4000-8000-000000000018` | Paso de S.D.M. · Corpus de San Francisco | `paso-sdm-corpus-san-francisco-lebrija` |
| 19 | `c0160033-0719-4000-8000-000000000019` | Paso del Santísimo Cristo de la Vera-Cruz | `paso-cristo-vera-cruz-lebrija` |
| 20 | `c0160033-0720-4000-8000-000000000020` | Paso de Nuestra Señora de Consolación | `paso-consolacion-lebrija` |
| 21 | `c0160033-0721-4000-8000-000000000021` | Urna del Santo Sepulcro | `urna-santo-sepulcro-lebrija` |
| 22 | `c0160033-0722-4000-8000-000000000022` | Paso de Nuestra Señora de la Soledad | `paso-soledad-lebrija` |
| 23 | `c0160033-0723-4000-8000-000000000023` | Paso de San Benito Abad | `paso-san-benito-lebrija` |

Relaciones:
- brotherhood_steps: `c0160033-0871-...` → `c0160033-0893-...`.
- image_steps: `c0160033-0901-...` → `c0160033-0923-...`.

## 11. Relaciones sacramentales

- `c0160033-0931-4000-8000-000000000001` · Dolores → Santísimo Sacramento · `has_titular`.
- `c0160033-0932-4000-8000-000000000002` · Sacramental → Santísimo Sacramento · `has_titular`.

REUSE Santísimo Sacramento:
`d335bf75-18ce-42db-a10b-cb8942a7b05a`.

## 12. Salidas y series

### outing_series · 16
`c0160033-0941-4000-8000-000000000001` → `c0160033-0956-4000-8000-000000000016`

Orden:
1–9 Penitencia; 10 Rocío; 11 Corpus San Francisco; 12 San Benito; 13 Aurora; 14 patronal Castillo; 15 San Pedro; 16 Corpus Sacramental.

### outings nuevas · 14
`c0160033-0961-4000-8000-000000000001` → `c0160033-0974-4000-8000-000000000014`

La nueva nº 14 es:
- `c0160033-0974-4000-8000-000000000014` · San Pedro Apóstol · 29/06/2026 · `announced` · serie `c0160033-0955-4000-8000-000000000015`.

REUSE/UPDATE:
- patronal Castillo 12/09/2026 · `8f15dc9a-697a-4639-8243-17a8d683c420`.

### outing_entities · 24
`c0160033-0981-4000-8000-000000000001` → `c0160033-1004-4000-8000-000000000024`.

La nº 24 enlaza la salida de San Pedro con `c0160033-0614-4000-8000-000000000014`.

## 13. Música

- positions: `c0160033-1011-4000-8000-000000000001` → `c0160033-1022-4000-8000-000000000012`.
- assignments: `c0160033-1031-4000-8000-000000000001` → `c0160033-1042-4000-8000-000000000012`.
- periods: `c0160033-1051-4000-8000-000000000001` → `c0160033-1062-4000-8000-000000000012`.

La relación nº 12 es San Pedro Apóstol → Banda Amor y Sacrificio de Lebrija, documentada solo para 2026.

## 14. Cultos

- cults: `c0160033-1071-4000-8000-000000000001` → `c0160033-1075-4000-8000-000000000005`.
- occurrences: `c0160033-1081-4000-8000-000000000001` → `c0160033-1083-4000-8000-000000000003`.

## 15. source_links · 123

`c0160033-2001-4000-8000-000000000001` → `c0160033-2123-4000-8000-000000000123`

Subrangos:
- 2001–2064 · 64 · entidad primaria;
- 2065 · 1 · UPDATE institucional de Castillo;
- 2066–2071 · 6 · autorías;
- 2072–2087 · 16 · outing_series;
- 2088–2101 · 14 · outings;
- 2102–2113 · 12 · música;
- 2114–2118 · 5 · cults;
- 2119–2121 · 3 · occurrences;
- 2122–2123 · 2 · relaciones sacramentales.

**Nota de estabilidad:** los IDs físicos de source_links ya congelados 2001–2121 no se renumeran por esta clasificación conceptual. Los dos IDs nuevos de San Pedro se reservan al final:
- `c0160033-2122-4000-8000-000000000122` · Fuente San Pedro → outing San Pedro;
- `c0160033-2123-4000-8000-000000000123` · Fuente San Pedro → asignación Amor y Sacrificio.

La tabla de posiciones del import, no los UUID lógicos, es la autoridad sobre el orden de ejecución.

## 16. Operaciones 472–473

### 472 · UPDATE brotherhoods · Castillo
`entity_id = b88c97c3-d979-414f-bdc4-145d4f337703`

Solo:
- denominación institucional moderna;
- carácter penitencial + patronal;
- notas editoriales seguras.

### 473 · UPDATE outings · Castillo patronal
`id = 8f15dc9a-697a-4639-8243-17a8d683c420`

Solo:
- asignar `outing_series_id` a la serie patronal nueva `c0160033-0954-4000-8000-000000000014`.

No modificar fecha, `held`, slug, horarios, imagen ni música.

## 17. Posiciones exactas del futuro import

| Posiciones | Tabla | Operación | Filas |
|---:|---|---|---:|
| 1–2 | municipalities | upsert | 2 |
| 3–33 | sources | upsert | 31 |
| 34–39 | places | upsert | 6 |
| 40–103 | entities | upsert | 64 |
| 104–114 | brotherhoods | upsert | 11 |
| 115–118 | bands | upsert | 4 |
| 119–121 | agents | upsert | 3 |
| 122–124 | agent_names | upsert | 3 |
| 125–127 | agent_disciplines | upsert | 3 |
| 128–150 | images | upsert | 23 |
| 151–173 | brotherhood_images | upsert | 23 |
| 174–179 | image_authorships | upsert | 6 |
| 180–202 | steps | upsert | 23 |
| 203–225 | brotherhood_steps | upsert | 23 |
| 226–248 | image_steps | upsert | 23 |
| 249–250 | entity_relations | upsert | 2 |
| 251–266 | outing_series | upsert | 16 |
| 267–280 | outings | upsert | 14 |
| 281–304 | outing_entities | upsert | 24 |
| 305–316 | outing_music_positions | upsert | 12 |
| 317–328 | outing_music_assignments | upsert | 12 |
| 329–340 | music_accompaniment_periods | upsert | 12 |
| 341–345 | cults | upsert | 5 |
| 346–348 | cult_occurrences | upsert | 3 |
| 349–471 | source_links | upsert | 123 |
| 472 | brotherhoods | update | 1 |
| 473 | outings | update | 1 |

## 18. REUSE congelados · 32

1. Lebrija.
2. San Fernando.
3. Hermandad del Castillo.
4. Nuestra Señora del Castillo Coronada.
5. Banda Virgen del Castillo.
6. Parroquia de la Oliva.
7. Ermita del Castillo.
8. Convento de la Purísima.
9. Santísimo Sacramento.
10. Juan Manuel Miñarro.
11. Juan Abascal.
12. Pedro Roldán.
13. Salida patronal Castillo 12/09.
14. relación Castillo–Virgen Castillo.
15. relación salida patronal–Virgen Castillo.
16. posición musical de la salida patronal.
17. asignación Banda Virgen Castillo de la salida patronal.
18–25. ocho Fuentes ya existentes del universo Castillo.
26. Congregación Nazarena · Hermandades.
27–29. tres Cultos existentes del Castillo.
30–32. tres occurrences 2026 existentes del Castillo.

## 19. Puerta

El manifiesto congela IDs, slugs, rangos y posiciones.

### IDs añadidos por la corrección San Pedro
- Fuente: `c0160033-0131-4000-8000-000000000031`.
- Outing: `c0160033-0974-4000-8000-000000000014`.
- Outing entity: `c0160033-1004-4000-8000-000000000024`.
- Music position: `c0160033-1022-4000-8000-000000000012`.
- Music assignment: `c0160033-1042-4000-8000-000000000012`.
- Music period: `c0160033-1062-4000-8000-000000000012`.
- Source links: `c0160033-2122-4000-8000-000000000122` y `c0160033-2123-4000-8000-000000000123`.

Los UUID anteriores del manifiesto 465 se mantienen sin renumeración.

**No crea staging. No crea bulk import. No ejecuta Apply.**

Siguiente puerta:
**construir el SQL exacto de las 473 DML → comprobar contrato BEGIN/ROLLBACK → ejecutar payload completo en producción con ROLLBACK → verificar 0 residuos**.
