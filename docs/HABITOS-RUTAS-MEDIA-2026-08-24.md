# Hábitos · rutas internas de Hilo Media

## Problema

La subida de ilustraciones de hábitos almacenaba en `brotherhood_habits.image_path` la URL pública completa generada por Supabase Storage. Esto acoplaba los datos al dominio del proyecto y al endpoint actual del bucket.

## Contrato

Las referencias visuales de los hábitos admiten tres formatos:

1. **Ruta interna de Hilo Media**
   - formato canónico: `habitos/{brotherhood_id}/{habit_id}/{file_id}.{ext}`;
   - se guarda sin dominio ni nombre de bucket;
   - la URL pública se resuelve únicamente al mostrar la imagen.

2. **Ruta local de la aplicación**
   - comienza por `/`;
   - se conserva sin cambios para los recursos versionados en `public/`.

3. **URL externa real**
   - se conserva sin cambios cuando el recurso no pertenece a Hilo Media.

Una URL pública del bucket `hilo-media` recibida por compatibilidad se normaliza automáticamente a su ruta interna.

## Flujo de publicación

```text
SUBIDA AL PANEL
→ Storage: hilo-media/habitos/…
→ Base de datos: habitos/…
→ Panel y Front: resolución temporal con getPublicUrl()
```

## Compatibilidad

El lector acepta:

- rutas internas nuevas;
- rutas locales;
- URLs externas;
- URLs públicas antiguas de Hilo Media durante cualquier transición o edición pendiente.

## Estado aplicado

- El lector y el escritor compatibles quedaron integrados en `main` mediante la PR #304.
- La migración remota `20260823232506_normalize_brotherhood_habit_media_paths` normalizó los tres registros que conservaban la URL pública completa.
- La base de datos contiene ahora cero URL completas de Hilo Media en `brotherhood_habits.image_path`.
- La restricción `brotherhood_habits_image_path_internal_reference` impide volver a guardar una URL pública completa del bucket.
- Las rutas locales y las URLs externas continúan permitidas.
- La ficha pública sigue resolviendo la dirección real del archivo al renderizar, sin alterar la imagen visible.
