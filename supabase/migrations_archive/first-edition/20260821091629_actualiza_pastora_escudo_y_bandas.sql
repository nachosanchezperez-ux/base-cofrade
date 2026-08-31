-- Completa la identidad visual y el acompañamiento musical vigente de
-- la Pastora de Cantillana sin crear nuevas entidades de banda.

update public.brotherhoods brotherhood
set crest_path = '/escudos/pastora-de-cantillana.webp'
from public.entities entity
where entity.id = brotherhood.entity_id
  and entity.slug = 'pastora-de-cantillana';

update public.entities
set
  name = 'Banda de Música de la Soledad de Cantillana',
  updated_at = now()
where slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and entity_type = 'band';

update public.music_accompaniment_periods period
set
  step_entity_id = null,
  position = 'Abriendo paso en la procesión y la Romería',
  outing_type = 'Procesión triunfal y Romería',
  date_from_text = 'Vigente en 2026',
  year_from = null,
  date_to = null,
  date_to_text = null,
  year_to = null,
  is_current = true,
  notes = 'Abre paso en la procesión triunfal de la Divina Pastora y en la Romería.',
  status = 'published',
  public_brotherhood_name = 'La Pastora de Cantillana',
  public_step_name = 'Apertura de cortejo',
  public_brotherhood_slug = 'pastora-de-cantillana',
  public_municipality_name = 'Cantillana',
  public_municipality_slug = 'cantillana',
  public_province = 'Sevilla',
  updated_at = now()
from public.entities brotherhood, public.entities band
where brotherhood.slug = 'pastora-de-cantillana'
  and band.slug = 'banda-del-sol'
  and period.brotherhood_entity_id = brotherhood.id
  and period.band_entity_id = band.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id,
  band_entity_id,
  step_entity_id,
  position,
  outing_type,
  date_from_text,
  year_from,
  is_current,
  notes,
  status,
  public_brotherhood_name,
  public_step_name,
  public_brotherhood_slug,
  public_municipality_name,
  public_municipality_slug,
  public_province
)
select
  brotherhood.id,
  band.id,
  null,
  'Abriendo paso en la procesión y la Romería',
  'Procesión triunfal y Romería',
  'Vigente en 2026',
  null,
  true,
  'Abre paso en la procesión triunfal de la Divina Pastora y en la Romería.',
  'published',
  'La Pastora de Cantillana',
  'Apertura de cortejo',
  'pastora-de-cantillana',
  'Cantillana',
  'cantillana',
  'Sevilla'
from public.entities brotherhood
join public.entities band on band.slug = 'banda-del-sol'
where brotherhood.slug = 'pastora-de-cantillana'
  and not exists (
    select 1
    from public.music_accompaniment_periods existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.band_entity_id = band.id
      and existing.is_current
      and existing.status <> 'archived'
  );

do $$
declare
  brotherhood_id uuid;
begin
  select id into brotherhood_id
  from public.entities
  where slug = 'pastora-de-cantillana';

  if brotherhood_id is null then
    raise exception 'No existe la ficha de la Pastora de Cantillana';
  end if;

  if not exists (
    select 1
    from public.brotherhoods
    where entity_id = brotherhood_id
      and crest_path = '/escudos/pastora-de-cantillana.webp'
  ) then
    raise exception 'No se ha asociado el escudo de la Pastora';
  end if;

  if (
    select count(distinct period.band_entity_id)
    from public.music_accompaniment_periods period
    join public.entities band on band.id = period.band_entity_id
    where period.brotherhood_entity_id = brotherhood_id
      and period.is_current
      and period.status = 'published'
      and band.slug in (
        'banda-de-musica-nuestra-senora-de-la-soledad-cantillana',
        'banda-del-sol'
      )
  ) <> 2 then
    raise exception 'La Pastora debe tener publicadas sus dos bandas vigentes';
  end if;
end
$$;
