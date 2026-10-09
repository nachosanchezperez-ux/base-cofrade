# Pino Montano · ampliación de contenido · 8/10/2026

## Revalidación viva · 9/10/2026
18/18 INSERT y 2/2 UPDATE coinciden campo a campo; hashes de música y salidas idénticos. Cero duplicados por claves lógicas auditadas, cero FK huérfanas; titulares y dos relaciones Imagen–Paso publicados y navegables. Hermandad, dos Imágenes y dos Pasos: 200, canonical exacta, index/follow, metadata, JSON-LD y sitemap PASS.
La advocación correcta es María Santísima del Amor. «Esperanza» figura en la miniatura de la Macarena y en la marcha; no se crea ni renombra ninguna Imagen. Miniatura de 2008, candelabros de 2009 y dimensiones visibles. Se preservan las notas que distinguen piezas históricas del proyecto aprobado en 2025. No se certifica ejecución del proyecto ni inventario exhaustivo de secundarias.
Responsive no certificado por timeout del navegador. #1122 permanece NO-GO por el contrato relacional de La Paz y QA visual incompleta. Ver `../cierre-1122-20261009/README.md`.

## Evidencia histórica del 8/10 (no es estado pendiente actual)

## Aplicación
Continuación del encargo de contenido de Hermandades al recibir https://hermandadpinomontano.es.
Aplicado en producción: 18 INSERT + 2 UPDATE del manifiesto; tres marcas de frescura editorial y una auditoría adicional.
No reejecutar el SQL histórico.

- Nueva marcha Amor y Esperanza: Alejandro Blanco Hernández, letra acreditada a Luis Castejón López, estreno por Cruz Roja en 2015. Se registra año de estreno; composición permanece sin fecha.
- Nueva dedicación a Pino Montano, explicando el hermanamiento con la Macarena. Reutilizado el compositor con nombre completo, ya relacionado con Judería Sevillana y Luz de luz; no se fusionan agentes homónimos.
- Dos piezas históricas vinculadas al palio: miniatura de la Macarena estrenada en 2008 y candelabros de cola estrenados en 2009. Las notas distinguen la evidencia histórica del proyecto de renovación de 2025. No se inventan fechas de ejecución ni se declara terminado el proyecto.
- Datos técnicos de Jesús de Nazaret y María Santísima del Amor: altura, dimensiones, anatomía, técnica, policromía e iconografía.
- Ocho enlaces nuevos a tres Fuentes oficiales ya existentes; sin duplicar Fuentes.

## Criterio y preservación
La historia, los cultos y el Rosario del 24/10/2026 a las 09:30 ya estaban incorporados.
No se duplican ni se alteran sus convocatorias. No se traslada la bendición del Jesús de 1986 al titular catalogado en 1989. La página de imágenes secundarias y la historia de 2013 requieren conciliación antes de certificar un inventario físico exhaustivo.
Las atribuciones de las piezas quedan en texto documental; no se fuerza una identidad entre los registros de Marmolejo ni se crean profesionales solo por coincidencia de nombre.

## Validación
Main 59edee119b5c81b470897c4899ffc8ecc5a4c25b; producción dpl_2jCDeirE6miwQohgXrpj9L7PJg4X READY sobre el mismo commit. Revisadas PR abiertas y 19 migraciones. Se conserva la discrepancia previa de timestamp de add_musical_repertoire_theme, ajena al lote.
Guard oficial HC-016 generado para la única Hermandad REUSE, clasificación Penitencia conservada.
Dry-run PASS; ROLLBACK sin filas residuales en siete tablas; mismo candidato COMMIT PASS (PINO_AMPLIACION_OK).
Postflight: 18 filas nuevas presentes; imágenes con alturas 175 y 165 cm y anatomías verificadas.
Hashes de acompañamientos y salidas idénticos antes/después:
{"music":"e5085aa139a2f3139ca1dc7f51207d1d","outings":"457e7ca85ab3ca0895b3869518c29488"}
Ficha nueva de marcha HTTP 200 con título, compositor y estreno 2015. Ficha de Hermandad HTTP 200; tras renovación natural, HTML público confirma Amor y Esperanza, la miniatura, los candelabros y las dimensiones ampliadas. Comprobación de contenido HTML, sin certificar interacción responsive. No se fuerza redeploy ni purga global.
Sin DDL, RLS ni cambios de aplicación.

## Fuentes
- https://hermandadpinomontano.es/historia-de-nuestra-hermandad/
- https://hermandadpinomontano.es/nuestro-padre-jesus-de-nazaret/
- https://hermandadpinomontano.es/maria-santisima-del-amor/
