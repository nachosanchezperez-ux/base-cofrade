create table if not exists public.concert_event_bands (
  id uuid primary key default gen_random_uuid(),
  event_entity_id uuid not null references public.entities(id) on delete cascade,
  band_entity_id uuid not null references public.entities(id) on delete restrict,
  role_name text,
  is_primary boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  notes text,
  status text not null default 'published' check (status = any (array['draft'::text, 'review'::text, 'published'::text, 'archived'::text])),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_entity_id, band_entity_id)
);

create index if not exists concert_event_bands_event_idx
  on public.concert_event_bands(event_entity_id, sort_order);

create index if not exists concert_event_bands_band_idx
  on public.concert_event_bands(band_entity_id);

alter table public.concert_event_bands enable row level security;

grant select on public.concert_event_bands to anon;
grant select, insert, update, delete on public.concert_event_bands to authenticated;
