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
- La compilación, el conjunto completo y la evidencia de preview/producción se registrarán en la PR de `feat/resumen-acompanamientos-20261006`.
- El visor responsive temporal solo se usa en preview y se retira antes de integrar.
