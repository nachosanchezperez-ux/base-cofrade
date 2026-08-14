-- Hilo Cofrade · Gestión básica de Fuentes desde el Panel
-- Migración 032
--
-- source_links no tiene estado editorial propio: retirar un vínculo significa
-- borrar únicamente esa fila de relación. La Fuente y la entidad permanecen.
-- La política de administración existente sigue vigente; esta política añade
-- el permiso mínimo necesario para que un editor pueda desvincular Fuentes.

create policy "Editors can unlink source links"
on public.source_links for delete to authenticated
using ((select public.can_edit_panel()));

grant delete on public.source_links to authenticated;
