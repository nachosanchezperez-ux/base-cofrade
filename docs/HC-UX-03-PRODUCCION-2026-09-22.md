# HC-UX-03 · producción · 22/09/2026

## Estado

HC-UX-03 quedó fusionado en `main` mediante la PR #912.

Commit funcional:
`7599573282d8ed35be0fc95d91d685521ef3dd90`

El siguiente commit de `main`, `46b9621dbd0d7162a6a9f8c2a62f423bae070f22`, es descendiente directo y conserva íntegramente HC-UX-03.

## QA previo

- CI de la PR #912: correcto.
- `npm test`: correcto.
- `npm run build`: correcto.
- Rama reconciliada con el sistema de frescura editorial de #910.
- Sin DDL, migraciones ni escrituras de contenido en HC-UX-03.

## Incidencia de Vercel

Los deployments automáticos de producción de `75995732` y de su descendiente `46b9621d` terminaron con:

`BUILD_UTILS_SPAWN_1 · Command "npm run build" exited with 1`

El mismo HEAD funcional había superado el build de GitHub Actions. Esta incidencia reproduce el patrón ya documentado en #911 para el despliegue anterior.

## Reintento

Este commit no introduce cambios funcionales. Su único objetivo es forzar un nuevo deployment de producción desde el `main` vigente y dejar trazabilidad del reintento controlado.
