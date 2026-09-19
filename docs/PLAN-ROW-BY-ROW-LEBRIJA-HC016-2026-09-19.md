# Plan row-by-row · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** ROW-BY-ROW CERRADO  
**Base:** `9bd786f9cb52f6eafb875dc8157c89da47fabfa5`  
**TOTAL DML:** **473**  
**INSERT / UPSERT:** **471**  
**UPDATE:** **2**  
**DELETE:** **0**  
**REUSE:** **32**

Este documento congela el número y orden lógico de las operaciones. Los IDs `c0160033-*` se materializarán en el manifiesto determinista posterior. No crea staging.

## 1. Rango de posiciones

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

## 2. Entidades · posiciones 40–103

### Hermandades · 11
1. Entrada Triunfal.
2. Oración en el Huerto.
3. Humildad.
4. Ecce-Homo.
5. Dolores.
6. Vera-Cruz.
7. Santo Sepulcro.
8. Soledad.
9. Rocío.
10. San Benito.
11. Sacramental.

### Bandas · 4
12. AM Afligidos de Puente Genil.
13. BM Maestro Agripino Lozano de San Fernando.
14. BM Nuestra Señora del Rosario de El Cuervo.
15. Banda Amor y Sacrificio de Lebrija.

### Agentes · 3
16. Juan Herrera Cala.
17. Juan Antonio González García «Ventura».
18. Diego Roldán y Serrallonga.

### Imágenes · 23
19. Jesús en su Entrada Triunfal.
20. Nuestra Señora de la Estrella.
21. San Juan Evangelista · Borriquita.
22. Jesús Orando en el Huerto.
23. Santísimo Cristo de la Buena Muerte.
24. Santa María de Jesús.
25. Jesús de la Humildad.
26. Nuestra Señora de la Victoria.
27. Nuestra Señora de la Aurora.
28. San Juan Evangelista · Humildad.
29. Jesús del Ecce-Homo.
30. Nuestra Señora del Mayor Dolor.
31. Jesús Atado a la Columna.
32. San Pedro Apóstol · Castillo.
33. Jesús Nazareno · Dolores.
34. María Santísima de los Dolores.
35. Santa Mujer Verónica.
36. San Juan Evangelista · Dolores.
37. Santísimo Cristo de la Vera-Cruz.
38. Nuestra Señora de Consolación.
39. Cristo de las Cinco Llagas / Yacente.
40. Nuestra Señora de la Soledad.
41. San Benito Abad.

### Pasos · 23
42. Misterio de la Entrada Triunfal.
43. Palio de la Estrella.
44. Paso de Jesús Orando en el Huerto.
45. Paso del Cristo de la Buena Muerte.
46. Paso de Santa María de Jesús.
47. Misterio de la Humildad.
48. Palio de la Victoria.
49. Paso de Gloria de la Aurora.
50. Paso del Ecce-Homo.
51. Palio del Mayor Dolor.
52. Misterio de Jesús Atado a la Columna.
53. Palio de la Virgen del Castillo.
54. Paso de San Pedro Apóstol.
55. Paso de Jesús Nazareno.
56. Palio de María Santísima de los Dolores.
57. Paso de la Santa Mujer Verónica.
58. Paso de San Juan Evangelista · Dolores.
59. Paso de S.D.M. · Corpus de San Francisco.
60. Paso del Cristo de la Vera-Cruz.
61. Paso de Nuestra Señora de Consolación.
62. Urna del Santo Sepulcro.
63. Paso de Nuestra Señora de la Soledad.
64. Paso de San Benito Abad.

## 3. Relaciones de Imágenes y Pasos

### brotherhood_images · 23
Una relación `titular` por cada imagen nueva.

La relación Castillo–Virgen del Castillo `42d6c66d-a935-4ace-ab0f-e3d1d3cf3cca` es REUSE.

### brotherhood_steps · 23
Una relación processional/current por cada Paso nuevo.

### image_steps · 23
- Entrada: 3 relaciones; Jesús y San Juan comparten el misterio.
- Oración: 3.
- Humildad: 3; San Juan no tiene Paso actual.
- Ecce-Homo: 2.
- Castillo: 3; Virgen del Castillo reutilizada.
- Dolores: 4; el Paso de S.D.M. no fuerza una `image`.
- Vera-Cruz: 2.
- Santo Sepulcro: 1.
- Soledad: 1.
- San Benito: 1.

### entity_relations · 2
- Dolores → Santísimo Sacramento · `has_titular`.
- Hermandad Sacramental → Santísimo Sacramento · `has_titular`.

Santísimo Sacramento reutilizado: `d335bf75-18ce-42db-a10b-cb8942a7b05a`.

## 4. Salidas y series

### outing_series · 16
1–9. Estaciones de Penitencia de las nueve Hermandades.
10. Rocío.
11. Corpus de San Francisco.
12. San Benito.
13. Rosario de la Aurora.
14. Procesión patronal del Castillo.
15. Procesión anual de San Pedro Apóstol.
16. Corpus Christi de la Sacramental.

### outings · 14
Se crean únicamente las occurrences 2026 verificadas o anunciadas.

### outing_entities · 24
Distribución:
- Penitencia: 20;
  - Entrada Triunfal aporta 3: Jesús, Estrella y San Juan Evangelista; los dos varones comparten el mismo misterio.
- Aurora: 1;
- San Benito: 1;
- Corpus San Francisco: 1;
- Rocío: 0.

La salida patronal del Castillo ya tiene la relación con la Virgen: `b0da1d13-6dc2-407c-84fe-42a9b3e97035`.

## 5. Música

### Posiciones / asignaciones · 11
Orden:
1. Humildad · misterio · Afligidos.
2. Humildad · palio Victoria · Agripino.
3. Aurora · Rosario El Cuervo.
4. Oración · Santa María de Jesús · Virgen Castillo.
5. Ecce-Homo · palio Mayor Dolor · Virgen Castillo.
6. Castillo · misterio · Amor y Sacrificio.
7. Castillo · palio · Virgen Castillo.
8. Dolores · Nazareno · Amor y Sacrificio.
9. Dolores · palio · Agripino.
10. Corpus San Francisco · Rosario El Cuervo.
11. Vera-Cruz · Consolación · Rosario El Cuervo.
12. San Pedro Apóstol · Amor y Sacrificio.

### Periodos · 12
Los periodos reproducen exactamente las 12 relaciones anteriores.

No se publica continuidad futura salvo cuando exista renovación expresa. La evidencia de 2027 de Agripino para Victoria y Dolores puede dejar estos dos vínculos como vigentes; las demás relaciones quedan documentadas para 2026.

## 6. Cultos

### cults · 5
- Aurora · Besamano.
- Aurora · Triduo.
- Aurora · Función.
- San Benito · Quinario.
- Sacramental · Culto mensual al Santísimo.

### cult_occurrences · 3
Solo Aurora 2026:
- 07/08;
- 10–12/08;
- 15/08.

## 7. Fuentes

### sources · 31 nuevas
Una URL planificada ya existía y se reutiliza:
- Congregación Nazarena · Hermandades · `a6b01a96-2c4c-4125-bf2a-13c22ca0a7a2`.

### source_links · 123
Subrangos conceptuales:
- 64 · fuente primaria de cada entidad nueva;
- 1 · actualización institucional de Castillo;
- 6 · autorías;
- 16 · outing_series;
- 14 · outings;
- 12 · asignaciones musicales;
- 5 · cults;
- 3 · cult_occurrences;
- 2 · entity_relations sacramentales.

## 8. UPDATE · posiciones 472–473

### 472 · brotherhoods · Castillo
Actualizar exclusivamente:
- `official_name` con la denominación moderna de su web/parroquia;
- `current_procession_day` para reflejar el carácter penitencial y patronal sin crear una segunda Hermandad;
- notas editoriales si fueran necesarias.

No cambia su UUID ni su slug.

### 473 · outings · patronal Castillo 12/09/2026
Actualizar exclusivamente:
- `outing_series_id` a la nueva serie patronal.

No se modifica:
- fecha;
- estado `held`;
- imagen procesional;
- música existente;
- slug;
- horarios publicados.

## 9. Operaciones que NO existen

- 0 DELETE.
- 0 DDL.
- 0 RLS.
- 0 staging.
- 0 Apply.
- 0 imagen/step artificial para el Rocío.
- 0 imagen artificial del Santísimo.
- San Pedro 2026 se conserva `announced`: existe convocatoria exacta, pero no evidencia posterior suficiente para elevarla a `held`.
- 0 ocurrencia 2026 de Corpus Sacramental vinculada por inferencia.

## 10. Próxima puerta

El siguiente paso autorizado es únicamente:

**colisiones finales → IDs deterministas `c0160033-*` → manifiesto 473/473 → generar payload SQL → ejecutar payload completo con ROLLBACK**.

El manifiesto posterior deberá preservar exactamente:
- 473 DML;
- 471 upsert;
- 2 update;
- 0 delete;
- 32 REUSE.
