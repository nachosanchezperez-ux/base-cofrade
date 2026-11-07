# Coherencia al cambiar la fecha de un acto

Estado: auditoría y propuesta implementada en rama; PR en borrador, NO FUSIONAR. No se han ejecutado migraciones ni escrituras de datos. Auditoría comunicada al propietario antes de crear la rama.

## Preflight y alcance

- Base inicial de la auditoría, GitHub main y producción Vercel READY: `03f8ba08301b8bbcd93d0c5c41fefa8d142d12a8`.
- Deployment: `dpl_43sjmHeY9fgRFmeeYoL9JcpC4sBz`.
- Supabase Hilocofrade `kcevwkucqzcyrqaimyhl`: ACTIVE_HEALTHY; asesor de salud sin avisos.
- PR abiertas revisadas: 1364 (no fusionar antes del 10/11), 1308, 1307, 1297 y 1171 (prototipos). Ninguna se modifica.
- SELECT sobre 507 salidas, 298 hitos, 345 ediciones de cultos, 144 jornadas y 621 eventos. Comparación completa de fechas estructuradas; búsqueda textual de aplazamientos/suspensiones en descripciones y notas. La búsqueda textual detecta candidatos, no demuestra ausencia de contradicciones en todo el contenido editorial.
- Lectura HTTP directa de producción el 7/11/2026. El buscador devolvió una copia anterior al aplazamiento: prevalecen las respuestas directas y la base de datos.

## Hallazgos confirmados y datos que NO se deben corregir automáticamente

1. Amparo, salida `edaa2090-1cbb-4417-b31a-c7850bdf28a2`: fecha 15/11; hito `af6a089f-7225-4622-8525-669b2a22fdc5`, coronación, fecha correcta 8/11 a las 10:00. La coronación NO debe desplazarse al 15. Existe además como culto independiente `06e1466a-0a6b-4576-baaf-464ef02d2e59`, edición `7a5c0e05-2026-4016-8000-000000c00007` del 8/11.
2. El destacado de portada conserva la fecha explícita «Domingo, 8 de noviembre» del hito, pero lo marca «Primer hito» dentro de la procesión del 15. La corrección acotada de esta PR excluye del horario compacto los hitos anteriores a la fecha de salida. No borra hitos ni altera sus fechas; conserva regresos posteriores con su fecha visible.
3. En la respuesta actual de `/procesiones-de-gloria/sevilla-amparo-2026` no se reproduce un horario independiente de coronación a las 10:00 del día 15. La información práctica distingue ambas fechas. No se reabre como error confirmado una presentación antigua.
4. Segundo Besamanos, edición `573a6823-5c84-4c78-8ce5-910c6c05350b` del culto `0a7525b8-a3d3-44cc-bb4b-d1330bb1906d`: sigue `announced`, 14–15/11, en Agenda y como «Próximo culto» de la ficha. El evento histórico `18b13ead-e3e1-4b20-bbd3-7c15de05b2bd` dice expresamente que se pospone y que la nueva fecha está por anunciar. Contradicción de datos confirmada; su corrección editorial sigue pendiente de autorización.
5. JSON-LD de la procesión: inicio 15/11 17:00, fin 22:45, `EventScheduled`, sin `previousStartDate`. Falta representar la reprogramación.
6. El rosario de la Sed del 3/10, salida `6c0d5e92-e533-48c8-aea4-c2130b331304`, está correctamente `cancelled`. La procesión de Santa Elena de Aznalcóllar está `held`: su texto distingue una romería suspendida y la procesión celebrada. No son errores.
7. Candidatos textuales descartados como contradicción propia: reorganización de cultos del Castillo (se suspende un traslado, no la reorganización), traslado histórico del Buen Fin y suspensión histórica de una hermandad. No convertirlos automáticamente en actos cancelados.

## Inventario completo: 41 hitos de otra fecha en 23 salidas

Fechas de 2026 salvo indicación. Una diferencia de día no implica error. Los regresos y programas de varios días se conservan con fecha explícita; los actos previos se separan del horario compacto. Cualquier modificación de registros requiere revisión editorial y autorización.

| Acto / slug | Fecha del acto | Hitos de otro día | Nº |
|---|---|---|---:|
| Hiniesta Gloriosa · `procesion-hiniesta-gloriosa-corpus-sevilla-2027` | 26/5/2027 | Regreso 27/5/2027 | 1 |
| Salud y Buen Viaje · `sevilla-salud-y-buen-viaje-2026` | 22/11 | Traslado y punto destacado 21/11 | 2 |
| Amparo · `sevilla-amparo-2026` | 15/11 | Coronación 8/11 | 1 |
| Dolores · `montellano-dolores-2026` | 11/10 | Capellán Vázquez Ramos, Casa Hermandad, Callejón del Tomate y entrada 12/10 | 4 |
| Divina Gracia · `sevilla-divina-gracia-2026` | 11/10 | Entrada 12/10 | 1 |
| Rosario · `santiponce-rosario-coronada-2026-10-10` | 10/10 | Entrada 11/10 | 1 |
| Rosario de Fátima · `los-rosales-rosario-de-fatima-2026-10-10` | 10/10 | Función y regreso 11/10 | 2 |
| Angustias · `utrera-angustias-2026` | 3/10 | Entrada 4/10 | 1 |
| Amargura · `dos-hermanas-amargura-cultos-extraordinarios-2026` | 20/9 | Triduo 23, 24 y 25/9; besamanos 26/9; función y regreso 27/9 | 6 |
| Pastora · `sevilla-pastora-triana-2026-09-19` | 19/9 | Santa Ana y entrada 20/9 | 2 |
| Dolores · `utrera-dolores-hermanas-cruz-2026` | 19/9 | Eucaristía, regreso y entrada 20/9 | 3 |
| Prado · `la-paz-virgen-prado-2026-09-18` | 18/9 | Papeletas 14/9 | 1 |
| Crucero · `almaden-de-la-plata-cristo-del-crucero-2026-09-12` | 12/9 | Entrada 13/9 | 1 |
| Sangre · `gerena-sangre-2026` | 12/9 | Entrada 13/9 | 1 |
| Estrella · `coria-del-rio-estrella-2026-09-08` | 8/9 | Entrada 9/9 | 1 |
| Pastora, sin slug · `4eddf059-35aa-4fab-80ad-313398a0332a` | 8/9 | Entrada 9/9 | 1 |
| Aguas Santas · `villaverde-del-rio-aguas-santas-2026-09-08` | 8/9 | Puja y entrada 9/9 | 2 |
| Consolación · `osuna-consolacion-2026-09-08` | 8/9 | Entrada 9/9 | 1 |
| Angustias · `virgen-angustias-aznalcazar-2026` | 22/8 | Bando 21/8 y entrada 23/8 | 2 |
| Santa Elena · `aznalcollar-santa-cruz-santa-elena-2026` | 16/8 | Entrada 17/8 | 1 |
| Hiniesta · `procesion-hiniesta-gloriosa-corpus-sevilla-2026` | 3/6 | Llegada al altar, regreso y entrada 4/6 | 3 |
| Vera Cruz · `estacion-penitencia-vera-cruz-alcala-del-rio-2026` | 2/4 | Vía Crucis/regreso y entrada 3/4 | 2 |
| San Pablo · `san-pablo-estacion-penitencia-2026` | 30/3 | Entrada 31/3 | 1 |

No hay jornadas de culto fuera del intervalo de su edición (0 de 144).

Consulta de inventario reproducible, solo lectura:

```sql
select o.id, o.slug, o.title, o.outing_date, o.return_date,
       o.event_status, o.status, s.id as milestone_id,
       s.label, s.item_date, s.item_time
from outings o join outing_schedule_items s on s.outing_id=o.id
where s.item_date <> o.outing_date
order by o.outing_date desc, s.sequence_no;
```

## Calendarios descargados en producción

- Procesión: `/calendario/acto/acto-processions-edaa2090-1cbb-4417-b31a-c7850bdf28a2.ics`, HTTP 200, UID `acto-processions-edaa2090-1cbb-4417-b31a-c7850bdf28a2@hilocofrade.es`, 15/11 17:00–22:45 Europe/Madrid, `STATUS:CONFIRMED`. NO contiene un VEVENT de coronación ni las 10:00. El texto explica el cambio del 8 al 15. No es necesario desplazar ese DTSTART.
- Besamanos: `/calendario/acto/acto-devotions-573a6823-5c84-4c78-8ce5-910c6c05350b.ics`, HTTP 200, UID `acto-devotions-573a6823-5c84-4c78-8ce5-910c6c05350b@hilocofrade.es`, inicio de día completo 14/11 y fin exclusivo 16/11, `STATUS:CONFIRMED`. Este archivo mantiene una cita que está aplazada.
- Ambos carecen de `SEQUENCE` y `LAST-MODIFIED`; `DTSTAMP` procede de la generación. Hay suscripciones webcal por hermandad, pero una descarga/importación puntual NO recibe futuras actualizaciones automáticamente. Tampoco un UID estable garantiza por sí solo que todos los clientes actualicen una importación.

## Representación implementada en rama (pendiente de publicación autorizada)

| Estado | Tarjeta y Próximos | Calendario | JSON-LD |
|---|---|---|---|
| Fecha conocida, anunciada | Fecha y hora real; «Por confirmar» únicamente si falta la hora | CONFIRMED | EventScheduled |
| Reprogramado, nueva fecha conocida | «Reprogramado · 15 nov» y «Antes: 8 nov»; incluir en Próximos con nueva fecha | Mismo UID, nuevas fechas, CONFIRMED y revisión incrementada | EventRescheduled + previousStartDate |
| Aplazado sin nueva fecha | «Aplazado · Nueva fecha por anunciar», fuera de Próximos ordinarios; conservar ficha y aviso accesible | Retirar la convocatoria antigua mediante CANCELLED con el mismo UID y explicación del aplazamiento; no crear un evento de fecha inventada | EventPostponed, conservando startDate anterior para identificar el evento |
| Suspendido/cancelado | Estado explícito, sin cuenta atrás ni llamada a asistir; fuera de Próximos | CANCELLED, mismo UID | EventCancelled |

La cancelación ICS de una fecha aplazada retira esa convocatoria, no afirma una cancelación definitiva del acto. Debe explicarse en SUMMARY/DESCRIPTION. No usar STATUS:POSTPONED, que no existe en VEVENT, ni TENTATIVE para sugerir que el acto sigue previsto en la fecha ya descartada. Validar la transición CANCELLED → CONFIRMED con el mismo UID en los clientes admitidos antes de publicar.

Propuesta de campos comunes: `event_status` con postponed/rescheduled, `previous_start_date`, `previous_end_date`, motivo público, fuente, fecha de cambio y `calendar_sequence` entero monotónico. Conservar las fechas anteriores al aplazar; distinguirlas mediante estado de las fechas activas. Guardar cada cambio en historial para aplazamientos sucesivos y actualización concurrente. No inferir estados desde frases ni desde un slug especial del Amparo.

En producción outings y cult_occurrences admiten announced/held/cancelled; events admite además postponed. La PR prepara `20261107214344_event_schedule_changes.sql`, sin aplicarla: amplía estados y guarda fecha anterior, motivo, fuente, historial y revisión en `schedule_change` JSONB. El trigger controla la revisión y permite documentar una reprogramación ya publicada sin alterar su fecha actual. No hay UPDATE editorial en la migración.

Para suscripciones, mantener los registros cancelados/aplazados en el feed aunque su fecha original pase: el filtro actual `!isPast` puede hacerlos desaparecer antes de que un cliente reciba la retirada. Definir retención explícita y probar refresco de Apple Calendar, Google Calendar y Outlook. Mantener UID estable por ID de acto, no por fecha/título. No cambiar categorías sin preservar el UID original. SEQUENCE debe aumentar al editar datos relevantes, no al descargar; LAST-MODIFIED debe proceder del cambio persistido.

No prometer actualización inmediata: la frecuencia del cliente no la impone el TTL del servidor. Ofrecer «Suscribirse» para recibir cambios y explicar la limitación de «Descargar».

JSON-LD esperado para el Amparo, una vez autorizado y persistido el cambio: `EventRescheduled`, `startDate: 2026-11-15T17:00:00+01:00`, `endDate: 2026-11-15T22:45:00+01:00`, `previousStartDate: 2026-11-08` (fecha anterior documentada; no se reconstruye una hora anterior no almacenada). La coronación conserva su evento del día 8 a las 10:00. No insertar excepciones por slug para simular datos estructurados inexistentes.

## Propuesta del aviso en el Panel

Al modificar fecha o estado, antes de guardar mostrar una revisión calculada en servidor sobre el registro vigente:

1. «Cambias del 8 al 15 de noviembre. Revisa los elementos relacionados».
2. Hitos: fecha, hora y enlace de edición; destacar los que quedarían antes/fuera del intervalo. Las entradas de madrugada dentro de return_date no son error.
3. Otros actos de la misma hermandad, titular o serie en torno a la fecha anterior y nueva: tratarlos como candidatos, no como dependencias demostradas. En el caso Amparo: coronación, bando, besamanos y Te Deum.
4. Resumen de impactos: Agenda, Próximos de la ficha, destacado, mapa/horarios, ICS y JSON-LD. Registrar revalidación tras guardar; no invalidar producción durante esta auditoría.
5. Ninguna cascada automática: elegir explícitamente qué hito se mueve, cuál se conserva fechado y cuál requiere revisión. La coronación no se mueve con la procesión.
6. Guardar fecha anterior, fuente y revisión en una única transacción; comprobar updated_at para no sobrescribir cambios de otro editor. Revalidar el aviso también en servidor, no solo con JavaScript.

Presentación móvil: estado textual antes de la fecha/hora, fecha anterior como texto secundario, sin depender del color; lista vertical de elementos revisables y controles táctiles de 44 px. «Nueva fecha por anunciar» para una fecha ausente; «Por confirmar» solo para la hora.

## Propuesta de corrección editorial del Amparo — NO ejecutada

- No cambiar las fechas de la coronación ni su hito.
- Registrar la reprogramación de la procesión del 8 al 15, conservando 17:00–22:45 según el comunicado ya documentado.
- Marcar la segunda edición del besamanos como aplazada sin nueva fecha, conservar 14–15 como convocatoria anterior y actualizar la descripción general del culto que todavía anuncia ambas tandas.
- No borrar la primera edición de octubre, ni crear una tercera fecha, ni cancelar la coronación.
- Alternativa temporal si se necesita retirar de Próximos antes del nuevo modelo: requerir autorización específica para retirar de publicación la segunda edición; advertir que eso por sí solo NO garantiza la retirada de calendarios ya importados. No se ejecuta esa alternativa aquí.

## Implementación y validación

Implementado: selección no mutante de hitos del destacado desde la fecha del acto; evita «Primer hito: coronación del 8» en la procesión del 15. Mantiene los hitos del mismo día y regresos posteriores con su etiqueta de fecha. Se prueba el caso real y el regreso de madrugada. El filtro por fecha propia de las tarjetas de Agenda ya existe en `agendaScheduleSteps` y no se duplica.

Implementado además:

- Estado textual compartido en Agenda, fichas y capítulos; aplazados fuera de Próximos y de los estados en curso. Aviso accesible con motivo y fecha anterior. Reprogramados con su nueva fecha.
- Panel de salidas, extraordinarias y ediciones de cultos: revisión de hitos/días y actos candidatos, motivo y fuente obligatorios, validación del servidor y control de versión. No mueve automáticamente registros vinculados. El alta de una convocatoria especial se realiza primero como borrador y después se revisa su cambio de estado.
- ICS con mismo UID, SEQUENCE persistida, LAST-MODIFIED, retirada de la convocatoria aplazada mediante CANCELLED y retención mientras siga publicada. Se elimina la duración ficticia de dos horas cuando no hay hora final. Descarga puntual y suscripción se distinguen.
- JSON-LD EventRescheduled/previousStartDate y EventPostponed. Sin excepciones por slug ni fechas nuevas inventadas.
- Lectura compatible con la ausencia de `schedule_change`; otros errores se propagan para evitar éxito parcial. El Panel bloquea el cambio si falta la migración. Por esa compatibilidad la migración usa `hc-despliegue: tolerante`.

Actualidad: main y último deployment de producción READY han avanzado a `d84b1bc3306ed93e9228a3b203702cd1d7e694d9`, deployment `dpl_3QBD6BsazmgncpPUHanNLAR57rkn`. #1406 solo modifica HolyWeekProgramme.js y su CSS, sin solapamiento con esta PR. No se han desplegado estos cambios en producción.

Validación: 2.475 pruebas generales pasaron; se añadieron dos casos adicionales de compatibilidad del lector y registro histórico de la fecha anterior, también correctos. El trigger se ejecutó con PGlite y datos sintéticos: evidencia obligatoria, aplazamiento sin perder fecha, reprogramación, revisión monotónica y rechazo de una revisión manipulada. Script reproducible `scripts/verify-event-schedule-migration.mjs`; instalar `@electric-sql/pglite` en un directorio temporal y señalar su módulo mediante `HILO_PGLITE_MODULE`. No requiere conexión a Supabase.

La compilación y comprobación de tipos local pasan. El prerender local se detiene por ausencia de configuración pública de Supabase; verificar build de Vercel. No se certifican aún la cadena completa de migraciones y seed en Supabase Preview, la interacción visual móvil ni la transición CANCELLED → CONFIRMED en Apple/Google/Outlook. La prueba PGlite no sustituye esas comprobaciones.

Siguiente paso: revisar la preview y el esquema preparado; después solicitar autorización separada para integración/migración y corrección editorial de los dos registros del Amparo. La PR continúa en borrador hasta completar esa certificación. La web seguirá mostrando los datos anteriores mientras no se autorice corregirlos.

Referencias: [Google Event](https://developers.google.com/search/docs/appearance/structured-data/event), [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545) §§3.8.1.11, 3.8.4.7, 3.8.7.3, 3.8.7.4. Consultadas el 7/11/2026. La política de retirar la convocatoria aplazada en ICS es una propuesta de producto, no una equivalencia literal entre los estados de schema.org e iCalendar.
