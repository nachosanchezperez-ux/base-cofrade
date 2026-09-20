# Certificación de preflight SQL · Osuna · HC-016

**Fecha:** 20 de septiembre de 2026  
**Resultado:** `PREFLIGHT_OSUNA_SQL_OK_ROLLED_BACK`  
**DML:** 368/368  
**source_links:** 87  
**outing_entities:** 45  
**Residuo editorial:** 0  
**Apply:** NO EJECUTADO

## Entorno

- Supabase: `ACTIVE_HEALTHY`, PostgreSQL 17.6.1.155.
- Migraciones: 12/12.
- Producción Vercel: READY sobre `eda4dd28066457809d69e26732a6f3b48475bcfe`.
- Errores runtime, últimas 12 h: 0.
- PR #867 y #870: sin escrituras Supabase y fuera del alcance del lote.
- Namespace `c0160034-*`: libre antes del dry-run.
- Imports activos antes del staging: 0.

## Garantías comprobadas

- Transacción completa con `BEGIN` y `ROLLBACK`.
- 11 hermandades, 27 imágenes, 21 pasos y 12 salidas.
- 87 enlaces con exactamente un destino.
- 0 DDL, 0 RLS, 0 DELETE.
- El payload no toca `bulk_imports` ni `bulk_import_items`.
