-- Hilo Cofrade · Readiness documental para primera carga real
-- Migración 033
--
-- Ajustes generales mínimos detectados al validar San Benito contra el modelo.
-- No contiene datos de San Benito ni introduce tablas específicas.

-- Una intervención puede estar documentada aunque el responsable todavía no
-- haya sido identificado. Si una investigación posterior lo identifica, el
-- mismo registro podrá actualizar agent_entity_id sin recrear el hecho.
alter table public.heritage_interventions
  alter column agent_entity_id drop not null;

-- El Panel necesita poder gestionar las identidades devocionales y las
-- relaciones semánticas ya existentes en el modelo (entity_relations), además
-- de intervenciones patrimoniales. Las políticas se crean solo si todavía no
-- existen para conservar compatibilidad con instalaciones anteriores.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'advocations'
      and policyname = 'Panel members can read advocations'
  ) then
    create policy "Panel members can read advocations"
    on public.advocations for select to authenticated
    using ((select public.is_panel_member()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'advocations'
      and policyname = 'Editors can create advocations'
  ) then
    create policy "Editors can create advocations"
    on public.advocations for insert to authenticated
    with check ((select public.can_edit_panel()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'advocations'
      and policyname = 'Editors can update advocations'
  ) then
    create policy "Editors can update advocations"
    on public.advocations for update to authenticated
    using ((select public.can_edit_panel()))
    with check ((select public.can_edit_panel()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'entity_relations'
      and policyname = 'Panel members can read entity_relations'
  ) then
    create policy "Panel members can read entity_relations"
    on public.entity_relations for select to authenticated
    using ((select public.is_panel_member()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'entity_relations'
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
    where schemaname = 'public' and tablename = 'entity_relations'
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

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'heritage_interventions'
      and policyname = 'Panel members can read heritage_interventions'
  ) then
    create policy "Panel members can read heritage_interventions"
    on public.heritage_interventions for select to authenticated
    using ((select public.is_panel_member()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'heritage_interventions'
      and policyname = 'Editors can create heritage_interventions'
  ) then
    create policy "Editors can create heritage_interventions"
    on public.heritage_interventions for insert to authenticated
    with check (
      (select public.can_edit_panel())
      and (status <> 'published' or (select public.can_publish_panel()))
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'heritage_interventions'
      and policyname = 'Editors can update heritage_interventions'
  ) then
    create policy "Editors can update heritage_interventions"
    on public.heritage_interventions for update to authenticated
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
grant select, insert, update on public.heritage_interventions to authenticated;
