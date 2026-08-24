# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Último estado conocido

- Revisión: **24 de agosto de 2026 · mañana (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Baseline funcional previo al cierre documental: `main` en `0a38643ccb50c9e2b8a3f53097b4c12d44bb467c`.
- Producción: `dpl_5dnhHspdGvsJu32fvU5tG28GHZXK` → **READY**, alineada con ese SHA.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Últimas migraciones reconciliadas:
  - `20260824001013_structured_simpecados_and_musical_work_types`;
  - `20260824001747_source_salve_pastora_premiere`;
  - `20260824003035_reconcile_salve_pastora_premiere_evidence`;
  - `20260824003235_cult_media`.
- #49 · Importador documental asistido → **⚪ APARCADA**; no usar como base ni aplicar sus migraciones.

La propia integración documental de esta fase cambiará el SHA de `main`. Este bloque debe actualizarse de nuevo después de fusionar y validar producción.

## Última validación

Antes de abrir el cierre documental se comprobó:

- GitHub real y PR abiertas;
- producción Vercel `READY`;
- Supabase `ACTIVE_HEALTHY`;
- historial remoto de migraciones hasta `cult_media`;
- arquitectura pública cerrada;
- Personas / agentes cerradas;
- smoke transversal anterior cerrado;
- primer ciclo de Salud del grafo cerrado;
- relaciones nucleares incoherentes: `0`;
- media abierta protegida por Panel, constraint y RLS;
- piloto visual y musical de la Pastora integrado.

## Frente activo

**CIERRE FORMAL DE LA FASE DE CONSOLIDACIÓN**

Orden activo:

1. consolidar el delta útil de #314;
2. sincronizar decisiones HC;
3. reconstruir el cierre de #316;
4. cerrar las tres PR antiguas;
5. actualizar este estado sobre el `main` definitivo;
6. ejecutar smoke corto de producción;
7. declarar consolidación cerrada.

No existe todavía una fase funcional nueva en ejecución.

## Bloqueos reales

- #314, #315 y #316 permanecen abiertas mientras se integra este corte canónico.
- El smoke final de producción todavía no se ha ejecutado sobre el cierre documental.
- `main`, deployment y última validación deberán refrescarse después de la fusión.

No son bloqueos:

- Supabase;
- migraciones de la Pastora;
- `cult_media`;
- media abierta;
- relaciones nucleares;
- arquitectura pública.

## Decisiones canónicas

- Registro: `docs/DECISIONES-HC.md`.
- Media abierta: `docs/MEDIA-ABIERTA.md`.
- Frontera pública / Panel: HC-015.
- Importación masiva: HC-016.
- Salud del grafo: HC-017.
- #49 continúa aparcada.
- No se asigna HC-018.

## Siguiente acción

**Fusionar y validar el corte documental de consolidación.**

Después:

**SMOKE FINAL DE PRODUCCIÓN**

Solo si el smoke es correcto:

**DECLARAR CONSOLIDACIÓN CERRADA Y ABRIR EXPERIENCIA MÓVIL**

Primer corte aprobado, todavía no iniciado:

**Panel móvil · operación real**, validado con Pastora, San Benito y El Baratillo.

## Regla para «¿Qué toca?»

1. Refrescar GitHub, Vercel y Supabase.
2. Localizar el primer punto pendiente de la secuencia activa.
3. Marcar como cerrados los anteriores si el estado real lo confirma.
4. Devolver una sola acción ejecutable.

**ESTADO-PROYECTO → 🟠 CANÓNICO PARA EL CIERRE · PENDIENTE DE VALIDACIÓN FINAL**
