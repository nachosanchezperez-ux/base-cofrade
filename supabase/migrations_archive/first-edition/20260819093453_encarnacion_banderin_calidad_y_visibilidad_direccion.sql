alter table public.band_agents
  add column if not exists is_public boolean not null default true;

comment on column public.band_agents.is_public is
  'Controla si la relación de dirección/responsabilidad se expone públicamente. No altera su vigencia histórica o actual.';

drop policy if exists "Public band agents" on public.band_agents;

create policy "Public band agents"
on public.band_agents
for select
to public
using (
  is_public
  and exists (
    select 1
    from public.entities e
    where e.id = band_agents.band_entity_id
      and e.status = 'published'
  )
);

update public.band_agents
set is_public = false
where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
  and is_current = true;

do $$
declare
  asset_id uuid;
begin
  select id
    into asset_id
  from public.entities
  where slug = 'banderin-agrupacion-musical-nuestra-senora-de-la-encarnacion'
    and entity_type = 'heritage_asset';

  if asset_id is null then
    raise exception 'No existe el banderín de la Agrupación Musical Nuestra Señora de la Encarnación';
  end if;

  update public.heritage_assets
  set
    public_image_path = 'https://www.amencarnacion.com/wp-content/uploads/2014/03/nuebo-bandera.jpg',
    public_image_alt = 'Banderín de la Agrupación Musical Nuestra Señora de la Encarnación',
    public_image_credit = 'Fotografía · Agrupación Musical'
  where entity_id = asset_id
    and parent_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924';

  if not found then
    raise exception 'No se encontró la pieza patrimonial asociada a La Encarnación';
  end if;
end
$$;
