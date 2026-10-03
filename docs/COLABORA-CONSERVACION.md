# HC-018 · Operación de conservación

Estado: propuesta en #1086, no desplegada ni activada. No se han eliminado datos reales. La política publicada no se modifica mediante este documento.

## Huellas antiabuso

`GET /api/cron/contributions-retention` exige cabecera Authorization Bearer con `CRON_SECRET` independiente de al menos 32 bytes y `CONTRIBUTION_RETENTION_ENABLED=true`. Ausencia/token incorrecto: 401; operación desactivada: 503. Respuestas sin caché y noindex, logs genéricos sin direcciones, contacto, títulos, rutas ni valores de claves.

Solo limpia intentos anteriores a 48h y pone a null los hashes de fingerprint y contenido de aportaciones anteriores a 48h. No borra contactos, aportaciones ni archivos. Quitar el hash de contenido después de 48h respeta la ventana de duplicados de 24h. La recepción pública puede seguir cerrada mientras se mantiene esta limpieza.

No hay un cron activado ni nuevas variables provisionadas en este corte. Tras verificar el endpoint con credenciales del preview y revisar sus logs, la configuración candidata para Vercel Pro es:

```json
{ "crons": [{ "path": "/api/cron/contributions-retention", "schedule": "*/15 * * * *" }] }
```

Debe integrarse con `vercel.json` conservando su configuración existente, únicamente cuando se haya autorizado y provisionado el mantenimiento. Cron se ejecuta en producción, no en previews. Con esta frecuencia, las huellas elegibles se eliminan en la siguiente ejecución correcta: 48h es un umbral de elegibilidad, **no una garantía de borrado exacto al segundo**. La política real debe expresarlo con precisión, incluir el tratamiento de errores y reconciliarse antes de abrir el formulario. Confirmar un ciclo real con datos sintéticos y ausencia de residuos; monitorizar ejecuciones fallidas y reintentarlas.

## Revisión y supresión de una aportación

1. Editor autorizado revisa el filtro Conservación → Revisión de plazo vencida en `/panel/aportaciones`. El plazo inicial de 12 meses requiere una decisión; no provoca borrado automático.
2. Documenta el motivo en el resumen y marca Caducada. Este estado cierra las modificaciones del Panel; la acción exige el estado anterior en el UPDATE para rechazar revisiones concurrentes obsoletas. Los nuevos registros de revisión omiten el título aportado.
3. Operador privilegiado inspecciona una única referencia con un entorno que ya disponga de URL y clave de servicio del proyecto correcto. No usar secretos en argumentos, salida o chat:

```bash
node scripts/purge-expired-contribution.mjs UUID
```

Sin `--apply`, solo comprueba estado caducado, plazo vencido y pertenencia estricta de hasta tres rutas privadas; devuelve únicamente conteos/estado. Nunca inspecciona el contacto ni descarga archivos. Ausencia de la fila es un resultado idempotente.

4. Tras autorizar la supresión concreta y revisar la inspección, ejecutar:

```bash
node scripts/purge-expired-contribution.mjs UUID --apply
```

Sanea los resúmenes/changed_fields de auditoría referidos a esa aportación; elimina objetos de `hilo-contributions-quarantine` por Storage API y después elimina la fila, aún condicionada a estado Caducada/plazo vencido. La FK existente elimina los metadatos de adjuntos. Un fallo de auditoría o Storage impide borrar la fila. Si falla el DELETE tras retirar objetos, reintentar la misma referencia; no ampliar el borrado a un bucket o lote.

5. Verificar ausencia de fila, metadatos y objetos del caso concreto y conservar evidencia de conteos sin datos del remitente. No declarar supresión completa sin ese postflight.

Las operaciones Storage y base de datos no comparten una transacción: puede haber un estado parcial entre ellas o tras un error. El flujo de Panel evita reabrir caducadas, pero no impide escrituras manuales de administradores fuera de la aplicación; no realizarlas durante la supresión. Copias de seguridad, exportaciones y retención administrativa de la auditoría necesitan una regla independiente y verificable; este código no garantiza su eliminación. Las solicitudes de supresión anticipada y las extensiones justificadas de plazo requieren resolver su procedimiento antes de certificar cumplimiento. No se añade un botón destructivo público ni se purgan automáticamente todas las aportaciones vencidas.

## Condición de cierre

Tests con cliente simulado y build no certifican una eliminación real. Pendientes: configuración segura, ciclo de limpieza real, supresión de un caso sintético con objetos privados, postflight y política reconciliada. Mantener NO-GO de recepción hasta completarlos.
