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


## Priorización de la cola

La cola editorial no se ordena alfabéticamente por defecto. La prioridad se recalcula con datos vivos y no se persiste como atributo de la entidad.

Señales utilizadas:

- actividad anunciada en los próximos 90 días;
- ficha sin revisar o con revisión vencida;
- cambios recientes en la entidad;
- número de conexiones estructuradas dentro del grafo;
- número de Fuentes directas vinculadas.

Niveles operativos:

- **Urgente**: 90 puntos o más;
- **Alta**: 70–89;
- **Media**: 55–69;
- **Normal**: menos de 55.

La interfaz muestra hasta cuatro motivos por ficha —por ejemplo, actividad próxima, ausencia de revisión, cambio reciente, conexiones o Fuentes— para que el orden sea explicable y auditable.

La vista `public.entity_editorial_priority` usa `security_invoker = true`, no está disponible para `anon` y solo admite lectura desde el panel autenticado.


### Corrección de la señal de cambio reciente

La prioridad usa la **fecha efectiva de contenido** (`content_updated_at ?? updated_at`) para medir si una ficha ha cambiado recientemente.

Esto evita que una acción meramente editorial como **Revisada hoy** —que puede mover el `updated_at` técnico por trigger— añada falsamente el motivo «Cambio reciente» o sume puntos de actualización.

La migración correctiva `20260922045453_fix_editorial_priority_content_date` redefine la vista sin cambiar pesos, umbrales ni permisos.
