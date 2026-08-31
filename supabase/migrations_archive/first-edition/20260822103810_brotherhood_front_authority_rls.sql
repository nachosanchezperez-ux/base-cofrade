-- Evita dos políticas SELECT permisivas para authenticated en la tabla de autoridad.

drop policy if exists "Published brotherhood section authority" on public.brotherhood_section_authority;
drop policy if exists "Panel members can read brotherhood section authority" on public.brotherhood_section_authority;

create policy "Anon can read published brotherhood section authority"
  on public.brotherhood_section_authority
  for select
  to anon
  using (
    exists (
      select 1
      from public.entities entity
      where entity.id = brotherhood_section_authority.brotherhood_entity_id
        and entity.entity_type = 'brotherhood'
        and entity.status = 'published'
    )
  );

create policy "Authenticated can read brotherhood section authority"
  on public.brotherhood_section_authority
  for select
  to authenticated
  using (
    (select public.is_panel_member())
    or exists (
      select 1
      from public.entities entity
      where entity.id = brotherhood_section_authority.brotherhood_entity_id
        and entity.entity_type = 'brotherhood'
        and entity.status = 'published'
    )
  );
