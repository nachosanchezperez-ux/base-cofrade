# Hilo Cofrade · Certificación documental

## Hermandad Mayor de Nuestra Señora de Setefilla

**Corte:** 5 de septiembre de 2026  
**Rama:** `content/cierra-setefilla-modelo-propio`  
**Base:** `main = 5bc3a35639b37baf8148340262033f95c70a4639`  
**Régimen:** `FIRST EDITION FREEZE` activo

**SETEFILLA → 🟢 CERTIFICADA · 93 % TÉCNICO · COMPLETA SEGÚN SU IDIOSINCRASIA · GRAFO CLEAN**

## 1 · Criterio de modelado

Setefilla no se trata como una Gloria urbana convencional.

La ficha distingue cuatro realidades que no deben confundirse:

1. **Santuario de Nuestra Señora de Setefilla** → sede canónica de la Hermandad y residencia ordinaria de la Sagrada Imagen.
2. **Parroquia de Nuestra Señora de la Asunción** → referencia parroquial, Capilla de la Virgen, sede fija de la Novena y residencia temporal de la Imagen cuando se encuentra en Lora.
3. **Casa de la Virgen** → sede social, secretaría y museo de la Hermandad.
4. **Idas y Venidas** → ciclo propio que determina la residencia física de María Santísima de Setefilla y no constituye una salida anual.

No se ha creado UX, tabla, DDL ni arquitectura nueva: todo se representa con `places`, `entity_locations`, `outing_series`, `outing_series_movements`, `outings`, `cults` y relaciones ya existentes.

## 2 · Identidad e historia

La identidad se completa sin fijar una fecha fundacional artificiosa.

Se documenta:

- origen corporativo en la Cofradía de Nuestra Señora de la Encarnación de Setefilla, surgida en Lora del Río a mediados del siglo XVI;
- título de **Hermandad Mayor** consolidado desde 1887;
- origen medieval de la devoción en la antigua bailía sanjuanista;
- despoblación de Setefilla en 1534 y traslado del centro humano de la devoción a Lora del Río;
- ceremonial de la Romería del 8 de septiembre documentado desde 1587;
- confirmación pontificia del Patronazgo el 05/12/1986;
- Coronación Canónica el 08/09/1987.

## 3 · Titular

Se estructura **María Santísima de Setefilla** como titular:

- Virgen con Niño;
- talla medieval de madera, de tradición gótica;
- 71 cm de altura;
- concebida originalmente como Virgen sedente mostrando al Niño;
- adaptada al uso de vestiduras en 1592;
- Patrona de Lora del Río y su comarca.

No se inventa autor material de la escultura.

## 4 · Ubicación real de la Imagen

La residencia de la Imagen queda temporalizada:

- **01/05/2022 → 12/10/2024** · Parroquia de Nuestra Señora de la Asunción, tras la Venida de 2022.
- **Desde 12/10/2024** · Santuario de Nuestra Señora de Setefilla, tras la Ida de 2024.

A **5 de septiembre de 2026**, la web oficial confirma que la Sagrada Imagen se encuentra en su Ermita de la Sierra.

Esto evita mostrar la Asunción como residencia actual cuando la Virgen se encuentra en Setefilla.

## 5 · Sedes

### Sede canónica

**Santuario de Nuestra Señora de Setefilla**  
Carretera de Lora del Río a Puebla de los Infantes · km 11.

### Sede social

**Casa de la Virgen**  
Calle José Montoto y González de la Hoyuela, 25 · Lora del Río.

Se registra además la Parroquia de Nuestra Señora de la Asunción como lugar parroquial y de cultos, sin confundirla con la sede social ni con la residencia permanente de la Imagen.

## 6 · Andas y patrimonio procesional

Se crea el paso **Andas de plata de María Santísima de Setefilla**.

La historia oficial documenta su realización durante la mayordomía de Alonso Ramírez de Montalbo, entre 1686 y 1703, por el platero sevillano **Diego Gallegos**.

Queda estructurada:

- entidad de paso;
- relación Hermandad → andas;
- relación Imagen → andas;
- fase de ejecución;
- autor Diego Gallegos como agente de orfebrería;
- Fuente específica de la historia oficial.

## 7 · Cultos

Se estructuran seis cultos recurrentes:

1. Misa del primer sábado de mes en el Santuario, excepto julio, agosto y septiembre.
2. Función de la Encarnación, en torno al 25 de marzo, celebrada donde se encuentre la Imagen.
3. Solemne Novena, del 30 de agosto al 7 de septiembre, **siempre en la Parroquia de la Asunción**.
4. Función Principal de Instituto, el 8 de septiembre, en el Santuario o en la Asunción según la residencia de la Imagen.
5. Besamanos del 8 de septiembre, tras la Función Principal.
6. Sabatina semanal en la Capilla de la Virgen de la Asunción.

### Actualidad 2026

Se crean tres ocurrencias exactas:

- 30/08–07/09/2026 · Novena en la Asunción · en curso al corte del 5 de septiembre;
- 08/09/2026 · Función Principal en el Santuario;
- 08/09/2026 · Besamanos en el Santuario.

La ubicación de los cultos de 2026 es coherente con la residencia actual de la Imagen.

## 8 · Romería

La Romería se modela como **serie recurrente propia**:

- fecha: **8 de septiembre**;
- los romeros llegan al Santuario desde Lora por el Camino de la Virgen, carretera y otros medios tradicionales;
- a las **11:00** se inicia la procesión de la Imagen alrededor del Santuario;
- a continuación se celebra la Función Principal y el Besamanos.

La salida de 2026 ya existente queda vinculada a esta serie, con origen y destino en el Santuario y estado `announced` al corte del 5 de septiembre.

No se presenta como una procesión urbana por las calles de Lora.

## 9 · Idas y Venidas

Se crea una segunda serie independiente: **Idas y Venidas de María Santísima de Setefilla**.

### Venida

- Santuario → Lora → Parroquia de la Asunción;
- ordinariamente al cumplirse cinco años desde la última devolución de la Imagen a la Ermita;
- puede celebrarse extraordinariamente por necesidad;
- requiere el ceremonial propio de petición y Cabildo.

### Ida

- Asunción → Santuario;
- se acuerda tras la estancia de la Virgen en Lora;
- la Hermandad procura que la estancia no supere dos años, salvo graves motivos.

Se incorporan como hitos reales del ciclo reciente:

- **01/05/2022** · Venida a Lora del Río;
- **12/10/2024** · Ida al Santuario · salida a las 08:00.

## 10 · Música

`music = false` en la métrica técnica.

**No se considera deuda.**

Las Fuentes canónicas de la Romería y del ceremonial de Idas/Venidas no convierten un acompañamiento de banda en requisito estructural del culto. No se inventa una formación musical para alcanzar un porcentaje artificial.

Por ello, **93 % técnico equivale a cierre documental completo para la idiosincrasia de Setefilla**.

## 11 · Fuentes

Se priorizan y contextualizan:

- web oficial · Historia;
- web oficial · Romería;
- web oficial · Idas y Venidas;
- web oficial · Cultos;
- web oficial · Santuario;
- web oficial · Visítanos;
- web oficial · Casa Hermandad;
- Ayuntamiento de Lora del Río · Venida 2022;
- Ayuntamiento de Lora del Río · Ida 2024;
- BOE · declaración BIC del conjunto de Setefilla;
- actualidad oficial de septiembre de 2026 para la Novena.

Las Fuentes se enlazan al contexto concreto: Hermandad, titular, andas, fase de ejecución, ubicación, culto, ocurrencia anual, serie o salida.

## 12 · QA final

- completitud técnica: **93 %**;
- escudo: sí;
- identidad: sí;
- sede canónica: sí;
- titular: **1**;
- paso/andas: **1**;
- fases de paso: **1**;
- cultos: **6**;
- ocurrencias exactas 2026: **3**;
- salidas: **3**;
- series recurrentes: **2**;
- acontecimientos históricos: **2**;
- ubicaciones temporales de la Imagen: **2**;
- slugs nuevos duplicados: **0**;
- Hermandad→Imagen huérfanas: **0**;
- Hermandad→Paso huérfanas: **0**;
- series huérfanas: **0**;
- acontecimientos sin `involves`: **0**;
- salidas futuras marcadas como celebradas: **0**.

## 13 · Restricciones

- DDL: **0**;
- tablas nuevas: **0**;
- migraciones estructurales: **0**;
- RLS: **0**;
- UX nueva: **0**;
- arquitectura nueva: **0**;
- #492: permanece aislada.

## 14 · Cierre

**SETEFILLA → 🟢 CERRADA Y CERTIFICADA.**

La ficha ya no se mide contra una Gloria ordinaria: queda representada conforme a su propia lógica devocional, territorial y temporal utilizando exclusivamente el modelo vigente de Hilo Cofrade.
