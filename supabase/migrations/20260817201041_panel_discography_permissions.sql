-- Hilo Cofrade · Panel editorial para Discografía
-- Migración 041
--
-- Amplía las reglas editoriales del Panel a las tablas creadas en 039.
-- El lanzamiento principal conserva estado editorial y se archiva; pistas y
-- enlaces de fuente son registros hijos y pueden retirarse por un editor.

-- Lectura editorial, incluidos borradores y elementos en revisión.
create policy "Panel members can read band releases"
on public.band_releases for select to authenticated
using ((select public.is_panel_member()));

create policy "Panel members can read band release tracks"
on public.band_release_tracks for select to authenticated
using ((select public.is_panel_member()));

create policy "Panel members can read band release sources"
on public.band_release_sources for select to authenticated
using ((select public.is_panel_member()));

grant select on public.band_releases to authenticated;
grant select on public.band_release_tracks to authenticated;
grant select on public.band_release_sources to authenticated;

-- Lanzamientos: siguen el mismo ciclo editorial que el resto de objetos con status.
create policy "Editors can create band releases"
on public.band_releases for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update band releases"
on public.band_releases for update to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete band releases"
on public.band_releases for delete to authenticated
using ((select public.can_admin_panel()));

grant insert, update, delete on public.band_releases to authenticated;

-- Pistas: contenido hijo editable. El vínculo a Marcha es opcional hasta que
-- la entidad Marcha exista y esté documentada.
create policy "Editors can create band release tracks"
on public.band_release_tracks for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update band release tracks"
on public.band_release_tracks for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Editors can delete band release tracks"
on public.band_release_tracks for delete to authenticated
using ((select public.can_edit_panel()));

grant insert, update, delete on public.band_release_tracks to authenticated;

-- Las fuentes siguen viviendo en public.sources; aquí solo se mantiene el vínculo
-- documental con el lanzamiento.
create policy "Editors can link band release sources"
on public.band_release_sources for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update band release sources"
on public.band_release_sources for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Editors can unlink band release sources"
on public.band_release_sources for delete to authenticated
using ((select public.can_edit_panel()));

grant insert, update, delete on public.band_release_sources to authenticated;
