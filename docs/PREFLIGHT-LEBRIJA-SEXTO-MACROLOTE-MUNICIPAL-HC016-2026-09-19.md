# Preflight específico · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** PRE-LOTE RESUELTO  
**Base de trabajo:** `9bd786f9cb52f6eafb875dc8157c89da47fabfa5`  
**Municipio:** Lebrija · `07281b21-d892-4e5d-aa63-24ec0e9bf4d2`  
**Namespace candidato:** `c0160033-*` · libre, todavía no materializado  
**Resultado:** **PREFLIGHT LÓGICO VERDE · 464 DML PREVISTAS · 32 REUSE**  
**Staging:** 0 · **Apply:** 0 · **DDL:** 0 · **RLS:** 0

## 1. Estado de plataforma

- GitHub `main`: `9bd786f9cb52f6eafb875dc8157c89da47fabfa5`;
- #859 fusionada;
- PR abiertas antes de esta rama: **0**;
- Vercel producción: `dpl_BT63ZkKMKUgoKVnyyRYDve3TPTtP` · **READY** · mismo SHA que `main`;
- `hilocofrade.es`: alias productivo sin error;
- Supabase `Hilocofrade`: **ACTIVE_HEALTHY**;
- migraciones estructurales: **12/12**;
- `c0160033-*`: **0 filas** en grafo e importador;
- bulk imports `c0160033-*`: **0**.

No se ha creado staging ni fila de importación.

## 2. Universo corporativo cerrado

Se preservan **12 corporaciones canónicas**:

1. Entrada Triunfal.
2. Oración en el Huerto.
3. Humildad.
4. Ecce-Homo · Los Gitanos.
5. Castillo.
6. Dolores.
7. Vera-Cruz.
8. Santo Sepulcro.
9. Soledad.
10. Rocío.
11. San Benito.
12. Hermandad Sacramental.

Reglas de reconciliación:

- Aurora es titular gloriosa de **Humildad**, no Hermandad separada.
- Castillo penitencial y Castillo Gloria son la **misma Hermandad** ya publicada.
- Dolores, aunque sacramental en su título actual, no absorbe a la **Hermandad Sacramental histórica**.
- Santo Sepulcro y Soledad permanecen como corporaciones diferentes.

Acción:

- 11 Hermandades nuevas;
- Castillo: REUSE + UPDATE de identidad institucional.

## 3. Inventario físico exacto

### 3.1 Imágenes

Resultado: **24 imágenes canónicas · 23 nuevas + 1 REUSE**.

| Corporación | Imágenes físicas |
|---|---|
| Entrada Triunfal | Nuestro Padre Jesús en su Entrada Triunfal · Nuestra Señora de la Estrella · San Juan Evangelista |
| Oración | Nuestro Padre Jesús Orando en el Huerto · Santísimo Cristo de la Buena Muerte · Santa María de Jesús |
| Humildad | Nuestro Padre Jesús de la Humildad · Nuestra Señora de la Victoria · Nuestra Señora de la Aurora · San Juan Evangelista |
| Ecce-Homo | Nuestro Padre Jesús del Ecce-Homo · Nuestra Señora del Mayor Dolor |
| Castillo | Nuestro Padre Jesús Atado a la Columna · Nuestra Señora del Castillo Coronada · San Pedro Apóstol |
| Dolores | Nuestro Padre Jesús Nazareno · María Santísima de los Dolores · Santa Mujer Verónica · San Juan Evangelista |
| Vera-Cruz | Santísimo Cristo de la Vera-Cruz · Nuestra Señora de Consolación |
| Santo Sepulcro | Santísimo Cristo de las Cinco Llagas / Yacente |
| Soledad | Nuestra Señora de la Soledad |
| San Benito | San Benito Abad |
| Rocío | no se fuerza Simpecado al modelo `image` |
| Sacramental | reutiliza la advocación global Santísimo Sacramento; no se crea `image` |

REUSE: Nuestra Señora del Castillo Coronada · `06e486fe-c229-4686-a0ec-fca6650b281b`.

Corrección del inventario preliminar:
- San Juan Evangelista de la Borriquita sí es una imagen física titular e integrada en el misterio; entra como `image`, no como Paso independiente.
- Beato Ceferino Mártir forma parte de la denominación de Los Gitanos, pero no se crea como `image` sin evidencia de imagen procesional titular.

### 3.2 Pasos

Resultado: **23 Pasos nuevos**.

- Entrada Triunfal: 2.
- Oración: 3.
- Humildad: 3.
- Ecce-Homo: 2.
- Castillo: 3.
- Dolores: 5.
- Vera-Cruz: 2.
- Santo Sepulcro: 1.
- Soledad: 1.
- San Benito: 1.
- Rocío: 0.
- Sacramental: 0 en este lote.

Humildad:
- Paso de misterio de Humildad;
- palio de la Victoria;
- Paso de Gloria de la Aurora.
San Juan de Humildad queda como titular sin Paso actual.

Dolores:
- Nazareno;
- Dolores;
- Verónica;
- San Juan;
- Paso de S.D.M. del Corpus de San Francisco.

El Paso sacramental de Dolores no se convierte en una nueva `image`; el vínculo eucarístico se modela con la advocación global del Santísimo.

## 4. Lugares

### REUSE

- Parroquia de Nuestra Señora de la Oliva · `067dda49-ad58-4a45-9da8-da87491fa7b2`.
- Ermita de Nuestra Señora del Castillo · `4f08d608-a848-479a-9cae-c6dc1366a5dc`.
- Convento de la Purísima Concepción · `f4a9cd86-4ee2-4f9a-9d26-7bbaba286176`.

### Nuevos · 6

1. Parroquia de Santa María de Jesús.
2. Capilla de la Aurora.
3. Iglesia de Belén.
4. Iglesia de San Francisco.
5. Capilla de la Vera-Cruz.
6. Ermita de San Benito.

## 5. Bandas

### REUSE
- Banda de Música Virgen del Castillo de Lebrija · `c34e984b-bb36-4424-a0a5-85b22ab71f72`.

### Nuevas · 4
1. Agrupación Musical Nuestro Padre Jesús de los Afligidos de Puente Genil.
2. Banda de Música Maestro Agripino Lozano de San Fernando.
3. Banda de Música Nuestra Señora del Rosario de El Cuervo de Sevilla.
4. Banda Amor y Sacrificio de Lebrija.

Municipios soporte:
- San Fernando: REUSE · `eb9b5d34-f926-4cde-ab3f-06ad57687016`.
- Puente Genil: INSERT.
- El Cuervo de Sevilla: INSERT.

## 6. Autores

### REUSE
- Juan Manuel Miñarro López · `67ccc278-fa71-4aaf-87a7-d42093a6ad7e`.
- Juan Abascal Fuentes · `25abc551-3611-4c9f-8176-ee1b569ef8d6`.
- Pedro Roldán · `262d4bc3-0c79-4344-b40c-9a2f689aafb5`.

### Nuevos · 3
- Juan Herrera Cala.
- Juan Antonio González García «Ventura».
- Diego Roldán y Serrallonga.

Autorías estructuradas · 6:
1. Entrada Triunfal → Juan Manuel Miñarro.
2. Virgen de la Estrella → Juan Herrera Cala.
3. Jesús Orando en el Huerto → Juan Antonio González García «Ventura».
4. Jesús de la Humildad → Juan Abascal.
5. Jesús Nazareno → atribución al taller de Pedro Roldán.
6. Virgen de los Dolores → Diego Roldán y Serrallonga.

No se crea una relación de autoría cuando la evidencia es genérica, anónima o discutida.

## 7. Salidas 2026

### Nuevas · 13

| # | Salida | Fecha | Estado |
|---|---|---|---|
| 1 | Entrada Triunfal | 29/03/2026 | held |
| 2 | Oración en el Huerto | 31/03/2026 | held |
| 3 | Humildad | 01/04/2026 | held |
| 4 | Ecce-Homo | 01/04/2026 | held |
| 5 | Castillo · Jueves Santo | 02/04/2026 | held |
| 6 | Dolores · Madrugá | 03/04/2026 | held |
| 7 | Vera-Cruz | 03/04/2026 | held |
| 8 | Santo Sepulcro | 03/04/2026 | held |
| 9 | Soledad | 03/04/2026 | held |
| 10 | Rocío · salida de Lebrija | 19/05/2026 | held |
| 11 | Corpus de San Francisco · Dolores | 14/06/2026 | held |
| 12 | San Benito | 10/07/2026 | announced |
| 13 | Rosario de la Aurora | 15/08/2026 | announced |

Las nueve estaciones de penitencia se elevan a `held` porque el Ayuntamiento certificó retrospectivamente que todas se realizaron con normalidad.

Rocío se eleva a `held` por noticia municipal posterior del 20/05 sobre la salida del 19/05.

Corpus de San Francisco se eleva a `held` por convocatoria municipal más evidencia posterior musical.

San Benito y Aurora permanecen `announced`: existe convocatoria fiable, pero no se ha encontrado evidencia posterior suficiente para elevarlas.

### REUSE / actualización controlada

Salida patronal del Castillo · 12/09/2026 · `8f15dc9a-697a-4639-8243-17a8d683c420`:
- se preserva como `held`;
- no se duplica su imagen procesional;
- no se duplica su posición musical existente;
- únicamente se enlazará a una nueva `outing_series`.

### Series · 16

- 13 series para las nuevas Salidas;
- 1 serie patronal del Castillo, enlazada a la Salida ya existente;
- 1 serie anual de San Pedro Apóstol, sin occurrence 2026;
- 1 serie del Corpus Christi de la Sacramental, sin occurrence 2026 ligada a la Hermandad por falta de asociación directa contemporánea.

## 8. Música 2026

Solo se modelan relaciones con evidencia directa o retrospectiva suficiente.

Nuevas posiciones/asignaciones: **11 + 11**.

1. Humildad · misterio → Afligidos.
2. Victoria · palio → Agripino Lozano.
3. Aurora → Rosario de El Cuervo.
4. Santa María de Jesús → Banda Virgen del Castillo.
5. Mayor Dolor → Banda Virgen del Castillo.
6. Castillo · Atado a la Columna → Amor y Sacrificio.
7. Castillo · Virgen del Castillo → Banda Virgen del Castillo.
8. Dolores · Nazareno → Amor y Sacrificio.
9. Dolores · palio → Agripino Lozano.
10. Corpus de San Francisco → Rosario de El Cuervo.
11. Vera-Cruz · Consolación → Rosario de El Cuervo.

Huecos legítimos:
- Entrada Triunfal;
- los otros Pasos de Oración;
- Ecce-Homo;
- Cristo de la Vera-Cruz;
- Santo Sepulcro;
- Soledad;
- San Benito.

No se rellenan por tradición.

Periodos musicales: **11**. Cuando solo existe prueba de 2026, se cierra el periodo en 2026. Las renovaciones expresas para 2027 podrán quedar abiertas/current únicamente en los casos acreditados.

## 9. Cultos

Nuevos Cultos: **5**.

Humildad / Aurora:
1. Besamano de la Aurora.
2. Triduo de la Aurora.
3. Función de la Aurora.

San Benito:
4. Quinario a San Benito · culto recurrente; no se fabrica una occurrence completa si faltan fechas terminales inequívocas.

Sacramental:
5. Culto mensual al Santísimo · recurrente; sin occurrence concreta.

Occurrences 2026 nuevas: **3**, únicamente las de Aurora:
- 07/08 · Besamano;
- 10–12/08 · Triduo;
- 15/08 · Función.

Los 3 Cultos y 3 occurrences ya existentes del Castillo se preservan sin reescribir estados históricos.

## 10. Trazabilidad y Fuentes

Lista nueva cerrada: **30 URLs nuevas**.

La revisión exacta contra `sources.url` dio:
- 31 URLs planificadas;
- 1 coincidencia existente: Congregación Nazarena · Hermandades · `a6b01a96-2c4c-4125-bf2a-13c22ca0a7a2`;
- **30 INSERT de Fuente**;
- **0 colisiones no reconciliadas**.

Además se preservan 8 Fuentes ya existentes del universo Castillo.

Contrato de `source_links`: **121**:
- 64 entidades nuevas;
- 1 enlace nuevo al Castillo existente para respaldar su actualización;
- 6 autorías;
- 16 series;
- 13 Salidas;
- 11 asignaciones musicales;
- 5 Cultos;
- 3 occurrences;
- 2 relaciones sacramentales.

## 11. REUSE congelados · 32

1. Lebrija.
2. San Fernando.
3. Hermandad del Castillo.
4. Nuestra Señora del Castillo Coronada.
5. Banda de Música Virgen del Castillo de Lebrija.
6. Parroquia de Nuestra Señora de la Oliva.
7. Ermita de Nuestra Señora del Castillo.
8. Convento de la Purísima Concepción.
9. Santísimo Sacramento · advocación global.
10. Juan Manuel Miñarro López.
11. Juan Abascal Fuentes.
12. Pedro Roldán.
13. Salida patronal del Castillo · 12/09/2026.
14. relación Castillo–Virgen del Castillo.
15. relación outing–Virgen del Castillo de la salida patronal.
16. posición musical ya existente de la salida patronal.
17. asignación Banda Virgen del Castillo ya existente en la salida patronal.
18. Ayuntamiento · Ermita del Castillo y Patrona.
19. El Pespunte · cambio de sede del Castillo 2026.
20. fuente oficial Día de la Virgen 2026.
21. Ayuntamiento · Feria y Fiestas Patronales 2026.
22. Hermandad del Castillo · Cultos.
23. Hermandad del Castillo · Sede canónica.
24. Hermandad del Castillo · Traslados.
25. Repertorio musical 2026 · Banda Virgen del Castillo.
26. Congregación Nazarena · Hermandades.
27–29. tres Cultos existentes del Castillo.
30–32. tres occurrences 2026 existentes del Castillo.

## 12. Recuento exacto

| Tabla / operación | Filas |
|---|---:|
| municipalities | 2 |
| sources | 30 |
| places | 6 |
| entities | 64 |
| brotherhoods · INSERT | 11 |
| bands | 4 |
| agents | 3 |
| agent_names | 3 |
| agent_disciplines | 3 |
| images | 23 |
| brotherhood_images | 23 |
| image_authorships | 6 |
| steps | 23 |
| brotherhood_steps | 23 |
| image_steps | 23 |
| entity_relations | 2 |
| outing_series | 16 |
| outings · INSERT | 13 |
| outing_entities | 22 |
| outing_music_positions | 11 |
| outing_music_assignments | 11 |
| music_accompaniment_periods | 11 |
| cults | 5 |
| cult_occurrences | 3 |
| source_links | 121 |
| brotherhoods · UPDATE Castillo | 1 |
| outings · UPDATE patronal Castillo | 1 |
| **TOTAL DML** | **464** |

Operaciones:
- **462 INSERT/UPSERT**;
- **2 UPDATE**;
- **0 DELETE**;
- **32 REUSE** fuera del total DML.

## 13. Puerta

Preflight lógico: **VERDE**.

Queda autorizado:
**plan row-by-row exacto → IDs deterministas → manifiesto determinista → payload SQL de preflight con ROLLBACK**.

Sigue prohibido:
- crear `bulk_imports`;
- staging;
- Apply;
- segundo municipio;
- DDL;
- RLS.
