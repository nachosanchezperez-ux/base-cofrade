# Preflight específico · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** PREFLIGHT CERRADO · pendiente de plan row-by-row  
**Municipio:** Lebrija  
**Municipality ID:** `07281b21-d892-4e5d-aa63-24ec0e9bf4d2`  
**Namespace candidato:** `c0160033-*` · libre, todavía no reservado  
**Staging:** 0 · **Apply:** 0 · **DDL:** 0 · **RLS:** 0

## 1. Baseline

- `main`: `9bd786f9cb52f6eafb875dc8157c89da47fabfa5`;
- PR abiertas antes de esta rama: **0**;
- Vercel producción: `dpl_BT63ZkKMKUgoKVnyyRYDve3TPTtP` · **READY** · mismo SHA que `main`;
- Supabase: **ACTIVE_HEALTHY**;
- migraciones: **12/12**;
- namespace `c0160033-*`: **0 filas** en tablas nucleares e importador;
- bulk imports `c0160033-*`: **0**;
- Hermandades de Lebrija publicadas actualmente: **1**.

## 2. Universo corporativo

Se mantiene el universo de **12 corporaciones canónicas**:

1. Entrada Triunfal.
2. Oración en el Huerto.
3. Humildad.
4. Ecce-Homo / Los Gitanos.
5. Castillo.
6. Dolores.
7. Vera-Cruz.
8. Santo Sepulcro.
9. Soledad.
10. Rocío.
11. San Benito.
12. Hermandad Sacramental.

Guardas:

- Aurora **no** crea Hermandad independiente: es titular de Humildad.
- Castillo Gloria **no** crea segunda corporación: Castillo es mixta.
- Dolores sacramental **no** absorbe a la Hermandad Sacramental histórica.
- Santo Sepulcro y Soledad siguen siendo dos Hermandades.

## 3. Resolución de las ocho incertidumbres

### 3.1 Humildad / Aurora · RESUELTO

La Hermandad tiene **tres pasos penitenciales** en Miércoles Santo.

La Aurora tiene además un **Paso de Gloria propio y documentado**, utilizado cada 15 de agosto. La web oficial explica que procede del antiguo paso del Señor de la Humildad, después usado por San Juan, pero en su configuración y uso actual constituye el **Paso de Gloria de Nuestra Señora de la Aurora**.

Decisión de modelo:

- 3 Pasos penitenciales;
- 1 Paso de Gloria de Aurora;
- no reutilizar como el mismo nodo uno de los Pasos penitenciales actuales;
- 1 Hermandad, 4 titulares.

### 3.2 Dolores · RESUELTO

El Consejo documenta **cuatro pasos** y la Hermandad tiene cuatro titulares procesionales:

- Nuestro Padre Jesús Nazareno;
- María Santísima de los Dolores;
- San Juan Evangelista;
- Santa Mujer Verónica.

La propia documentación describe además el Paso de San Juan y las andas de la Verónica.

Decisión:

- 4 Imágenes;
- 4 Pasos;
- 4 relaciones Hermandad–Imagen;
- 4 Hermandad–Paso;
- 4 Imagen–Paso.

### 3.3 Rocío · RESUELTO

El elemento identitario procesional es el **Simpecado**, que desde 1986 realiza el camino en una **carreta de plata**.

Decisión:

- crear Hermandad del Rocío;
- modelar el Simpecado y la carreta como patrimonio, no como `step`;
- crear la salida `held` del 19/05/2026 hacia El Rocío;
- no fabricar Imagen titular ni Paso convencional.

### 3.4 San Benito · RESUELTO DE FORMA CONSERVADORA

La salida procesional de 2026 está documentada el **10/07/2026 a las 21:00** desde el Convento de las Hermanas Concepcionistas / iglesia de San Sebastián.

El título publicado por el Ayuntamiento en 2025 identifica a la corporación como Hermandad de **San Benito Abad, Nuestra Señora del Perpetuo Socorro y San Antón**.

Decisión:

- crear la Hermandad;
- crear a San Benito Abad como Imagen titular;
- crear salida `held` 10/07/2026;
- crear quinario 2026 y su edición;
- **no crear todavía un Paso de San Benito**: las fuentes consultadas acreditan procesión, pero no definen con suficiente precisión el objeto físico para congelar un nodo `step`.

### 3.5 Hermandad Sacramental · RESUELTO DE FORMA CONSERVADORA

La identidad corporativa es distinta de Dolores.

No se ha localizado una Fuente 2026 suficientemente inequívoca que permita fijar una salida eucarística propia con fecha, horario y carácter.

Decisión:

- crear la corporación;
- no crear salida 2026;
- no crear Paso/Custodia;
- dejar Corpus, patrimonio y Cultos como hueco legítimo hasta evidencia actual suficiente.

### 3.6 Música 2026 · RESUELTO PARA EL ALCANCE SEGURO

Se incorporan únicamente relaciones inequívocas:

1. Humildad · Paso del Señor · **Agrupación Musical Ntro. Padre Jesús de los Afligidos de Puente Genil**.
2. Humildad · Paso de palio de la Victoria · **Banda de Música Maestro Agripino Lozano de San Fernando**.
3. Aurora · Rosario 15/08/2026 · **Banda Municipal Ntra. Sra. del Rosario de El Cuervo de Sevilla**.
4. Dolores · paso de palio de María Santísima de los Dolores · **Banda de Música Maestro Agripino Lozano de San Fernando**.

No se incorporan por ahora acompañamientos de Entrada Triunfal, Oración, Ecce-Homo, Castillo penitencial, Vera-Cruz, Santo Sepulcro, Soledad, Rocío o San Benito si no aparece Fuente 2026 directa suficiente durante el row-by-row.

### 3.7 Bandas externas · RESUELTO

Producción no contiene nodos canónicos de:

- Agrupación Musical Ntro. Padre Jesús de los Afligidos de Puente Genil;
- Banda de Música Maestro Agripino Lozano de San Fernando;
- Banda Municipal Ntra. Sra. del Rosario de El Cuervo de Sevilla.

Se prevén **3 altas de Banda**, con municipios soporte si todavía no existen.

La Banda de Música Virgen del Castillo de Lebrija se reutiliza y no se duplica.

### 3.8 Fuentes existentes · RESUELTO

Se preservan y reutilizan las ocho Fuentes ya presentes vinculadas a Lebrija, entre ellas:

- Ayuntamiento · Ermita del Castillo y Patrona;
- cambio de sede del Castillo 2026;
- Día de la Virgen 2026;
- Feria y Fiestas Patronales 2026;
- Castillo · Cultos;
- Castillo · sede canónica;
- Castillo · traslados;
- repertorio musical 2026 de la Banda Virgen del Castillo.

No se volverán a insertar esas URLs o fuentes internas.

## 4. Inventario físico congelado para el row-by-row

### Hermandades

- 11 nuevas;
- 1 REUSE: Castillo.

### Imágenes

Base segura para planificación:

- Entrada Triunfal: 3;
- Oración: 3;
- Humildad: 4;
- Ecce-Homo: 3;
- Castillo: 3, de las cuales 1 REUSE —Virgen del Castillo—;
- Dolores: 4;
- Vera-Cruz: 2;
- Santo Sepulcro: 1;
- Soledad: 1;
- San Benito: 1;
- Rocío: 0 como `image`;
- Sacramental: 0 por ahora.

Total relacional previsto: **25 Imágenes** · **24 nuevas + 1 REUSE**.

### Pasos

- Entrada Triunfal: 2;
- Oración: 3;
- Humildad penitencial: 3;
- Aurora: 1;
- Ecce-Homo: 2;
- Castillo: 2;
- Dolores: 4;
- Vera-Cruz: 2;
- Santo Sepulcro: 1;
- Soledad: 1;
- San Benito: 0 en esta fase;
- Rocío: 0;
- Sacramental: 0.

Total: **21 Pasos nuevos**.

## 5. Salidas 2026

### Nuevas y `held`

- 9 estaciones de penitencia de Semana Santa 2026;
- Rocío · 19/05/2026;
- San Benito · 10/07/2026;
- Aurora · 15/08/2026.

Total seguro: **12 Salidas nuevas `held`**.

### REUSE

- Castillo · procesión patronal · 12/09/2026 · ya existe en Hilo.

El row-by-row decidirá si conviene añadir una `outing_series` a esta salida existente mediante UPDATE.

## 6. Cultos seguros 2026

Sin perseguir exhaustividad:

### Aurora

- Besamano 07/08/2026;
- Triduo 10–12/08/2026;
- Función 15/08/2026.

### San Benito

- Quinario 04–08/07/2026;
- Función Principal 08/07/2026, si se conserva separada del último día del quinario en el modelo.

No se duplican los tres Cultos 2026 ya existentes del Castillo.

## 7. Lugares

### REUSE

- Parroquia de Ntra. Sra. de la Oliva;
- Ermita de Ntra. Sra. del Castillo;
- Convento de la Purísima Concepción.

### Alta segura pendiente de IDs

- Parroquia de Santa María de Jesús;
- Capilla de la Aurora;
- Iglesia / Capilla de Belén;
- Iglesia de San Francisco.

La sede 2026 de San Benito reutiliza el Convento de la Purísima Concepción.

La Ermita de San Benito puede incorporarse como sede canónica histórica si el row-by-row confirma la denominación y relación vigente.

## 8. Patrimonio específico

El row-by-row puede incorporar, sin forzar nuevos tipos:

- Simpecado de la Hermandad del Rocío;
- carreta de plata del Simpecado;
- patrimonio procesional de San Benito solo si existe Fuente suficiente;
- elementos patrimoniales de Pasos no forman parte del mínimo de cierre municipal.

## 9. Fuentes nuevas mínimas

El plan deberá registrar, como mínimo:

- Consejo · itinerarios / Pasos;
- Consejo · Dolores;
- Consejo · Ecce-Homo;
- Consejo · Soledad;
- Consejo · Rocío;
- Consejo · San Benito;
- Ayuntamiento · balance Semana Santa 2026;
- Ayuntamiento · Rocío 2026;
- Ayuntamiento · San Benito 2026;
- Humildad · Miércoles Santo;
- Humildad · Paso de Gloria;
- Humildad · Aurora 2026;
- Humildad · renovaciones musicales;
- El Pespunte · Agripino Lozano en Humildad y Dolores;
- web oficial Banda Municipal de El Cuervo;
- referencia institucional de Afligidos;
- web/historia Agripino Lozano;
- fuentes oficiales de Entrada Triunfal, Oración, Castillo, Vera-Cruz, Santo Sepulcro y Sacramental ya enumeradas en el inventario.

## 10. Guardas antes del plan row-by-row

El siguiente documento deberá:

1. congelar IDs deterministas;
2. ejecutar colisión de todos los IDs;
3. congelar slugs definitivos;
4. comparar URLs nuevas con `sources`;
5. reconciliar los municipios soporte de Puente Genil, San Fernando y El Cuervo;
6. decidir UPDATE exactos de Castillo;
7. asignar Fuente primaria a cada fila estructural;
8. cerrar `source_links` uno a uno;
9. producir recuento exacto INSERT/UPSERT / UPDATE / DELETE / REUSE.

## 11. Resultado del preflight

**PREFLIGHT LEBRIJA · CERRADO.**

Las ocho incertidumbres dejan de bloquear el lote.

No existe todavía:

- manifiesto;
- SQL de payload;
- bulk import;
- staging;
- Apply.

Siguiente puerta:

**plan row-by-row determinista → IDs/slugs/Fuentes exactos → recuento DML exacto → manifiesto.**
