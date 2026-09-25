# Pre-row-by-row · Carmona · octavo macrolote municipal HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** CERRADO · ROW-BY-ROW Y MANIFIESTO CONGELADOS · SIN DML EJECUTADO  
**Base:** `f1bcda7f2e166038a8d3dc447ce424d959fbb3f9`  
**Namespace congelado:** `c0160035-*`

## Fotografía productiva

- Carmona no tiene todavía Hermandades ni Bandas propias materializadas por municipio en el grafo productivo.
- Existe una única Salida 2026 del municipio: `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218`, Servitas · 19/09/2026; debe ser REUSE.
- El namespace `c0160035-*` tiene 0 colisiones en las familias estructurales y de bulk import comprobadas.
- Amor y Sacrificio de Lebrija y la Banda Municipal de Música de Mairena del Alcor ya existen como entidades canónicas y son REUSE.
- El inventario y modelado previos conservan nueve sujetos corporativos, los cortejos históricos de 2026, Pasos, imágenes, sedes y relaciones ya auditadas.

## Reglas de congelación

1. No duplicar la Hermandad de la Esperanza: una corporación, dos cortejos.
2. No crear una corporación independiente para Desamparados.
3. No crear una corporación independiente para La Borriquita: pertenece a Humildad.
4. Servitas es una única corporación para marzo y septiembre.
5. La Salida servita de septiembre se reutiliza por UUID.
6. El Paso servita de septiembre permanece sin relación hasta prueba específica; `NULL` es el resultado correcto.
7. Desamparados se modela como salida sin acompañamiento musical; ausencia de Banda no equivale a deuda.
8. Música de capilla sin conjunto nominal no crea entidad Banda.
9. No reconciliar Bandas homónimas por nombre incompleto: municipio + identidad canónica obligatorios.
10. Semana Santa 2026 se registra como histórico; sus recorridos no alimentan agenda futura.

## Orden row-by-row

La enumeración determinista se abrirá con este orden:

`sources → places → entities → brotherhoods/bands → images → brotherhood_images → steps → brotherhood_steps → image_steps → outing_series → outings → outing_entities → outing_music_positions → outing_music_assignments → music_accompaniment_periods → source_links`.

## REUSE ya congelados antes de enumerar

| Familia | UUID | Decisión |
|---|---|---|
| outing | `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218` | Servitas · Procesión del Escapulario · 19/09/2026 |
| band | `d6852052-92bb-4b54-b551-e52b656dea6d` | Banda Municipal de Música de Mairena del Alcor |
| band | `c0160033-0404-4000-8000-000000000004` | Banda Amor y Sacrificio de Lebrija |
| band | `c0160032-0402-4000-8000-000000000002` | Agrupación Musical Paz y Caridad de Estepa |
| band | `4e4d493c-5273-44aa-8066-72dd1faa1ed8` | Agrupación Musical Nuestra Señora de Valme de Dos Hermanas |

Los demás REUSE/INSERT de Bandas deben confirmarse contra producción antes de fijar posiciones.

## Cierre de la fase

La puerta queda **cerrada** con:

- plan row-by-row completo en **530 posiciones**;
- contrato **530 DML · 8 REUSE externos · 0 DELETE · 0 DDL · 0 RLS**;
- 129 `source_links` enumerados individualmente;
- namespace `c0160035-*` sin colisiones en el preflight de lectura;
- manifiesto determinista con invariantes de recuento;
- contrato de ensayo transaccional obligado a terminar en `ROLLBACK`.

Documentos de cierre:
- [PLAN-ROW-BY-ROW-CARMONA-HC016-2026-09-25.md](./PLAN-ROW-BY-ROW-CARMONA-HC016-2026-09-25.md)
- [ANEXO-SOURCE-LINKS-CARMONA-HC016-2026-09-25.md](./ANEXO-SOURCE-LINKS-CARMONA-HC016-2026-09-25.md)
- [MANIFIESTO-DETERMINISTA-CARMONA-HC016-2026-09-25.md](./MANIFIESTO-DETERMINISTA-CARMONA-HC016-2026-09-25.md)
- [CIERRE-PUERTA-CARMONA-MUSICA-SERVITAS-HC016-2026-09-25.md](./CIERRE-PUERTA-CARMONA-MUSICA-SERVITAS-HC016-2026-09-25.md)

**Siguiente fase:** construir y revisar el payload SQL de preflight. Su creación documental no autoriza su ejecución. Siguen en **0 staging · 0 dry-run ejecutado · 0 Apply**.
