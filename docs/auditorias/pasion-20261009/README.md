# Pasión · ampliación desde la web oficial · 9/10/2026

Estado actual: APLICADO Y VERIFICADO el 9/10/2026 tras nueva autorización del usuario. El conector aceptó COMMIT; hashes previos y guard HC016 incluidos. Postflight: dos marchas con una autoría y una dedicatoria cada una, clasificación Penitencia/Sacramental y dos descripciones de Imágenes correctas. SSR público de Hermandad contiene ambas marchas, Sacramental, Triunfo de la Eucaristía y hoja de cardina. SQL ya aplicado: NO REEJECUTAR; su cierre ROLLBACK se conserva como evidencia. No se acredita reproducción de vídeo ni QA visual responsive.

Los errores de conexión y el estado NO APLICADO descritos abajo corresponden al corte anterior y quedan superados. Pasión y Muerte #1126 no se ha reaplicado en este cierre.

Corte anterior: PREPARADO, NO APLICADO. Base main d013d28f49d979eb949c383c3789d438b6109ae4; producción dpl_3Bsm3wjBnchmFWfwPPMHyMm1K62N READY. PR abiertas #1126/#1123/#1111/#1097/#1086/#1020/#1019 sin intervención. Sin código, DDL, RLS o despliegue.

Cinco actualizaciones: dos Imágenes, dos Pasos y clasificación Penitencia + Sacramental. Dos marchas: El Señor de Pasión (Ramón González Varela, firma 20/03/1897) y Merced, Luz de Pasión (Cristóbal López Gándara, estreno marzo de 2020, año de composición no fijado). Un compositor nuevo; dos autorías y dos dedicatorias directas a titulares; ocho fuentes oficiales. La Oliva y López Gándara se reutilizan. Enlace YouTube de la primera marcha tomado de la fuente oficial, sin prueba de reproducción.

Fuentes:
- https://www.hermandaddepasion.org/ntro-padre-jesus-la-pasion/
- https://www.hermandaddepasion.org/ntra-madre-sra-la-merced/
- https://www.hermandaddepasion.org/pasos/
- https://www.hermandaddepasion.org/paso-palio-la-stma-virgen/
- https://www.hermandaddepasion.org/noticias/la-marcha-procesional-mas-antigua-que-conserva-nuestra-archicofradia/
- https://www.hermandaddepasion.org/noticias/marcha-procesional-merced-luz-pasion-cristobal-lopez-gandara/
- https://laolivadesalteras.com/noche-grande-en-el-salvador/
- https://www.hermandaddepasion.org/hermandad-sacramental-del-salvador/

Dry-run original: dos marchas, rollback cero residuos. Ajuste conservador: no equiparar año de estreno de Merced con composición; fuente sacramental específica añadida. Dry-run final PASS. Apply devuelve Invalid or expired requestState. Lectura posterior: cero entidades nuevas y clasificación Penitencia original. No se certifica publicación ni se intenta otro canal de credenciales.

Pendientes documentales fuera del candidato:
- Conservación Humildad y Paciencia comunicada el 08/10/2026: https://www.hermandaddepasion.org/noticias/detalles-de-las-labores-de-conservacion-sobre-el-santisimo-cristo-de-la-humildad-y-paciencia/ . Modelar su identidad propia y relación con la Fundación/Obra Pía; no confundir con el titular homónimo de la Cena. Atribución a Cardoso de Quirós, no autoría contractual.
- Coplas y piezas pianísticas del archivo (Noriega, Íñiguez, Turina) requieren clasificación específica, sin convertirlas automáticamente en marchas.
- Catálogo musical no exhaustivo. Revisar Jesús de Pasión de Braña, Marcha Fúnebre de Turina y Merced de Pasión de Pulido señaladas por La Oliva: https://laolivadesalteras.com/un-repertorio-de-todos/ .
- La ficha del Nazareno explica ausencia de contrato y respaldo testimonial; no se ha modificado automáticamente la certeza de su autoría existente.
- La página del paso del Señor presenta cronologías distintas (1946 conjunto, 1949 respiraderos); se conserva 1943–1949 por fases.
- No cargar fecha exacta de bendición de Merced sin resolver incoherencia entre día semanal y fecha en la web.
- Restauraciones y autorías de piezas deben revisarse relacionalmente antes de ampliar ese alcance.

Retomar desde preflight vivo, hashes y deduplicación; aplicar una sola vez tras resolver el conector; postflight SQL y páginas públicas. candidate.sql finaliza con ROLLBACK. ESTADO compartido: reconciliar antes de integrar. No reejecutar lotes de Esperanza ya aplicados.
