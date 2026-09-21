# Frescura editorial de fichas · 22/09/2026

## Estado

Sistema editorial activo desde la PR #910.

- `content_updated_at`: última actualización editorial significativa del contenido público.
- `editorial_reviewed_at`: última revisión editorial aunque no haya cambios.
- La fecha pública usa `content_updated_at` y mantiene `updated_at` como fallback legado.
- Una revisión sin cambios conserva la fecha pública.
- La cola del Panel clasifica las fichas como Sin revisar, Al día, Revisar pronto o Vencida.
- Umbrales operativos: 90 y 180 días.
- No existe backfill automático de revisiones históricas.

## Migración

`20260921234430_add_entity_editorial_freshness`

La migración está aplicada en Supabase producción, con columnas nullable e índice parcial de la cola editorial.

## QA

- dry-run transaccional: OK;
- 1.087/1.087 tests: OK;
- build de CI: OK;
- preview Vercel: READY;
- prueba BEGIN/ROLLBACK: una revisión cambia `updated_at` técnico pero preserva la fecha pública;
- sin revisiones ficticias ni cambios persistentes durante el QA.

## Despliegue

El primer deployment automático de producción del merge #910 terminó con un error genérico de build de Vercel pese a que el mismo código había superado CI y preview. Este documento deja trazado el reintento controlado del deployment sin introducir cambios funcionales.
