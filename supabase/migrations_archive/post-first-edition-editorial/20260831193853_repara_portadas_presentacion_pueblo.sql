with target_band as (
  select id
  from public.entities
  where entity_type = 'band'
    and slug = 'banda-cornetas-tambores-presentacion-al-pueblo-dos-hermanas'
  limit 1
), cover_updates(title, cover_image_path) as (
  values
    ('Pasa la Estrella', 'https://pasionporlamusicacofrade.wordpress.com/wp-content/uploads/2013/11/frontal-1993-pasa-la-estrella.jpg?h=270&w=270'),
    ('Al Gitano de la Cava', 'https://pasionporlamusicacofrade.wordpress.com/wp-content/uploads/2013/11/frontal-1999-sentimiento-gitano.jpg?h=270&w=270'),
    ('Antología', 'https://pasionporlamusicacofrade.wordpress.com/wp-content/uploads/2013/11/frontal-2004-antologc3ada.jpg?h=270&w=270'),
    ('Recuerdos', 'https://pasionporlamusicacofrade.wordpress.com/wp-content/uploads/2013/11/frontal-2004-recuerdos.jpg?h=270&w=270'),
    ('La historia de un Profeta', 'https://pasionporlamusicacofrade.wordpress.com/wp-content/uploads/2013/11/frontal-2011-la-historia-de-un-profeta.jpg?h=270&w=270')
)
update public.band_releases br
set cover_image_path = cu.cover_image_path,
    cover_image_credit = 'Archivo gráfico · Pasión por la música cofrade',
    updated_at = now()
from target_band tb, cover_updates cu
where br.band_entity_id = tb.id
  and lower(br.title) = lower(cu.title);
