# HC-018 · /colabora · NO-GO de apertura

Corte: 3 de octubre de 2026, Europe/Madrid (2/10, 22:07 UTC).

## Resultado

**NO-GO. `/colabora` continúa cerrado. La apertura no está certificada.**

Esta intervención audita la implementación existente y prepara un endurecimiento mínimo en una rama aislada. No activa el flag, no fusiona cambios, no promueve deployments y no cambia datos editoriales ni esquema. No duplica formulario, tablas o Panel.

## Preflight y actualidad

- Primera lectura: `main=f110d5c5905e7bcbd11b9d80f1cae12683f23a5c`, producción `dpl_4CBLVdiNxsxTFhYZzSnbbspn7zUN`, READY.
- Durante la revisión se publica #1084, ajena a este trabajo. La base local actual es `ea076004fff14a2f78b0268048f54dd6fc7f456e`; producción final consultada `dpl_GrtDS2qyDM1nwtZ5CQUHZxPYaxQ2`, READY sobre ese mismo SHA.
- PR #1019 y #1020 abiertas al preflight y sin operaciones sobre ellas.
- `docs/ESTADO-PROYECTO.md` leído. HC-018 sigue bloqueado.
- Supabase `kcevwkucqzcyrqaimyhl`, ACTIVE_HEALTHY, Postgres 17.6.1.155. 18 migraciones registradas; `20260831071000_secure_public_contributions_reconciled` existe. No reaplicada.
- `/colabora` productivo: HTTP 200, aviso de cierre, sin formulario, `noindex, follow`, canonical propia. Este control es HTTP/HTML y **no** QA visual.
- Rama: `audit/colabora-no-go-20261003`.

## Arquitectura existente comprobada

`ContributionForm` → Server Action → origen/ticket → validación → RPC antiabuso → Turnstile server-side → validación y recodificación de adjuntos → comprobación de duplicados → `contributions.pending` → cuarentena privada → `/panel/aportaciones`.

El navegador no usa una clave privilegiada ni escribe directamente en la cola. El Panel tiene pendiente, revisión, falta de información, aceptada, rechazada, incorporada y caducada. El editor actualiza la revisión y la auditoría; no transforma automáticamente una aportación en contenido editorial. Los PDF se presentan mediante descarga temporal, sin previsualización. Los enlaces firmados del Panel duran 300 segundos.

## Correcciones preparadas, todavía no productivas

1. Ticket y fingerprint requieren `CONTRIBUTION_FORM_SECRET` propio de al menos 32 bytes. Se elimina el fallback a la credencial Turnstile. Readiness permanece cerrado si falta ese secreto o es demasiado corto. La longitud mínima no certifica por sí sola la entropía: debe provisionarse aleatoriamente.
2. Turnstile rechaza llamadas sin hostname esperado y exige `success === true`, además del action y hostname existentes. Conserva timeout de seis segundos y rechazo ante HTTP fallido, JSON inválido y error de red.
3. Consentimiento y confirmación de derechos requieren exactamente un valor `on`. No basta con que exista el campo ni se acepta `false` como confirmación.
4. Regresiones ejecutables sobre el módulo real de seguridad y el parser. El harness omite solo el marcador de empaquetado `server-only`; no sustituye la lógica por una copia. Las respuestas Turnstile son mocks locales, no una verificación humana real.

Sin nuevas dependencias, DDL, DML editorial ni migraciones.

## Seguridad de Supabase verificada

- RLS activo en `contributions`, `contribution_attachments` y `contribution_attempts`.
- `anon` sin SELECT/INSERT/UPDATE/DELETE en las tres tablas. Doce peticiones reales REST con clave pública devuelven HTTP 401 y código Postgres `42501`. PATCH/DELETE apuntan a IDs inexistentes; no se toca contenido real.
- `authenticated` carece de INSERT/DELETE en aportaciones y adjuntos y de todos los permisos en intentos. SELECT/UPDATE de la cola requieren pertenencia al Panel; UPDATE requiere editor/admin.
- Bajo rol authenticated sin identidad de Panel, las consultas de aportaciones, adjuntos y objetos de cuarentena no devuelven filas. Verificación SQL con ROLLBACK.
- `current_panel_role` consulta `panel_users` por `auth.uid()` y `active=true`; no confía en metadata editable del usuario. Las funciones auxiliares tienen `search_path=''`.
- RPC antiabuso SECURITY DEFINER, `search_path=''`, EXECUTE exclusivamente postgres/service_role. La llamada bajo anon se deniega.
- Bucket `hilo-contributions-quarantine`, `public=false`, 8 MiB, MIME permitidos JPEG/PNG/WebP/PDF. Las policies de lectura/borrado exigen rol de Panel; no hay policy pública de cuarentena.
- Enumeración HTTP anónima del bucket devuelve `200 []`. Es ausencia de filas visibles, no un error HTTP. Falta probar descarga de un objeto de prueba real y el recorrido editorial autenticado.
- RPC probada: primeras cinco llamadas aceptadas, sexta rechazada; fingerprint inválido rechazado; umbrales 20/24h y 300/h global rechazan. Todos los datos de prueba se generan dentro de transacciones terminadas en ROLLBACK. No quedan intentos de prueba.
- Security Advisor ejecutado. INFO por `contribution_attempts` sin policies es coherente con la tabla exclusivamente servidor. Avisos de funciones auxiliares de Panel y `apply_document_import`, y la tabla `completeness_rules`, se registran como observaciones ajenas sin ampliar alcance.

La prueba del límite global es secuencial; no certifica su comportamiento concurrente.

## Bloqueos pendientes de apertura

### B1 · PDF: contenido real insuficientemente validado

Prueba local: un archivo `fake.pdf` declarado `application/pdf`, con HTML/JavaScript al comienzo, `%PDF-1.7` más adelante y `%%EOF` al final, es aceptado por `validateContributionAttachment` como PDF. La función busca cabecera en los primeros 1024 bytes, EOF y tokens peligrosos literales. No parsea la estructura PDF ni los nombres escapados/objetos comprimidos.

No se ha enviado el archivo a producción ni se ha almacenado. La cuarentena sigue siendo privada, pero no compensa el fallo del contrato de validación. Resolver con validación estructural adecuada y regresiones sobre contenido malformado, nombres escapados, objetos comprimidos, cifrado y contenido activo, manteniendo descarga privada y sin preview automática. No afirmar que un simple regex certifica ausencia de contenido peligroso.

### B2 · Duplicados y concurrencia

La acción hace SELECT por hash y ventana de 24h, seguido de INSERT en otra llamada. El índice productivo del hash no es UNIQUE. Dos solicitudes concurrentes pueden superar ambas el SELECT. Además, descripción y fuentes no se normalizan suficientemente para detectar contenido sustancialmente idéntico con diferencias triviales.

Resolver reserva/inserción atómica por hash y ventana temporal, con regresión concurrente; cualquier corrección de base de datos debe nacer como migración mínima y superar preview. No se modifica el esquema en este corte. La protección de ráfagas por fingerprint sí está probada; el lock actual no serializa el contador global entre fingerprints distintos.

### B3 · Conservación y privacidad: contrato pendiente

Se leyó la versión `ready` real de `legal_drafts.privacy_policy` usada por `/privacidad`. Contempla aportaciones, contacto opcional, revisión, cuarentena, derechos y proveedores.

Sin embargo, afirma que las huellas se depuran a las 48h. La limpieza existe exclusivamente dentro del RPC cuando llega un nuevo intento; no hay job cron de contribuciones. Las aportaciones tienen `expires_at` de 12 meses pero no se encontró automatización de revisión/supresión; el Panel consulta y muestra la cola sin filtrar caducidad. Falta concretar un procedimiento demostrable de conservación, incluidos contacto, fingerprint de la aportación y objetos privados, o ajustar las afirmaciones al funcionamiento real.

No se ha cambiado ni publicado una nueva política en este corte. No se certifica cumplimiento legal ni se amplía este encargo a la analítica general.

### B4 · Variables y Turnstile reales sin certificar

El conector Vercel disponible permite consultar proyectos/deployments, pero no listar ni editar variables. No hay CLI Vercel autenticada ni token Vercel en este entorno. No se han leído ni inventado secretos. No puede concluirse que las claves falten: su estado es **no verificado**.

Pendiente comprobar, sin valores en salida, producción y preview: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `CONTRIBUTION_FORM_SECRET`, `SUPABASE_SECRET_KEY` o service role vigente, `NEXT_PUBLIC_SUPABASE_URL`, `PUBLIC_CONTRIBUTIONS_ENABLED`. Readiness cerrado en producción está observado; la causa concreta del cierre no se deduce de ese resultado.

Falta hostname permitido en el widget real, validación humana controlada y prueba end-to-end hasta `pending` con privacidad y limpieza. Los tests mock no sustituyen esas pruebas.

### B5 · Experiencia y matriz final pendientes

La implementación actual presenta cuatro modalidades; agenda e información musical están agrupadas en `new_record`. Faltan cinco entradas claras, campos condicionales mínimos y contexto validado desde ficha/agenda/música al mismo formulario. La base de datos solo acepta cuatro tipos: no añadir dos tipos de UI sin reconciliar el contrato de almacenamiento o modelarlos como submodalidades validadas.

No se ha modificado la UI ni colocado CTAs hacia un canal cerrado. Faltan pruebas visuales de formulario, errores, éxito, adjuntos, teclado y Turnstile en 320/390/430/768/1024/1366/1600 px. No existe envío humano de prueba ni aceptación certificada en el Panel.

## QA y build de la propuesta

- Baseline: 1461/1461 tests PASS.
- Propuesta: 1463/1463 tests PASS, cero fallos/omisiones.
- Build completo `npm run build`: PASS. Usa únicamente URL y clave **pública** real de Supabase y canal desactivado; no credenciales falsas ni service role. No certifica readiness de producción.
- `git diff --check`: PASS.
- Ticket: aleatoriedad, límite mínimo 3s, máximo 45min, manipulado, futuro y secreto ausente/corto cubiertos.
- Turnstile: token ausente, hostname ausente/incorrecto, action incorrecto, éxito no booleano, HTTP fallido, red y JSON inválido cubiertos con mocks. El timeout se conserva en código; no se declara prueba temporal ejecutada.
- Consentimiento: ausente/no afirmativo y campos repetidos rechazados.
- Adjuntos: tests previos de MIME falso, tipos permitidos, recodificación y eliminación EXIF, número/peso de archivos PASS. B1 demuestra que esa cobertura no certifica PDFs.
- SHA de código verificado: `664b51613a839f1b291540fdf15ba31411fec471`; [PR #1086](https://github.com/nachosanchezperez-ux/base-cofrade/pull/1086), draft, sin fusionar.
- CI del SHA de código: PASS; workflow `37070997076`, job `111050145463`, checkout/install/tests/build SUCCESS.
- Preview del SHA de código: `dpl_Crz8JT6X8QDPCSeBNgNw3yMZW6ji`, READY. `/colabora` HTTP 200, formulario de preview presente, envío deshabilitado y `noindex, follow`. No equivale a QA visual ni a readiness verificado.
- La actualización documental posterior no cambia los módulos ya probados; comprobar también los checks del HEAD final antes de cualquier futura fusión.
- QA visual, envío humano y producción de los cambios: **NO EJECUTADOS**; ninguna certificación de apertura.

## Continuación y condición de GO

Mantener cerrado. Resolver B1–B3; completar UX sin duplicar sistemas; obtener inspección de variables reales; verificar preview, seguridad concurrente, almacenamiento privado y moderación autenticada; completar matriz visual y CI; solo entonces activar y realizar un único envío humano productivo con limpieza y revisión de logs.

Este documento registra un **NO-GO verificable**, no un cierre certificado del flujo completo. La rama conserva las correcciones mínimas para revisión y continuidad. Ningún resultado aquí autoriza degradar una defensa para abrir el canal.
