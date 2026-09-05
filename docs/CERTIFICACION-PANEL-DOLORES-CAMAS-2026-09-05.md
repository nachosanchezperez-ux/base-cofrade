# Hilo Cofrade · Reconciliación de Dolores de Camas en el panel

**Corte:** 5 de septiembre de 2026  
**Base:** `main = fba41d8a7219a16b631387ac6f80f5aba79fe132`

## Incidencia

En móvil, el listado del panel podía dirigir a `28a57fd8-1694-4c7f-98f7-fbe386331078`, un placeholder `draft` denominado `Hermandad de los Dolores de Camas` que no disponía de fila en `brotherhoods`. El editor exige entidad + ficha de Hermandad, por lo que ese nodo terminaba en 404.

La ficha canónica y publicada es `3ebe31fa-0feb-4976-a159-8cbd47f47723`, slug `dolores-camas`.

## Reconciliación

- se conserva un único nodo canónico de Dolores de Camas;
- el placeholder `draft` sin ficha propia se elimina;
- su única relación útil, Cruz Roja, se traslada al nodo canónico;
- Cruz Roja queda histórica/no vigente en 2026, con cronología exacta pendiente;
- Maestro Tejera permanece vigente en 2026;
- el panel ya no puede construir un enlace de edición hacia el UUID obsoleto.

## Resultado

- duplicados de Dolores de Camas: 1 nodo total;
- nodo canónico: `3ebe31fa-0feb-4976-a159-8cbd47f47723`;
- Maestro Tejera: vigente 2026;
- Cruz Roja: histórica, no vigente 2026;
- DDL: 0;
- RLS: 0;
- UX estructural: 0.
