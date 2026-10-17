# Noticias de El Hilo se mueve: del código al Panel · 17/10/2026

Autorizado por el propietario («Hazlo», 17/10/2026).

## Qué se hizo en producción

- 23 filas en `editorial_content` (ids `7a5c0e05-2026-4018-8000-000000000001` … `…023`), con el mismo `slug` que en `lib/hilo-movements-data.js`, así que las URL no cambian.
- 41 vínculos en `editorial_content_links` (protagonista `about` y fichas `related` con su papel).
- 34 fuentes nuevas en `sources` (marcadas en `notes`: «Alta al pasar las noticias de El Hilo se mueve al Panel (17/10/2026)»); 5 URL ya existían y se reutilizaron, por lo que esas noticias muestran el título que ya tenía la fuente.
- 40 enlaces en `source_links`.
- `event_date` (fecha del acto) solo donde la noticia anuncia algo con fecha confirmada en el propio texto.
- 20 noticias publicadas; las 3 con protagonista sin ficha (Morón, Glorias, Triana) quedan en borrador hasta desplegar el código que las admite (#1251).

## Comprobación

- Checksum MD5 de slug, titular, entradilla, contexto, etiqueta, tema, tipo y fechas: idéntico al del código (`958a3f1abe2e965409d7abde6af7d7a1`).
- Producción tras publicar: 23 noticias en el índice; la noticia del uniforme de Las Cigarreras ya lee sus fuentes del Panel.

## Recuperación

`noticias-al-panel-rollback.sql` borra los enlaces, vínculos y noticias por id y las fuentes marcadas que queden sin uso. Mientras `lib/hilo-movements-data.js` siga en el código, la web vuelve a mostrar esas noticias desde el código.

`noticias-al-panel.sql` es la versión de referencia de la carga (idempotente). En producción se ejecutó en bloques equivalentes (inserciones con `where not exists` / `on conflict do nothing`), primero como borrador y después publicando, para que ninguna noticia desapareciera mientras faltaban sus vínculos.
