# HC-019 · Crucetas musicales interpretadas

## Decisión

Hilo Cofrade incorpora las crucetas musicales como repertorios documentados de una banda en una salida concreta. No son catálogos aislados de marchas ni previsiones de repertorio.

La relación canónica es:

`Hermandad → Salida → Paso → Banda → Cruceta → Obra`

La primera aplicación corresponde a la procesión triunfal de la Divina Pastora de Cantillana del 8 de septiembre de 2026 y a la Banda de Música de Nuestra Señora de la Soledad de Cantillana.

## Regla editorial

- `performed` identifica un repertorio comunicado después de la procesión.
- Cada obra conserva el número de interpretaciones que declara la fuente.
- La cantidad no permite deducir que las interpretaciones fueran consecutivas.
- El orden de presentación es editorial y no reconstruye el recorrido ni la cronología musical.
- Si la fuente no documenta lugar, momento u orden, esos datos permanecen ausentes.

## Presentación pública

La cruceta es accesible desde su directorio propio y desde las fichas relacionadas de Hermandad y Banda. La ficha de detalle muestra la edición, la procesión, el Paso, la formación, las obras distintas y el total de interpretaciones. Las repeticiones se representan como `×n`.

## Datos y seguridad

`musical_repertoires` identifica el repertorio y sus relaciones. `musical_repertoire_entries` conserva las obras y `performance_count`. Ambas tablas usan RLS: la lectura anónima exige repertorio, salida y Banda publicados; la escritura queda reservada al Panel conforme a sus permisos existentes.

La carga piloto contiene 48 obras distintas y 60 interpretaciones. Por corrección editorial expresa, «Pasan los Campanilleros» consta con 2 interpretaciones y «El Turuta» con 4, sin atributo de consecutividad.
