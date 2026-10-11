# Renovaciones de bandas · 6 de octubre de 2026

## Estado

**Aplicado en producción y comprobado públicamente.** La operación se guardó el
6 de octubre de 2026 a las 18:55:46 UTC. El postflight público se completó el
7 de octubre: las cinco fichas de Banda sirven la información y las tres fichas
de Hermandad incluyen la documentación correspondiente.

La petición incorpora cinco renovaciones sobre relaciones que ya existían.
La Puebla ya tenía documentada la temporada 2027. El Sol ya tenía contrato
hasta 2029; se añade la ratificación posterior. Se completan Carmen, Los Gitanos
Juvenil y Las Cigarreras, conservando cada periodo y su contexto.

## Relaciones

| Banda | Hermandad · municipio | Posición · jornada | Resultado |
| --- | --- | --- | --- |
| Banda de Música María Santísima de la Victoria (Las Cigarreras) | Santa Cruz · Dos Hermanas | Palio de Nuestra Señora del Amor y Sacrificio · Lunes Santo | Renovación 2027 aportada por el editor; plazo completo no documentado. |
| Banda Municipal de Música de La Puebla del Río | La Paz · Sevilla | Palio de María Santísima de la Paz · Domingo de Ramos | Renovación 2027 ya documentada; fila intacta. |
| Banda de Cornetas y Tambores Nuestra Señora del Sol | El Baratillo · Sevilla | Misterio de Misericordia y Piedad · Miércoles Santo | Se conserva 2027–2029 y se añade la ratificación oficial del 24/09. |
| Sociedad Filarmónica Nuestra Señora del Carmen de Salteras | El Baratillo · Sevilla | Palio de María Santísima de la Caridad en su Soledad · Miércoles Santo | Renovación hasta 2029; se conserva el inicio de 1980. |
| Agrupación Musical Juvenil María Santísima de las Angustias Coronada (Los Gitanos Juvenil) | El Baratillo · Sevilla | Cruz de Guía · Miércoles Santo | Ratificación para 2027; se conserva el inicio de 2024 y el final abierto. |

### Identidades conservadas

- Las Cigarreras–Santa Cruz: `79511741-cf06-4d8e-8640-5c89e91101a2`.
- La Puebla–La Paz: `9d5bab12-c743-4fde-a2cb-93e6c00137eb`.
- El Sol–Baratillo: `a6a2fef0-2c70-4d1b-90ac-4915ebfbc4f1`.
- Carmen–Baratillo: `e8cd8c55-00e0-4e8b-826a-f046ddf45df4`.
- Gitanos Juvenil–Baratillo: `13ddbd73-ac98-4d1d-871e-34ed8e77bcd2`.

Las Cigarreras se vincula a la entidad canónica de **Banda de Música**
`a23934c9-93e9-4bf1-886e-d98ec170b74f`. Se preservan las entidades separadas
de cornetas y tambores y el duplicado archivado.

## Fuentes y límites documentales

1. [Baratillo · comunicado conjunto del 24/09/2026](https://hermandadelbaratillo.es/renovacion-del-acompanamiento-musical/).
   Ratifica las tres bandas y sus posiciones para la próxima estación de
   penitencia. Por su fecha, corresponde a 2027; el texto no concreta el plazo
   total de cada acuerdo.
2. [El Sol · comunicado oficial del 07/08/2026](https://hermandadelbaratillo.es/renovacion-del-contrato-con-la-banda-de-cc-tt-ntra-sra-del-sol/).
   Ya estaba enlazado y especifica 2027, 2028 y 2029.
3. [Carmen de Salteras · anuncio oficial en X](https://x.com/CarmenDSalteras/status/2103055199698923564/photo/1).
   El resultado indexado oficial, fechado el 24/09/2026, precisa tres años más
   hasta 2029. La apertura directa devolvió 403; se registra este límite de
   recuperación, sin atribuirlo al comunicado conjunto.
4. [La Puebla–La Paz · Gente de Paz, 17/09/2026](https://www.gentedepaz.es/la-banda-municipal-de-la-puebla-renueva-su-compromiso-musical-con-la-hermandad-de-la-paz-para-el-domingo-de-ramos-de-2027/).
   Ya documentaba la renovación para el Domingo de Ramos de 2027 y se conserva.
5. **Las Cigarreras–Santa Cruz: información editorial directa del 06/10/2026.**
   La renovación procede de la comunicación del usuario/editor. Se crea una
   Fuente sin URL, identificada como información editorial directa. No se
   presenta la guía de 2026 como prueba de esta renovación ni se fija un plazo
   contractual desconocido.

El plazo de tres Miércoles Santos para Los Gitanos Juvenil apareció en espejos
de una publicación de la Hermandad, sin permalink original recuperado. Esta
operación se apoya en la ratificación web oficial para 2027 y mantiene el final
abierto.

## Modelo y alcance de la escritura

Se aplica el contrato de HC-006 sobre `music_accompaniment_periods`:

- **4 UPDATE** de periodos existentes.
- **0 INSERT / 0 DELETE** de periodos.
- **3 Fuentes nuevas y 5 enlaces** a periodos.
- La Puebla conserva su fila completa, incluida su huella.
- Los inicios, Bandas, Hermandades, Pasos, posiciones y jornadas permanecen.
- Solo Carmen incorpora `year_to = 2029` y su texto de fin contractual.
- El Sol conserva el final de 2029 ya documentado.
- Sin DDL, RLS, migraciones de esquema, nuevas Salidas ni asignaciones de salida.

Una renovación mantiene el periodo longitudinal. No se introduce un
`year_from = 2027` artificial: Cambios musicales conserva **44 cambios,
39 corporaciones y 34 formaciones entrantes**.

## Verificación

La [operación SQL](./operations/RENOVACIONES-BANDAS-2026-10-06.sql) pasó revisión
estática independiente y ensayo transaccional con **ROLLBACK**. Las cinco
huellas originales quedaron intactas y la comprobación posterior encontró
cero Fuentes residuales.

El Apply y su lectura posterior confirmaron cuatro actualizaciones, tres
Fuentes y cinco enlaces. Los controles conservaron:

- 551 periodos totales.
- 44 registros elegibles de Cambios musicales de 2027.
- Huellas de los demás periodos de las tres Hermandades.
- Huellas de Salidas, posiciones y asignaciones de esas Hermandades.
- Documentación anterior y fila íntegra de La Puebla.

El postflight público obtuvo **HTTP 200** y verificó las notas en las cinco
fichas de Banda, retirando scripts antes de comprobar los textos del HTML.
Las fichas de El Baratillo, La Paz y Santa Cruz incluyen las Fuentes correctas.
La lectura musical de las Hermandades conserva las posiciones; ese componente
no dibuja las observaciones de los periodos.

El navegador de QA agotó su tiempo de espera. La comprobación se completó con
la respuesta HTML servida por producción a través del conector de Vercel.
No se afirma QA visual ni captura de pantalla; no hay cambios de interfaz.

La evidencia exacta se conserva en
[RENOVACIONES-BANDAS-2026-10-06.json](./evidence/RENOVACIONES-BANDAS-2026-10-06.json).

## Concurrencia y recuento de acompañamientos

Preflight del Apply: `main = 8e91ac026cc73f22b7d0bb44e1c083a87c1ef710`,
producción Vercel en success y Supabase ACTIVE_HEALTHY. Las 18 migraciones
estructurales estaban reconciliadas.

El registro documental se prepara sobre
`32b9cd9da6713fe2fab6be86a62fdb2cdd2e4ef3`, después de las actualizaciones
independientes de Agenda. Las filas del Apply conservan sus huellas.

Las PR #1104, #1097, #1086, #1020 y #1019 permanecen independientes.
**Conflicto potencial documental con #1104:** ambas actuaciones añaden contexto
a `docs/ESTADO-PROYECTO.md`; al integrarla deberá conservarse este cierre.

La PR #1104, aún abierta en el postflight, distingue cobertura temporal de
notas libres: una renovación descrita solo en notas/Fuentes permanece pendiente
en su avance cuantitativo. No se modifican fechas para forzar ese contador.
El plazo hasta 2029 de Carmen sí aporta cobertura temporal estructurada.
Este cierre no publica ni modifica aquella PR.

**No reejecutar la operación.** Sus huellas bloquean una segunda aplicación.
