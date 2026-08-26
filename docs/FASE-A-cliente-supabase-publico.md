# Fase A · Cliente Supabase público anónimo

Estado: EN IMPLEMENTACIÓN INCREMENTAL

Objetivo: separar lecturas públicas de `lib/supabase/server.js`, que es cookie-aware y queda reservado para superficies autenticadas o que necesiten sesión.

## Contrato

`lib/supabase/public.js` usa únicamente la URL y publishable key públicas, no persiste sesión, no refresca tokens, no detecta sesión en URL y no lee ni escribe cookies.

## Primer lote

- `brotherhood-directory.js`
- `directories.js` (Imágenes y Pasos)
- `entity-media.js` (media publicada)

## Fuera de alcance

Bandas, fichas complejas, Home, extraordinarias, búsqueda/Tira del hilo, acciones del Panel y cualquier forma de caché/ISR/TTL/tags.

Si una lectura deja de funcionar de forma anónima, se revisará RLS o el carácter público del dato; no se reintroducirá sesión del Panel como solución.

La caché persistente continúa desactivada durante toda la Fase A.
