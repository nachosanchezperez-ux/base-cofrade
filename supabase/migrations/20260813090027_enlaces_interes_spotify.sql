-- Hilo Cofrade · Enlaces de interés y Spotify para bandas
-- Migración 027

alter table public.entity_social_links
  drop constraint if exists entity_social_links_platform_check;

alter table public.entity_social_links
  add constraint entity_social_links_platform_check check (
    platform in ('website','facebook','instagram','x','youtube','spotify','tiktok','whatsapp')
  );

-- Migra los enlaces históricos de bandas al bloque común de entidades.
insert into public.entity_social_links (entity_id, platform, url, label, display_order)
select entity_id, 'website', website_url, 'Web oficial', 10
from public.bands
where website_url is not null and btrim(website_url) <> ''
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order;

insert into public.entity_social_links (entity_id, platform, url, label, display_order)
select entity_id, 'instagram', instagram_url, 'Instagram', 30
from public.bands
where instagram_url is not null and btrim(instagram_url) <> ''
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order;
