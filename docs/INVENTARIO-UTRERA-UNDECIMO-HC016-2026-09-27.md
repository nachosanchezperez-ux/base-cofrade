# Utrera · inventario de identificación HC-016

**Corte:** 27/09/2026, Europe/Madrid.
**Fase autorizada:** inventario documental fila por fila tras el recálculo provincial.
**Resultado:** identificación y conciliación inicial terminadas; **modelo no congelado y NO-GO a manifiesto/Apply** mientras persistan las cuestiones de identidad descritas.
**Escrituras productivas:** 0. Sin staging, SQL editorial, dry-run, Apply, DDL o cambios RLS.

## 1. Base real

main sigue en `25c5fc12a35be8ae144d1a4fa5cde98469301562`; producción `dpl_39jFfrkgwkS1KRJtroE5QNFXBc31` READY sobre ese SHA, con aliases hilocofrade.es/www. PR abierta de producto observada: #1000 (GA4), independiente. Supabase ACTIVE_HEALTHY; 17 migraciones consultadas. Morón permanece cerrado, sin repetir sus operaciones. HC-AUTO-03 no se toca.

Municipio canónico: `e4319248-831a-4f4c-adb8-19c496f95dd6`.

La base contiene tres Hermandades publicadas vinculadas al municipio, tres relaciones con Imágenes y tres con Pasos. El palio de las Angustias está en estado **review**, no publicado. Hay cuatro Salidas con municipio Utrera: tres vinculadas a estas Hermandades y otra de las Marismas sin Hermandad. Ninguna sustituye las quince salidas históricas de esta propuesta.

La consulta adicional revisa un catálogo de 479 entidades de tipo Hermandad/Banda, además de coincidencias por nombre/slug y relaciones municipales. Los filtros textuales son exclusivamente de descubrimiento. Las decisiones futuras de escritura exigirán UUIDs exactos y un preflight nuevo.

## 2. Frontera documental

- **11 corporaciones:** diez penitenciales y la Sacramental de Santa María.
- **15 Salidas históricas 2026:** trece penitenciales y dos eucarísticas de Resurrección.
- **23 posiciones de Paso** en los trece cortejos penitenciales. No equivalen todavía a 23 objetos físicos distintos.
- **34 imágenes identificadas individualmente** por nombre en el núcleo procesional; dos ya existen. No es un censo de todos los titulares corporativos ni de todas las figuras de los misterios.
- Dos conjuntos pendientes de individualización: dos hebreas de Borriquita y las figuras de la Columna de Vera-Cruz.
- Siete sedes; tres REUSE y cuatro candidatas nuevas.
- Veinte acompañamientos musicales anunciados y tres posiciones sin música documentada como silencio. Las dos salidas eucarísticas no tienen música determinada en esta matriz.

El programa oficial del Consejo recuperado desde un espejo tiene 40 páginas. Se verificaron visualmente portada 2026, editor y páginas de Santo Entierro/Resurrección. El índice público de galerías del Consejo corrobora los quince cortejos. Las horas del programa son **horas anunciadas**, no mediciones de lo sucedido. Las fechas históricas no deben generar eventos futuros ni trasladarse a 2027.

Quedan fuera de este núcleo penitencial/eucarístico las Glorias, romerías, Corpus, cultos anuales y extraordinarias ya existentes. Consolación Coronada se **preserva**, sin confundirla con los Muchachos de Consolación. Rocío, Fátima, María Auxiliadora y pedanías no se consideran cubiertas por este inventario; tampoco se abren automáticamente. No se certifica «todo Utrera cerrado».

## 3. Hermandades fila por fila

Las claves H/L/I/B/O son identificadores documentales, no nuevos UUIDs de producción. NEW significa candidata para futura creación tras conciliación final, no operación aprobada.

| Clave | Corporación | Acción | Tipos acreditados | Sede |
|---|---|---|---|---|
| H01 | Trinidad | NEW | Penitencia | L01 |
| H02 | Jesús Nazareno | REUSE | Penitencia | L02 |
| H03 | Quinta Angustia | NEW | Penitencia | L03 |
| H04 | Muchachos de Consolación | NEW | Penitencia | L04 |
| H05 | Estudiantes | NEW | Penitencia | L05 |
| H06 | Aceituneros | NEW | Penitencia | L03 |
| H07 | Redentor Cautivo / Sacramental de Santiago | NEW | Penitencia + Sacramental | L06 |
| H08 | Gitanos | NEW | Penitencia | L06 |
| H09 | Vera-Cruz / Santo Entierro | REUSE | Penitencia | L07 |
| H10 | Milagros | NEW | Penitencia | L03 |
| H11 | Sacramental de Santa María | NEW | Sacramental | L03 |

REUSE:
- H02: `4e462b02-979d-4b88-ab98-0c97f2dbf0a0` · `hermandad-jesus-nazareno-utrera`.
- H09: `7bab2fe6-c69e-48e5-9446-a247b4169910` · `vera-cruz-santo-entierro-utrera`.
- Consolación, fuera del núcleo y protegida: `8d4e62d9-a428-4363-afc7-6a2f9e8c1450`.

Decisiones antiduplificación:
- Borriquita y Trinidad pertenecen a H01; Huerto y Nazareno, a H02; Vera-Cruz y Santo Entierro, a H09.
- Redentor Cautivo y Sacramental de Santiago son H07; Santa María es H11.
- H07 debe conservar ambas dimensiones, Penitencia y Sacramental.
- H11 solo tiene Sacramental acreditado: no inferir Penitencia por la fecha.
- Trinidad tiene Penitencia acreditada. Su posible dimensión Gloria exige una fuente específica; la palabra Rosario en el título no basta.
- Los homónimos de Sevilla, Osuna y Carmona no son reutilizables para Utrera.

## 4. Salidas fila por fila

Fuente F01; páginas físicas del PDF, numeradas desde la portada. Zona horaria Europe/Madrid. Las recogidas posteriores a medianoche tienen el día siguiente explícito en el JSON.

| Clave | Hermandad | Cortejo | Fecha | Salida | Recogida prevista | Posiciones | Página |
|---|---|---|---|---|---|---|---|
| O01 | H01 | Borriquita | 2026-03-29 | 11:00 | 14:15 | 1 | 4 |
| O02 | H03 | Quinta Angustia | 2026-03-29 | 17:30 | 23:30 | 2 | 6 |
| O03 | H02 | Oración en el Huerto | 2026-03-29 | 17:30 | 22:00 | 1 | 8 |
| O04 | H04 | Muchachos de Consolación | 2026-03-30 | 18:00 | 2026-03-31 00:45 | 2 | 10 |
| O05 | H05 | Estudiantes | 2026-03-31 | 19:00 | 2026-04-01 00:00 | 2 | 12 |
| O06 | H06 | Aceituneros | 2026-04-01 | 19:00 | 2026-04-02 00:00 | 2 | 14 |
| O07 | H01 | Trinidad | 2026-04-02 | 19:00 | 2026-04-03 00:15 | 2 | 18 |
| O08 | H07 | Redentor Cautivo | 2026-04-02 | 22:00 | 2026-04-03 01:45 | 2 | 20 |
| O09 | H08 | Gitanos | 2026-04-03 | 00:30 | 05:30 | 2 | 22 |
| O10 | H02 | Jesús Nazareno | 2026-04-03 | 06:30 | 12:45 | 2 | 26 |
| O11 | H09 | Vera-Cruz | 2026-04-03 | 19:30 | 2026-04-04 00:20 | 2 | 28 |
| O12 | H10 | Milagros | 2026-04-03 | 22:30 | 2026-04-04 01:30 | 1 | 30 |
| O13 | H09 | Santo Entierro | 2026-04-04 | 19:15 | 22:45 | 2 | 32 |
| O14 | H07 | Resurrección · Santiago | 2026-04-05 | 11:45 | No consta | Palio de mano | 34 |
| O15 | H11 | Resurrección · Santa María | 2026-04-05 | 13:00 | 13:30 | Palio de mano | 36 |

No crear dos imágenes del Santísimo ni dos Pasos de palio de costaleros para O14/O15. El palio eucarístico es un bien patrimonial distinto de un Paso procesional de imagen; la Salida puede existir sin esas relaciones. La hora de recogida de Santiago permanece sin determinar.

## 5. Pasos y música por posición

| Posición | Representación | Música | ID de Paso existente |
|---|---|---|---|
| O01-P1 | Entrada en Jerusalén | B01 | Por modelar |
| O02-P1 | Caridad y Piedad | B02 | Por modelar |
| O02-P2 | Ángeles | B03 | Por modelar |
| O03-P1 | Oración en el Huerto | B04 | Por modelar |
| O04-P1 | Perdón | B04 | Por modelar |
| O04-P2 | Amargura | B05 | Por modelar |
| O05-P1 | Amor / Lanzada | B06 | Por modelar |
| O05-P2 | Veredas | B07 | Por modelar |
| O06-P1 | Columna de Aceituneros | B08 | Por modelar |
| O06-P2 | Paz | B09 | Por modelar |
| O07-P1 | Afligidos | B10 | Por modelar |
| O07-P2 | Desamparados | B11 | Por modelar |
| O08-P1 | Cautivo | Silencio | Por modelar |
| O08-P2 | Lágrimas | Silencio | Por modelar |
| O09-P1 | Buena Muerte | B12 | Por modelar |
| O09-P2 | Esperanza | B13 | Por modelar |
| O10-P1 | Nazareno | B04 | Por modelar |
| O10-P2 | Angustias | B14 | REUSE b51dd99d-97fe-4636-b35e-59ac8fa92dc5 |
| O11-P1 | Columna de Vera-Cruz | B12 | Por modelar |
| O11-P2 | Dolores | B15 | Por modelar |
| O12-P1 | Milagros | B16 | Por modelar |
| O13-P1 | Yacente | Silencio | Por modelar |
| O13-P2 | Dolores en Soledad | B15 | Por modelar |

- O08: el programa declara que no lleva música; ambas posiciones quedan en silencio.
- O13-P1: el programa solo asigna música al palio; **F12** explicita el silencio del Yacente. No se dedujo de una omisión.
- O12: hay coro, por tanto no corresponde registrar silencio.
- O11-P2/O13-P2: misma imagen de Dolores, con distinta presentación. El soporte físico y sus configuraciones aún deben conciliarse. **22 Pasos canónicos es una hipótesis si se confirma soporte común; 23 posiciones sí están documentadas.**
- El Paso de Angustias `b51dd99d-97fe-4636-b35e-59ac8fa92dc5` debe reutilizarse y revisarse; su estado actual es review. No crear un segundo palio.
- El único periodo musical preexistente de Jesús corresponde a **1989**, is_current=false; se preserva y no se extiende a 2026.
- El programa acredita acompañamiento anunciado para 2026; no autoriza un periodo indefinido o una renovación 2027.

### Bandas y conjunto vocal

| Clave | Formación | Decisión | UUID existente |
|---|---|---|---|
| B01 | AM Virgen de la Esperanza · Alcalá la Real | NEW_CANDIDATE | No localizado |
| B02 | CCyTT Nazareno · Utrera | NEW_CANDIDATE | No localizado |
| B03 | BM El Saucejo | REUSE | c0160037-0406-4000-8000-000000000006 |
| B04 | AM Muchachos de Consolación · Utrera | NEW_CANDIDATE | No localizado |
| B05 | BM Municipal Coria del Río | REUSE | 63f719d8-61ab-4357-a43f-cc7977bdda43 |
| B06 | CCyTT Expiración · Quesada | NEW_CANDIDATE | No localizado |
| B07 | BM Municipal Arahal | REUSE | 95e4daf1-9db6-4bdb-805a-9f68833c8da1 |
| B08 | CCyTT Cristo de los Remedios · Castilleja de la Cuesta | NEW_CANDIDATE | No localizado |
| B09 | Asociación Musical Nuestra Señora del Águila · Alcalá de Guadaíra | NEW_CANDIDATE | No localizado |
| B10 | CCyTT Nuestra Señora de los Llanos · Albacete | NEW_CANDIDATE | No localizado |
| B11 | BM Municipal Paterna del Campo | NEW_CANDIDATE | No localizado |
| B12 | CCyTT Vera-Cruz · Utrera | REUSE | c0160032-0406-4000-8000-000000000006 |
| B13 | BM Maestro Leyva · Churriana de la Vega | NEW_CANDIDATE | No localizado |
| B14 | BM Virgen de las Angustias · Sanlúcar la Mayor | REUSE | 8c35dfd4-342a-47ab-8d06-8c320255a29a |
| B15 | Asociación Musical de La Algaba | REUSE | aa0f526c-2b63-41f0-aa74-ecaa14365375 |
| B16 | Coro De Profundis | REVIEW_IDENTITY | e4884d0e-204e-408c-955e-b4c639de92c9 |

B16 es un REUSE **condicionado**: el perfil existente describe acompañamiento al Cristo de la Fundación. El nombre De Profundis no basta para probar que se trata del mismo coro que intervino en Utrera. No duplicar ni enlazar todavía.

Para Coria se selecciona el perfil publicado `63f719d8-61ab-4357-a43f-cc7977bdda43`; no reactivar el archivado `870f7ec0-8a57-4652-96ff-05725104a47b`.

Se detectan dos fichas publicadas de Álvarez Quintero (`7fafdc04-cb94-47d8-814f-5537639660ff` y `f492d28d-af48-4606-862c-89d5d3560a6b`). No figuran en los acompañamientos del núcleo seleccionado. Su posible duplicidad queda registrada como deuda externa; **no se fusionan ni bloquean este inventario por ello**.

## 6. Imágenes fila por fila

Nombres breves de identificación. La relación se identifica por **Hermandad + imagen**, nunca solo por advocación. Las autorías, atribuciones, fechas y restauraciones deben cerrarse en la matriz de fuentes del modelado; este registro no las inventa ni convierte atribuciones en certezas.

| Clave | Hermandad | Imagen | Acción | Página F01 |
|---|---|---|---|---|
| I01 | H01 | Jesús en su Entrada Triunfal | NEW_CANDIDATE | 4 |
| I02 | H01 | Santiago | NEW_CANDIDATE | 4 |
| I03 | H01 | San Pedro | NEW_CANDIDATE | 4 |
| I04 | H01 | San Juan | NEW_CANDIDATE | 4 |
| I05 | H01 | Cristo de los Afligidos | NEW_CANDIDATE | 18 |
| I06 | H01 | Virgen de los Desamparados | NEW_CANDIDATE | 18 |
| I07 | H02 | Jesús de la Oración en el Huerto | NEW_CANDIDATE | 8 |
| I08 | H02 | San Juan | NEW_CANDIDATE | 8 |
| I09 | H02 | San Pedro | NEW_CANDIDATE | 8 |
| I10 | H02 | Ángel confortador | NEW_CANDIDATE | 8 |
| I11 | H02 | Jesús Nazareno | NEW_CANDIDATE | 26 |
| I12 | H02 | Simón de Cirene | NEW_CANDIDATE | 26 |
| I13 | H02 | Virgen de las Angustias | REUSE | 26 |
| I14 | H03 | Cristo de la Caridad | NEW_CANDIDATE | 6 |
| I15 | H03 | Virgen de la Piedad | NEW_CANDIDATE | 6 |
| I16 | H03 | San Juan | NEW_CANDIDATE | 6 |
| I17 | H03 | María Magdalena | NEW_CANDIDATE | 6 |
| I18 | H03 | Virgen de los Ángeles | NEW_CANDIDATE | 6 |
| I19 | H04 | Cristo del Perdón | NEW_CANDIDATE | 10 |
| I20 | H04 | Virgen de la Amargura | NEW_CANDIDATE | 10 |
| I21 | H05 | Cristo del Amor | NEW_CANDIDATE | 12 |
| I22 | H05 | María Magdalena | NEW_CANDIDATE | 12 |
| I23 | H05 | Longinos | NEW_CANDIDATE | 12 |
| I24 | H05 | Virgen de las Veredas | NEW_CANDIDATE | 12 |
| I25 | H06 | Jesús Atado a la Columna | NEW_CANDIDATE | 14 |
| I26 | H06 | Virgen de la Paz | NEW_CANDIDATE | 14 |
| I27 | H07 | Jesús Redentor Cautivo | NEW_CANDIDATE | 20 |
| I28 | H07 | Virgen de las Lágrimas | NEW_CANDIDATE | 20 |
| I29 | H08 | Cristo de la Buena Muerte | NEW_CANDIDATE | 22 |
| I30 | H08 | Virgen de la Esperanza | NEW_CANDIDATE | 22 |
| I31 | H09 | Jesús Atado a la Columna | NEW_CANDIDATE | 28 |
| I32 | H09 | Virgen de los Dolores | REUSE | 28 |
| I33 | H09 | Cristo Yacente | NEW_CANDIDATE | 32 |
| I34 | H10 | Crucifijo de los Milagros | NEW_CANDIDATE | 30 |

REUSE:
- Angustias: `4550fd96-94d3-4929-8d61-af79ba7de8e7`.
- Dolores: `e875dbee-612f-4739-9f24-fd583d6b2df6`; también para su presentación de Soledad.

Las dos hebreas de Borriquita están documentadas colectivamente, sin identidad individual estable en la fuente revisada. Las figuras del misterio de Vera-Cruz tampoco tienen identificación suficiente en el programa. No crear «Hebrea 1», «Hebrea 2» ni sayones numerados para completar cifras.

San Juan Bosco, San Pedro titular corporativo de Aceituneros, Santa Ángela, el Cristo de Santiago y otros titulares presentes en los títulos requieren separar advocación, titularidad e imagen física. No se añade un nodo o Paso penitencial solo por aparecer en el nombre de una corporación.

Las páginas históricas contienen diferencias relevantes respecto al programa actual: la antigua Veredas fue sustituida y las referencias al ángel del Huerto distinguen la imagen perdida de la actual. La comparación debe conservar las intervenciones y sucesiones, sin mezclar objetos antiguos y vigentes.

## 7. Sedes

| Clave | Lugar | Acción | UUID |
|---|---|---|---|
| L01 | Capilla de la Trinidad | NEW_CANDIDATE | No localizado en el municipio |
| L02 | Capilla de San Bartolomé | REUSE | 9b425ed3-943b-4b77-b351-93d87467b1cc |
| L03 | Parroquia de Santa María de la Mesa | NEW_CANDIDATE | No localizado en el municipio |
| L04 | Santuario de Consolación | REUSE | 09fb4082-dd92-4fc4-bb25-41fff021d284 |
| L05 | Basílica de María Auxiliadora | NEW_CANDIDATE | No localizado en el municipio |
| L06 | Parroquia de Santiago el Mayor | NEW_CANDIDATE | No localizado en el municipio |
| L07 | Iglesia de San Francisco | REUSE | f9dc025c-094b-468f-ad7c-4ee55c7167e8 |

La sede compartida se modela una vez: Santa María reúne H03/H06/H10/H11; Santiago H07/H08. El Santuario ya existe por Consolación y se reutiliza para H04.

## 8. Protección de lo existente

Preservar las cuatro Salidas actuales:
- Consolación, 08/09/2026 · `d4debf08-2ffc-40ef-9e9b-001056634cf8`.
- Angustias, 03/10/2026 · `1ccf8096-c5e3-417e-a7f4-97ad3a799492`.
- Dolores, traslado 19/09/2026 · `b639727d-e6c1-43fb-a4ea-22ec6230d58c`.
- Marismas, 19/09/2026, sin Hermandad · `9210cbbb-e66e-415e-9f50-ca18ccb97d93`.

No reclasificar sus estados de celebración, corregir pedanías ni aprovechar esta fase para editar extraordinarias. Las andas de Consolación 2026 y el trono histórico de 1964 tampoco pertenecen al inventario de Pasos penitenciales.

## 9. Puerta hacia el modelado

Inventario de identificación: **completo para el núcleo declarado**. Censo municipal integral: **no realizado**. Manifiesto ejecutable: **no preparado**.

Antes de congelar un manifiesto:
1. Resolver soporte/configuración de Dolores–Soledad.
2. Confirmar identidad del coro De Profundis.
3. Cerrar la matriz de atributos y fuentes por imagen/Paso, manteniendo anónimos y atribuciones; decidir el tratamiento colectivo de figuras no individualizadas.
4. Resolver la clasificación adicional de Trinidad sin inferencias y revisar posibles titulares mixtos.
5. Revisar reutilización final de las bandas candidatas, lugares y nodos sin municipio; reservar UUIDs solo entonces.
6. Incluir la barrera obligatoria de tipos sobre todas las Hermandades del universo, también REUSE; prohibir arrays vacíos, NULL, casing inválido y tipos duplicados.

No se pide autorización para corregir datos ahora: **esta fase termina en documentación revisable**. El siguiente paso recomendado es resolver estas cuestiones dentro del modelado de Utrera, antes de generar el manifiesto.

## 10. Fuentes y evidencia

- **F01** · [Programa oficial Semana Santa Utrera 2026](https://aljarafeymas.com/system/images/20374/original/itinerario-ss-utrera-2026-1.pdf).
- **F02** · [Consejo: galerías Semana Santa 2026](https://consejodehermandadesdeutrera.org/semana-santa/semana-santa-de-utrera-2026/).
- **F03** · [Consejo: directorio corporativo histórico](https://www.consejodehermandadesdeutrera.com/Hermandades/).
- **F04** · [Consejo: Jesús Nazareno](https://www.consejodehermandadesdeutrera.com/Hermandades/Jesus_Nazareno.php).
- **F05** · [Consejo: Muchachos](https://www.consejodehermandadesdeutrera.com/Hermandades/Muchachos-Consolacion.php).
- **F06** · [Consejo: Estudiantes](https://www.consejodehermandadesdeutrera.com/Hermandades/Estudiantes.php).
- **F07** · [Consejo: Aceituneros](https://www.consejodehermandadesdeutrera.com/Hermandades/Aceituneros.php).
- **F08** · [Consejo: Gitanos](https://www.consejodehermandadesdeutrera.com/Hermandades/Gitanos.php).
- **F09** · [Consejo: Vera-Cruz](https://www.consejodehermandadesdeutrera.com/Hermandades/Vera-Cruz.php).
- **F10** · [Consejo: Sacramental Santa María](https://www.consejodehermandadesdeutrera.com/Hermandades/Sacramental.php).
- **F11** · [Utrera al día: Milagros, crónica 04/04/2026](https://utreraaldia.com/el-senor-del-altozano-y-el-recogimiento-del-crucifijo-de-los-milagros-marcan-el-viernes-santo-directo/).
- **F12** · [Utrera al día: Santo Entierro 04/04/2026](https://utreraaldia.com/el-luto-y-el-silencio-cerraran-la-semana-santa-de-utrera-con-el-santo-entierro-este-sabado/).

F01: SHA-256 `caa85cdc7ac250fcf62d99ce2c03e582301e6d324f33c13b42d6fe34f2e10242`; copia espejo de una publicación del Consejo, no una redacción independiente del medio. La URL original del descargable falló y Caminos de Pasión redirigió a una landing; no se atribuye a esas respuestas una lectura válida del PDF.

F03–F10: fuentes institucionales históricas, útiles para identidad y trayectoria, no para copiar horarios o cargos actuales. F11 es extracto indexado; F12 se leyó íntegra. No se reproducen el PDF, fotografías ni textos editoriales completos en el repositorio.

- [Inventario estructurado](./evidence/inventario-utrera-2026-09-27/inventory.json).
- [Snapshot de producción](./evidence/inventario-utrera-2026-09-27/production-snapshot.json).
- [Consultas de solo lectura](./evidence/inventario-utrera-2026-09-27/queries.sql).
- [Recálculo provincial previo](./RECALCULO-PROVINCIAL-UNDECIMO-HC016-2026-09-27.md).
