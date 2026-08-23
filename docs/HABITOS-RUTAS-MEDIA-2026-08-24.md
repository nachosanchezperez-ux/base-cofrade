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

El lector acepta durante la transición:

- URLs públicas antiguas de Hilo Media;
- rutas internas nuevas;
- rutas locales;
- URLs externas.

La normalización de los registros existentes se ejecutará únicamente después de desplegar el lector compatible, para no interrumpir las imágenes actuales en producción.
