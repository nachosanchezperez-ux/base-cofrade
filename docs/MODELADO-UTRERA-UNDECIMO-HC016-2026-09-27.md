# Utrera · modelo de edición y manifiesto HC-016

**Corte vigente: 27/09/2026. Alcance de edición congelado; manifiesto y dry-run preparados. No ejecutados.**

La orden posterior a Morón sitúa Utrera como próximo macrolote y exige detener después la expansión municipal para completar fichas y secciones existentes. Esta continuación resuelve las identidades y los títulos secundarios y entrega el [manifiesto fila por fila](./MANIFIESTO-DETERMINISTA-UTRERA-HC016-2026-09-27.md). No vuelve a cargar Morón ni interviene en HC-AUTO-03.

## Estado real

Main sigue en `2c751d493189fd9640f4f7dc29935efeaf5892a4`. Vercel `dpl_5zqJGYYHEpZENYkcMNncTuh5N4PV` está READY sobre ese SHA; aliases canónicos. La consulta del deployment vigente no devuelve errores/fatal en la última hora. Supabase está ACTIVE_HEALTHY con 17 migraciones. PR #1009 abierta, en borrador. No se fuerza deployment de producción.

En producción siguen las tres Hermandades de Utrera y las cuatro Salidas anteriores. Esta continuación ha realizado **0 escrituras productivas, 0 staging, 0 DDL y 0 cambios RLS**. El Paso de Angustias conserva todavía `review`: su publicación es una operación del candidato, no un hecho consumado.

Los cortes anteriores en `model-review.json`, `gloria-and-closure.json` y `steps-and-scope.json` se conservan. Sus puertas G01/G02/G05 son históricas respecto de las decisiones y UUID ahora recogidos en `identity-closure.json` y `manifest.json`. El validador anterior sigue reproduciendo aquel corte; la validación vigente es `manifest-validation.json`.

## Alcance resuelto para esta edición

| Bloque | Decisión |
|---|---|
| Núcleo institucional | Las 14 corporaciones identificadas por el Consejo; tres REUSE y once altas |
| ADMA | H15, Gloria, identidad propia y separada de Estudiantes. Salesianos la identifica como Archicofradía/Asociación; el catálogo público ya representa a ADMA de la Trinidad de Sevilla como Gloria |
| Borriquita de Trajano | H16, Agrupación Parroquial, con sede en San Pablo. Distinta de Romeros de Santa María la Blanca. No se declara erección posterior sin prueba |
| Marismas de Pinzón | H17, Agrupación Parroquial, denominación expresa del acta municipal F59. La parroquia figura como beneficiario jurídico de la romería. No se inventa sede canónica ni independencia jurídica |
| Resucitado | Dos imágenes en Santiago y un Vía Lucis con `organizer_name`, sin alta de Hermandad ni tipo canónico inferido |
| Pinzón: procesión existente | UUID `9210cbbb-e66e-415e-9f50-ca18ccb97d93` intacto. El convenio de la romería no prueba el organizador de la procesión de septiembre; no se enlaza automáticamente a H17 |
| Guadalema / Romeros de Trajano | Referencias parroquial y asociativa conservadas; no altas de Hermandades a partir de una subvención festiva |
| El Torbiscal | Revisión de fuentes cerrada para esta edición sin corporación acreditada; no se declara inexistencia universal |
| El Palmar de Troya | Fuera por municipio independiente desde 2018 |

Son **17 corporaciones del candidato**, incluidas las tres existentes. Congelar este universo hace ejecutable una edición documentada; no acredita un censo universal de toda asociación o devoción municipal. Las omisiones tienen decisión expresa y no se convierten en nuevas entidades por inferencia.

F59, páginas 28–30, resuelve el uso del nombre de Marismas como Agrupación; conserva una discordancia en la denominación de la parroquia. Por ello no se rellena `canonical_see_place_id`. No afecta a la identidad municipal de Pinzón ni autoriza una fusión con El Trobal, que pertenece a Los Palacios.

## Titulares y soportes

El candidato pasa de 38 a **47 imágenes**: añade Rosario y Beato Ceferino de Los Gitanos, la Inmaculada de la Sacramental de Santa María, las dos imágenes de María Auxiliadora, Resucitado y Estrella, y Borriquita y Consolación de Trajano.

- María Auxiliadora histórica y réplica de Buiza son dos objetos. Solo la réplica se vincula al Paso procesional del candidato. Las andas históricas de José Gil de 1912 no se identifican automáticamente con el soporte de 2026.
- La Inmaculada de Santiago mantiene dos lecturas de fecha/autoría: web corporativa y catálogo del Consejo. Se elimina la certeza artificial de 1798 y se conserva la atribución calificada.
- El San Pedro del frontal del palio de la Paz se representa como patrimonio del Paso. El título corporativo no genera una segunda escultura exenta.
- Los restantes títulos secundarios tienen resolución en la matriz: Santa Ángela, San Juan Bosco, San Bartolomé, Santa Bárbara, San Miguel, San Sebastián, San Antonio, Inmaculadas y devociones eucarísticas. Sin identificación material suficiente, no se crean objetos autónomos.
- La Concepción de Milagros sigue como titular sin relación procesional inferida. La Estrella no se incorpora al Vía Lucis de 2026 sin evidencia específica.
- Angustias y Dolores conservan sus UUID. No se borra la atribución tradicional de Angustias. Dolores mantiene un solo Paso S20 con dos configuraciones anuales.

Hay **25 Pasos y 25 posiciones**: los 22 soportes revisados más Auxiliadora, Borriquita de Trajano y Resucitado. El Paso de Trajano se describe según su documentación de 2019, sin fabricar una Salida de 2026. El Paso de Angustias incorpora texto y fuentes, y corrige una nota que daba el llamador por estrenado y mantenía una publicación pendiente: los proyectos siguen siendo proyectos mientras no se acredite su ejecución.

Los **6 bienes patrimoniales** son Simpecado y carreta del Rocío, carreta de Fátima, representación de San Pedro y dos palios eucarísticos. Estos últimos no se transforman en Pasos de costaleros ni en imágenes del Santísimo. Las cinco figuras de Vera-Cruz y las dos hebreas de Trinidad permanecen como conjuntos descritos, sin identidades individuales inventadas.

Consolación ya publicada se preserva íntegra. Su imagen y sus dos soportes anteriores están fuera de los 47/25 objetos revisados de este candidato; no se ocultan ni se recrean. Tras un eventual Apply el total municipal esperado sería 48 imágenes vinculadas/modeladas y 27 Pasos, sujeto al preflight actualizado, no a una afirmación anticipada de publicación.

## Salidas, música y actualidad

Se preparan **20 nuevas Salidas**: 7 `held` con evidencia vinculada y 13 `announced`. Las cuatro Salidas productivas, incluida la coronación futura de Angustias y Pinzón, se conservan sin DML. No se convierten fechas pasadas en celebraciones comprobadas.

Los quince itinerarios de Semana Santa proceden del programa oficial y se guardan como previstos. Se conservan los cambios de fecha tras medianoche. La partida del Rocío tiene crónica; el regreso mantiene anuncio. Fátima conserva hora y punto de partida nulos por discrepancia documental. La carreta descrita en 2022 no se asigna automáticamente a la romería de 2026.

El Vía Lucis vespertino del Resucitado es distinto de las dos procesiones eucarísticas matinales. ADMA conserva el anuncio del 24 de mayo y su acompañamiento de Álvarez Quintero. Los silencios explícitos no generan bandas ficticias. De Profundis conserva `e4884d0e-204e-408c-955e-b4c639de92c9`, con voces y acompañamiento instrumental documentados para Milagros.

## Deduplicación y payload

La lectura global revisó 3.622 entidades, 244 lugares, 2.445 fuentes, 153 perfiles de Banda y 693 agentes; después se contrastaron 84 denominaciones de Banda y 165 nombres de agentes. El snapshot municipal contiene las relaciones y filas previas completas de los UPDATE. Se leyeron constraints y triggers reales. El import futuro `c0160038-0000-4000-8000-000000000001` no existe; su identificador se reserva documentalmente, sin crear lote.

Se reutilizan los nodos anteriores de Juan Ventura y Álvarez Quintero. Sus duplicados detectados se registran como deuda futura; no se fusionan en esta orden. Pepe Romero permanece como crédito textual de Fátima, sin crear un agente o expandir su nombre por homonimia.

**1.173 operaciones propuestas: 1.166 INSERT, 7 UPDATE, 0 DELETE.** Las altas incluyen 14 corporaciones, 45 imágenes, 24 Pasos, 9 Bandas, 10 agentes y 6 bienes patrimoniales. Son operaciones de perfiles, relaciones y trazabilidad además de entidades; no 1.173 fichas nuevas. Los 7 UPDATE se limitan a Jesús, Vera-Cruz, la relación de Angustias y su Paso/relaciones. No actualizan otras corporaciones, Bandas existentes ni las Salidas anteriores.

## Puertas que quedan

El trabajo documental solicitado y el manifiesto quedan preparados. El SQL de dry-run está preparado. La auditoría posterior del lector público detecta **cuatro fichas que aún impiden recomendar Apply**: I44, I45 y S25 carecen del contexto corporativo que el lector exige hoy, y H17 carece de una relación sustantiva acreditada. La identidad documental está resuelta; la publicación completa de esas cuatro fichas no lo está. El siguiente trabajo es resolverlas sin fabricar relaciones. [Auditoría estática del contrato público](./evidence/modelado-utrera-2026-09-27/public-contract-audit.json).

El SQL incluye IDs explícitos, control de deriva, duplicados naturales con NULL, conteos por operación, preservación de columnas no autorizadas y comparación de filas ajenas. Incorpora la barrera de tipos de las 17 corporaciones, incluidas las REUSE. Solo contiene ROLLBACK. El mismo candidato puede reconocer filas ya idénticas sin reescribirlas; una deriva de identidad o datos aborta.

**Dry-run ejecutado: no. Rollback verificado: no. Residuos medidos: no procede todavía. Apply: no. QA público/SEO: no ejecutado. Utrera no está certificada.** La comprobación offline del SQL no sustituye su ejecución PostgreSQL ni el QA del resultado público. El snapshot de cero residuos se debe medir en la sesión de ejecución; no se anticipa como 0 por tener un fichero con ROLLBACK.

Tras resolver las cuatro excepciones del contrato público, obtener dry-run verde, cero residuos y puertas de ejecución satisfechas, procede Apply del mismo candidato y QA de datos, fichas, navegación y SEO. Después del cierre de Utrera se detiene la expansión: se completan fichas y secciones existentes por grupos acotados.

## Reproducción y pruebas

- `node scripts/build-utrera-manifest.mjs`: genera manifiesto, tabla por UUID, universo de tipos, SQL preparado y consulta de snapshot.
- `node --test tests/utrera-manifest-contract.test.js tests/utrera-model-contract.test.js`: 29/29 pruebas.
- `node --test`: **1.323/1.323**, 0 fallos. Sin cambios de aplicación ni build forzado.
- 109 entidades nuevas/actualizadas pasan la comprobación genérica de texto, contexto documental y fuente del candidato. **No es el contrato real de indexabilidad**: la revisión de los lectores descubre las cuatro excepciones anteriores. Los REUSE se preservan. No se declara preparación pública completa ni QA ejecutado.
- [Decisiones y fuentes nuevas](./evidence/modelado-utrera-2026-09-27/identity-closure.json), [preflight](./evidence/modelado-utrera-2026-09-27/identity-preflight.json), [payload completo](./evidence/modelado-utrera-2026-09-27/manifest.json) y [validación vigente](./evidence/modelado-utrera-2026-09-27/manifest-validation.json).
- F52 se conserva mediante URL/hash y referencias a páginas; no se copian el PDF ni fotografías ajenas al repositorio. La falta de multimedia con derechos permanece como ausencia legítima, sin fabricar recursos.
