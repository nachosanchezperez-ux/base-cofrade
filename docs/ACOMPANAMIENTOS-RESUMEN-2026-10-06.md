# Acompañamientos musicales por banda · 6 de octubre de 2026

## Petición y alcance

Nacho solicita otra zona que calcule los acompañamientos de cada banda en Sevilla capital y en el resto de la provincia. La ruta neutral `/acompanamientos-musicales` presenta Semana Santa 2026; el enlace desde Cambios musicales 2027 abre `?temporada=2027`, identificado como **Avance de 2027**. Se mantienen separados los 44 cambios musicales y este recuento de relaciones, que también incluye continuidades documentadas.

## Contrato de cálculo

- Fuente única: periodos publicados de `music_accompaniment_periods`. No se suman salidas de agenda ni sus asignaciones porque duplicarían relaciones estables.
- Alcance: Semana Santa y vísperas. Glorias, conciertos, rosarios, traslados, romerías y extraordinarias quedan fuera aunque su nombre mencione una jornada.
- Territorio: municipio de la Hermandad. Una banda de fuera de Sevilla puede tener acompañamientos incluidos; su origen no altera la suma.
- Capital = municipio de Sevilla; provincia = otros municipios conocidos de la provincia de Sevilla. No se asigna a provincia un territorio desconocido o externo por descarte.
- Unidad: banda + Hermandad + jornada + paso/posición. Se preservan dos pasos, secciones, tramos y contextos distintos. Los periodos solapados de la misma relación cuentan una vez; una instantánea genérica solo se asocia a un paso cuando resulta inequívoco.
- Los identificadores de banda mantienen separadas las formaciones con nombres coincidentes, incluida la BM y la CCyTT de Las Cigarreras.
- Los límites exactos se comparan con la fecha de la jornada en la temporada, en UTC. No se deduce vigencia de notas o fechas de texto libre.

## Temporadas y cobertura

Las temporadas revisadas son explícitamente 2026 y 2027; no se amplían al cambiar el año del calendario.

Para 2026 se incluyen los intervalos que cubren la temporada, los que comienzan ese año y los periodos abiertos que constan actuales sin inicio posterior. Un cierre en 2026 sigue contando en 2026 aunque el indicador actual sea falso.

Para 2027 se incluyen los periodos que comienzan en 2027 y los intervalos con final conocido que cubren ese año. Las entradas futuras cuentan aunque `is_current=false`: 42 registros reales del corte usan ese estado. Los vínculos abiertos anteriores o sin año inicial que constan actuales se presentan aparte como **otros vínculos por revisar para 2027**, fuera de las sumas del avance.

No se llama a ese grupo «continuidad por confirmar»: en Bellavista la renovación de Santa Ana aparece en una nota, pero falta trasladarla a los límites de vigencia; en Pasión de Dos Hermanas la nota solo acredita 2026. El resumen no interpreta textos ni cambia contratos para llenar las cifras. San Gonzalo también queda en revisión para el avance porque la duración no está delimitada numéricamente.

Las cifras representan documentación registrada, no un censo completo. Cero en 2026 o guion en el avance indican ausencia de registros incluidos en ese ámbito, no ausencia de contratos reales. Los pendientes no son bajas.

## Corte comprobado

Auditoría de lectura de los 547 periodos publicados el 6/10/2026, sobre `main` `6f3acd7118005433a4cfd2f19e2493ea21bcb59b` y producción `dpl_GCEFNsRoCTxMC2cB9EGdZhknNfwn` READY.

| Temporada | Capital | Resto de la provincia | Total | Bandas con cifra | Vínculos por revisar |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2026 | 142 | 173 | 315 | 138 | 0 |
| Avance 2027 | 10 | 40 | 50 | 37 | 194 |

El corte 2026 absorbe dos duplicados: Santa María Magdalena de Arahal en la Expiración de Écija y Sangre de San Benito en el Confalón. Se conservan separados los dos pasos de Álvarez Quintero en Vera Cruz de Tocina y las posiciones juveniles de Cruz de Guía.

El relevo de San Esteban cambia de Las Cigarreras en 2026 a Santa Ana en 2027. Para Santa Ana el avance suma tres registros de capital —San Esteban, Panaderos y Esperanza de Triana— y mantiene los otros vínculos en revisión fuera de esa cifra.

## Implementación y frescura

Lector público mínimo, sin sesión ni cliente privilegiado. Pagina los periodos con orden por ID y consulta entidades en lotes. Entidades y periodos deben estar publicados; para relaciones con fichas no visibles se utilizan instantáneas `public_*`, sin enlaces a borradores. Un fallo de consulta rechaza la lectura completa.

La caché comparte los periodos entre temporadas durante 300 segundos. Guardar o archivar desde el panel de Bandas invalida el tag `public-music-accompaniment-summary` y la ruta. Los cambios SQL posteriores entran por la renovación temporal habitual.

La UI usa formulario GET, filtrado por nombre y formación, orden A–Z o por cifras, y detalles nativos por municipio. Los totales superiores representan todos los registros de la temporada; el resultado filtrado muestra su propia suma. Limpiar conserva la temporada y restablece los controles. Los vínculos pendientes se pueden encontrar con la misma búsqueda.

Sin DML, DDL, migraciones, cambios RLS ni dependencias nuevas. #1097, #1086, #1020 y #1019 quedan preservadas.

## Verificación

- Auditoría independiente del lector público, cálculo y datos reales: GO, con dos ajustes incorporados para excluir actos ajenos a Semana Santa y unir un snapshot de paso con su ID inequívoco.
- 15 pruebas nuevas de comportamiento PASS: temporadas, futuros, fechas exactas, exclusiones, territorio, identidad, deduplicación, tramos, ambigüedad y orden municipal.
- Compilación PASS y 1.494 pruebas en UTC PASS en el primer corte. La evidencia de integración y despliegue se registra en la PR #1104.
- El visor responsive temporal se ha retirado del resultado final.

## Actualización y límite de verificación · 7/10/2026

Se incorpora `main` `32b9cd9da6713fe2fab6be86a62fdb2cdd2e4ef3` sin conflictos, conservando las actualizaciones independientes de #1105–#1108. Las 1.499 pruebas del conjunto integrado pasan en UTC. Este frente no vuelve a aplicar sus operaciones SQL.

El archivo musical pasa a 550 periodos publicados por actualizaciones editoriales realizadas en paralelo. Una nueva lectura y el HTML de la preview confirman este corte:

| Temporada | Capital | Resto de la provincia | Total | Bandas con cifra | Vínculos por revisar |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2026 | 142 | 176 | 318 | 139 | 0 |
| Avance 2027 | 12 | 48 | 60 | 44 | 190 |

La respuesta SSR de 2026 devuelve las 139 identidades esperadas: cada fila coincide con el cálculo auditado, la suma es 318 y el número de acompañamientos de cada desglose coincide con su cifra. La búsqueda de Santa Ana en el avance devuelve 3 acompañamientos en la capital, junto a sus vínculos por revisar. Formulario GET, temporada seleccionada, canonical y robots se comprueban en el HTML servido. Las pruebas de filtros y el postflight del despliegue final se registran en #1104.

La respuesta completa del avance contiene las 44 bandas, 60 acompañamientos y 190 vínculos por revisar esperados. El estado vacío devuelve 200 y Limpiar conserva la temporada en su enlace; el listado de cambios mantiene 44 anclas únicas y su acceso a la nueva zona. Son comprobaciones SSR, no clics de navegador.

La comprobación de búsqueda detectó que el nombre formal de la BM María Santísima de la Victoria omitía «Las Cigarreras». La búsqueda incluye ahora su ruta pública, donde consta ese nombre habitual. Una prueba de regresión protege el alias, los acentos y los guiones; las **16 pruebas específicas** pasan. La preview final `dpl_6FCMK6GABzvXZdKrZ8FjQyi3m3Vz` está READY sobre `775e34ee7bef3203a262d489919c673705cdccfd`: esa búsqueda devuelve por SSR una única BM con 6 acompañamientos de 2026 (5 capital + 1 provincia), coincidentes con la auditoría. Las 1.500 pruebas finales pasan en UTC y la compilación local final termina con código 0. Los checks remotos y la publicación quedan documentados en #1104 sin atribuir a un check omitido un resultado ejecutado.

**QA visual pendiente:** la herramienta de navegador agota su espera tanto al consultar la página como al reiniciar la sesión (dos intentos de 300 segundos). No se ha observado un bloqueo del sitio ni se atribuye a Vercel. Se verifican código, datos, HTML servido, pruebas, compilación y despliegue; esto no acredita una revisión visual responsive, de teclado ni de interacción hidratada. No hay screenshot de esta nueva zona. El límite queda registrado y no se declara certificación visual completa.


## Reconciliación de la entrada de renovaciones

Durante la integración, `main` avanzó a `e54c6f3edba7822653c954579f5ee30a13fa312c` (#1109). El conflicto de #1104 estaba limitado al nuevo párrafo del tablero canónico. Se conserva íntegra la entrada de renovaciones y se añade a continuación la de este resumen. Los tres documentos de certificación de #1109 permanecen en el árbol; no se reejecuta DML. El código de la zona, sus 16 pruebas y el resto de archivos de aplicación mantienen el contenido ya verificado (1.500 pruebas y build PASS). Se conserva la rama y la PR originales.
