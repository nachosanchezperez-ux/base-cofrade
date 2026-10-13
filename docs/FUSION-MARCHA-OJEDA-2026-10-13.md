# Fusión de marcha duplicada · «Tú eres el orgullo de nuestro pueblo» (Pablo Ojeda)

Fecha: 13/10/2026. Autorizado por el propietario en sesión (Tarea 08, PR I).

## Diagnóstico

Dos fichas publicadas para la misma obra y el mismo compositor, ambas indexables, con el mismo título y canonical propia.

| Ficha | id | Repertorios | Otras referencias |
|---|---|---|---|
| **Canónica** `tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda` | `6df2901d-66d2-4b38-b315-ad478187817c` | 6 | 1 autoría |
| Duplicada `tu-eres-orgullo-nuestro-pueblo-pablo-ojeda` | `994b7349-eec6-4e07-a89b-7032c8875694` | 1 (San Gonzalo, Lunes Santo 2026) | 1 autoría |

Se revisaron las 94 claves externas hacia `entities`. La duplicada solo tiene la entrada de repertorio y su autoría. No tiene grabaciones, pistas, dedicatorias, fuentes, relaciones, conciertos, estrenos, medios, nombres ni contenido editorial.

## Operación

1. Despliegue de la redirección 301 duplicada → canónica (`next.config.mjs`).
2. En una única transacción:
   - `musical_repertoire_entries` `e0da230d-fa97-4ab4-b580-600c4756f422`: `march_entity_id` pasa a la canónica. No choca con `UNIQUE (repertoire_id, march_entity_id)`, porque la canónica no está en ese repertorio.
   - `entities` `994b7349-…`: `status` pasa de `published` a `archived`.
   - No se borra nada. La autoría de la duplicada se conserva con la ficha archivada.

## Respaldo (estado previo)

```json
{"entry":{"id":"e0da230d-fa97-4ab4-b580-600c4756f422","repertoire_id":"d6f3e740-183b-426c-b543-dad40d2c9be4","march_entity_id":"994b7349-eec6-4e07-a89b-7032c8875694","display_title":"Tu Eres el Orgullo de Ntro. Pueblo","source_credit":"Pablo Ojeda","performance_count":2,"display_order":3},
 "entity":{"id":"994b7349-eec6-4e07-a89b-7032c8875694","entity_type":"march","slug":"tu-eres-orgullo-nuestro-pueblo-pablo-ojeda","status":"published","updated_at":"2026-09-14T15:31:10.101902+00:00"}}
```

## Reversión

```sql
begin;
update public.musical_repertoire_entries
   set march_entity_id = '994b7349-eec6-4e07-a89b-7032c8875694'
 where id = 'e0da230d-fa97-4ab4-b580-600c4756f422';
update public.entities
   set status = 'published'
 where id = '994b7349-eec6-4e07-a89b-7032c8875694';
commit;
```

Después, retirar la redirección de `next.config.mjs`.
