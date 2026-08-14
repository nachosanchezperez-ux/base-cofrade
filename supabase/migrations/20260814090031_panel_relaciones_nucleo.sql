-- Hilo Cofrade · Permisos del núcleo relacional en el Panel
-- Migración 031
--
-- No modifica el modelo semántico. Completa las políticas editoriales que
-- faltaban para gestionar Imagen ↔ Paso e Imagen ↔ Agente desde el Panel.

-- -----------------------------------------------------------------------------
-- image_steps
-- -----------------------------------------------------------------------------

create policy "Panel members can read image_steps"
on public.image_steps for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create image_steps"
on public.image_steps for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update image_steps"
on public.image_steps for update to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete image_steps"
on public.image_steps for delete to authenticated
using ((select public.can_admin_panel()));

grant select, insert, update, delete on public.image_steps to authenticated;

-- -----------------------------------------------------------------------------
-- image_authorships
-- -----------------------------------------------------------------------------

create policy "Panel members can read image_authorships"
on public.image_authorships for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create image_authorships"
on public.image_authorships for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update image_authorships"
on public.image_authorships for update to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete image_authorships"
on public.image_authorships for delete to authenticated
using ((select public.can_admin_panel()));

grant select, insert, update, delete on public.image_authorships to authenticated;
