-- Hilo Cofrade · Guardado editorial de relaciones públicas
-- Migración 038
--
-- Evita que una relación entity_relations quede publicada cuando alguno de sus
-- extremos todavía no está publicado. No fuerza relaciones draft a published:
-- únicamente degrada published -> draft cuando la relación no es publicable.

create or replace function public.guard_entity_relation_publication()
returns trigger
language plpgsql
as $$
declare
  source_status text;
  target_status text;
begin
  if new.status <> 'published' then
    return new;
  end if;

  select status into source_status
  from public.entities
  where id = new.source_entity_id;

  select status into target_status
  from public.entities
  where id = new.target_entity_id;

  if source_status is distinct from 'published'
     or target_status is distinct from 'published' then
    new.status := 'draft';
  end if;

  return new;
end;
$$;

drop trigger if exists entity_relations_guard_publication on public.entity_relations;

create trigger entity_relations_guard_publication
before insert or update of source_entity_id, target_entity_id, status
on public.entity_relations
for each row
execute function public.guard_entity_relation_publication();

-- Corrige relaciones que pudieran haber quedado públicas con algún extremo
-- todavía no publicado. Las relaciones archivadas o en revisión no se tocan.
update public.entity_relations relation
set status = 'draft'
where relation.status = 'published'
  and exists (
    select 1
    from public.entities source_entity
    join public.entities target_entity on target_entity.id = relation.target_entity_id
    where source_entity.id = relation.source_entity_id
      and (
        source_entity.status <> 'published'
        or target_entity.status <> 'published'
      )
  );
