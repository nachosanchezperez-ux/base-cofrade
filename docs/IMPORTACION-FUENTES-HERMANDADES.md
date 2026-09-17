# Importación de fuentes de Hermandades

Este flujo prepara la incorporación de fuentes desde una hoja de cálculo sin escribir directamente en Supabase.

## Regla de seguridad

La secuencia es siempre:

`Excel → normalización → conciliación → dry run → revisión → escritura`

El conciliador vive en `lib/brotherhood-source-import-plan.js` y no ejecuta SQL, no crea tablas y no modifica RLS.

## Columnas admitidas

No es obligatorio usar exactamente estas cabeceras. El conciliador acepta alias habituales en español e inglés.

| Dato | Cabeceras admitidas | Recomendación |
| --- | --- | --- |
| Identificador | `hermandad_id`, `brotherhood_id`, `entity_id` | La referencia más segura si está disponible. |
| Slug | `hermandad_slug`, `brotherhood_slug`, `slug` | Preferido cuando no hay ID. |
| Hermandad | `hermandad`, `nombre_hermandad`, `brotherhood_name` | Se usa solo por coincidencia exacta normalizada; nunca por similitud. |
| Nombre de fuente | `fuente`, `nombre_fuente`, `source_name` | Recomendado. Si falta y hay URL, se genera un nombre provisional y se marca el aviso. |
| URL | `url`, `enlace`, `web`, `source_url`, `fuente_url` | Recomendado. Solo se aceptan `http` y `https`. |
| Tipo | `tipo_fuente`, `source_type`, `tipo` | Si falta, el dry run usa `web` y marca el aviso. |
| Alcance | `ambito`, `alcance`, `scope` | Si falta, usa `general`. |
| Notas de fuente | `notas_fuente`, `source_notes` | Opcional. |
| Notas del vínculo | `notas_vinculo`, `link_notes`, `notas` | Opcional. |
| Autor/editor | `autor_editor`, `editor`, `publisher`, `author_or_publisher` | Opcional. |
| Fecha publicación | `fecha_publicacion`, `publication_date` | Opcional. |
| Fecha consulta | `fecha_consulta`, `accessed_at` | Opcional. |
| Licencia | `licencia`, `license` | Opcional. |

## Cómo resuelve una Hermandad

1. ID exacto, si el Excel lo aporta.
2. Slug exacto normalizado.
3. Nombre exacto normalizado, ignorando mayúsculas, tildes y puntuación.
4. Si hay cero o varias coincidencias, la fila pasa a revisión. No se hace emparejamiento difuso automático.

Así se evita asociar una fuente a una corporación equivocada cuando existen nombres repetidos o muy parecidos.

## Cómo deduplica las fuentes

Las URL se normalizan antes de compararse:

- dominio y protocolo en minúsculas;
- eliminación de `#fragmentos`;
- eliminación de parámetros de seguimiento (`utm_*`, `fbclid`, `gclid`, `igshid`, `mc_cid`, `mc_eid`);
- conservación de parámetros funcionales;
- orden estable de parámetros;
- normalización de barras finales.

Si la URL ya existe, se reutiliza una fuente existente en lugar de crear otra. Si en la base ya hay varias filas para la misma URL canónica, el dry run señala el grupo duplicado y elige un representante determinista sin borrar nada.

Las fuentes sin URL solo se consideran equivalentes cuando coinciden nombre normalizado y tipo.

## Salida del dry run

El plan separa cada fila en seis grupos:

- `sourcesToCreate`: fuentes realmente nuevas;
- `reusedSources`: fuentes existentes que se pueden reutilizar;
- `linksToCreate`: nuevos vínculos fuente ↔ Hermandad;
- `noops`: filas que ya están cubiertas o están duplicadas dentro del propio Excel;
- `review`: Hermandad no encontrada o ambigua;
- `invalid`: URL inválida u otros datos imprescindibles incorrectos.

El resumen incluye los contadores de los seis grupos antes de autorizar cualquier escritura.

## Estado previo detectado el 17/09/2026

La auditoría previa encontró 2.066 registros en `sources`, 631 vínculos de fuente asociados a Hermandades y 4 Hermandades publicadas sin vínculo de fuente. También existen numerosos grupos históricos de fuentes con URL repetida, por lo que la importación debe reutilizar primero y crear después.

La limpieza global de duplicados históricos queda fuera de este flujo: requiere una migración independiente porque una misma fuente puede estar vinculada a otros tipos de contenido además de la ficha de Hermandad.
