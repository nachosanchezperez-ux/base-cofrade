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
| Procesión | gloriosa, de alabanza, histórica, solemne, de penitencia, magna, coronación canónica |
| Vía Crucis | del Consejo de Hermandades y Cofradías |
| Vía Lucis | — |
| Rosario Matutino · Rosario de la Aurora · Rosario Vespertino | — |
| Rosario Público · Rosario Extraordinario | — |
| Traslado | de regreso, en Vía Crucis, colectivo, misional |
| Romería | — |
| Otra salida pública | — (actos que no son procesión ni rosario) |

## Cierre de la lista · 13/10/2026

Las 16 filas que quedaban fuera de la lista se resolvieron con estas decisiones. Cada
cambio quedó en `audit_log` (`actor_label` = «Claude · normalización de tipos de salida
(13/10/2026)») con el valor anterior y el nuevo.

| Salidas | Antes | Después |
|---|---|---|
| Corona Seráfica (Sevilla), Santo Escapulario (Carmona), Lignum Crucis (Valencina), San Jerónimo (Sevilla) | Procesión | Procesión de Gloria |
| Procesión patronal del Cristo del Crucero (Almadén de la Plata) | Procesión patronal | Procesión de Gloria |
| Corona Dolorosa (Arahal) | Corona Dolorosa | Procesión de Gloria |
| Cruz de Mayo (Tocina) | Cruz de Mayo | Procesión de Gloria |
| Bando anunciador de la Divina Pastora de Santa Marina | Procesión | Otra salida pública |
| Participación en el Congreso Mariano de Zaragoza (Sastres) | Extraordinaria | Otra salida pública |
| Rosario de la Aurora y subida (Lebrija) | Rosario de la Aurora y subida | Rosario de la Aurora |
| Traslado en andas del Rosario de Fátima (Utrera) | Rosario y traslado en andas | Traslado |
| 20.º aniversario de la Merced (Marchena) | Rosario y procesión gloriosa extraordinaria | Procesión · gloriosa |
| Nuestra Señora de los Dolores (Cerro del Águila) | Rosario de la Aurora extraordinario y traslado extraordinario | Rosario de la Aurora |
| Santo Entierro Magno 2004 (San Gonzalo) · Magna Procesión de Tercia (Marchena) | Santo Entierro Magno · Magna Procesión de Tercia | Procesión · magna |
| Coronación Canónica de la Salud (San Gonzalo) | Coronación Canónica | Procesión · coronación canónica |

Criterios: un acto compuesto se guarda como una sola fila con su tipo principal (el resto
queda en el título). Las tres glorias sin Hermandad vinculada (Almadén de la Plata, Arahal
y Valencina) muestran el organizador cuando está documentado; si falta, conservan
«Hermandad por confirmar». Verificación de 15/10/2026: Almadén tiene organizador;
Arahal y Valencina aún no tienen Hermandad vinculada ni `organizer_name`.
Las 16 reclasificaciones siguen aplicadas: no repetir sus escrituras.

Para revertirlo, con el trigger desactivado, basta leer `changed_fields` de esas filas de
`audit_log`:

```sql
alter table public.outings disable trigger outings_normalize_outing_type;
update public.outings o
   set outing_type    = a.changed_fields->'outing_type'->>'antes',
       outing_subtype = a.changed_fields->'outing_subtype'->>'antes'
  from public.audit_log a
 where a.object_id = o.id
   and a.actor_label like 'Claude · normalización de tipos de salida (13/10/2026)%';
alter table public.outings enable trigger outings_normalize_outing_type;
```

## Vía Crucis del Consejo

El subtipo "del Consejo de Hermandades y Cofradías" es genérico: vale para el Consejo
General de Sevilla y para los Consejos locales de los municipios de la provincia. Lo que
identifica a cada uno es `organizer_name` (nombre oficial del Consejo) junto con
`municipality_id`. Los 40 Vía Crucis actuales son del Consejo General de Sevilla y llevan
ya el municipio de Sevilla.

### Consejos de la provincia con Vía Crucis general documentado (11/10/2026)

Alcalá de Guadaíra, Arahal, Carmona, Coria del Río, Dos Hermanas, Écija, Estepa, Lebrija,
Los Palacios y Villafranca, Marchena, Morón de la Frontera, Osuna y Utrera. Los 13
municipios ya existen en `public.municipalities`. A la fecha no hay ninguna salida cargada
de estos Consejos: falta el nombre oficial de cada uno (para `organizer_name`) y los datos
de cada Vía Crucis (año, fecha, recorrido y fuente).

Pendiente de confirmar: el Vía Crucis de la Humildad y Paciencia de Osuna (30/03/2026,
ordinario, sin organizador) figura con la Hermandad como protagonista. Si fuera el del
Consejo de Osuna, habría que ponerle el subtipo y el organizador; hasta entonces no se toca.

## Un fallo de la primera aplicación

`getGeneralPublicOutings` lee los tipos `Romería` y `Procesión`. Al renombrar "Procesión
extraordinaria" a "Procesión", 41 salidas extraordinarias entraron también por esa lectura
y quedaron duplicadas en la Agenda y en la Home. La PR #1135 añadió `.eq('character',
'ordinary')`; hasta que se desplegó, esas 41 filas se devolvieron a su tipo original.
Estado a 12/10/2026: el filtro está desplegado, el trigger y el cron de 15 minutos están
activos en producción y las 41 filas ya tienen el tipo y subtipo previstos (se
reaplicaron el 11/10/2026 a las 20:47, hora de Madrid). El mapeo sigue guardado en
`private.outing_type_reapply_20261010`.

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
