# HC-SEO-GSC · Baseline Search Console · 26/09/2026

## Objetivo

Convertir Search Console en una fuente operativa estable para decidir el crecimiento SEO de Hilo Cofrade con datos reales de Google, separando:

- demanda temporal;
- pérdida o ganancia de posiciones;
- descubrimiento/rastreo;
- indexación;
- rendimiento por familia de contenido.

Propiedad canónica analizada: `sc-domain:hilocofrade.es`.

Datos de rendimiento consolidados hasta **24/09/2026**.

---

## 1 · Diagnóstico del pico de septiembre

### Rendimiento agregado

| Periodo | Clics | Impresiones |
|---|---:|---:|
| 01–07/09 | 47 | 1.498 |
| 08–14/09 | 3 | 96 |
| 17–23/09 | 1 | 57 |
| 24/09 | 0 | 22 |

La caída principal se produce entre el **7 y el 8 de septiembre**.

No hay evidencia de un bloqueo global de rastreo o una desindexación total:

- `robots.txt` permite el rastreo público;
- los sitemaps responden HTTP 200;
- varias URLs clave constan como **Submitted and indexed** mediante Google URL Inspection;
- no hubo cambio de robots, sitemap, canonical, metadata o noindex en el corte exacto 7→8/09.

### Concentración del pico

Cinco páginas generaron 37 de los 47 clics del 01–07/09:

| Página | Clics | Impresiones | Posición media |
|---|---:|---:|---:|
| Extraordinaria Ntra. Sra. de los Dolores del Cerro | 16 | 180 | 6,7 |
| `/extraordinarias` | 10 | 238 | 7,26 |
| Salud y Buen Viaje | 4 | 79 | 6,08 |
| Igualá Divina Pastora de Triana | 4 | 39 | 6,49 |
| Dolores de La Rinconada | 3 | 41 | 8,20 |

Conclusión operativa: gran parte del pico fue **demanda temporal muy específica**, especialmente Extraordinarias e Igualás. Google sigue siendo capaz de colocar esas páginas en primera página cuando existe demanda.

---

## 2 · Indexación real: muestra URL Inspection

### Indexadas

- `/` → Submitted and indexed.
- `/hermandades` → Submitted and indexed.
- `/bandas` → Submitted and indexed.
- `/imagenes` → Submitted and indexed.
- `/extraordinarias` → Submitted and indexed.
- Dolores de La Rinconada → Submitted and indexed.
- El Baratillo → Submitted and indexed.
- Maestro Tejera → Submitted and indexed.
- Santa María Magdalena de Arahal → Submitted and indexed.
- Paso de la Sagrada Presentación al Pueblo → Submitted and indexed.

### No indexadas o todavía desconocidas

- `/agenda-cofrade` → Discovered - currently not indexed.
- `/pasos` → URL is unknown to Google.
- `/marchas` → Discovered - currently not indexed.
- `/autores` → Discovered - currently not indexed.
- `/agenda-cofrade/localidad/la-rinconada` → URL is unknown to Google.
- El Valle → URL is unknown to Google.
- Cristo de Burgos → Discovered - currently not indexed.
- Esperanza Macarena (Imagen) → Discovered - currently not indexed.
- Guadalupe de Las Aguas (Imagen) → Discovered - currently not indexed.
- varias Marchas/Autores/Imágenes de muestra → unknown o discovered/not indexed.

El contador agregado del sitemap mostraba `2.216 submitted / 0 indexed`, pero esto contradice las inspecciones individuales de Google. Por tanto, **no usar ese “0 indexed” como verdad de cobertura** hasta que Google vuelva a procesar los sitemaps.

---

## 3 · Rendimiento por familia · 28/08–24/09

`URLs con impresiones` significa URLs que aparecieron al menos una vez en Search Console durante el periodo. No equivale a “URLs indexadas”.

| Familia | URLs sitemap | URLs con impresiones | Clics | Impresiones |
|---|---:|---:|---:|---:|
| General | 6 | 4 | 6 | 38 |
| Hermandades | 263 | 15 | 6 | 614 |
| Bandas | 161 | 22 | 3 | 491 |
| Imágenes | 531 | 15 | 0 | 62 |
| Pasos | 64 | 9 | 0 | 40 |
| Marchas | 590 | 0 | 0 | 0 |
| Autores | 389 | 0 | 0 | 0 |
| Crucetas | 7 | 0 | 0 | 0 |
| Agenda | 233 | 10 | 39 | 648 |

### Lectura

- **Agenda** es la familia con mayor rendimiento real y debe seguir siendo prioritaria.
- **Bandas** tiene una señal temprana razonable de descubrimiento.
- **Hermandades** tiene muchas impresiones concentradas en muy pocas URLs y posiciones débiles en consultas genéricas.
- **Imágenes y Pasos** presentan descubrimiento/indexación todavía muy limitado.
- **Marchas, Autores y Crucetas** no han generado aún ninguna impresión en GSC durante el periodo analizado.

---

## 4 · Sitemaps segmentados enviados a Google

El 26/09/2026 se enviaron explícitamente y fueron aceptados, sin warnings ni errores:

- `/sitemaps/general.xml`
- `/sitemaps/hermandades.xml`
- `/sitemaps/bandas.xml`
- `/sitemaps/imagenes.xml`
- `/sitemaps/pasos.xml`
- `/sitemaps/marchas.xml`
- `/sitemaps/autores.xml`
- `/sitemaps/crucetas.xml`
- `/sitemaps/agenda.xml`

Estado inmediato: **pending**, pendiente de descarga/procesado por Google.

`/sitemap.xml` permanece también enviado.

---

## 5 · Indexing Tracker

Tracker activo de GSC Wizard:

- Total monitorizado: **137 URLs**
- Indexadas tras las primeras inspecciones: **5**
- No indexadas: **8**
- Pendientes: **124**
- Errores: **0**
- Warnings: **0**

La muestra incluye:

- las 75 páginas que ya tuvieron impresiones;
- los 43 hubs municipales;
- las landings principales;
- muestras estratégicas de Marchas, Autores e Imágenes;
- páginas que protagonizaron el pico de comienzos de septiembre.

No solicitar indexación masiva de todo el universo. Priorizar rastreo natural mediante:

`sitemap segmentado → enlazado interno → páginas con autoridad → URL Inspection / tracker`.

---

## 6 · Prioridades

### P0 · Conseguir descubrimiento/indexación de landings maestras

Prioridad inmediata:

1. `/agenda-cofrade`
2. `/pasos`
3. `/marchas`
4. `/autores`
5. hubs municipales estratégicos
6. Imágenes con relaciones fuertes

### P1 · Consolidar lo que ya rankea

Proteger y potenciar:

- Extraordinarias;
- Igualás;
- Bandas con posición 1–10;
- Hermandades que ya reciben impresiones;
- contenidos temporales de Agenda.

### P2 · Autoridad evergreen

Objetivo posterior:

- `cofradías Sevilla`;
- `hermandades Sevilla`;
- consultas por día de Semana Santa;
- consultas territoriales;
- búsquedas de patrimonio, imágenes, pasos, marchas y autores.

---

## 7 · Criterio de éxito

No medir el frente solo por clics diarios.

Indicadores de avance:

1. reducción de URLs `unknown to Google`;
2. aumento de URLs `Submitted and indexed` en la muestra;
3. crecimiento de URLs con impresiones por familia;
4. aparición de Marchas/Autores/Crucetas en GSC;
5. recuperación de impresiones de Agenda sin depender de un único evento;
6. mejora progresiva de posiciones en consultas evergreen;
7. crecimiento orgánico de los hubs municipales.

El pico 01–07/09 es una referencia histórica útil, no un baseline estable.

---

## Regla operativa

Toda nueva decisión SEO relevante debe partir de:

`Search Console → URL/familia/consulta → diagnóstico → cambio mínimo → QA → nueva medición`.

No abrir nuevas superficies indexables únicamente para aumentar el número de URLs.
