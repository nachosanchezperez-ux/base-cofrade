# Certificación · PREFLIGHT SQL READ-ONLY · Morón · HC-016

**Fecha:** 26 de septiembre de 2026  
**Supabase:** `kcevwkucqzcyrqaimyhl` · ACTIVE_HEALTHY  
**Escrituras ejecutadas:** **0**  
**DML Morón ejecutado:** **0**  
**Staging Morón:** **0**  
**Token:** `PREFLIGHT_MORON_READ_ONLY_OK`

## Resultado

| Guarda | Esperado | Real | PASS |
|---|---:|---:|---|
| `namespace_c0160037_empty` | 0 | 0 | ✅ |
| `municipality_slug_absent` | 0 | 0 | ✅ |
| `entity_slug_collisions` | 0 | 0 | ✅ |
| `place_slug_collisions` | 0 | 0 | ✅ |
| `outing_slug_collisions` | 0 | 0 | ✅ |
| `source_url_collisions` | 0 | 0 | ✅ |
| `new_band_exact_name_collisions` | 0 | 0 | ✅ |
| `reuse_bands_present_and_typed` | 4 | 4 | ✅ |
| `ars_sacra_present_only_as_external_node` | 1 | 1 | ✅ |
| `taxonomy_mystery_present` | 1 | 1 | ✅ |
| `taxonomy_palio_present` | 1 | 1 | ✅ |
| `taxonomy_cross_guide_present` | 1 | 1 | ✅ |
| `participation_unspecified_present` | 1 | 1 | ✅ |
| `event_status_held_present` | 1 | 1 | ✅ |
| `moron_bulk_import_absent` | 0 | 0 | ✅ |
| `hc_auto_03_ready_55_unapplied` | 1 | 1 | ✅ |

**16/16 guardas PASS.**

## Hechos certificados

- namespace `c0160037-*`: 0 filas;
- municipio `moron-de-la-frontera`: no materializado;
- 0 colisiones en entities/places/outings/sources/nombres exactos de bandas nuevas;
- 24/24 URLs canónicas disponibles como INSERT en este corte;
- 4/4 REUSE musicales presentes y tipados;
- taxonomías requeridas presentes;
- `unspecified` y `held` presentes en producción;
- `bulk_import` de Morón: 0;
- HC-AUTO-03: `ready`, 55 esperadas, 55 staged, 55 válidas, 0 inválidas, 0 aplicadas, 0 fallidas;
- Ars Sacra existe, pero el manifiesto no la relaciona con Morón 2026.

## Veredicto

**MORÓN DE LA FRONTERA · PREFLIGHT READ-ONLY CERTIFICADO · APTO PARA STAGING.**

Esto **no autoriza staging**. La próxima operación material requiere una orden posterior específica. Tampoco autoriza payload DML, dry-run de Apply, Apply, HC-AUTO-03 ni apertura de otro municipio.
