# Limpieza de textos internos visibles · 17/10/2026

Origen: la crítica como espectador del 17/10 (`claude/critica-espectador-2026-10-17.md`). En fichas públicas aparecían notas de proceso del equipo editorial.

| Tabla · campo | Filas | Qué se veía | Qué se hace |
|---|---|---|---|
| `brotherhoods.notes` (se publica como «Historia») | 133 | «Primera edición HC-016 Écija.», «Ficha cerrada en el macrolote…» | Vacío. En 2 filas se conserva la parte editorial (Rosario de San Julián, Lebrija) |
| `entities.summary` | 49 | «Penitencia de Écija documentada en HC-016.» | Vacío |
| `images.description` | 29 | «Imagen titular documentada en el inventario HC-016 Carmona.» | Vacío |
| `outings.description` | 32 | «…celebración acreditada con evidencia posterior.» | Vacío |
| `outings.public_notes` | 28 | «Soporte procesional: pendiente de documentación específica…» | Se quita solo esa frase; el resto se conserva |
| `agents.description` | 3 | «Imaginero documentado en el lote de Lebrija.» | Vacío |
| `sources.name` | 40 | «ECI-F03 · Acredita el carácter oficial…» | Se quita el prefijo «ECI-F03 · » |
| `cult_occurrences.description_override` | 12 | «2026-10-17 a 2026-10-18» | Vacío (se muestra la descripción del culto) |
| `steps.step_type` | 20 | «mystery», «palio», «misterio» | «Misterio», «Palio» |

Total: **346 filas**. No se borra ningún registro, no se cambian relaciones ni fechas.

- Aplicar: `limpieza-jerga.sql` (transacción, idempotente).
- Deshacer: `limpieza-jerga-rollback.sql` (valores originales leídos antes de aplicar).

Queda fuera (no se ve en la web o hace falta criterio editorial): `source_links.notes`, `steps.notes`, `brotherhood_images.notes`, y el pie de foto «Neyra.02» de Tres Caídas (puede ser el nombre del fotógrafo).
