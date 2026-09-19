# Certificación · manifiesto determinista de Estepa · HC-016

**Fecha:** 19 de septiembre de 2026  
**Municipio:** Estepa  
**Fase:** PRE-LOTE · manifiesto determinista  
**Staging:** 0  
**Apply:** 0  
**DDL / RLS:** 0 / 0

## Veredicto

**MANIFIESTO DETERMINISTA · CERRADO Y APTO PARA PREFLIGHT SQL**

No autoriza staging.

## Base real

- main al iniciar esta fase: `0bf938e69f6bd15fcccdd6e30ce177702bbcec45`.
- #854: fusionada.
- producción: `dpl_yxSL3BJnGUmWEU1abUdyDpSd2ywn` · READY.
- Supabase: ACTIVE_HEALTHY.
- migraciones: 12/12.
- PR abiertas al inicio: 0.
- imports abiertos de Estepa: 0.
- imports históricos de Estepa: 0.

## Namespace

Se congela:

`c0160032-*`

Bulk import reservado documentalmente:

`c0160032-0000-4000-8000-000000000001`

No existe una fila `bulk_imports` con ese ID.

## Guardas de colisión

Resultado contra producción:

- IDs reservados `c0160032-*` en tablas nucleares: **0 colisiones**.
- bulk import reservado: **libre**.
- 67 slugs de `entities`: **0 colisiones**.
- duplicados internos en esos 67 slugs: **0**.
- 4 slugs de lugares: **0 colisiones**.
- 2 slugs de municipios soporte: **0 colisiones**.
- 23 URLs de nuevas Fuentes: **0 coincidencias exactas**.

## REUSE

Los 21 REUSE congelados están presentes en producción:

**21/21 · 0 missing**

Incluyen:
- municipios Estepa y Utrera;
- Nazareno, Imagen y Paso;
- relaciones ya existentes del Nazareno;
- autoría atribuida a Luis Salvador Carmona;
- Iglesia de San Sebastián;
- Villa de Osuna;
- cuatro agentes;
- cuatro Fuentes existentes;
- dos Salidas extraordinarias de noviembre.

## Limpieza controlada

Fuente duplicada candidata:

`dc375c1f-9318-4de9-ae1f-d1f10a7d050f`

Estado verificado:
- misma URL que la Fuente canónica;
- `source_links = 0`;
- Fuente canónica preservada: `72ac1537-8940-4455-8e8d-c17169baa0aa`.

Antes del DELETE, el payload final debe volver a recorrer todas las FK.

## Recuento congelado

| Clase | Total |
|---|---:|
| INSERT / UPSERT | 490 |
| UPDATE | 4 |
| DELETE | 1 |
| **TOTAL DML** | **495** |
| REUSE | 21 |

### Desglose nuclear
- 13 corporaciones;
- 28 Imágenes físicas;
- 18 Pasos;
- 7 Bandas nuevas;
- 13 Salidas nuevas;
- 16 posiciones/asignaciones musicales;
- 14 periodos musicales;
- 8 Cultos;
- 8 ediciones 2026;
- 1 acontecimiento;
- 23 Fuentes nuevas;
- 143 `source_links`.

## Fuentes

Las 23 URLs candidatas se revalidaron contra `public.sources` y ninguna existe actualmente como URL exacta.

Fuentes externas especialmente sensibles:
- BCT Santa Bárbara · La Línea: identidad y final de vinculación con Estepa documentados.
- BCT Santa Vera+Cruz · Utrera: web propia.
- AM Vera Cruz · Campillos: web propia.
- AM Paz y Caridad: web oficial.
- Estudiantes: blog oficial activo en 2026.

## Regla de seguridad

El siguiente movimiento permitido es:

`construir payload exacto → BEGIN → 495 DML → guardas globales → ROLLBACK`

No crear:
- `bulk_imports`;
- `bulk_import_items`;
- SQL activo de migración;
- staging;
- Apply.

Solo tras un preflight SQL completo y limpio podrá plantearse staging.

