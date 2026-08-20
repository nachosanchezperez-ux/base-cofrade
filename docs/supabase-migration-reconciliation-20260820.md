# Reconciliación del historial de migraciones · 20/08/2026

El repositorio conserva como fuente de verdad las versiones y sentencias que
Supabase registró en producción. No se debe ejecutar `supabase db push` hasta
que `supabase migration list` muestre las columnas Local y Remote alineadas.

## Cambios realizados

- Se recuperaron del historial remoto las migraciones que faltaban en Git.
- Se corrigieron las marcas temporales locales que tenían una equivalencia
  inequívoca en producción.
- El SQL de las 28 migraciones remotas desde el 19/08/2026 se sincronizó con las
  sentencias exactas guardadas en `supabase_migrations.schema_migrations`.
- Se añadió una prueba automática que rechaza versiones duplicadas o nombres de
  migración mal formados.

## Versiones locales pendientes de registrar como aplicadas

La auditoría de producción confirmó sus efectos actuales o que fueron
reemplazados por una migración posterior. Estas versiones se crearon antes de
que su ejecución quedara registrada correctamente en el historial remoto:

```text
20260817090035
20260817090036
20260817090037
20260817173038
20260817191039
20260817193040
20260817201041
20260817203042
20260817203142
20260817222043
20260817223044
20260817224045
20260818123047
20260818133048
20260819090052
20260820123000
20260820225000
20260820234000
```

Una vez fusionada esta rama y actualizado el repositorio local, deben registrarse
con `migration repair --status applied`; no deben volver a ejecutarse. Después se
debe comprobar el resultado con `migration list` antes de usar `db push`.

## Evidencias verificadas en producción

- Existen las columnas y la vista de la próxima salida extraordinaria, junto con
  la salida de Aznalcázar y sus tres hitos.
- Existen la función y el trigger de protección de relaciones públicas.
- Existen las tres tablas de discografía, sus permisos y `spotify_url` en las
  pistas.
- La Encarnación tiene entidad, perfil de Spotify y nueve publicaciones; su foto
  inicial fue reemplazada posteriormente por la imagen oficial.
- Existen la marcha «El Nazareno» y su autor relacional.
- San Benito está consolidado en su ID canónico y no quedan los IDs duplicados.
- Están publicadas las fotografías actuales de La Puebla y las indumentarias de
  San Benito y El Baratillo.
