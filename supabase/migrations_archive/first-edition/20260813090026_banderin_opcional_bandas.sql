-- Hilo Cofrade · Banderín opcional de las bandas
--
-- En las fichas de banda no se abre un catálogo patrimonial general. La única
-- pieza notable contemplada es, cuando está documentada, un único banderín.

alter table public.bands
  add column if not exists banderin_entity_id uuid references public.entities(id) on delete set null;

create unique index if not exists bands_banderin_entity_unique_idx
  on public.bands(banderin_entity_id)
  where banderin_entity_id is not null;

update public.bands b
set banderin_entity_id = (
  select ha.entity_id
  from public.heritage_assets ha
  where ha.parent_entity_id = b.entity_id
    and ha.asset_type = 'Banderín'
  order by ha.display_order, ha.entity_id
  limit 1
)
where exists (
  select 1
  from public.heritage_assets ha
  where ha.parent_entity_id = b.entity_id
    and ha.asset_type = 'Banderín'
);
