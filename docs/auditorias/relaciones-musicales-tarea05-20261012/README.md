# TAREA 05 · Relaciones musicales e integridad de los pasos · 12/10/2026

Auditoría de solo lectura sobre producción (`main = 492129a`). **No se ha modificado ningún dato en esta tarea.**

## Archivos

| Archivo | Contenido |
|---|---|
| `matriz.csv` | Matriz completa: 141 casos con las columnas pedidas, filtrable |
| `matriz.md` | La misma matriz, legible en GitHub |
| `candidate.sql` | Cambios respaldados por datos confirmados. Parte 2 (nombres históricos): **aplicada** mediante `owner-fixes-2.sql`. Parte 1 (Utrera 1989): **pendiente de autorización** |
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

## Datos aportados por el propietario · 12/10/2026 · **aplicado y verificado**

`owner-fixes.sql` y su reversión, `owner-fixes-rollback.sql`, que contiene literalmente los valores anteriores:

1. **Camas · Gloria 2026: acompañó Cruz Roja.**
   - El periodo de Cruz Roja pasa a vigente en 2026, sin año de inicio, enlazado al paso de palio que usa la Gloria y con fuente editorial.
   - El periodo de Maestro Tejera «vigente en 2026» se **archiva, no se borra**. Su única fuente era la procesión extraordinaria del 30/05, cuya música curada es Virgen de las Angustias y Cruz Roja.
   - La fila heredada `1d36a39e` sigue congelada como evidencia; la web no la lee.
2. **La Banda Juvenil de Santa Ana se integra en la ficha de la Banda de Música Santa Ana.**
   - Sus 3 asignaciones se enlazan a esa ficha.
   - `band_name_text` conserva el nombre juvenil y la nota visible indica «Banda Juvenil de la Banda de Música Santa Ana de Dos Hermanas».
   - No se cambia la etiqueta de posición, que comparten los coros.

**Aplicado el 12/10/2026 con autorización del propietario.** Resultado: 2 fuentes, Cruz Roja 1/1, Maestro Tejera archivado 1/1, Juvenil 3/3 y 4 enlaces a fuentes.

**Verificación:**
- `outing_music_details` muestra «Banda de Música Santa Ana de Dos Hermanas» con la nota juvenil en las 3 salidas.
- La web del paso (`/pasos/paso-dolores-coronada-camas`) muestra Cruz Roja en la Gloria y ya no muestra Maestro Tejera.
- La ficha de banda solo lista salidas futuras (diseño existente), así que muestra Las Portadas (25/10). Las dos salidas pasadas se ven en sus directorios.

**Cifras actualizadas:**
- Formaciones solo como texto: 34 (24 correctas así, 9 bandas sin ficha, 1 ambigua).
- Camas deja de estar bloqueado.

## Segunda tanda del propietario · 12/10/2026 · aplicada

Detalle en `owner-fixes-2.sql` y su reversión, `owner-fixes-2-rollback.sql`.

1. **Nombres de los 12 periodos históricos** de San Bernardo (×11) y la Trinidad (×1): 12/12.
   - Verificado en la web: `/pasos/paso-cristo-salud-san-bernardo` muestra ahora los 12 periodos, de Cruz Roja (1930) a Corona de Espinas (2003–2006).
2. **AM Juvenil Santa María Magdalena de Arahal** (San Pablo, Cruz de Guía 2026): enlazada a la A.M. Santa María Magdalena de Arahal.
   - Conserva el nombre juvenil como texto y en la nota visible.
   - La ficha juvenil en borrador no se toca.
   - Verificado en `outing_music_details`.
3. **Camas · Jueves Santo · Banda Virgen de las Angustias:** confirmada, con fuente editorial.
   - 2026 pasa a ser una constatación y no un inicio, así que la web deja de decir «Desde 2026».
   - Verificada la etiqueta resultante (vacía). La página tiene una caché de 15 minutos.

**Cifras actualizadas:**
- Bandas en borrador en salidas publicadas: queda Ánima Sacra, más el posible duplicado de Bollullos.
- Periodos históricos invisibles: 0.

## Tercera tanda del propietario · 12/10/2026 · aplicada

Detalle en `owner-fixes-3.sql` y su reversión, `owner-fixes-3-rollback.sql`.

1. **Bollullos:** una sola ficha con el nombre correcto, «Banda Municipal de Bollullos del Condado». Sigue en borrador.
   - Sus 2 asignaciones de Aznalcázar llevan ya el nombre nuevo.
   - El periodo 2027–2028 de la Esperanza de Arahal pasa a esta ficha, sin enlace público.
   - La ficha duplicada «… Bollullos Par del Condado» se archiva, no se borra. No tenía otras referencias.
2. **Ánima Sacra:** solo como texto en el Corpus del Cerro. La ficha, en revisión, no se toca.

**Verificado en `outing_music_details`:**
- Los nombres se muestran correctamente.
- Asignaciones publicadas cuya banda no está publicada y que no tienen texto: **0**.

## Los 88 periodos sin paso · creación de pasos · 12/10/2026

### Diagnóstico

- **7 Hermandades publicadas** (7 periodos). Se han revisado con sus fuentes:
  - **Paso documentado, creado y publicado** (`pasos-nuevos.sql` y su reversión, `pasos-nuevos-rollback.sql`):
    - **Soledad de Castilblanco** · Paso de Nuestra Señora de los Dolores en su Soledad. Fuente: la banda Las Nieves de Olivares cita «ambos pasos» del Sábado Santo y acompaña desde 2023.
    - **Pura y Limpia del Postigo** · Paso de la Pura y Limpia Concepción. Fuente: su web cita el paso y su capataz. Maestro Tejera.
    - **Santo Ángel** · Paso de palio de María Santísima de la Salud. Fuente: el palio está en ejecución en 2026 para estrenarse en la Semana Santa siguiente. Se enlaza también a la imagen de la Salud. Carmen de Salteras (2027). La ficha del paso no muestra este acompañamiento porque es futuro: se ve en Música 2027.
  - **No se crean, por falta de fuente:**
    - **Araceli** (no consta si es paso o andas).
    - **Sacramental de San Pedro** (la fuente no menciona custodia ni paso).
    - **Dulce Nombre de Alcalá.** La salida de 2026 la acompañó la Banda de Música de La Puebla del Río, no Cruz Roja: **el periodo de Cruz Roja, marcado como vigente, debe revisarse** ([fuente](https://www.ssantadealcala.org/2026/05/salida-dulce-nombre.html)).
    - **Vera Cruz y Sangre de Huévar** (sin imágenes y sin fuente).
- **57 Hermandades en borrador** (81 periodos): son fichas vacías, sin imágenes ni pasos. Crear sus pasos exige completar las fichas.
  - Lista priorizada en `hermandades-borrador-prioridad.md` / `.csv`: 1 urgente (Nieves de Olivares, con 2 salidas publicadas), 35 de prioridad alta, 11 media y 10 baja.

### Verificación (web en producción)

- `/pasos/paso-soledad-castilblanco`, `/pasos/paso-pura-limpia-postigo` y `/pasos/paso-palio-salud-santo-angel` cargan con su Hermandad.
- Castilblanco muestra Las Nieves de Olivares desde 2023 y Pura y Limpia muestra Maestro Tejera.

### Hallazgo adicional (sin tocar)

16 relaciones en borrador cuyos dos extremos están publicados no se ven en la web:

- 3 Hermandad–Paso, entre ellas el Cristo de los Desamparados del Santo Ángel;
- 3 Imagen–Paso;
- 10 Hermandad–Imagen.

Pueden ser restos de una despublicación temporal. Revisar antes de publicarlas.

### Municipios de las Hermandades en borrador · aplicado

Indicación del propietario: el municipio está al final del nombre (por ejemplo, Nieves «de Olivares» o Jesús «de La Algaba»).

- `municipios.sql` lo asigna solo cuando coincide exactamente con un municipio existente, más dos formas abreviadas: «Jerez» → Jerez de la Frontera y «Huévar» → Huévar del Aljarafe.
- Solo rellena municipios vacíos: 25 actualizados.
- Crea la fila de Hermandad que faltaba en otras 10, con la convención de los borradores.
- **Resultado: 40 de 57 con municipio.** Reversión: `municipios-rollback.sql`.
- Quedan 17:
  - 7 municipios por dar de alta: Hinojos, Paterna del Campo, El Pedroso, Villarrasa, Los Molares, Brenes y Huete.
  - 10 nombres de barrio o parroquia, o sin lugar.

**Alta de municipios de Sevilla** (`municipios-sevilla.sql`; reversión: `municipios-sevilla-rollback.sql`):

- Se dan de alta El Pedroso, Los Molares y Brenes, y se asignan a sus Hermandades.
- Quedan fuera, por indicación del propietario: Hinojos, Paterna del Campo y Villarrasa (Huelva), y Huete (Cuenca).
- Un municipio sin bandas publicadas no genera página ni entrada en el sitemap.
- **Resultado: 43 de 57 con municipio.**

## Hermandades en borrador · primeras resoluciones · 12/10/2026 · aplicado y verificado

Detalle en `fusiones-y-olivares.sql` y su reversión, `fusiones-y-olivares-rollback.sql`.

- **Nieves de Olivares:** no existe Hermandad. La Patrona la gestiona la comunidad parroquial, que solicitó la coronación (29/04/2028).
  - La ficha pasa a ser **Parroquia de Santa María de las Nieves de Olivares**, publicada.
  - Incluye la imagen (María Roldán, según la Archidiócesis), su paso y la música de Las Nieves de Olivares, todo con fuentes.
  - Verificada en `/hermandades/parroquia-santa-maria-nieves-olivares`.
- **La Milagrosa (Sevilla):** el borrador duplicaba la Hermandad publicada.
  - Sus 2 periodos pasan a su misterio: La Redención 2008–2025 y Virgen de los Reyes desde 2026.
  - Verificado en la web.
- **Torreblanca (Sevilla):** el borrador duplicaba la Hermandad publicada.
  - Las Nieves de Olivares pasa a su palio desde 1996.
  - También se trasladan la salida en borrador del Vía Crucis 2018 y su relación.
  - Verificado en la web.
- **Nieves de Benacazón:** se fusionan los dos borradores en «Nuestra Señora de las Nieves Coronada», que sigue en borrador.
  - Cruz Roja, el 5 de agosto.
  - Virgen de las Mercedes de Bollullos, el 6 de agosto (periodo nuevo).
  - **Pendiente:** el periodo de Maestro Tejera, con fuente de 2026, que contradice este dato.
- **Pendiente de confirmar:** Santo Entierro de Paradas parece duplicar la Hermandad publicada.
- Los 3 borradores duplicados se archivan. No se borra nada.

**Tipos de salida legibles** (`tipos-salida.sql` y su reversión, `tipos-salida-rollback.sql`):

- 16 periodos mostraban un código interno, como «procesion_gloria» en la ficha de Olivares o «station_of_penance».
- Pasan a «Procesión de Gloria», «Estación de penitencia», «Procesión penitencial» y «Romería».
- Las estaciones de penitencia se clasifican ahora en Semana Santa en la ficha de banda (antes, en Glorias).

**Maestro Tejera en Benacazón** (`tejera-castilleja.sql`; reversión: `tejera-castilleja-rollback.sql`): aplicado.

- Según el propietario, la fuente del periodo (vídeo de la banda del 2 de agosto de 2026) es de Castilleja de la Cuesta.
- [El Pespunte](https://www.elpespunte.es/articulo/cofrade/procesiones-virgen-nieves-benacazon-2026-recorridos-bandas/20260805094516144171.html) confirma que en Benacazón acompañan Cruz Roja (5 de agosto) y Virgen de las Mercedes (6 de agosto).
- El periodo se archiva hasta identificar a qué Hermandad de Castilleja corresponde.
- Se asigna el municipio Castilleja de la Cuesta a la «Hermandad del Gran Poder de Castilleja de la Cuesta», que estaba en borrador y sin municipio.

**Calle Real de Castilleja** (`calle-real-castilleja.sql`; reversión: `calle-real-castilleja-rollback.sql`): aplicado.

- El propietario confirma que el borrador «Gran Poder de Castilleja de la Cuesta» es la misma Hermandad que la Calle Real.
- Su periodo pasa a la Calle Real: Carmen de Salteras, tras el misterio del Santísimo Cristo de la Vera Cruz, el Jueves Santo.
- El duplicado se archiva.
- La Calle Real queda con 4 periodos:
  - Jueves Santo: Vera Cruz.
  - Madrugá: Gran Poder, con Valme hasta 2026 y Las Cigarreras desde 2027.
  - Domingo de Resurrección: Inmaculada con Cruz Roja.
