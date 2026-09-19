# Plan row-by-row · Estepa · quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Estado:** preparado para futuro staging, pero **NO STAGING / NO APPLY**  
**Esquema:** sin cambios  
**RLS:** sin cambios

## 1. Recuento operativo congelado

El plan adopta el mismo criterio de conteo usado en los macrolotes municipales ya ejecutados: cada fila DML o relación constituye una operación efectiva; REUSE se informa aparte y no aumenta el total DML.

### Total previsto

| Clase | Total |
|---|---:|
| INSERT / UPSERT | **490** |
| UPDATE | **4** |
| DELETE controlado | **1** |
| **TOTAL DML** | **495** |
| REUSE canónico | **21** |

La cifra 495 sustituye la estimación preliminar ≈395 de la fase de selección. La diferencia procede de haber resuelto Bandas, cuatro Pasos de Gloria, 8 Cultos/ediciones, 14 periodos musicales y la trazabilidad row-by-row.

## 2. Manifest por rangos

| Posiciones futuras | Tabla / clase | Filas |
|---|---|---:|
| 1–2 | `municipalities` | 2 |
| 3–25 | `sources` | 23 |
| 26–29 | `places` | 4 |
| 30–96 | `entities` | 67 |
| 97–108 | `brotherhoods` | 12 |
| 109–115 | `bands` | 7 |
| 116 | `band_names` | 1 |
| 117–119 | `agents` | 3 |
| 120–122 | `agent_names` | 3 |
| 123–125 | `agent_disciplines` | 3 |
| 126–152 | `images` | 27 |
| 153–179 | `brotherhood_images` | 27 |
| 180–187 | `image_authorships` | 8 |
| 188–204 | `steps` | 17 |
| 205–221 | `brotherhood_steps` | 17 |
| 222–240 | `image_steps` | 19 |
| 241–253 | `outing_series` | 13 |
| 254–266 | `outings` | 13 |
| 267–284 | `outing_entities` | 18 |
| 285–300 | `outing_music_positions` | 16 |
| 301–316 | `outing_music_assignments` | 16 |
| 317–330 | `music_accompaniment_periods` | 14 |
| 331–338 | `cults` | 8 |
| 339–346 | `cult_occurrences` | 8 |
| 347 | `events` | 1 |
| 348–490 | `source_links` | 143 |
| 491–494 | UPDATE existentes Nazareno | 4 |
| 495 | DELETE Fuente duplicada | 1 |

## 3. Municipios soporte · 2 INSERT

### 1. La Línea de la Concepción
- provincia: Cádiz;
- uso: Banda de Cornetas y Tambores Santa Bárbara;
- no abre frente municipal editorial.

### 2. Campillos
- provincia: Málaga;
- uso: Agrupación Musical Vera Cruz;
- no abre frente municipal editorial.

### REUSE
- Estepa.
- Utrera.

## 4. Fuentes · 23 INSERT + 4 REUSE

### INSERT previstos

1. Programa de Mano Semana Santa Estepa 2026.
2. Ayuntamiento · cierre de la Semana Santa 2026.
3. Ayuntamiento · La Borriquita.
4. Ayuntamiento · Las Angustias.
5. Ayuntamiento · San Pedro.
6. Ayuntamiento · Los Estudiantes.
7. Ayuntamiento · Dulce Nombre.
8. Ayuntamiento · El Calvario.
9. Ayuntamiento · Paz y Caridad.
10. Ayuntamiento · Santo Entierro.
11. Ayuntamiento · Monumentos de Estepa.
12. Ayuntamiento · presentación Glorias 2026.
13. Ayuntamiento · procesión Santa Ana 2026.
14. Ayuntamiento · Cartel de la Asunción 2026.
15. El Pespunte · Asunción de Estepa · 15/08/2026.
16. El Pespunte · Remedios de Estepa · 17/05/2026.
17. Cadena SER Andalucía Centro · Carmen de Estepa · 12/09/2026.
18. Ayuntamiento · conferencia del 400.º aniversario · 25/09/2026.
19. Web oficial · Hermandad de Paz y Caridad.
20. Web oficial 2026 · Hermandad de los Estudiantes.
21. Fuente institucional/current · BCT Santa Bárbara de La Línea.
22. Web oficial · BCT Santa Vera+Cruz de Utrera.
23. Fuente oficial · AM Vera Cruz de Campillos.

### REUSE
- Ayuntamiento de Estepa · Jesús Nazareno · `7e442086-80e3-467f-a100-bd616773ae6a`.
- Congregación Nazarena · Hermandades · `a6b01a96-2c4c-4125-bf2a-13c22ca0a7a2`.
- Arte Sacro · Jesús Nazareno · `98b510d7-f486-4063-b24f-10c4260658d1`.
- Devociones de Estepa · 400 aniversario · `72ac1537-8940-4455-8e8d-c17169baa0aa`.

## 5. Lugares · 4 INSERT + 1 REUSE

### INSERT
1. Ermita de Santa Ana.
2. Iglesia de Nuestra Señora de la Asunción.
3. Iglesia de Nuestra Señora de los Remedios.
4. Iglesia de Nuestra Señora del Carmen.

### REUSE
- Iglesia de San Sebastián · `0c9ab35d-171f-4814-af76-e669ace8c295`.

## 6. Hermandades · 12 INSERT + 1 REUSE

### INSERT
1. Borriquita de Estepa.
2. Hermandad de las Angustias.
3. Hermandad de San Pedro.
4. Hermandad de los Estudiantes.
5. Hermandad del Dulce Nombre.
6. Hermandad del Calvario.
7. Hermandad de Paz y Caridad.
8. Santo Entierro de Estepa.
9. Hermandad de Nuestra Señora de la Asunción.
10. Hermandad de Nuestra Señora de los Remedios Coronada.
11. Hermandad de Nuestra Señora del Carmen.
12. Hermandad de Santa Ana.

Cada alta implica:
- 1 `entities`;
- 1 `brotherhoods`.

### REUSE
- Jesús Nazareno de Estepa · `25d7900f-5518-4e22-84a3-b5b3b44e9ab1`.

La Inmaculada permanece dentro de Paz y Caridad: **0 Hermandad adicional**.

## 7. Imágenes · 27 INSERT + 1 REUSE

### Borriquita
1. Nuestro Padre Jesús en su Entrada Triunfal en Jerusalén.
2. María Santísima de la Victoria.

### Angustias
3. Nuestra Señora de las Angustias.
4. San José Obrero.

San Pío X se conserva en la identidad jurídica/devocional de la Hermandad, pero no genera `images` sin evidencia física inequívoca.

### San Pedro
5. San Pedro Apóstol.
6. Santo Cristo de las Penas.
7. María Santísima de los Dolores.

### Estudiantes
8. Santísimo Cristo del Amor.
9. Nuestro Padre Jesús Cautivo y Rescatado.
10. María Santísima del Valle.

### Dulce Nombre
11. Dulce Nombre de Jesús.
12. Santísimo Cristo de la Humildad y Paciencia.
13. Nuestra Señora María Santísima de la Paz.

### Calvario
14. Santísimo Cristo de la Salud.
15. Nuestra Señora de la Amargura.
16. San Juan Evangelista.

### Paz y Caridad
17. Santísimo Cristo Amarrado a la Columna.
18. María Santísima de la Esperanza Coronada.
19. Pura y Limpia Concepción de María.

### Nazareno
20. María Santísima de los Dolores.

### Santo Entierro
21. Cristo Yacente del Santo Entierro.
22. Santísimo Cristo de la Buena Muerte.
23. Nuestra Señora de la Soledad.

### Glorias
24. Nuestra Señora de la Asunción.
25. Nuestra Señora de los Remedios Coronada.
26. Nuestra Señora del Carmen.
27. Santa Ana.

### REUSE
- Nuestro Padre Jesús Nazareno · `c4c9cda1-7e3a-402c-8f18-f81e0a318666`.

Cada Imagen nueva implica:
- 1 `entities`;
- 1 `images`;
- 1 `brotherhood_images`.

## 8. Autorías · 8 INSERT + 1 REUSE

1. Señor de la Entrada Triunfal → Francisco Berlanga de Ávila.
2. María Santísima de la Victoria → Francisco Berlanga de Ávila.
3. Nuestra Señora de las Angustias → Diego Márquez · atribución.
4. San Pedro Apóstol → Pedro de Mena · atribución.
5. Santísimo Cristo de la Humildad y Paciencia → Diego Márquez.
6. Nuestra Señora María Santísima de la Paz → Francisco Buiza Fernández.
7. Santísimo Cristo de la Salud → Manuel Escamilla Cabezas.
8. Santísimo Cristo Amarrado a la Columna → Andrés de Carvajal y Campos.

### Nuevos agentes
- Diego Márquez.
- Pedro de Mena.
- Andrés de Carvajal y Campos.

Cada uno:
- `entities`;
- `agents`;
- `agent_names`;
- `agent_disciplines`.

### REUSE
- Francisco Berlanga de Ávila.
- Francisco Buiza Fernández.
- Manuel Escamilla Cabezas.
- Luis Salvador Carmona.

La autoría existente del Nazareno atribuida a Luis Salvador Carmona no se duplica.

## 9. Pasos · 17 INSERT + 1 UPDATE/REUSE

### Nuevos penitenciales · 13
1. Misterio de la Entrada Triunfal.
2. Andas de Nuestra Señora de las Angustias.
3. Paso de San Pedro Apóstol.
4. Paso de palio de María Santísima de los Dolores · San Pedro.
5. Paso del Santísimo Cristo del Amor.
6. Paso del Dulce Nombre de Jesús.
7. Paso de palio de Nuestra Señora de la Paz.
8. Paso del Calvario.
9. Paso del Cristo Amarrado a la Columna.
10. Paso de palio de la Esperanza Coronada.
11. Paso de palio de María Santísima de los Dolores · Nazareno.
12. Urna del Santo Entierro.
13. Paso de Nuestra Señora de la Soledad.

### Nuevos Glorias · 4
14. Paso de Nuestra Señora de la Asunción.
15. Paso de Nuestra Señora de los Remedios Coronada.
16. Paso de Nuestra Señora del Carmen.
17. Paso de Santa Ana.

Cada nuevo Paso implica:
- 1 `entities`;
- 1 `steps`;
- 1 `brotherhood_steps`.

### Paso existente
`c221206c-3a80-4aa7-9074-aea30d5f1343` · Paso de Nuestro Padre Jesús Nazareno.

No INSERT.

## 10. Relaciones Imagen–Paso · 19 INSERT + 1 UPDATE/REUSE

Nuevas relaciones `image_steps`:
- Borriquita: 1.
- Angustias: 1.
- San Pedro: 2.
- Estudiantes: 1.
- Dulce Nombre: 2.
- Calvario: 3.
- Paz y Caridad: 2.
- Nazareno: 1 nueva para la Virgen de los Dolores.
- Santo Entierro: 2.
- Glorias: 4.

Total nuevo: **19**.

REUSE/UPDATE:
- Nazareno ↔ Paso del Nazareno · `7fb4c76b-1859-4b4c-83d6-d42c23071e4a`.

No se relacionan con un Paso las Imágenes titulares que no procesionan en 2026.

## 11. Bandas · 7 INSERT + 1 REUSE

### Locales
1. Banda de Música de Estepa.
2. Agrupación Musical Paz y Caridad de Estepa.
3. Agrupación Musical Dulce Nombre de Jesús de Estepa.
4. Capilla Musical Nuestra Señora de la Victoria de Estepa.

### Externas
5. Banda de Cornetas y Tambores Santa Bárbara de La Línea de la Concepción.
6. Banda de Cornetas y Tambores Santa Vera+Cruz de Utrera.
7. Agrupación Musical Vera Cruz de Campillos.

Cada alta:
- 1 `entities`;
- 1 `bands`.

Además:
- 1 `band_names` para alias **BAME**.

REUSE:
- Banda de Música Villa de Osuna · `75fc797d-f287-4813-9e52-8f5c5ddf56ad`.

## 12. Series y Salidas · 13 + 13 INSERT

Se crean 13 `outing_series` y 13 ediciones `outings`.

### Semana Santa 2026 · `held`
1. Borriquita · 29/03/2026.
2. Angustias · 30/03/2026.
3. San Pedro · 31/03/2026.
4. Estudiantes · madrugada 01/04/2026.
5. Dulce Nombre · 01/04/2026.
6. Calvario · madrugada 02/04/2026.
7. Paz y Caridad · 02/04/2026.
8. Jesús Nazareno · 03/04/2026.
9. Santo Entierro · 04/04/2026.

### Glorias 2026
10. Remedios · 17/05/2026 · `held`.
11. Santa Ana · 26/07/2026 · `held`.
12. Asunción · 15/08/2026 · `announced`.
13. Carmen · 12/09/2026 · `announced`.

### REUSE
- extraordinaria Nazareno 02/11/2026.
- extraordinaria Nazareno 15/11/2026.

## 13. Relaciones Salida–Paso · 18 INSERT

`outing_entities`:
- 14 relaciones Paso–Salida para las nueve estaciones penitenciales;
- 4 relaciones Paso–Salida para las Glorias.

No se inventa una relación de Paso para el Cristo de la Buena Muerte.

## 14. Música · 16 + 16 + 14 INSERT

### `outing_music_positions` · 16
### `outing_music_assignments` · 16

1. Borriquita · Santa Bárbara.
2. Angustias · tambores destemplados · texto.
3. San Pedro · Vera+Cruz Utrera.
4. San Pedro · BAME.
5. Dulce Nombre · AM Dulce Nombre.
6. Dulce Nombre · BAME.
7. Calvario · Capilla Ntra. Sra. Victoria.
8. Paz y Caridad · AM Paz y Caridad.
9. Paz y Caridad · BAME.
10. Nazareno · AM Vera Cruz Campillos.
11. Nazareno · Villa de Osuna.
12. Santo Entierro · tambores fúnebres · texto.
13. Santo Entierro · BAME.
14. Remedios · BAME.
15. Asunción · BAME.
16. Carmen · BAME.

Estudiantes: **0 posición musical**, porque la estación está documentada en silencio.

Santa Ana: **0 asignación musical** hasta Fuente directa suficiente.

### `music_accompaniment_periods` · 14

Un periodo por cada asignación con entidad Banda.

- Santa Bárbara: 2026 histórico, no vigente después.
- los demás: documentados como vigentes en 2026; no se proyecta continuidad automática a 2027 salvo contrato explícito.

## 15. Cultos · 8 + 8 INSERT

### `cults`
1. Angustias · Función Principal de Instituto.
2. Angustias · Misa de Hermandad.
3. San Pedro · Misa de Hermandad.
4. Estudiantes · Misa de Hermandad.
5. Dulce Nombre · Misa de Hermandad.
6. Calvario · Misa de Hermandad.
7. Remedios · Función Principal.
8. Asunción · Función Principal de Instituto.

### `cult_occurrences`
Una edición 2026 por cada Culto.

Estados:
- Asunción: `held`.
- restantes: `announced` hasta evidencia posterior específica.

No se crea ningún Quinario, Triduo o Novena por recurrencia.

## 16. Acontecimiento · 1 INSERT

`events`:
- **La vocación cofrade como servicio a la Iglesia**
- 25/09/2026 · 21:00
- Casa de Hermandad
- relación con Jesús Nazareno
- `event_status = announced`

No existe evento equivalente en producción.

La fila requiere además una nueva `entities` ya contabilizada en las 67 entidades.

## 17. Trazabilidad · 143 `source_links`

Distribución prevista:

- identidades y perfiles de entidades nuevas;
- autorías estructuradas;
- 13 series;
- Salidas, con doble evidencia cuando el estado `held` necesita programa + retrospectiva;
- 16 asignaciones musicales;
- 8 Cultos y 8 ediciones;
- acontecimiento de septiembre.

Regla:
- una Fuente puede reutilizarse en muchas relaciones;
- no se duplica una URL para aumentar el número de evidencias;
- las 143 filas son enlaces, no 143 Fuentes.

## 18. UPDATE · posiciones 491–494

Sobre el Paso existente del Nazareno:

491. `entities` · estado `review → published`.
492. `steps` · completar descripción segura.
493. `brotherhood_steps` · estado `review → published`.
494. `image_steps` · estado `review → published`.

No hay UPDATE masivo sobre Jesús Nazareno.

## 19. DELETE · posición 495

Eliminar únicamente:
`dc375c1f-9318-4de9-ae1f-d1f10a7d050f`

Precondiciones obligatorias:
1. URL idéntica a la Fuente canónica.
2. 0 `source_links`.
3. 0 FK dinámicas restantes.
4. la Fuente `72ac1537-8940-4455-8e8d-c17169baa0aa` permanece.

Si cualquiera falla, DELETE cancelado.

## 20. REUSE · 21

1. Municipio Estepa.
2. Municipio Utrera.
3. Hermandad Jesús Nazareno.
4. Imagen Jesús Nazareno.
5. Paso Jesús Nazareno.
6. Relación Hermandad–Imagen Nazareno.
7. Relación Hermandad–Paso Nazareno.
8. Relación Imagen–Paso Nazareno.
9. Autoría Nazareno → Luis Salvador Carmona.
10. Iglesia de San Sebastián.
11. Banda Villa de Osuna.
12. Francisco Berlanga de Ávila.
13. Francisco Buiza Fernández.
14. Luis Salvador Carmona.
15. Manuel Escamilla Cabezas.
16. Fuente Ayuntamiento · Jesús Nazareno.
17. Fuente Congregación Nazarena.
18. Fuente Arte Sacro · Nazareno.
19. Fuente canónica Devociones de Estepa.
20. Salida extraordinaria Nazareno · 02/11/2026.
21. Salida extraordinaria Nazareno · 15/11/2026.

## 21. Slugs

La lista prevista de slugs de:
- 12 Hermandades;
- 27 Imágenes;
- 17 Pasos;
- 7 Bandas;

fue contrastada contra `public.entities`.

Resultado: **0 colisiones exactas**.

Los IDs aún no se generan en esta fase. El siguiente constructor deberá asignar IDs deterministas y mantenerlos estables entre staging, SQL archivado y QA.

## 22. Puerta antes de staging

Antes de crear cualquier `bulk_import`:

- refrescar main;
- 0 PR concurrentes sobre datos Estepa;
- revalidar los 495 movimientos contra producción;
- revisar que ninguna entidad se haya creado entre tanto;
- validar columnas y CHECK reales;
- validar todas las FK;
- recalcular Fuente canónica duplicada;
- congelar IDs deterministas;
- generar manifest;
- ejecutar preflight completo en transacción + ROLLBACK.

Hasta entonces:

**0 STAGING · 0 APPLY**.

