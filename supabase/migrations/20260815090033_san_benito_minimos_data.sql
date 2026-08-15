-- Hilo Cofrade · San Benito · bloqueantes mínimos aprobados por HILO DATA
-- Migración 033
--
-- Alcance exclusivo:
-- 1) titularidad conceptual mediante advocation + entity_relations.has_titular;
-- 2) intervenciones documentadas con responsable opcional.

-- Una intervención puede estar documentada aunque todavía no se conozca
-- la persona, taller o institución responsable. El mismo registro podrá
-- actualizarse más adelante cuando se identifique el Agente.
alter table public.heritage_interventions
  alter column agent_entity_id drop not null;

-- Advocations y entity_relations ya existen en el modelo, pero las migraciones
-- iniciales del Panel no les dieron permisos editoriales. Se añaden únicamente
-- los permisos necesarios para gestionar identidades devocionales y has_titular.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'advocations'
      and policyname = 'Panel members can read advocations'
  ) then
    create policy "Panel members can read advocations"
    on public.advocations for select to authenticated
    using ((select public.is_panel_member()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'advocations'
      and policyname = 'Editors can create advocations'
  ) then
    create policy "Editors can create advocations"
    on public.advocations for insert to authenticated
    with check ((select public.can_edit_panel()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'advocations'
      and policyname = 'Editors can update advocations'
  ) then
    create policy "Editors can update advocations"
    on public.advocations for update to authenticated
    using ((select public.can_edit_panel()))
    with check ((select public.can_edit_panel()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'entity_relations'
      and policyname = 'Panel members can read entity_relations'
  ) then
    create policy "Panel members can read entity_relations"
    on public.entity_relations for select to authenticated
    using ((select public.is_panel_member()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'entity_relations'
      and policyname = 'Editors can create entity_relations'
  ) then
    create policy "Editors can create entity_relations"
    on public.entity_relations for insert to authenticated
    with check (
      (select public.can_edit_panel())
      and (status <> 'published' or (select public.can_publish_panel()))
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'entity_relations'
      and policyname = 'Editors can update entity_relations'
  ) then
    create policy "Editors can update entity_relations"
    on public.entity_relations for update to authenticated
    using (
      (select public.can_edit_panel())
      and (status <> 'published' or (select public.can_publish_panel()))
    )
    with check (
      (select public.can_edit_panel())
      and (status <> 'published' or (select public.can_publish_panel()))
    );
  end if;
end
$$;

grant select, insert, update on public.advocations to authenticated;
grant select, insert, update on public.entity_relations to authenticated;
