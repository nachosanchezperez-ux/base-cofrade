# Certificación de staging y Apply · Osuna HC-016

Fecha: 20 de septiembre de 2026  
Importación: `c0160034-0000-4000-8000-000000000001`  
Payload: `supabase/migrations_archive/post-first-edition-editorial/20260920180000_preflight_osuna_septimo_macrolote_hc016.sql`

## Cierre del staging

- Estado final: `completed`.
- Esperadas / staged / válidas / aplicadas: 368 / 368 / 368 / 368.
- Inválidas / fallidas: 0 / 0.
- Filas de `bulk_import_items` en estado `applied`: 368.
- Autorización de Apply: registrada.
- Resultado transaccional: `APPLY_OSUNA_SQL_OK_COMMITTED`.

## QA posaplicación

| Conjunto | Filas |
|---|---:|
| Entidades | 61 |
| Lugares | 9 |
| Fuentes | 4 |
| Hermandades | 11 |
| Bandas | 2 |
| Imágenes | 27 |
| Relaciones hermandad–imagen | 27 |
| Pasos | 21 |
| Relaciones hermandad–paso | 21 |
| Relaciones imagen–paso | 23 |
| Series de salida | 12 |
| Salidas | 12 |
| Relaciones de cortejo | 45 |
| Posiciones musicales | 2 |
| Asignaciones musicales | 2 |
| Periodos musicales | 2 |
| Enlaces de fuentes | 87 |

Las 12 salidas abarcan del 29 de marzo al 4 de abril de 2026, están publicadas y tienen `event_status = 'held'`; no existe ninguna salida del lote con otro estado.
