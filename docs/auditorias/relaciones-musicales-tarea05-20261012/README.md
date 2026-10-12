# TAREA 05 · Relaciones musicales e integridad de los pasos · 12/10/2026

Auditoría de solo lectura sobre producción (`main = 492129a`). **No se ha modificado ningún dato en esta tarea.**

## Archivos

| Archivo | Contenido |
|---|---|
| `matriz.csv` | Matriz completa: 141 casos con las columnas pedidas, filtrable |
| `matriz.md` | La misma matriz, legible en GitHub |
| `candidate.sql` | Los únicos cambios respaldados por datos confirmados. **No aplicado**: requiere autorización |
| `rollback.sql` | Reversión de `candidate.sql` |

Criterios:

- No se enlaza nada por coincidencia de nombres.
- Se distingue paso, imagen, rosario y otros soportes: un rosario no implica el paso procesional.
- Los periodos futuros (2027) y los históricos conservan sus fechas y no se mezclan con los vigentes.

## Resumen por grupo

| Grupo | Casos | Confirmados | Pendientes de documentación | Ambiguos |
|---|---:|---:|---:|---:|
| 1 · Periodos sin paso en Hermandades sin pasos | 88 | 0 | 88 | 0 |
| 2 · Periodos ambiguos | 12 | 4 | 4 | 4 |
| 3 · Formaciones solo como texto en salidas | 37 | 24 | 12 | 1 |
| 4 · Bandas en borrador en salidas publicadas | 4 | 0 | 2 | 2 |
| **Total** | **141** | **28** | **106** | **7** |

«Confirmado» significa que el dato está acreditado. No implica que haga falta un cambio: 27 de los 28 confirmados ya están bien como están.

## 1 · Los 88 periodos sin paso

- **64 Hermandades** afectadas: 57 en borrador y 7 publicadas.
- **Ninguna tiene pasos creados**, ni siquiera en borrador, salvo Castilblanco, Defensión y Guillena, que tienen uno cada una.
- Vigencia: 46 vigentes, 24 históricos y 19 futuros (Castilleja 2027 es vigente y futuro a la vez).
- 31 periodos no tienen fuente enlazada.
- **No se puede enlazar ninguno**: no existe el paso. Crear pasos es una decisión editorial.

Las 7 Hermandades publicadas que necesitan su paso:

| Hermandad | Paso necesario | Formación |
|---|---|---|
| Desamparados del Santo Ángel | Palio de María Santísima de la Salud | Carmen de Salteras (2027, sin fuente) |
| Vera Cruz y Sangre de Huévar | Paso de la Virgen de la Sangre | Carmen de Salteras (2026, sin fuente) |
| Dulce Nombre de Alcalá de Guadaíra | Paso de Gloria | Cruz Roja |
| Santo Entierro de Castilblanco | Paso de los Dolores en su Soledad (hay uno en borrador) | Las Nieves de Olivares |
| Araceli | Paso de Nuestra Señora de Araceli | Maestro Tejera |
| Pura y Limpia del Postigo | Paso de la Pura y Limpia | Maestro Tejera |
| Sacramental de San Pedro | Paso de la Custodia | Maestro Tejera |

## 2 · Los 12 ambiguos, revisados con sus fuentes

| Caso | Decisión |
|---|---|
| **Utrera · Presentación al Pueblo · 1989** | **Confirmado.** La posición nombra a Nuestro Padre Jesús Nazareno y esa imagen solo procesiona en el Paso de Nazareno. Mismo criterio que los 27 enlaces aplicados esta mañana. Incluido en `candidate.sql` |
| Santa Genoveva, Maravillas, Carrión | Confirmados **sin paso**: rosarios o romero; el soporte no está acreditado |
| Candelaria 1990, Expiración de Écija, La Algaba 1989 | Ambiguos: las fuentes solo nombran la Hermandad |
| San Gil de Écija 2027 | Ambiguo: el registro dice «Jesús de la Salud» y los pasos creados son la Coronación de Espinas y el Cristo de la Salud. No tiene fuente |
| Quinta Angustia | Pendiente: el paso del Niño Jesús no está creado |
| Camas · Cruz Roja | Pendiente: ver el apartado 5 |
| Tocina ×2 (Cruz de Mayo y traslado) | Pendientes: sin fuente. La Cruz de Mayo no es un paso de la Hermandad |

## 3 · Las 37 formaciones solo como texto

Ninguna coincide con una ficha existente, ni por nombre oficial ni por nombres alternativos.

- **9 genéricas, correctas como texto:** música de capilla, capilla sin identificar y tambores fúnebres.
- **15 coros, corales y conjuntos de cámara, correctos como texto.** Crear sus fichas es decisión editorial. El Grupo de Cámara «SACRA» de Gerena no debe confundirse con Ánima Sacra sin una fuente.
- **12 bandas sin ficha, pendientes de crear:**
  - Fuente Clara, AM Jesús Nazareno de La Palma, BCT Jesús Despojado de San Fernando, BCT Rosario de Arriate, Montefrío, Cristóbal Llanes de Calañas, Las Golondrinas, Municipal de Lora del Río y Municipal de Montellano.
  - **Banda Juvenil de Santa Ana, que aparece 3 veces con tres nombres distintos.** Es una formación distinta de la Banda de Música Santa Ana: no se enlaza a ella.
- **1 ambiguo:** el trío del Liceo de Moguer (apartado 5).

## 4 · Bandas que no están publicadas en salidas y periodos publicados

| Caso | Situación | Propuesta (sin aplicar) |
|---|---|---|
| AM Juvenil de Arahal · San Pablo | **El nombre no se ve en la web**: la ficha está en borrador y la asignación no tiene texto | Copiar el nombre a `band_name_text` sin publicar la ficha |
| Ánima Sacra · Corpus del Cerro | Igual (la ficha está en revisión) | Igual |
| Municipal de Bollullos del Condado ×2 · Aznalcázar | El nombre se ve como texto. **Posible ficha duplicada** de «Banda Municipal de Música de Bollullos Par del Condado» (otra ficha en borrador, usada en Esperanza de Arahal 2027–2028) | Revisión editorial antes de publicar ninguna |
| 39 periodos publicados con banda no publicada | 27 muestran su nombre gracias a la instantánea pública. **12 no se ven**: San Bernardo ×11 y Trinidad ×1, con formaciones históricas archivadas | `candidate.sql` copia el nombre de la ficha archivada. No crea enlace ni cambia su estado |

## 5 · Casos especiales

### Camas · Hermandad Sacramental · Gloria

- **Fila heredada (`1d36a39e`):** Maestro Tejera, Gloria del 13/09/2026, «Tras Nuestra Señora de los Dolores Coronada».
- **Salida curada:** Cruz Roja.
- **Periodo de Cruz Roja:** sin fechas y marcado como no vigente en 2026, pero la salida de 2026 lo muestra. Es una contradicción.
- **Fuentes consultadas:**
  - [La web de la Hermandad](https://sacramentaldecamas.es/procesion-de-gloria/) no nombra la banda. Acredita el soporte: «el mismo paso de la Estación de Penitencia sin el palio».
  - [La web de Cruz Roja](https://www.bandacruzroja.es/hermandades/glorias) incluye la Gloria de Camas («tercer domingo de septiembre»), sin años.
  - [El libro de feria de 2026](https://www.camas.es/export/sites/camas/.galleries/documentos-noticias/Libro-de-Feria-Camas-2026.pdf) no cita ninguna banda.
- **Decisión:** no se toca nada. Hace falta una fuente que diga quién acompañó en 2026 y desde cuándo acompaña Cruz Roja. Después, el periodo puede enlazarse al paso de palio, cuyo uso en la Gloria ya está documentado.
- **Otros periodos de Camas** (Humillación y Santa Cruz): sus Hermandades están en borrador y no tienen pasos.

### Utrera

- **Presentación al Pueblo 1989:** confirmada y propuesta (apartado 2).
- **Consolación de Utrera:** sin incidencias de paso. El coro de su Gloria está bien como texto.

### Trío del Liceo de Moguer · Jesús Despojado · Rosario 2025

- **Lo que dice el registro:** «Trío de capilla de la Banda del Liceo de Moguer». Solo existe una ficha relacionada, la Banda Sinfónica del Liceo Municipal de la Música de Moguer, sin nombres alternativos.
- **Por qué no se enlaza:**
  - Es un trío, no la banda, y la vista mostraría el nombre completo de la banda.
  - Es un rosario, así que no implica el palio que la banda acompañó históricamente.
- **Si el propietario lo valida:** enlazar conservando «Trío de capilla de la Banda» en la etiqueta, como la camerata de Santa Ana en Regla.
- **Fuente:** la crónica oficial de la Hermandad, citada en el registro. No se ha podido abrir desde esta sesión.

## Cobertura

| | Hoy | Tras aplicar `candidate.sql` |
|---|---:|---:|
| Periodos publicados sin paso | 126 | 125 |
| Periodos históricos invisibles por falta de nombre | 12 | 0 |
| Asignaciones solo como texto | 37 | 37 (24 correctas así) |

Ganado hoy en las tareas 04 y 05 (ya aplicado y verificado esta mañana): 27 periodos enlazados a su paso, 7 bandas enlazadas en salidas y 135 pasos con histórico musical visible.
