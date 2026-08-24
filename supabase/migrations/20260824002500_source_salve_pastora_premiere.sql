-- Fuente específica para el estreno de «Salve Pastora».
-- No altera la fecha de composición: documenta únicamente el estreno de 2013.
insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select 'Cantillana y su Pastora · Nueva marcha «Salve Pastora»',
       'https://cantillanaysupastora.blogspot.com/2013/06/',
       'web',
       'Cantillana y su Pastora',
       '2013-06-08'::date,
       current_date,
       'Anuncia la composición de David Álvarez García para la Banda del Sol y su estreno previsto durante la procesión del 8 de septiembre de 2013.'
where not exists (
  select 1 from public.sources where url='https://cantillanaysupastora.blogspot.com/2013/06/'
);

insert into public.source_links(source_id, entity_id, scope, notes)
select s.id, e.id, 'Patrimonio musical · estreno',
       'Fuente específica para la relación entre «Salve Pastora», David Álvarez García, Banda del Sol y su estreno del 8 de septiembre de 2013.'
from public.sources s
join public.entities e on e.slug='salve-pastora-david-alvarez'
where s.url='https://cantillanaysupastora.blogspot.com/2013/06/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id=s.id and sl.entity_id=e.id and sl.scope='Patrimonio musical · estreno'
  );
