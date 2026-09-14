# Certificación HC-016 · Hermandades de la Madrugá

**Corte:** 14 de septiembre de 2026

**Ámbito:** macrolote transversal editorial sobre las seis Hermandades de la Madrugada de Sevilla

**Base reconciliada:** `b4d9fe91e6de4e0c9c20e941a047e2a99baf7c42`

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

La Madrugada de Sevilla queda cubierta con sus seis corporaciones publicadas: El Silencio, Gran Poder, La Macarena, El Calvario, Esperanza de Triana y Los Gitanos. Macarena y Gran Poder se preservaron sin reabrir sus cierres; el lote creó los perfiles de El Silencio y El Calvario y completó los perfiles parciales de Esperanza de Triana y Los Gitanos.

El trabajo recorrió carga, staging, preflight global, revisión, Apply y postflight. No incorporó DDL, tablas, índices, funciones, políticas RLS, cambios de producto ni activación de HC-018.

## Lote gobernado

| Lote | Estado | Preparadas | Aplicadas | Inválidas | Fallidas | Plan efectivo |
|---|---|---:|---:|---:|---:|---|
| `96cc4393-fefa-4756-965b-8af1c0f59941` | `completed` | 262 | 262 | 0 | 0 | 257 insert · 5 update |

El preflight global terminó con 262/262 registros válidos, 0 colisiones y cuatro envíos protegidos. La barrera se volvió a comprobar antes de la primera escritura y Apply concluyó sin incidencias. La receta canónica queda archivada en `20260914120000_cierra_madruga_sevilla.sql` fuera de la cadena estructural activa.

## Alcance editorial

| Familia | Filas del lote |
|---|---:|
| Lugares | 3 |
| Fuentes | 29 |
| Entidades | 37 |
| Perfiles de Hermandad | 4 |
| Imágenes / relaciones con Hermandad | 8 / 8 |
| Autorías | 6 |
| Pasos / relaciones con Hermandad / relaciones con Imagen | 8 / 8 / 8 |
| Cultos / relaciones | 15 / 15 |
| Salidas / relaciones | 4 / 8 |
| Acontecimientos | 16 |
| Patrimonio | 1 |
| Periodos musicales actualizados | 3 |
| Vínculos de Fuente | 81 |
| **Total** | **262** |

## Postflight por corporación

| Hermandad | Estado | Titulares | Pasos | Cultos | Salidas | Hitos | Música |
|---|---|---:|---:|---:|---:|---:|---:|
| El Silencio | `published` | 2 | 2 | 3 | 1 | 3 | Silencio documentado |
| Gran Poder | `published` | 3 | 2 | 9 | 8 | 2 | Silencio documentado |
| La Macarena | `published` | 3 | 2 | — | 1 | 1 | 3 periodos |
| El Calvario | `published` | 2 | 2 | 4 | 1 | 4 | Silencio documentado |
| Esperanza de Triana | `published` | 2 | 2 | 4 | 1 | 6 | 1 periodo vigente |
| Los Gitanos | `published` | 2 | 2 | 4 | 1 | 6 | 2 periodos vigentes |

La ausencia de música en El Silencio, Gran Poder y El Calvario responde a su carácter procesional documentado y no se contabiliza como deuda. El lote reutiliza Tres Caídas de Triana y la Agrupación Musical Nuestro Padre Jesús de la Salud de Los Gitanos sin crear bandas homónimas.

- 0 duplicados de los cuatro slugs incorporados o completados.
- 0 relaciones troncales huérfanas de Imagen, Paso, Culto o Salida.
- Las autorías dudosas se expresan como atribuciones; no se convierten en certezas.
- No se incorporan escudos ni fotografías sin licencia reutilizable.

## Verificación pública

El directorio `/hermandades` muestra `Madrugada · 6` dentro de Sevilla capital. La ruta `/hermandades/semana-santa/sevilla-capital/madrugada` publica y enlaza correctamente las seis fichas.

Las nuevas rutas públicas verificadas son:

- `/hermandades/el-silencio-sevilla`;
- `/hermandades/el-calvario-sevilla`;
- `/hermandades/hermandad-esperanza-de-triana-sevilla`;
- `/hermandades/hermandad-gitanos-sevilla`.

Las cuatro responden con su sede, denominación, jornada, titulares, Pasos, Cultos, Salida, acontecimientos y Fuentes. No se detectaron errores de aplicación en consola; los únicos avisos procedían de la extensión del navegador de auditoría y no de Hilo Cofrade.

## Fuentes principales

- webs oficiales de la Hermandad del Silencio, Hermandad del Calvario, Esperanza de Triana y Hermandad de Los Gitanos;
- boletín oficial número 170 de El Silencio para Cultos y estación de penitencia de 2026;
- páginas oficiales específicas de historia, sedes, titulares, Pasos, Cultos y estación de penitencia de cada corporación.

## Huecos legítimos

- escudos, cabeceras y fotografías sin licencia o autorización reutilizable;
- catálogo patrimonial y musical exhaustivo;
- horarios o ediciones de Cultos no acreditados de forma inequívoca;
- cifras volátiles de hermanos, nazarenos, cuadrillas y responsables actuales;
- autorías, dataciones o intervenciones que las propias Fuentes no permiten afirmar.

## Control técnico

- `main` y producción partían alineados en `b4d9fe91e6de4e0c9c20e941a047e2a99baf7c42`;
- producción `READY` en `dpl_H36Gwz8cANanRKSjyx3F1Zr5t1mS` antes del lote;
- Supabase `ACTIVE_HEALTHY`, una sola rama principal y lote `completed` 262/262;
- 0 PR abiertas al iniciar el cierre;
- suite completa 720/720 y `next build` correctos;
- `git diff --check` limpio;
- receta exclusivamente DML y archivada fuera de la cadena estructural activa.

El frente transversal queda cerrado. Los trece contextos HC-016 anteriores permanecen preservados y no se abre otra Hermandad.
