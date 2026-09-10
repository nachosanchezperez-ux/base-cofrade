-- HC-019 · reconciliación de preview y endurecimiento del contrato.
-- La preview aplicó la primera versión de 20260910181542 antes de que la rama
-- incorporase el índice de Fuentes y los perfiles de autores. Esta evolución
-- aditiva deja idénticas una preview ya creada y una instalación limpia.

create index if not exists musical_repertoires_source_idx
  on public.musical_repertoires (source_id)
  where source_id is not null;

insert into public.agents (entity_id, agent_kind, description)
select distinct author.id, 'person', author.summary
from public.musical_repertoires repertoire
join public.musical_repertoire_entries entry
  on entry.repertoire_id = repertoire.id
join public.march_authors authorship
  on authorship.march_entity_id = entry.march_entity_id
join public.entities author
  on author.id = authorship.agent_entity_id
 and author.entity_type = 'agent'
where repertoire.slug = 'pastora-cantillana-procesion-2026'
on conflict (entity_id) do nothing;

do $contract$
begin
  if exists (
    select 1
    from public.musical_repertoires
    where repertoire_kind <> 'performed'
  ) then
    raise exception 'HC-019 solo admite repertorios realmente interpretados';
  end if;
end
$contract$;

alter table public.musical_repertoires
  drop constraint if exists musical_repertoires_kind_check;

alter table public.musical_repertoires
  add constraint musical_repertoires_kind_check
  check (repertoire_kind = 'performed');

comment on column public.musical_repertoires.repertoire_kind is
  'performed: repertorio realmente interpretado y documentado tras la salida.';

revoke all on public.musical_repertoires from public, anon, authenticated;
revoke all on public.musical_repertoire_entries from public, anon, authenticated;

grant select on public.musical_repertoires to anon;
grant select on public.musical_repertoire_entries to anon;
grant select, insert, update, delete on public.musical_repertoires to authenticated;
grant select, insert, update, delete on public.musical_repertoire_entries to authenticated;
grant all on public.musical_repertoires to service_role;
grant all on public.musical_repertoire_entries to service_role;
