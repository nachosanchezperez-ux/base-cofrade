-- Hilo Cofrade · precisión documental del estreno de «Salve Pastora»
--
-- La fuente contemporánea disponible, publicada el 8 de junio de 2013,
-- anuncia en futuro un estreno previsto para el 8 de septiembre. Acredita la
-- composición, su autor, la Banda del Sol como formación prevista y el acto
-- anunciado, pero no prueba por sí sola que el estreno llegara a celebrarse.
-- Hasta disponer de una fuente posterior al acto, los campos canónicos de
-- estreno efectivo deben permanecer abiertos.

update public.sources
set url = 'https://cantillanaysupastora.blogspot.com/2013/06/nueva-marcha-dedicada-la-divina-pastora.html',
    notes = 'Fuente contemporánea previa al acto: documenta la composición de David Álvarez García para la Banda del Sol y anuncia su estreno previsto durante la procesión del 8 de septiembre de 2013. No acredita por sí sola que el estreno llegara a celebrarse.'
where url = 'https://cantillanaysupastora.blogspot.com/2013/06/'
  and not exists (
    select 1
    from public.sources exact_source
    where exact_source.url = 'https://cantillanaysupastora.blogspot.com/2013/06/nueva-marcha-dedicada-la-divina-pastora.html'
  );

update public.sources
set notes = 'Fuente contemporánea previa al acto: documenta la composición de David Álvarez García para la Banda del Sol y anuncia su estreno previsto durante la procesión del 8 de septiembre de 2013. No acredita por sí sola que el estreno llegara a celebrarse.'
where url in (
  'https://cantillanaysupastora.blogspot.com/2013/06/',
  'https://cantillanaysupastora.blogspot.com/2013/06/nueva-marcha-dedicada-la-divina-pastora.html'
);

update public.source_links source_link
set scope = 'Patrimonio musical · anuncio de estreno',
    notes = 'Fuente previa al acto: acredita autoría, dedicatoria, Banda del Sol y estreno anunciado para el 8 de septiembre de 2013; la celebración efectiva permanece pendiente de confirmación documental.'
from public.sources source,
     public.entities work
where source_link.source_id = source.id
  and source_link.entity_id = work.id
  and work.slug = 'salve-pastora-david-alvarez'
  and source.url in (
    'https://cantillanaysupastora.blogspot.com/2013/06/',
    'https://cantillanaysupastora.blogspot.com/2013/06/nueva-marcha-dedicada-la-divina-pastora.html'
  )
  and source_link.scope in (
    'Patrimonio musical · estreno',
    'Patrimonio musical · anuncio de estreno'
  );

update public.marches march
set premiere_date = null,
    premiere_date_text = null,
    premiered_by_band_entity_id = null,
    notes = case
      when coalesce(march.notes, '') like '%la celebración efectiva queda pendiente de confirmación documental%'
        then march.notes
      else concat_ws(
        E'\n',
        nullif(btrim(coalesce(march.notes, '')), ''),
        'La fuente contemporánea del 8 de junio de 2013 anuncia un estreno previsto para el 8 de septiembre de 2013 por la Banda del Sol; la celebración efectiva queda pendiente de confirmación documental.'
      )
    end
from public.entities work,
     public.entities band
where march.entity_id = work.id
  and work.slug = 'salve-pastora-david-alvarez'
  and band.slug = 'banda-del-sol'
  and march.premiere_date = date '2013-09-08'
  and march.premiere_date_text = '8 de septiembre de 2013'
  and march.premiered_by_band_entity_id = band.id;
