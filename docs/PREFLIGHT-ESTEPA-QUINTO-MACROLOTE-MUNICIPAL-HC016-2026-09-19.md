# Preflight específico · Estepa · quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** PRE-LOTE · cierre de incertidumbres  
**Staging:** NO  
**Apply:** NO  
**DDL / RLS:** 0 / 0  
**HEAD de partida:** `74d8e1dc39655d2f19c58a79eee6d48574ec4031`

## 1. Puerta de entrada

- GitHub: 0 PR abiertas al comienzo del preflight.
- Vercel producción: `dpl_3XHahUicK55WfRK5NMGsTMNhFLj6` · READY · mismo SHA que main.
- Runtime: sin error/fatal en la ventana de control.
- Supabase: `ACTIVE_HEALTHY`.
- Migraciones: 12/12.
- Imports Estepa abiertos: 0.
- Hermandades Estepa publicadas: 1.
- Bandas Estepa publicadas: 0.
- Único frente municipal: Estepa · PRE-LOTE.

## 2. Resultado de las siete incertidumbres

### 2.1 Formaciones locales · RESUELTA

Se admiten como futuras Bandas canónicas:

1. **Banda de Música de Estepa (BAME)**  
   - entidad global nueva;
   - municipio: Estepa;
   - alias público previsto: `BAME`.

2. **Agrupación Musical Paz y Caridad de Estepa**  
   - entidad global nueva;
   - municipio: Estepa;
   - vinculada institucionalmente a Paz y Caridad.

3. **Agrupación Musical Dulce Nombre de Jesús de Estepa**  
   - entidad global nueva;
   - municipio: Estepa;
   - vinculada institucionalmente al Dulce Nombre.

4. **Capilla Musical Nuestra Señora de la Victoria de Estepa**  
   - entidad global nueva;
   - municipio: Estepa;
   - actividad y acompañamiento del Calvario documentados.

No existe ningún nodo de Banda de Estepa que pueda reutilizarse.

### 2.2 Formaciones externas · RESUELTA

Se resuelven como formaciones globales independientes:

5. **Banda de Cornetas y Tambores Santa Bárbara de La Línea de la Concepción**  
   - nueva Banda global;
   - municipio soporte nuevo: La Línea de la Concepción · Cádiz;
   - acompañó a la Borriquita de Estepa en 2026;
   - no se proyecta vigencia para 2027.

6. **Banda de Cornetas y Tambores Santa Vera+Cruz de Utrera**  
   - nueva Banda global;
   - municipio Utrera: REUSE;
   - acompañamiento de San Pedro en 2026.

7. **Agrupación Musical Vera Cruz de Campillos**  
   - nueva Banda global;
   - municipio soporte nuevo: Campillos · Málaga;
   - acompañamiento del Nazareno en 2026.

**Banda de Música Villa de Osuna** se reutiliza:
`75fc797d-f287-4813-9e52-8f5c5ddf56ad`.

### 2.3 Fuente duplicada · RESUELTA

URL duplicada:
`https://devocionesdeestepa.blogspot.com/2026/02/400-aniversario-de-la-hermandad-de-ntro.html`

- **CONSERVAR:** `72ac1537-8940-4455-8e8d-c17169baa0aa`
  - 3 relaciones existentes;
  - soporta las dos Salidas extraordinarias de noviembre y el Paso del Nazareno.
- **ELIMINAR EN EL FUTURO DML:** `dc375c1f-9318-4de9-ae1f-d1f10a7d050f`
  - 0 relaciones;
  - misma URL, nombre, fecha y publisher.

La limpieza será un DELETE determinista, únicamente después de comprobar todas las FK en el preflight global.

### 2.4 Pasos de Gloria · RESUELTA EN NÚCLEO

Se admiten cuatro Pasos de Gloria genéricos, sin inventar tallistas, dimensiones ni datos físicos no documentados:

- Paso procesional de Nuestra Señora de la Asunción.
- Paso procesional de Nuestra Señora de los Remedios Coronada.
- Paso procesional de Nuestra Señora del Carmen.
- Paso procesional de Santa Ana.

Evidencia suficiente:
- existencia procesional estable;
- referencias explícitas al paso/andas o baldaquino;
- actividad contemporánea documentada.

El futuro lote no incorporará patrimonio interno de estos Pasos salvo Fuente adicional.

### 2.5 Salidas de Gloria 2026 · RESUELTA

- **Remedios · 17/05/2026:** `held` por evidencia posterior.
- **Santa Ana · 26/07/2026:** `held` por crónica municipal posterior.
- **Asunción · 15/08/2026:** `announced`; existe convocatoria/seguimiento oficial del día, pero no se fuerza `held` sin evidencia posterior inequívoca.
- **Carmen · 12/09/2026:** `announced`; existe convocatoria específica de 2026, pero no se eleva por haber pasado la fecha.

No se crea Salida 2026 independiente para la Inmaculada por recurrencia.

### 2.6 Autorías · RESUELTA CON CAUTELA

Se estructuran únicamente las autorías/atribuciones suficientemente documentadas:

**REUSE agentes existentes**
- Francisco Berlanga de Ávila · `c0160500-0001-4000-8000-000000000006`
- Francisco Buiza Fernández · `160be307-5396-41a2-8903-7467a8c330f3`
- Luis Salvador Carmona · `00d90e7d-63e5-47b6-b78d-e784a5852430`
- Manuel Escamilla Cabezas · `dbb2cabe-b9c7-42ad-8009-cb5d60f1c0e1`

**INSERT agentes nuevos**
- Diego Márquez.
- Pedro de Mena.
- Andrés de Carvajal y Campos.

**Autorías/atribuciones nuevas previstas**
- Señor de la Entrada Triunfal → Francisco Berlanga de Ávila.
- María Santísima de la Victoria → Francisco Berlanga de Ávila.
- Nuestra Señora de las Angustias → atribuida a Diego Márquez.
- San Pedro Apóstol → atribuido a Pedro de Mena.
- Santísimo Cristo de Humildad y Paciencia → Diego Márquez.
- María Santísima de la Paz → Francisco Buiza Fernández.
- Santísimo Cristo de la Salud → Manuel Escamilla Cabezas.
- Santísimo Cristo Amarrado a la Columna → Andrés de Carvajal y Campos.

La autoría del Nazareno atribuida a Luis Salvador Carmona ya existe y se reutiliza.

No se estructura como autoría ninguna afirmación dudosa sobre las restantes Imágenes.

### 2.7 Cultos 2026 · RESUELTA EN MÍNIMO DOCUMENTADO

Se comprometen **8 Cultos + 8 ediciones 2026**:

1. Angustias · Función Principal de Instituto · 29/03/2026 · 09:00 · Santa Ana.
2. Angustias · Misa de Hermandad · 30/03/2026 · 09:30 · Santa Ana.
3. San Pedro · Misa de Hermandad · 31/03/2026 · 08:30 · La Asunción.
4. Estudiantes · Misa de Hermandad · 31/03/2026 · 20:30 · San Sebastián.
5. Dulce Nombre · Misa de Hermandad · 01/04/2026 · 11:00 · Los Remedios.
6. Calvario · Misa de Hermandad · 01/04/2026 · 19:30 · El Carmen.
7. Remedios · Función Principal · 17/05/2026 · 12:00 · Los Remedios.
8. Asunción · Función Principal de Instituto · 15/08/2026 · 11:00 · La Asunción.

Estado:
- Asunción 15/08: `held`, porque una Hermandad participante confirma posteriormente la celebración de la función.
- los otros siete: conservar `announced` salvo que antes del Apply aparezca prueba posterior específica de celebración.

No se deducen novenas, quinarios o triduos 2026 sin fechas directas suficientes.

## 3. Corrección del universo físico

El inventario jurídico inicial contaba 29 nombres titulares. Para el modelo `images`, el número correcto es:

### **28 Imágenes físicas canónicas**

San Pío X permanece en la denominación/titularidad institucional de Las Angustias, pero no se crea como `image` sin evidencia inequívoca de una talla titular independiente.

### Penitencia · 24 Imágenes

**Borriquita · 2**
- Nuestro Padre Jesús en su Entrada Triunfal en Jerusalén.
- María Santísima de la Victoria.

**Angustias · 2**
- Nuestra Señora de las Angustias.
- San José Obrero.

**San Pedro · 3**
- San Pedro Apóstol.
- Santo Cristo de las Penas.
- María Santísima de los Dolores.

**Estudiantes · 3**
- Santísimo Cristo del Amor.
- Nuestro Padre Jesús Cautivo y Rescatado.
- María Santísima del Valle.

**Dulce Nombre · 3**
- Dulce Nombre de Jesús.
- Santísimo Cristo de la Humildad y Paciencia.
- Nuestra Señora María Santísima de la Paz.

**Calvario · 3**
- Santísimo Cristo de la Salud.
- Nuestra Señora de la Amargura.
- San Juan Evangelista.

**Paz y Caridad · 3**
- Santísimo Cristo Amarrado a la Columna.
- María Santísima de la Esperanza Coronada.
- Pura y Limpia Concepción de María.

**Jesús Nazareno · 2**
- Nuestro Padre Jesús Nazareno · REUSE.
- María Santísima de los Dolores.

**Santo Entierro · 3**
- Cristo Yacente del Santo Entierro.
- Santísimo Cristo de la Buena Muerte.
- Nuestra Señora de la Soledad.

### Glorias · 4 Imágenes
- Nuestra Señora de la Asunción.
- Nuestra Señora de los Remedios Coronada.
- Nuestra Señora del Carmen.
- Santa Ana.

Resultado:
- total: 28;
- REUSE: 1;
- INSERT: **27**.

## 4. Pasos

### Penitencia · 14
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
11. Paso de Nuestro Padre Jesús Nazareno · REUSE/UPDATE.
12. Paso de palio de María Santísima de los Dolores · Nazareno.
13. Urna del Santo Entierro.
14. Paso de Nuestra Señora de la Soledad.

### Glorias · 4
15. Paso de Nuestra Señora de la Asunción.
16. Paso de Nuestra Señora de los Remedios Coronada.
17. Paso de Nuestra Señora del Carmen.
18. Paso de Santa Ana.

Resultado:
- total: 18;
- nuevos: **17**;
- existente en `review`: 1.

## 5. Paso del Nazareno · UPDATE, no INSERT

Nodo existente:
`c221206c-3a80-4aa7-9074-aea30d5f1343`

Relaciones existentes:
- `brotherhood_steps`: `8bf3d4de-c9f3-4e79-bd4e-4fef6c2a7adb` · `review`
- `image_steps`: `7fb4c76b-1859-4b4c-83d6-d42c23071e4a` · `review`

Plan:
1. UPDATE `entities.status` → `published`.
2. UPDATE `steps` con descripción segura desde Fuentes.
3. UPDATE `brotherhood_steps.status` → `published`.
4. UPDATE `image_steps.status` → `published`.

No se cambia el ID ni el slug.

## 6. Música · plan final

### Penitencia
- Borriquita → BCT Santa Bárbara de La Línea.
- Angustias → tambores destemplados fúnebres · crédito textual.
- San Pedro → BCT Santa Vera+Cruz de Utrera + BAME.
- Estudiantes → sin Banda.
- Dulce Nombre → AM Dulce Nombre de Estepa + BAME.
- Calvario → Capilla Musical Ntra. Sra. de la Victoria.
- Paz y Caridad → AM Paz y Caridad + BAME.
- Nazareno → AM Vera Cruz de Campillos + Banda Villa de Osuna.
- Santo Entierro → tambores fúnebres · crédito textual + BAME.

### Glorias
- Remedios → BAME.
- Asunción → BAME.
- Carmen → BAME.
- Santa Ana → sin asignación hasta disponer de evidencia musical directa.

### Recuento
- posiciones/asignaciones: **16**
- con Banda canónica: 14
- textuales: 2
- periodos musicales: **14**

Santa Bárbara se modelará como periodo 2026 cerrado/no vigente después de ese año, debido a la no renovación documentada.

## 7. Salidas 2026

### Penitencia · 9
Las nueve estaciones de penitencia de 2026 pueden entrar como `held`: el balance posterior de Semana Santa confirma el desarrollo de todas las jornadas y la salida de la totalidad de las Hermandades.

### Glorias · 4
- Remedios · `held`.
- Santa Ana · `held`.
- Asunción · `announced`.
- Carmen · `announced`.

### Extraordinarias Nazareno
Las dos Salidas de noviembre ya existentes se reutilizan y quedan fuera de INSERT:
- 02/11/2026.
- 15/11/2026.

Nuevas Salidas anuales: **13**.

## 8. Evento futuro

No existe en Supabase un evento equivalente a:

**La vocación cofrade como servicio a la Iglesia · 25/09/2026 · 21:00**

Se incorpora al plan como un único evento `announced`, relacionado con Jesús Nazareno y el 400.º aniversario.

## 9. Slugs y colisiones

Se preflightearon los slugs previstos de:
- 12 Hermandades nuevas;
- 27 Imágenes nuevas;
- 17 Pasos nuevos;
- 7 Bandas nuevas.

Resultado: **0 colisiones exactas en `entities.slug`**.

También:
- Campillos no existe todavía como municipio soporte.
- La Línea de la Concepción no existe todavía como municipio soporte.
- Utrera sí existe y se reutiliza.

## 10. Modelo

El cierre específico confirma:

- no DDL;
- no tablas nuevas;
- no cambios RLS;
- no excepciones de Estepa;
- no nuevo tipo de entidad;
- no necesidad de HC nuevo;
- HC-016 soporta toda la operación.

## 11. Puerta final del pre-lote

Estepa queda preparada para un manifiesto row-by-row.

La siguiente fase, todavía sin staging, es el documento:
`PLAN-ROW-BY-ROW-ESTEPA-HC016-2026-09-19.md`.

