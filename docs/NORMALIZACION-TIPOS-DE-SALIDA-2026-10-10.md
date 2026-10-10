# Normalización de los tipos de salida · 09–10/10/2026

Registro de las decisiones tomadas sobre `public.outings.outing_type` y de cómo revertirlas.
Cada cambio de datos hecho en producción quedó guardado antes/después en
`private.outing_type_backup_20261009` (`id`, `antes`, `despues`).

## Criterios acordados

- Una sola forma por tipo, con mayúscula inicial en los nombres propios:
  **Estación de Penitencia**, **Procesión de Gloria**, **Rosario Matutino / de la Aurora /
  Vespertino**.
- Lo ordinario o extraordinario va en `character`, no en el nombre del tipo.
- Las variantes de un tipo van en la columna nueva `outing_subtype`.
- Las procesiones son de penitencia (Semana Santa), de Gloria o sacramentales (sinónimo
  de eucarísticas). La procesión extraordinaria es una "Procesión" con carácter
  extraordinario, no un tipo distinto.

## Lista cerrada vigente

| Tipo (`outing_type`) | Subtipos (`outing_subtype`) |
|---|---|
| Estación de Penitencia | — |
| Procesión de Gloria | Resurrección |
| Procesión sacramental | Corpus Christi |
| Procesión | gloriosa, de alabanza, histórica, solemne, de penitencia |
| Vía Crucis | del Consejo de Hermandades y Cofradías |
| Vía Lucis | — |
| Rosario Matutino · Rosario de la Aurora · Rosario Vespertino | — |
| Rosario Público · Rosario Extraordinario | — |
| Traslado | de regreso, en Vía Crucis, colectivo, misional |
| Romería | — |

Sin cerrar a la fecha: rosarios compuestos (Aurora y subida, Rosario y traslado…), Procesión
patronal, Corona Dolorosa, Cruz de Mayo, Santo Entierro Magno, Magna Procesión de Tercia,
Coronación Canónica y "Extraordinaria".

## Vía Crucis del Consejo

El subtipo "del Consejo de Hermandades y Cofradías" es genérico: vale para el Consejo
General de Sevilla y para los Consejos locales de los municipios de la provincia. Lo que
identifica a cada uno es `organizer_name` (nombre oficial del Consejo) junto con
`municipality_id`. Los 40 Vía Crucis actuales son del Consejo General de Sevilla y llevan
ya el municipio de Sevilla.

## Un fallo de la primera aplicación

`getGeneralPublicOutings` lee los tipos `Romería` y `Procesión`. Al renombrar "Procesión
extraordinaria" a "Procesión", 41 salidas extraordinarias entraron también por esa lectura
y quedaron duplicadas en la Agenda y en la Home. Esta rama añade `.eq('character',
'ordinary')` y, mientras no se desplegó, esas 41 filas se devolvieron a su tipo original.
El mapeo previsto se conserva en `private.outing_type_reapply_20261010` para reaplicarlo
después del despliegue.

## Trigger de normalización

`outings_normalize_outing_type` reescribe las variantes conocidas al tipo canónico en cada
INSERT o UPDATE de `outing_type`, sea desde el Panel, el circuito HC-016 o
`apply_document_import`. No rechaza valores desconocidos: los deja tal cual.

Para revertir datos con el respaldo hay que desactivarlo antes:

```sql
alter table public.outings disable trigger outings_normalize_outing_type;
update public.outings o
   set outing_type = b.antes
  from private.outing_type_backup_20261009 b
 where o.id = b.id;
alter table public.outings enable trigger outings_normalize_outing_type;
```

## Fuera de alcance

`outing_series.outing_type` y `music_accompaniment_periods.outing_type` son columnas
independientes y no se han normalizado todavía.
