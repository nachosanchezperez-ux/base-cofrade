# HC-016.2 · Fuentes canónicas y reutilización automática

## Objetivo

Evitar que el importador masivo siga creando Fuentes duplicadas cuando la misma URL ya existe y hacer que las referencias por URL reutilicen de forma determinista una Fuente existente.

## Alcance

- Canonicalización de URL antes del staging.
- Eliminación de fragmentos y parámetros de seguimiento (`utm_*`, `fbclid`, `gclid`, etc.).
- Orden estable de parámetros de consulta útiles.
- Equivalencia entre URL con y sin barra final cuando no hay query string.
- Contrato explícito de `sources` en HC-016.
- Una operación `insert` sobre `sources` pasa a `effective_operation = reuse` si ya existe una Fuente equivalente.
- Las referencias a `sources` por URL resuelven de forma determinista la Fuente más antigua cuando existen duplicados históricos.

## Fuera de alcance

- No fusiona ni borra las Fuentes históricas duplicadas.
- No reescribe `source_links` existentes.
- No introduce DDL, migraciones estructurales ni cambios de RLS.
- No activa publicación automática.

## Criterio de aceptación

Una carga que repite una URL ya existente no debe crear una nueva fila en `sources`, y un `source_link` que resuelve esa misma URL debe poder apuntar a una Fuente existente sin caer en ambigüedad por duplicados históricos exactos.
