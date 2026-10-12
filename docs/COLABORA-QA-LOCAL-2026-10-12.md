# HC-018 · QA de Supabase local · 12/10/2026

## Procedencia y alcance

Pruebas guiadas por el asistente, ejecutadas por Nacho Sánchez en su Mac; resultados de Terminal aportados en esta conversación. El asistente no tiene acceso directo a ese Docker ni certifica por esta vía un deployment. Código probado: `94a748644cdbef144cfab5745f037f388b2a3c66`, rama `audit/colabora-no-go-20261003`, PR #1086 draft.

Entorno declarado: Mac arm64, Node 24.15.0, npm 11.12.1, Git 2.50.1; Docker Engine 29.4.0 y Docker Desktop 4.70.0. Sin costes externos adicionales: se descarta provisionar la rama de pago de Supabase. No se crean recursos remotos ni se modifica producción.

## Aislamiento

La primera instancia reutilizaba una base antigua `hilocofrade` con once migraciones del 12/08 y sin el esquema de seguridad del formulario. Se conserva y se prepara otra instancia `hilo-colabora-qa`: configuración local respaldada y puertos desplazados a 55320–55329; inspector 9083. Las tablas contributions, contribution_attachments y contribution_attempts, las funciones y el bucket privado aparecen en la nueva instancia.

La red `hilo-colabora-qa-local` por sí sola no limitó las escuchas del Mac. Se cambió Port binding behavior de Docker Desktop a localhost, manteniendo Enable host networking desactivado. Postflight `lsof`: los cinco puertos publicados 55321/55322/55323/55324/55327 escuchan en 127.0.0.1. No se certifica el estado de los puertos de otras instancias.

## Resultados aportados

| Prueba | Resultado |
| --- | --- |
| Ocho INSERT concurrentes del mismo hash, transacciones READ COMMITTED y service_role | 1 aceptado, 7 duplicados SQLSTATE 23505, 0 errores, 1 fila; CONCURRENCIA PASS; residuos 0 |
| Ocho llamadas concurrentes con la misma huella | 5 permitidas, 3 bloqueadas, 0 errores, 5 filas; ANTISPAM PASS; residuos 0 |
| 298 intentos sintéticos y ocho llamadas concurrentes de huellas distintas | 2 permitidas, 6 bloqueadas, 0 errores, 300 filas; LIMITE GLOBAL PASS; residuos 0 |
| Veinte intentos de una huella hace 2h y siguiente llamada | Intento 21 bloqueado; LIMITE DIARIO PASS; ROLLBACK |
| Permisos de insertar contributions y ejecutar el limitador | anon f/f, authenticated f/f, service_role t/t |
| RLS de las tres tablas | t/t/t |
| PNG sintético de 1×1 en Storage privado y descarga privilegiada | Bytes coincidentes; ruta pública devuelve rechazo 400/401/403/404 |
| Supresión con purgeExpiredContribution real | Inspección conserva fila/objeto; apply retira objeto, aportación y metadata; auditoría saneada; reintento absent |
| Postflight de Storage y supresión | STORAGE Y CONSERVACION PASS; LIMPIEZA PASS, cero residuos del caso |
| removeOldContributionFingerprints real con casos de 49h y 47h | Elimina 1 intento antiguo y limpia 1 aportación antigua; conserva hashes e intento recientes; CONSERVACION 48 HORAS PASS; residuos 0 |

Las pruebas usaron identificadores/huellas aleatorios y limpieza limitada a sus fixtures. Las pruebas de conteo global y limpieza 48h exigieron tablas de intentos/aportaciones vacías según su alcance. Las claves locales se leyeron en memoria mediante status JSON y no se incorporan a este informe.

## Límites y apertura

B2 dispone ahora de ensayo concurrente real en Postgres local. B3 dispone de ensayo real de objeto privado, purgador y limpieza de huellas locales. Estos resultados no certifican configuración, migración o ejecución en producción ni el scheduler.

Pendientes: widget/variables reales de Turnstile; envío humano completo, Server Action activa y revisión autenticada en Panel; mantenimiento HTTP activo y horario efectivo; política reconciliada (supresión anticipada, extensiones, copias/exportaciones); runtime desplegado y reconciliación de rama con main antes de integración. No se activan recepción ni mantenimiento, no se fusiona/promueve la PR. NO-GO permanece. #1019/#1020 intactas.
