# Certificación HC-019 · Crucetas Musicales

**Fecha:** 10 de septiembre de 2026  
**HEAD inicial real:** `8893522afedc5110b20d0504a58634910c082d30`  
**HEAD funcional integrado:** `2b22a29d996afd2affb7af901321e117beee8b30`  
**PR funcional:** [#740](https://github.com/nachosanchezperez-ux/base-cofrade/pull/740) · merge `43cbe6b0fd62a725f3d3baec4680fa634bcb41be`  
**Remate de cierre:** [#741](https://github.com/nachosanchezperez-ux/base-cofrade/pull/741) · merge `2b22a29d996afd2affb7af901321e117beee8b30`  
**Producción funcional:** `READY` · `dpl_G3Ndveqo4RyTYkP2azF2jHqMLfZz`

## Alcance integrado

HC-019 incorpora el directorio `/crucetas-musicales`, la ficha pública por `slug`, navegación y sitemap, enlaces desde Hermandad y Banda, componentes responsive, cargadores de datos, pruebas y dos tablas con migración reproducible:

- `musical_repertoires`: Salida, Paso, Banda, Fuente, título, tipo y estado;
- `musical_repertoire_entries`: Marcha, multiplicidad y orden editorial de presentación.

Las PK/FK, unicidades e índices impiden una misma obra o posición duplicada dentro de una cruceta. RLS permite lectura pública únicamente del contenido publicado y reserva la escritura a perfiles del Panel. El remate #741 reconcilió el índice de Fuente en previews ya creadas, aplicó privilegios mínimos y restringió `repertoire_kind` a `performed` tanto en instalaciones limpias como actualizadas.

## Piloto real y fuente

La prueba certificada es **Pastora de Cantillana · Procesión de Gloria 2026 · Banda de Música de Nuestra Señora de la Soledad de Cantillana**, celebrada el 8 de septiembre de 2026 y vinculada con su Hermandad, Salida y Paso.

La Fuente primaria queda atribuida a la propia Banda, con fecha, título y notas documentales. La URL original de la publicación no consta en el dato disponible y no se inventa; es una deuda de trazabilidad corregible en origen, no una licencia para reinterpretar el repertorio.

| Control | Resultado |
|---|---:|
| Obras distintas | 48 |
| Interpretaciones | 60 |
| Entradas huérfanas | 0 |
| Marchas duplicadas en la cruceta | 0 |
| Posiciones editoriales duplicadas | 0 |
| Crucetas duplicadas por Salida y Banda | 0 |
| Autores sin perfil canónico | 0 |

Las repeticiones se guardan como multiplicidad: por ejemplo, `Pasan los Campanilleros ×2` y `El Turuta ×4`. `display_order` conserva el orden editorial de la Fuente, no demuestra cronología de interpretación. No se modelan calle, chicotá, duración, ubicación ni consecutividad porque la Fuente no los acredita.

La normalización detectó homónimos globales como «Coronación» y «Macarena», pero sus autorías acreditan que son obras distintas. No existe duplicidad determinista introducida por el piloto.

## QA de Supabase

- ambas migraciones de HC-019 registradas en producción y preview;
- constraint productivo: `repertoire_kind = 'performed'`;
- 48 entradas y suma de `performance_count = 60`;
- 0 huérfanos en repertorio, Salida, Paso, Banda, Fuente o Marcha;
- 0 duplicidades deterministas;
- `anon`: `SELECT` permitido, `INSERT` y `TRUNCATE` denegados;
- `authenticated`: sin `TRUNCATE`; el DML queda sometido a RLS;
- 0 avisos de seguridad específicos de las tablas nuevas.

Los avisos de rendimiento específicos son índices todavía sin uso y políticas `SELECT` permisivas coincidentes para contenido publicado y miembros del Panel. Son coherentes con una tabla recién estrenada y con el patrón de lectura del proyecto; no abren una incidencia de integridad o seguridad.

## QA público y técnico

- `/crucetas-musicales`, ficha del piloto, Hermandad, Banda y Paso: HTTP 200;
- canonical, `index, follow`, title, description, Open Graph, JSON-LD, breadcrumbs, enlaces internos y sitemap correctos;
- directorio: Hermandad, procesión, año, Banda, 48 obras y 60 interpretaciones comprensibles;
- ficha: 48 obras legibles y multiplicidades `×2`, `×3` o `×4` sin repetir filas artificialmente;
- Hermandad y Banda enlazan al piloto; las entidades sin cruceta no muestran bloques vacíos;
- no existe ruta pública de Marcha en el producto actual, por lo que no se creó un módulo analítico nuevo;
- la retícula pasa a una columna en tablet/móvil y las relaciones y métricas se apilan en el corte estrecho;
- el entorno disponible no permitió lanzar Chromium por una restricción de sockets; se verificaron HTML productivo, contratos responsive, preview READY y ausencia de errores de runtime. Esta limitación de captura no afectó a la validación funcional ni de datos;
- suite vigente: 678/678;
- build completo de Next.js 16.3 y TypeScript: correcto;
- `git diff --check`: limpio;
- deployment productivo: 18 respuestas 200 registradas y 0 errores de runtime en las rutas de HC-019.

## Auditor

1. El modelo admite nuevas crucetas sin tocar esquema: cada caso añade un repertorio y sus entradas canónicas.
2. `performance_count` representa repeticiones sin atribuir consecutividad.
3. Las FK hacia Hermandad por la Salida, Paso, Banda, Marcha y Fuente reutilizan el grafo vigente.
4. El piloto no introduce duplicidades deterministas; los homónimos quedan diferenciados por autoría.
5. La presentación de 40–60 obras es estable mediante retícula responsive, multiplicidades compactas y jerarquía por bloques.
6. HC-019 puede considerarse patrón estable después de reconciliar migraciones, tipo documental y privilegios en #741.

**Certificación:** HC-019 · Crucetas Musicales queda **CERTIFICADA**. El piloto conserva 48 obras y 60 interpretaciones fieles a la Fuente, producción está READY y no se abre otro frente en este cierre.
