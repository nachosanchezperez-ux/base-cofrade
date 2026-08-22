# Fase A · Bandas con cliente público anónimo

Estado: IMPLEMENTACIÓN INCREMENTAL

## Alcance de este PR

Se migra únicamente `/bandas` al cliente público anónimo ya validado en la Fase A.

El nuevo loader `bands-directory-public.js` reproduce exclusivamente los datos que necesita el directorio: identidad, nombres, tipología, localidad, fundación, vinculación institucional, colores y logotipo.

## Motivo del corte

`lib/supabase/bands.js` también alimenta fichas individuales y concentra acompañamientos, dirección, estrenos, autores, patrimonio, fuentes, curiosidades y salidas. Migrar todo ese grafo en el mismo cambio aumentaría innecesariamente el radio de regresión.

Por tanto:
- `/bandas` → cliente público anónimo;
- `/bandas/[slug]` → mantiene temporalmente el loader existente;
- Panel → sin cambios;
- caché/ISR/TTL → sin cambios.

## Criterio de aceptación

1. `/bandas` responde con las mismas bandas publicadas que producción previa.
2. Se mantienen nombres, tipologías, municipios, logotipos y fondos HC-012.
3. Las fichas siguen navegables desde el directorio.
4. La respuesta continúa `no-store` mientras la Fase A no active caché.
5. Si RLS anónima bloquea una tabla necesaria, se corrige la política o se replantea el dato; no se introduce sesión del Panel en el loader público.

## Siguiente paso

Migrar `getBandBySlug` y `loadBandRelations` en un PR posterior, después de inventariar y validar las políticas RLS de todas sus tablas relacionadas.
