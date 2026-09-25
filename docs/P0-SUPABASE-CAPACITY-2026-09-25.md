# Supabase · capacidad y mitigación de presión de memoria

Corte: 25/09/2026. Seguimiento del incidente SU-484619 después de la
recuperación operativa del 24/09.

## Respuesta de Supabase Support

Supabase Support ha confirmado en las métricas del proyecto:

- sobreutilización de memoria;
- uso sostenido de SWAP;
- sobreasignación de memoria;
- un patrón compatible con degradación, timeouts e inestabilidad cuando la
  presión se mantiene.

Soporte recuerda que CPU y Disk I/O pueden agravar el mismo síntoma y que el
agotamiento de créditos burst puede reducir el rendimiento efectivo. La
evidencia recibida permite dejar de tratar el incidente como una causa
desconocida: existe presión de memoria demostrada. No se atribuye, sin evidencia
adicional, todo el incidente exclusivamente a RAM frente a CPU/IO.

La organización está en Pro. El usuario ha actualizado el proyecto de Nano a
Micro siguiendo la recomendación de soporte.

## Estado post-upgrade

Proyecto: `kcevwkucqzcyrqaimyhl` · `ACTIVE_HEALTHY`.

Base de datos: ~45 MB. No existe evidencia de agotamiento por tamaño.

Configuración observada:

| Parámetro | Antes | Micro |
|---|---:|---:|
| shared_buffers | 224 MB | 256 MB |
| effective_cache_size | 384 MB | 768 MB |
| work_mem | 2184 kB | 3500 kB |
| maintenance_work_mem | 32 MB | 64 MB |
| max_connections | 60 | 60 |

La mejora de compute aumenta el margen, pero no sustituye la optimización de
consultas.

## Foco demostrado: home_knowledge_threads

Los registros del 24/09 contienen `statement timeout` sobre
`home_knowledge_threads`. La vista reconstruía en cada lectura una red de CTE,
joins, agregaciones y uniones sobre entidades, patrimonio, marchas, pasos,
autorías y relaciones.

Antes de la mitigación, un `EXPLAIN ANALYZE` equivalente al acceso de Home
empleó ~115,4 ms y produjo 2.052 filas derivadas antes de devolver el subconjunto
ordenado.

La vista contiene:

- 2.052 hilos totales;
- 842 hilos de descubrimiento;
- 59 hilos de prioridad >= 92;
- 2.052 `thread_key` únicos.

## HC-PERF-SUPABASE-01

Migraciones aplicadas en producción:

- `20260925051118_home_knowledge_threads_cache`
- `20260925051336_home_knowledge_threads_cache_private`

Arquitectura final:

1. `public.home_knowledge_threads_live`: fuente relacional pesada, sin acceso
   público.
2. `private.home_knowledge_threads_cache`: materialized view precalculada.
3. `public.home_knowledge_threads`: contrato público `security_invoker` que
   conserva nombre y columnas para la aplicación.
4. Índice único por `thread_key` y dos índices de lectura para prioridad y
   fecha.
5. Supabase Cron refresca la caché cada minuto mediante
   `REFRESH MATERIALIZED VIEW CONCURRENTLY`.

La caché está fuera del esquema público. El aviso
`materialized_view_in_api` detectado inicialmente por Security Advisor quedó
eliminado después del hardening.

## QA

- fuente: 2.052 filas;
- caché: 2.052 filas;
- `live EXCEPT cache`: 0;
- `cache EXCEPT live`: 0;
- rol `anon`: lectura correcta;
- consulta equivalente de Home: ~0,42 ms después de materializar;
- mejora observada del patrón medido: aproximadamente 270x;
- cinco refrescos consecutivos del cron final: `succeeded`, ~156–160 ms cada uno;
- 7 conexiones cliente en la medición final, 1 activa y 0 `idle in transaction` persistentes;
- 0 errores PostgreSQL `ERROR/FATAL/PANIC` en la ventana posterior a la migración;
- `home_knowledge_threads` conserva `security_invoker=true`;
- Preview Branch reproduce las 17 migraciones y la arquitectura `public`/`private` sin datos;
- GitHub CI: 1.159 tests + build, verde;
- Vercel preview: `READY`; 0 errores de runtime en la ventana de validación;
- Home productiva: HTTP 200 y hilos reales renderizados tras la migración;
- no se ha modificado contenido editorial.

Performance Advisor conserva 65 avisos informativos de claves foráneas sin
índice. No se crean índices masivamente: deberán cruzarse con consultas reales
antes de cualquier nueva DDL.

## Estado operativo

La migración está en producción y reconciliada en la PR #934
(`perf/home-knowledge-cache`). Todos los gates de cierre han quedado verdes y
HC-PERF-SUPABASE-01 queda certificado para integración. Carmona y HC-AUTO-03 no
forman parte de esta intervención.
