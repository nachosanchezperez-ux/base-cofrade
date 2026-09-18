# Inventario + matriz de Fuentes · Coria del Río · cuarto macrolote municipal HC-016

**Fecha:** 18 de septiembre de 2026  
**HEAD de partida:** `c46bc93494b40d89908174ae846318187e169454`  
**Fase:** inventario y fuentes  
**Apply:** **NO INICIADO**  
**DDL / RLS:** sin cambios

## Regla de este corte

Este documento cierra únicamente:

1. universo corporativo canónico;
2. universo musical local relevante;
3. Fuentes mínimas disponibles;
4. reutilizaciones y duplicidades;
5. bloqueos previos a construir el lote.

No contiene ni autoriza Apply.

---

## 1 · Universo corporativo canónico

El Consejo General de Hermandades y Cofradías de Coria del Río publica seis Hermandades de Penitencia y dos corporaciones de Gloria/Sacramentales.

El universo canónico del municipio queda en **8 corporaciones únicas**.

| # | Corporación canónica | Tipo | Jornada / ciclo | Hilo Cofrade | Acción |
|---:|---|---|---|---|---|
| 1 | Borriquita de Coria del Río | Penitencia | Domingo de Ramos | EXISTE | PRESERVAR + COMPLETAR |
| 2 | Hermandad de Jesús Cautivo | Penitencia | Lunes Santo | NO EXISTE | CREAR |
| 3 | Hermandad de San José / Jesús de la Paz | Sacramental + Penitencia | Martes Santo + Sábado Santo | NO EXISTE | CREAR UNA SOLA CORPORACIÓN |
| 4 | Hermandad del Gran Poder y Nuestra Señora del Carmen | Penitencia + devoción del Carmen | Miércoles Santo + cultos/procesión del Carmen | NO EXISTE | CREAR UNA SOLA CORPORACIÓN |
| 5 | Hermandad de Vera+Cruz / Cerro | Penitencia | Jueves Santo | NO EXISTE | CREAR |
| 6 | Hermandad de la Soledad | Servita + Penitencia | Viernes Santo + Domingo de Resurrección | NO EXISTE | CREAR UNA SOLA CORPORACIÓN |
| 7 | Hermandad de Nuestra Señora del Rocío de Coria del Río | Gloria / filial rociera | Romería del Rocío | NO EXISTE | CREAR |
| 8 | Hermandad Sacramental de Nuestra Señora de la Estrella | Gloria + Sacramental | 8 de septiembre | EXISTE | PRESERVAR |

### Regla de identidad

No crear fichas separadas para:

- **Hermandad de la Paz** y **Piedad de San José**: son dos estaciones de penitencia de la misma Hermandad de San José;
- **Gran Poder** y **Hermandad de Nuestra Señora del Carmen**: el propio Consejo usa el mismo título corporativo; se modela una sola Hermandad;
- **Soledad de Viernes Santo** y **Soledad / Resucitado del Domingo de Resurrección**: una sola Hermandad, con Salidas distintas.

Esto evita tres duplicidades estructurales antes de empezar.

---

## 2 · Corporaciones existentes en Hilo

### 2.1 · Borriquita de Coria del Río

**Entidad existente:** `20f519f8-54ee-46e0-a4ab-aa524c13227b`  
**Slug:** `borriquita-coria-del-rio`

Ya publica:

- identidad;
- historia;
- sede;
- web oficial;
- Domingo de Ramos;
- Santísimo Cristo de la Salud en su Sagrada Entrada en Jerusalén;
- una Salida anunciada para noviembre de 2026;
- dos Fuentes directas.

Deuda nuclear:

- **María Santísima de la Victoria** como titular estructurada;
- **2 Pasos** de Semana Santa acreditados en 2026;
- relación Imagen ↔ Paso;
- Cultos solo si existe Fuente directa suficiente;
- estación de penitencia 2026 como Salida separada, solo si se acredita celebración;
- acompañamientos 2026 únicamente con Fuente identificada.

Fuentes actuales ya canónicas:

1. Web oficial de la Hermandad  
   https://www.borriquitadecoria.es/
2. Consejo de Hermandades de Coria · ficha de Borriquita  
   https://www.consejohermandadescoria.com/hermandad-de-la-borriquita
3. Turismo Provincia de Sevilla · Semana Santa Coria 2026  
   https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-coria-del-rio

### 2.2 · Estrella de Coria del Río

**Entidad existente:** `f5b142a7-5f4e-44e5-b862-444244d30d56`  
**Slug:** `estrella-coria-del-rio`

Ya publica:

- identidad Gloria + Sacramental;
- historia;
- sede;
- web oficial;
- Nuestra Señora de la Estrella Coronada;
- Paso de la Virgen;
- 4 Cultos;
- Coronación 2025;
- Ofrenda / Divino Lucero 2026;
- procesión del 8 de septiembre de 2026;
- Fuentes directas.

**Regla:** preservar. No convertir su profundidad actual en excusa para reescribir la ficha dentro del lote municipal.

Fuentes ya canónicas:

1. https://www.estrellapatronadecoria.es/
2. https://www.estrellapatronadecoria.es/Fiestas-Patronales/
3. https://www.estrellapatronadecoria.es/newpage
4. Consejo de Hermandades · Estrella  
   https://www.consejohermandadescoria.com/hdad-sacramental-de-ntra-sra-de-la-estrella

---

## 3 · Corporaciones ausentes

### 3.1 · Jesús Cautivo

**Título documentado:**  
Humilde y Fervorosa Hermandad de Nuestro Padre Jesús Cautivo, Nuestra Señora del Dulce Nombre de María, San Lucas Evangelista y Santa Ángela de la Cruz.

**Sede:** Capilla de Jesús Cautivo.  
**Jornada:** Lunes Santo.  
**Pasos 2026:** 2.  
**Titulares procesionales 2026:** Nuestro Padre Jesús Cautivo y Nuestra Señora del Dulce Nombre de María.

Cronología prudente:

- origen vecinal / agrupación en torno a la imagen desde la década de 1970;
- el Consejo documenta el proceso que culmina en **Hermandad de Penitencia el 28 de febrero de 1990**;
- Turismo Provincia resume fundación en 1983.

No forzar un único año si las Fuentes representan etapas jurídicas distintas. `foundation_text` debe conservar la secuencia.

Fuentes:

1. Consejo · Jesús Cautivo  
   https://www.consejohermandadescoria.com/quienes-somos
2. Turismo Provincia · Semana Santa 2026  
   https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-coria-del-rio

### 3.2 · Hermandad de San José / Jesús de la Paz

**Título documentado:**  
Hermandad Sacramental y Cofradía de Nazarenos de Nuestro Padre Jesús de la Paz en su Presentación al Pueblo, María Santísima de Gracia y Esperanza, Piedad del Santísimo Cristo de la Misericordia, Nuestra Señora de los Dolores, San Juan Evangelista y Patriarca Bendito Señor San José.

**Sede:** Parroquia de San José.

Cronología:

- grupo fundacional / Fraternidad Cristiana: 1990;
- Agrupación Parroquial en el proceso inicial;
- Hermandad de Penitencia: 2007;
- Piedad incorporada posteriormente;
- primera estación de la Piedad: 2018.

Salidas que deben modelarse bajo la **misma Hermandad**:

#### Martes Santo
- Nuestro Padre Jesús de la Paz en su Presentación al Pueblo;
- María Santísima de Gracia y Esperanza;
- 2 Pasos.

#### Sábado Santo
- Piedad del Santísimo Cristo de la Misericordia y Nuestra Señora de los Dolores;
- 1 Paso;
- grupo de José Antonio Navarro Arteaga documentado en 2017.

Fuentes:

1. Consejo · Hermandad de San José  
   https://www.consejohermandadescoria.com/newpage
2. Turismo Provincia · Semana Santa 2026  
   https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-coria-del-rio
3. Horarios 2026 publicados en prensa local para contraste de Salidas  
   https://www.aljarafedigital.com/aljarafe/coria-del-rio/horarios-y-recorridos-de-la-semana-santa-de-coria-del-rio-2026/

**Regla:** no crear una Hermandad `Piedad de San José` independiente.

### 3.3 · Gran Poder y Nuestra Señora del Carmen

**Título documentado:**  
Antigua Hermandad de Jesús Nazareno y Cofradía de Marineros, Fervorosa Hermandad de Nuestro Padre Jesús del Gran Poder y Nuestra Señora del Carmen.

**Sede:** Parroquia de Santa María de la Estrella.  
**Jornada penitencial:** Miércoles Santo.  
**Pasos 2026:** 2.  
**Titulares:** Nuestro Padre Jesús del Gran Poder y Nuestra Señora del Carmen.

El Consejo documenta además la dimensión marinera y los cultos / procesión de Nuestra Señora del Carmen en julio.

**Regla estructural:** Gran Poder y Carmen son la misma corporación; no crear dos fichas de Hermandad.

Fuentes:

1. Consejo · Gran Poder  
   https://www.consejohermandadescoria.com/hermandad-del-gran-poder
2. Consejo · Nuestra Señora del Carmen  
   https://www.consejohermandadescoria.com/hermandad-de-ntra-sra-del-carmen
3. Turismo Provincia · Semana Santa 2026  
   https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-coria-del-rio

### 3.4 · Vera+Cruz / Cerro

**Título documentado:**  
Humilde y Antigua Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Vera+Cruz, Purísima Concepción de María Santísima y San Juan Bautista.

**Sede:** Ermita de San Juan Bautista, calle San Juan nº 42.  
**Jornada:** Jueves Santo.  
**Pasos 2026:** 2.  
**Titulares 2026:** Santísimo Cristo de la Vera Cruz y Purísima Concepción de María Santísima.

Cronología:

- origen situado en torno a 1500 / principios del siglo XVI;
- documentación abundante del siglo XVI;
- no convertir una aproximación histórica en una fecha exacta de fundación.

Fuentes:

1. Consejo · Vera+Cruz  
   https://www.consejohermandadescoria.com/hermandad-de-vera-cruz
2. Turismo Provincia · Semana Santa 2026  
   https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-coria-del-rio

### 3.5 · Soledad

**Título documentado:**  
Muy Antigua, Fervorosa y Venerable Hermandad Servita y Cofradía de Nazarenos del Santo Entierro, Cristo Resucitado y Nuestra Señora de la Soledad Coronada.

**Sede:** Capilla de Nuestra Señora de la Soledad.

El Consejo sitúa la corporación a finales del siglo XVI y cita documentación anterior —referencias de 1567/1569 y poder de 1578—. Conservar esa incertidumbre histórica en texto.

La misma Hermandad articula dos momentos distintos:

#### Viernes Santo
- Santo Entierro;
- Nuestra Señora de la Soledad;
- 2 Pasos según Turismo Provincia 2026.

#### Domingo de Resurrección
- Santísimo Cristo Resucitado;
- Nuestra Señora de la Soledad Coronada;
- 2 Pasos;
- Los Abrazos.

**Regla:** una Hermandad + varias Salidas. No crear una segunda ficha para Resurrección.

Fuentes:

1. Consejo · Soledad  
   https://www.consejohermandadescoria.com/hermandad-de-la-soledad
2. Turismo Provincia · Semana Santa 2026  
   https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-coria-del-rio
3. Horarios 2026 para contraste de Viernes y Domingo  
   https://www.aljarafedigital.com/aljarafe/coria-del-rio/horarios-y-recorridos-de-la-semana-santa-de-coria-del-rio-2026/

### 3.6 · Nuestra Señora del Rocío

**Título documentado:**  
Real, Imperial, Ilustre y Antigua Hermandad de Nuestra Señora del Rocío de Coria del Río.

**Sede:** Capilla de Nuestra Señora del Rocío.  
**Fundación:** 21 de abril de 1849 según la ficha del Consejo.

No forma parte de las seis estaciones de penitencia, pero sí del universo municipal cofrade y debe entrar en el cierre integral.

Fuente:

1. Consejo · Hermandad del Rocío  
   https://www.consejohermandadescoria.com/newpagea377262a
2. Ayuntamiento de Coria · registro municipal de asociaciones  
   https://www.ayto-coriadelrio.es/es/municipio/asociaciones/

---

## 4 · Mapa de Salidas 2026

El universo de penitencia no equivale a seis Salidas.

| Jornada | Corporación | Salida a modelar |
|---|---|---|
| Domingo de Ramos | Borriquita | Estación de Penitencia 2026 |
| Lunes Santo | Jesús Cautivo | Estación de Penitencia 2026 |
| Martes Santo | San José | Paz + Gracia y Esperanza |
| Miércoles Santo | Gran Poder / Carmen | Gran Poder + Carmen |
| Jueves Santo | Vera+Cruz | Vera+Cruz + Purísima |
| Viernes Santo | Soledad | Santo Entierro + Soledad |
| Sábado Santo | San José | Piedad |
| Domingo de Resurrección | Soledad | Resucitado + Soledad / Los Abrazos |

La Fuente provincial acredita que las salidas cubren todas las jornadas salvo Madrugada.

**Actualidad:** ninguna Salida se elevará automáticamente a `held` por haber pasado la fecha. Cada una necesita evidencia posterior o una Fuente inequívocamente retrospectiva.

### 4.1 · Mapa de titulares y Pasos

Este mapa fija únicamente identidades y relaciones que ya pueden sostenerse con las Fuentes reunidas. La autoría se conserva con el grado de certeza publicado por cada Fuente.

| Corporación / Salida | Titulares procesionales | Autoría / cronología documentada | Pasos a modelar | Estado previo al lote |
|---|---|---|---:|---|
| Borriquita | Stmo. Cristo de la Salud en su Sagrada Entrada en Jerusalén · María Stma. de la Victoria | Ambas imágenes vinculadas a Darío Fernández Parra en la documentación actual de la corporación | 2 | Cristo ya existe; Virgen y ambos Pasos pendientes |
| Jesús Cautivo | N. P. Jesús Cautivo · Ntra. Sra. del Dulce Nombre de María | Cautivo: talla del s. XVII vinculada al círculo de Pedro Roldán; Dolorosa: Fernando Castejón López, encargo documentado en 1986 | 2 | Todo pendiente de alta/reutilización exacta |
| San José · Martes Santo | N. P. Jesús de la Paz · María Stma. de Gracia y Esperanza | Fernando Castejón López; cronología documentada en los primeros años de la década de 1990 | 2 | Pendiente |
| San José · Sábado Santo | Piedad del Stmo. Cristo de la Misericordia y Ntra. Sra. de los Dolores | Grupo de José Antonio Navarro Arteaga documentado en 2017 | 1 | Pendiente; no crear Hermandad independiente |
| Gran Poder / Carmen | N. P. Jesús del Gran Poder · Ntra. Sra. del Carmen | Francisco Buiza: Señor 1973 · Virgen 1972 | 2 | Pendiente; una sola Hermandad |
| Vera+Cruz | Stmo. Cristo de la Vera+Cruz · Purísima Concepción de María Stma. | Cristo anónimo, en torno a 1500 · Purísima: Rafael Barbero Medina, 1953 | 2 | Pendiente |
| Soledad · Viernes Santo | Cristo Yacente · Ntra. Sra. de la Soledad Coronada | Yacente: Francisco Buiza, 1972 · Soledad: imagen histórica de autoría no cerrada en este corte | 2 | Pendiente |
| Soledad · Domingo de Resurrección | Cristo Resucitado · Ntra. Sra. de la Soledad Coronada | Resucitado: Luis Peyré Azcárraga; encargo 1944 y recepción documentada en 1948 | 2 posiciones procesionales | **Pendiente identidad física del Paso de la Virgen**: no asumir que es un cuarto Paso distinto del Viernes Santo |
| Rocío | Simpecado / representación corporativa según modelo y Fuente final | No forzar Imagen devocional física si la corporación se representa mediante Simpecado | 0 por defecto | Seguir el patrón relacional de otras Hermandades del Rocío; no fabricar Paso |
| Estrella | Ntra. Sra. de la Estrella Coronada | Ya documentada en Hilo | 1 | PRESERVAR |

**Bloqueo residual de Pasos:** la única ambigüedad física relevante antes de planificar el lote está en la estructura usada por la Virgen de la Soledad el Domingo de Resurrección. Hasta resolver si es el mismo Paso transformado, unas andas distintas o una estructura específica, no se asignará un cuarto nodo por comodidad.

### 4.2 · Acompañamientos musicales 2026

Fuente transversal principal:

- El Muñidor del Aljarafe 2026 · edición digital  
  https://aljarafeymas.com/system/images/20386/original/EL_MU%C3%91IDOR_DEL_ALJARAFE_2026_-_EDICION_DIGITAL.pdf

La guía se usa para fijar **vigencia 2026**, no continuidad posterior.

| Jornada | Corporación | Posición | Formación 2026 | Decisión |
|---|---|---|---|---|
| Domingo de Ramos | Borriquita | Cristo | AM Nuestro Padre Jesús Nazareno · La Palma del Condado | Documentar 2026; resolver identidad global antes de CREATE |
| Domingo de Ramos | Borriquita | Virgen | AC Amigos de la Música · Herrera | Documentar 2026; resolver identidad global antes de CREATE |
| Lunes Santo | Cautivo | Cristo | AM Nuestro Padre Jesús Nazareno · La Algaba | Documentar 2026; resolver identidad global antes de CREATE |
| Lunes Santo | Cautivo | Virgen | Banda Municipal de Lora del Río | Documentar 2026; resolver identidad global antes de CREATE |
| Martes Santo | San José / Paz | Misterio | CCTT Nuestra Señora del Rosario · Arriate | Documentar 2026; no sustituir por contratos posteriores |
| Martes Santo | San José / Paz | Palio | Banda de Música Las Golondrinas · Vélez-Málaga | Documentar 2026 |
| Miércoles Santo | Gran Poder / Carmen | Cristo | BCT Nuestro Padre Jesús del Gran Poder · Coria del Río | Crear Banda local si supera preflight de identidad |
| Miércoles Santo | Gran Poder / Carmen | Virgen | Banda Municipal de Música de Coria del Río | REUSE del nodo canónico tras reconciliar duplicado |
| Jueves Santo | Vera+Cruz | Cristo | Capilla Musical | Conservar como crédito/posición; no crear entidad ambigua sin identidad |
| Jueves Santo | Vera+Cruz | Virgen | Banda Municipal de Música de Coria del Río | REUSE |
| Viernes Santo | Soledad | Cristo Yacente | Capilla Musical | Conservar como crédito/posición si no se resuelve identidad |
| Viernes Santo | Soledad | Virgen | Banda Municipal de Música de Coria del Río | REUSE |
| Sábado Santo | San José / Piedad | — | **La guía 2026 no consigna acompañamiento** | NO INFERIR desde años anteriores |
| Domingo de Resurrección | Soledad | Cristo Resucitado | AM Santa Cecilia de Sevilla | REUSE de `6d6ceee7-53d0-4705-a58c-fadc364cb322` |
| Domingo de Resurrección | Soledad | Virgen | Banda Municipal de Música de Coria del Río | REUSE |
| Domingo de Resurrección | Soledad | posición adicional | AM San Lucas Evangelista de Coria del Río aparece en otra guía 2026 | **ROL / TRAMO PENDIENTE**; no crear asignación hasta resolverlo |

### 4.3 · Reglas de actualidad musical

- El contrato de **Paterna del Campo** con la Hermandad de San José corresponde a 2027–2028: no se presenta como vigencia 2026.
- Los acompañamientos históricos de la Piedad —incluidos De Profundis o Capilla Calvarium en fuentes antiguas— no se elevan a 2026 sin prueba actual.
- Una Banda citada en la guía 2026 no obliga a crear un nodo: antes se busca identidad canónica global y Fuentes suficientes.
- Para Capillas sin identidad inequívoca se admite crédito textual antes que un nodo dudoso.
- La Banda Municipal de Coria solo puede quedar publicada una vez después de la reconciliación de IDs.

---

## 5 · Universo musical local

### 5.1 · Banda Municipal de Música de Coria del Río

La evidencia institucional y social resuelve que los dos nodos actuales representan **una sola formación**.

#### Nodo A
- ID: `63f719d8-61ab-4357-a43f-cc7977bdda43`
- Nombre: Banda de Música Municipal de Coria del Río
- Slug: `banda-musica-municipal-coria-del-rio`
- Relaciones actuales:
  - Estrella de Coria;
  - Servitas;
  - Pastora de Santa Marina;
  - varias asignaciones de Salida de Coria y Sevilla.

#### Nodo B
- ID: `870f7ec0-8a57-4652-96ff-05725104a47b`
- Nombre: Banda Municipal de Música de Coria del Río
- Slug: `banda-municipal-musica-coria-del-rio`
- Relación actual:
  - Borriquita de Dos Hermanas 2026.

#### Evidencia de identidad

El Ayuntamiento publica una única **Banda de Música de Coria del Río**, nacida aproximadamente en 1986 desde el Aula Municipal de Música.

El canal social agregado de la formación se presenta como **Banda Municipal de Música de Coria del Río**.

Fuentes:

1. Ayuntamiento · Banda de Música de Coria del Río  
   https://www.ayto-coriadelrio.es/es/cultura/banda-municipal-de-musica/
2. Perfil agregado oficial de BM Coria  
   https://linktr.ee/bandadecoria

#### Reconciliación prevista

Aplicar el patrón ya certificado para Los Gitanos Juvenil:

- conservar un ID canónico;
- mover todas las relaciones musicales del duplicado;
- mover / preservar sus Fuentes;
- archivar el duplicado sin borrar el ID;
- no borrar histórico;
- verificar todas las tablas con `band_entity_id`.

**Candidato canónico:** `63f719d8-61ab-4357-a43f-cc7977bdda43`, por ser el nodo ya utilizado por la trazabilidad global de Bandas y concentrar el mayor grafo relacional.

**Nombre público a normalizar:** `Banda Municipal de Música de Coria del Río`.

Antes del Apply deben revisarse al menos:

- `accompaniments`;
- `band_agents`;
- `band_colors`;
- `band_names`;
- `band_premieres`;
- `band_releases`;
- `concert_event_bands`;
- `current_music_accompaniments`;
- `march_recordings`;
- `music_accompaniment_periods`;
- `musical_repertoires`;
- `outing_music_assignments`;
- cualquier vista derivada.

### 5.2 · Agrupación Musical San Lucas Evangelista de Coria del Río

No existe hoy en Hilo Cofrade.

El Ayuntamiento la recoge como asociación musical y el Consejo la cita entre las formaciones que participan en las Fiestas Patronales.

Fuentes:

1. Ayuntamiento · Asociaciones  
   https://www.ayto-coriadelrio.es/es/municipio/asociaciones/
2. Consejo · Fiestas Patronales  
   https://www.consejohermandadescoria.com/fiestas-patronales

**Acción prevista:** CREATE, solo cuando se complete identidad, canales y acompañamientos actuales documentados.

### 5.3 · Banda de Cornetas y Tambores de Nuestro Padre Jesús del Gran Poder de Coria del Río

No existe hoy en Hilo Cofrade.

El Ayuntamiento registra la **Asociación Cultural Musical Banda de Cornetas y Tambores de Nuestro Padre Jesús del Gran Poder de Coria del Río**. El Consejo la menciona como **Banda Gran Poder Coria**.

Fuentes:

1. Ayuntamiento · Asociaciones  
   https://www.ayto-coriadelrio.es/es/municipio/asociaciones/
2. Consejo · Fiestas Patronales  
   https://www.consejohermandadescoria.com/fiestas-patronales

**Acción prevista:** CREATE cuando quede resuelta la denominación pública actual y los acompañamientos vigentes.

### 5.4 · Banda Artística Coriana

El registro municipal contiene el nombre `Banda Artística Coriana`.

Sin embargo, la historia institucional de la Banda Municipal presenta a la Banda Artística Coriana como antecedente histórico de la tradición bandística anterior a la Guerra Civil.

**No entra como Banda actual** hasta que una Fuente demuestre que hoy existe como formación independiente.

---

## 6 · Matriz mínima de Fuentes

| Entidad | Fuente institucional de identidad | Fuente 2026 | Fuente propia | Estado |
|---|---|---|---|---|
| Borriquita | Consejo | Turismo Provincia | borriquitadecoria.es | SUFICIENTE |
| Jesús Cautivo | Consejo | Turismo Provincia | pendiente | SUFICIENTE PARA INVENTARIO |
| San José / Paz | Consejo | Turismo Provincia + horarios 2026 | pendiente | SUFICIENTE PARA INVENTARIO |
| Gran Poder / Carmen | Consejo | Turismo Provincia | pendiente | SUFICIENTE PARA INVENTARIO |
| Vera+Cruz | Consejo | Turismo Provincia | pendiente | SUFICIENTE PARA INVENTARIO |
| Soledad | Consejo | Turismo Provincia + horarios 2026 | pendiente | SUFICIENTE PARA INVENTARIO |
| Rocío | Consejo + Ayuntamiento | no aplica a Semana Santa | pendiente | SUFICIENTE PARA IDENTIDAD |
| Estrella | Consejo | no aplica a Semana Santa | estrellapatronadecoria.es | SUFICIENTE |
| Banda Municipal | Ayuntamiento | relaciones ya publicadas + fuentes de cada acompañamiento | Linktree / canales BM Coria | IDENTIDAD RESUELTA |
| AM San Lucas | Ayuntamiento + Consejo | pendiente | pendiente | IDENTIDAD RESUELTA / VIGENCIA PENDIENTE |
| BCT Gran Poder | Ayuntamiento + Consejo | pendiente | pendiente | IDENTIDAD RESUELTA / VIGENCIA PENDIENTE |

---

## 7 · Reutilización prevista

### REUSE directo

- municipio Coria del Río;
- Borriquita;
- Cristo de la Salud de la Borriquita;
- Estrella;
- Virgen de la Estrella Coronada;
- Paso de la Estrella;
- Cultos y Salidas existentes de Estrella;
- nodo canónico de la Banda Municipal `63f719d8…`;
- lugares canónicos existentes solo cuando la identidad coincida exactamente.

### UPDATE previsto, todavía no ejecutado

- Borriquita: completar grafo;
- Banda Municipal canónica: normalizar denominación, identidad, canales y relaciones;
- relaciones que hoy apunten al nodo musical duplicado.

### CREATE previsto, todavía no ejecutado

- 6 Hermandades ausentes;
- sus titulares no existentes;
- Pasos verificables;
- Salidas 2026 verificables;
- AM San Lucas;
- BCT Gran Poder;
- Fuentes y `source_links`.

### ARCHIVE previsto

- nodo duplicado de Banda Municipal `870f7ec0…`, **solo después** de haber trasladado y verificado todas sus relaciones.

No se borrará el ID.

---

## 8 · Bloqueos reales antes del lote

### Resueltos

- universo corporativo: **8 corporaciones**;
- Gran Poder/Carmen: misma corporación;
- San José/Paz/Piedad: misma corporación;
- Soledad/Resurrección: misma corporación;
- duplicidad conceptual de Banda Municipal: **misma formación**;
- nodo musical canónico propuesto: `63f719d8…`.

### Pendientes

1. **Piedad del Sábado Santo:** acompañamiento 2026 no documentado en la guía actual; no inferirlo;
2. **Domingo de Resurrección:** resolver la posición o tramo exacto de AM San Lucas Evangelista antes de crear asignación;
3. Fuentes propias / canales oficiales de las cinco penitenciales ausentes y Rocío, cuando existan;
4. completar autoría y cronología de titulares solo donde una Fuente suficiente permita precisión mayor;
5. cerrar identidad física de los Pasos, especialmente el utilizado por la Virgen de la Soledad el Domingo de Resurrección;
6. comprobar Salidas 2026 una a una como `held` o `announced`;
7. Cultos recurrentes solo donde haya evidencia directa;
8. inventario exhaustivo de relaciones del nodo musical duplicado antes de archivarlo;
9. resolver identidad canónica global de las Bandas externas citadas en 2026 antes de cualquier CREATE.

---

## 9 · No entra

- fotografías sin licencia verificable;
- escudos sin procedencia apta;
- patrimonio exhaustivo por defecto;
- responsables actuales sin Fuente inequívoca;
- acompañamientos deducidos por años anteriores;
- 2027 inferido desde 2026;
- Banda Artística Coriana como nodo actual sin prueba de identidad independiente;
- una ficha separada de Carmen;
- una ficha separada de Piedad;
- una ficha separada de Resurrección;
- excepciones nominales del buscador;
- DDL o cambios de RLS.

---

## 10 · Puerta de construcción del lote

No construir Apply hasta completar una segunda auditoría con:

- TOTAL de operaciones;
- INSERT;
- UPDATE;
- REUSE;
- ARCHIVE;
- Fuentes nuevas;
- enlaces de Fuente;
- titulares;
- Pasos;
- Cultos;
- Salidas;
- posiciones musicales.

Preflight obligatorio:

`0 INVALID · 0 UNRESOLVED · 0 AMBIGUOUS · 0 COLLISION`

Y guardas específicas:

- 8 Hermandades canónicas al final;
- 1 sola Banda Municipal publicada;
- 0 relaciones conservadas en el nodo musical archivado;
- 0 slugs duplicados;
- 0 imágenes o Pasos compartidos por homonimia;
- 0 Salidas duplicadas;
- 0 eventos paralelos para actos ya modelados;
- 0 DDL;
- 0 RLS.

---

## Observación de Auditor

1. La deuda de Coria es mayor de lo que mostraba el simple 2+2 del grafo: el universo real son **8 corporaciones canónicas**.
2. Las seis Hermandades de Penitencia generan **8 jornadas/salidas**, porque San José sale Martes y Sábado y Soledad sale Viernes y Domingo de Resurrección.
3. El principal riesgo de identidad queda resuelto antes de Apply: los dos nodos de Banda Municipal representan una sola formación.
4. El cierre debe incorporar también Rocío, no solo Semana Santa, para que el municipio sea realmente integral.
5. AM San Lucas y BCT Gran Poder son deuda musical real; Banda Artística Coriana no se eleva a formación actual sin evidencia adicional.
6. Borriquita debe completarse; Estrella debe preservarse.
7. El mapa musical 2026 y el núcleo de titulares/Pasos ya están cerrados. El próximo movimiento autorizado es **resolver los dos residuos musicales, Salidas held/announced, Fuentes propias y el plan cuantificado del lote**, todavía sin Apply.

**Estado:** `INVENTARIO CANÓNICO CERRADO · MÚSICA 2026 CASI CERRADA · MAPA TITULARES/PASOS FIJADO · APPLY NO INICIADO`.
