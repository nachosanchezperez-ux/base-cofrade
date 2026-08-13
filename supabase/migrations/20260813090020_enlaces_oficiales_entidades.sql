-- Hilo Cofrade · Web y redes sociales oficiales de las entidades
-- Migración 020

create table public.entity_social_links (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  platform text not null check (
    platform in ('website','facebook','instagram','x','youtube','tiktok','whatsapp')
  ),
  url text not null check (url ~ '^https?://'),
  label text,
  display_order smallint not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_id, platform)
);

create index entity_social_links_entity_idx
  on public.entity_social_links(entity_id, display_order, platform);

create trigger entity_social_links_set_updated_at
before update on public.entity_social_links
for each row execute function public.set_updated_at();

alter table public.entity_social_links enable row level security;

create policy "Public official entity links"
on public.entity_social_links for select
using (
  is_public = true
  and exists (
    select 1 from public.entities e
    where e.id = entity_id and e.status = 'published'
  )
);

create policy "Panel members can read official entity links"
on public.entity_social_links for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create official entity links"
on public.entity_social_links for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update official entity links"
on public.entity_social_links for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Admins can delete official entity links"
on public.entity_social_links for delete to authenticated
using ((select public.can_admin_panel()));

grant select on public.entity_social_links to anon, authenticated;
grant insert, update, delete on public.entity_social_links to authenticated;

-- Conserva los enlaces ya documentados en la tabla histórica de hermandades.
insert into public.entity_social_links (entity_id, platform, url, label, display_order)
select entity_id, 'website', website_url, 'Web oficial', 10
from public.brotherhoods
where website_url is not null and btrim(website_url) <> ''
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order;

insert into public.entity_social_links (entity_id, platform, url, label, display_order)
select entity_id, 'instagram', instagram_url, 'Instagram', 30
from public.brotherhoods
where instagram_url is not null and btrim(instagram_url) <> ''
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order;

-- Webs oficiales verificadas para las dos fichas iniciales.
insert into public.entity_social_links (entity_id, platform, url, label, display_order)
select id, 'website', 'https://hermandadelbaratillo.es/', 'Web oficial', 10
from public.entities
where entity_type = 'brotherhood' and slug = 'el-baratillo'
on conflict (entity_id, platform) do update set url = excluded.url, label = excluded.label;

insert into public.entity_social_links (entity_id, platform, url, label, display_order)
select id, 'website', 'https://asunciondecantillana.es/', 'Web oficial', 10
from public.entities
where entity_type = 'brotherhood' and slug = 'asuncion-de-cantillana'
on conflict (entity_id, platform) do update set url = excluded.url, label = excluded.label;
