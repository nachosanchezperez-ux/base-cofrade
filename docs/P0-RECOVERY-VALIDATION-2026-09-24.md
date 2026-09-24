# Recuperación de Supabase y publicación correctiva

Corte final: 24/09/2026, 22:36 UTC. Recuperación confirmada; P0 cerrado
operativamente tras una ventana limpia superior a 30 minutos.

## Recuperación

El usuario ejecutó el reinicio desde el panel de Supabase. PostgreSQL informa
inicio a las 22:04:49 UTC. `SELECT 1` volvió a responder a las 22:06:52 UTC.
La API pública devuelve filas reales y Storage sirve un PNG público con HTTP 200.
También se verificó una imagen de Storage a través del optimizador de imágenes
del dominio productivo: HTTP 200, `image/jpeg`, 449.543 bytes.

Dos mediciones posteriores al reinicio mostraron 9 conexiones de cliente con
`max_connections=60`, ninguna otra consulta activa y ninguna sesión
`idle in transaction`. Esto describe el estado posterior, no demuestra la causa
de la caída. No se ha confirmado agotamiento de cuota ni necesidad de ampliar plan.

## Validación y publicación

La producción anterior seguía sirviendo Agenda y Bandas vacías con HTTP 200,
aunque los registros ya estaban disponibles en Supabase.

Se accedió a la preview mediante el enlace temporal autorizado de Vercel y una
sesión con cookies. Se comprobó contenido de la aplicación, no una pantalla SSO.
El candidato `3e047a0ca3a8426f983b3773eb95c56ad7d985c1` pasó CI y las lecturas
reales: 103 Bandas, 62 actos próximos, 198 Hermandades visibles, 510 Imágenes,
368 Pasos, 388 Autores, 21 Igualás/Ensayos y 6 Crucetas. La Home recuperó sus
contadores. Los sitemaps completo y por familias contenían exactamente el mismo
conjunto de 2.051 URL únicas, canónicas y sin duplicados.

La PR #932 se fusionó y publicó:

- `main`: `ba70771c94f11fd3aff70e4e651ab3093352fd28`.
- Producción: `dpl_6V5TZZyVzoT36J3DvXg3seJ82ehF`, READY desde 22:15:03 UTC.
- Alias verificados: `hilocofrade.es` y `www.hilocofrade.es`.
- El código de `app`, `lib` y `components` coincide con el árbol local validado.
- Home, Agenda, Bandas, Hermandades, Autores, Igualás/Ensayos y El Baratillo:
  HTTP 200, deployment correcto, canonical correcto y sin payload de error.
- Producción: 103 Bandas, 63 actos próximos y 2.052 URL en el sitemap completo.

La diferencia de un acto respecto a la preview se investigó: apareció el Rosario
Vespertino de María Santísima de la Victoria del 03/10/2026, creado/publicado en
`outings` a las 22:14:14 UTC durante la validación. Es la única URL añadida y no
hay ninguna retirada. Esta intervención no creó ni modificó ese registro.
La comprobación inicial de igualdad de conteos se detuvo ante esa diferencia;
se verificó posteriormente su correspondencia exacta con el registro real.

## Ventana limpia y cierre

PostgreSQL acumuló 1.915 segundos de actividad desde el reinicio (31 minutos y
55 segundos) en la medición de cierre. Conservaba 7 conexiones de cliente de un
máximo de 60, ninguna otra consulta activa y ninguna sesión `idle in transaction`.

Entre 22:04:49 y 22:34:21 UTC, los logs de Auth, Edge, Pgbouncer, PostgreSQL,
PostgREST, Realtime, Storage y Workflows no registraron entradas con nivel
`error`. Las cinco menciones de `timeout` eran cierres normales de conexiones
inactivas de Pgbouncer (`server idle timeout`), no timeouts de peticiones ni
indisponibilidad. Vercel no encontró grupos de error desde el despliegue de
producción hasta la medición final.

Después de vencer las cachés de 300/900 segundos se forzaron lecturas nuevas de
Home, Agenda, Bandas, Hermandades, Imágenes, Pasos, Autores, Igualás/Ensayos,
El Baratillo y el sitemap completo. Todas respondieron HTTP 200 con el deployment
esperado y contenido real. El Baratillo pasó de `STALE` a `HIT`, acreditando la
regeneración de ISR. Producción conservó 63 actos, 103 bandas, 198 Hermandades
visibles, 510 Imágenes, 368 Pasos, 388 Autores, 21 Igualás/Ensayos y 2.052 URL.

Se recertificaron 15 migraciones estructurales. Existe un único lote `ready`,
HC-AUTO-03 · El Calvario, 55/55 válido y 0 aplicado, creado el 21/09. Se preserva
intacto y no forma parte de este cierre: no se ejecutó Apply ni ninguna escritura.

P0 queda cerrado como incidente operativo. La causa raíz del bloqueo inicial no
ha sido demostrada; el ticket Supabase SU-484619 se conserva abierto y no se ha
enviado otro mensaje a soporte. #931 sigue independiente. Carmona vuelve a quedar
disponible como siguiente frente, pero no se abre ni se ejecuta en este cierre.
HC-AUTO-03 conserva su bloqueo expreso.

Evidencias: `docs/qa/p0-recovery-2026-09-24/`. No contienen cookies, claves ni
enlaces de acceso temporal. No hubo DML, DDL ni cambios de plan por el agente.
