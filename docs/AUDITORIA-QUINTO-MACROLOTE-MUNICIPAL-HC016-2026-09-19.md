# Auditoría · selección del quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Misión:** recálculo provincial desde cero después del cierre certificado de Coria del Río  
**Régimen:** FIRST EDITION FREEZE  
**Apply editorial:** NO  
**Staging:** NO  
**DDL / RLS:** 0 / 0

## 1. Preflight real

- `main`: `256acd63c4ea0ae9e3c2598e40c26850bd7e4efe`.
- PR abiertas al inicio: **0**.
- Producción: `dpl_3vBNWw6BxMJntVbPx5Am22quJjjB` · **READY** · mismo SHA que `main`.
- Runtime de producción: **0 error/fatal** en la ventana de 24 h comprobada.
- Supabase `Hilocofrade`: **ACTIVE_HEALTHY**.
- Migraciones activas: **12/12**.
- `docs/ESTADO-PROYECTO.md`: ningún frente editorial activo.
- `docs/HILO-ORQUESTADOR.md`: el tablero vigente prevalece sobre rankings históricos.
- #492: cerrada.
- HC-018: bloqueada.

## 2. Municipios congelados

Se excluyen de la competición por cierre municipal certificado:

1. Gerena.
2. Dos Hermanas.
3. Alcalá de Guadaíra.
4. Pilas.
5. Cantillana.
6. Coria del Río.

Sevilla capital queda fuera de este recálculo por definición de misión.

No apareció otro municipio certificado como macrolote integral posterior a Coria.

## 3. Fotografía provincial

El grafo productivo contiene **41 municipios de la provincia con contenido real** que pueden competir después de excluir los seis cierres y Sevilla capital.

La fotografía no se calculó con una única señal de completitud. Para cada municipio se cruzaron:

- Hermandades publicadas y no publicadas;
- Imágenes y Pasos relacionados;
- Bandas locales;
- Salidas y series;
- Cultos y ediciones;
- acontecimientos;
- acompañamientos musicales;
- lugares;
- personas;
- patrimonio;
- relaciones con Fuentes;
- actividad 2026 y citas futuras.

### Señales relevantes del grafo actual

| Municipio | Hdes publicadas | Bandas | Salidas | Cultos | Música | Observación |
|---|---:|---:|---:|---:|---:|---|
| La Rinconada | 5 | 1 | 9 | 8 | 11 | Densidad alta; deuda municipal real menor que la aparente |
| Utrera | 3 | 3 | 3 | 4 | 1 | Mucha deuda, gran actualidad y riesgo de duplicidad musical |
| Aznalcázar | 2 | 0 | 4 | 4 | 1 | Grafo ya bastante denso para un universo menor |
| Tocina | 2 | 0 | 6 | 3 | 5 | Cobertura relacional alta respecto a su tamaño |
| Sanlúcar la Mayor | 1 | 2 | 2 | 0 | 0 | Deuda alta, pero no hereda posición del ranking anterior |
| Écija | 1 publicada + 2 `draft` ocultas | 1 | 1 | 3 | 1 | Universo enorme; parte de la deuda ya existe bajo IDs canónicos |
| Osuna | 1 | 1 | 1 | 2 | 1 | Deuda limpia y Fuentes institucionales muy fuertes |
| Marchena | 1 publicada + 1 `draft` oculta | 1 | 1 | 0 | 1 | Consejo local muy profundo; riesgo canónico medio |
| Mairena del Alcor | 1 | 1 | 0 | 0 | 1 | Actualidad inmediata y universo amplio |
| Estepa | 1 | 0 | 2 | 0 | 0 | Deuda muy grande, limpia y fuertemente documentada |

## 4. Duplicidades antes de puntuar

La auditoría nominal y de slug confirmó:

- **Écija**: Expiración y Confalón ya existen como Hermandades en `draft`; además existe un Paso de Confalón en `draft`. Su deuda bruta no equivale a deuda de INSERT.
- **Marchena**: la Soledad ya existe como Hermandad en `draft`; la Divina Pastora está publicada.
- **Utrera**: existen dos nodos publicados de Álvarez Quintero que exigen desambiguación/reconciliación antes de cualquier lote.
- **Estepa**: no aparecen Hermandades ocultas adicionales por nombre o slug. Solo existen la Hermandad de Jesús Nazareno, su Imagen y su Paso.
- **Estepa · Fuentes**: existen dos filas con la misma URL de “Devociones de Estepa”; deben reconciliarse antes de un futuro staging, pero no alteran el universo.
- **Sanlúcar la Mayor**: una Banda denominada “Banda de Música Virgen de las Angustias” figura con subtipo “Cornetas y Tambores”; requiere revisión previa.

La experiencia de Coria queda, por tanto, aplicada: el ranking se construye sobre deuda reconciliada, no sobre ausencia aparente.

## 5. Contraste externo y Fuentes

### Estepa

El Ayuntamiento mantiene una estructura estable y específica por Hermandad y un programa oficial de 2026. El propio consistorio cerró la Semana Santa agradeciendo a **las nueve Hermandades** que la integran. Además, la documentación municipal de Glorias identifica **cuatro Hermandades de Gloria**; Paz y Caridad se encarga de la procesión de la Inmaculada, que no se cuenta como corporación distinta.

Fuentes principales:

- Ayuntamiento · Programa de mano Semana Santa 2026  
  https://www.estepa.es/es/turismo/noticias/PROGRAMA-DE-MANO-DE-LA-SEMANA-SANTA-2026/
- Ayuntamiento · cierre Semana Santa 2026  
  https://www.estepa.es/es/actualidad/noticias/DOMINGO-DE-RESURRECCION-FINALIZA-LA-SEMANA-SANTA-2026/
- Ayuntamiento · La Borriquita  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/domingo-de-ramos/
- Ayuntamiento · Las Angustias  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/lunes-santo/
- Ayuntamiento · San Pedro  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/page-00001/
- Ayuntamiento · Los Estudiantes  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/miercoles-santo/
- Ayuntamiento · Dulce Nombre  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/miercoles-santo-00001/
- Ayuntamiento · Calvario  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/miercoles-santo-madrugada/
- Ayuntamiento · Paz y Caridad  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/el-cristo/
- Ayuntamiento · Jesús Nazareno  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/jesus-nazareno/
- Ayuntamiento · Santo Entierro  
  https://www.estepa.es/es/turismo/descubrenos/semanasanta/el-santo-entierro/
- Ayuntamiento · Glorias  
  https://www.estepa.es/es/actualidad/noticias/PRESENTACION-DEL-CARTEL-DE-LAS-GLORIAS-2022/
- Ayuntamiento · Santa Ana 2026  
  https://www.estepa.es/es/actualidad/noticias/PROCESION-DE-NTRA.-SRA.-SANTA-ANA/
- Ayuntamiento · Asunción 2026  
  https://www.estepa.es/es/actualidad/noticias/CARTEL-DE-LA-ASUNCION-2026/
- Ayuntamiento · agenda 400 aniversario Nazareno · 25/09/2026  
  https://www.estepa.es/es/actualidad/eventos/CONFERENCIA-LA-VOCACION-COFRADE-COMO-SERVICIO-A-LA-IGLESIA/
- Turismo Provincia · Semana Santa 2026 Estepa.
- Fuentes propias de varias corporaciones enlazadas desde las páginas municipales.

Calidad: **MUY ALTA**.  
Actualidad: **MUY ALTA**.  
Estabilidad: **ALTA**.  
Capacidad para justificar DML: **MUY ALTA**.

### Osuna

La fuente institucional provincial documenta **diez Hermandades de Semana Santa** con sede, día, Pasos y titulares; el Ayuntamiento publicó guía y app 2026 con información histórica de todas las Hermandades y confirmó retrospectivamente que todas pudieron realizar sus estaciones de penitencia.

Fuentes:
- https://www.turismosevilla.org/de/node/27669
- https://osuna.es/es/actualidad/noticias/Presentadas-la-guia-y-app-de-la-Semana-Santa-de-Osuna-2026/
- https://www.osuna.es/es/cultura/noticias/Osuna-cierra-una-Semana-Santa-plena-marcada-por-la-alta-participacion-y-afluencia-de-visitantes-y-por-la-dinamizacion-de-la-economia-local/

Calidad: **MUY ALTA**.  
Actualidad: **ALTA**.  
Riesgo: **BAJO-MEDIO**, porque el universo total de Glorias exige una segunda delimitación.

### Utrera

El Consejo publica material específico de la Semana Santa 2026 y Turismo Provincia documenta las corporaciones y sus distintas jornadas. Es el candidato con mayor actualidad potencial, pero varias Hermandades procesionan en más de una jornada y Hilo contiene dos nodos Álvarez Quintero que deben resolverse.

Fuentes:
- https://consejodehermandadesdeutrera.org/semana-santa/semana-santa-de-utrera-2026/
- https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-utrera

Calidad: **MUY ALTA**.  
Actualidad: **MUY ALTA**.  
Riesgo: **MEDIO-ALTO**.

### Marchena

El Consejo local ofrece fichas profundas de sus **siete Hermandades de Semana Santa** y de dos Hermandades de Gloria. Hilo ya contiene Divina Pastora y una Soledad en `draft`. La actualidad del Consejo es alta en septiembre de 2026.

Fuentes:
- https://consejodehermandadesdemarchena.es/?page_id=96
- https://consejodehermandadesdemarchena.es/
- https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-marchena

Calidad: **MUY ALTA**.  
Actualidad: **ALTA**.  
Riesgo: **MEDIO** por fronteras corporativas y nodos previos.

### Mairena del Alcor

La web municipal documenta las estaciones penitenciales desde Domingo de Ramos a Resurrección y un calendario de Glorias, romería y Vía Crucis. La Romería 2026 de la Virgen de los Remedios está anunciada para el 27 de septiembre.

Fuentes:
- https://www.mairenadelalcor.org/es/turismomairena/guia-turistica/fiestas/
- https://www.mairenadelalcor.org/es/actualidad/noticias/Mairena-del-Alcor-ultima-los-preparativos-para-una-Semana-Santa-marcada-por-la-coordinacion-y-la-seguridad/
- https://www.mairenadelalcor.org/es/seguridad-ciudadana/noticias/Coordinado-el-plan-de-autoproteccion-coordinacion-y-emergencias-para-la-Romeria-2026/

Calidad: **ALTA**.  
Actualidad: **MUY ALTA**.  
Riesgo: **MEDIO**, porque el universo incluye penitencia, patronales, Ánimas, Rocío y otras corporaciones de distinta naturaleza.

## 6. TOP 5 interno

Matriz común: deuda verificable, Fuentes, valor relacional, actualidad, reutilización, riesgo de duplicidad, volumen ejecutable y compatibilidad DML.

| Puesto | Municipio | Deuda | Fuentes | Relacional | Actualidad | Riesgo | Motivo |
|---|---|---|---|---|---|---|---|
| 1 | **Estepa** | Muy alta | Muy alta | Muy alto | Muy alta | Bajo | Universo exacto de 13; Fuentes municipales por corporación; programa 2026; reutilizaciones claras |
| 2 | **Osuna** | Muy alta | Muy alta | Muy alto | Alta | Bajo-medio | 10 penitenciales institucionalmente cerradas y guía/app 2026 muy profunda |
| 3 | **Utrera** | Muy alta | Muy alta | Muy alto | Muy alta | Medio-alto | Gran actualidad y Consejo fuerte, pero multijornadas y duplicidad Álvarez Quintero |
| 4 | **Marchena** | Alta | Muy alta | Alto | Alta | Medio | Consejo excelente; Soledad `draft`; universo amplio con Glorias y Pastora fuera del núcleo del Consejo |
| 5 | **Mairena del Alcor** | Alta | Alta | Alto | Muy alta | Medio | Romería inmediata y tejido amplio, pero frontera corporativa más heterogénea |

### Fuera del TOP 5

- **Écija**: la deuda absoluta es mayor —14 corporaciones de Semana Santa documentadas institucionalmente—, pero el lote sería mucho más grande; Expiración y Confalón ya existen en `draft`, y para un cierre municipal integral faltaría una delimitación adicional de Glorias. Queda por debajo del TOP 5 por ejecutabilidad inmediata, no por falta de valor.
- **Sanlúcar la Mayor**: deuda alta y Fuentes suficientes, pero no hereda plaza del ranking anterior; presenta además una inconsistencia de subtipo en una Banda y menor actualidad que los cinco seleccionados.
- **La Rinconada, Tocina, Tomares, Villaverde del Río y Aznalcázar**: poseen una densidad actual elevada respecto a su universo visible; su deuda marginal no multiplica el grafo tanto como los candidatos del TOP 5.

## 7. TOP 3 final

| Puesto | Municipio | Corporaciones | Deuda real | Fuentes | Valor relacional | Actualidad | Riesgo |
|---|---|---:|---|---|---|---|---|
| **1** | **Estepa** | **13** | 12 corporaciones ausentes + remate del Nazareno | Muy altas | Muy alto | Muy alta | **Bajo** |
| **2** | **Osuna** | ≥10 penitenciales + Glorias por cerrar | 9 penitenciales ausentes y universo letífico adicional | Muy altas | Muy alto | Alta | Bajo-medio |
| **3** | **Utrera** | ≥10 corporaciones penitenciales + sacramentales/Gloria | Gran deuda; 3 corporaciones públicas actuales | Muy altas | Muy alto | Muy alta | **Medio-alto** |

## 8. Selección

# QUINTO MACROLOTE MUNICIPAL HC-016 · ESTEPA

Estepa gana por cinco razones concretas:

1. El universo queda cerrado sin inferencia: **9 Hermandades de Semana Santa + 4 Hermandades de Gloria = 13 corporaciones**; la Inmaculada pertenece funcionalmente a Paz y Caridad y no se duplica como corporación.
2. El Ayuntamiento ofrece una Fuente estable por cada Hermandad de Pasión y un programa 2026 que documenta horarios, Pasos y acompañamientos.
3. Hilo solo tiene una Hermandad municipal publicada, de modo que la deuda es material y no una ilusión estadística.
4. El grafo puede reutilizar Nazareno, San Sebastián, Banda Villa de Osuna y varios autores ya canónicos, multiplicando relaciones sin duplicar entidades.
5. La actualidad sigue viva: 400 aniversario del Nazareno, conferencia del 25 de septiembre y dos Salidas extraordinarias de noviembre ya publicadas en Hilo.

## 9. Puertas de seguridad

- Nuevo DDL: **NO**.
- Nuevas tablas: **NO**.
- Cambios RLS: **NO**.
- Excepciones nominales por municipio: **NO**.
- HC-016 actual soporta el lote: **SÍ**.
- Frente concurrente: **NO**.
- Apply en esta misión: **0**.
- Staging en esta misión: **0**.

La selección queda preparada para inventario y pre-lote. No se autoriza Apply.

