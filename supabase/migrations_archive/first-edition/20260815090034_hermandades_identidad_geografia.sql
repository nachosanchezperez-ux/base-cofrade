-- Hilo Cofrade · Identidad, geografía y presencia oficial de Hermandades
-- Migración 034
--
-- Completa el flujo editorial de Localidades y Lugares sin crear nuevas
-- entidades geográficas. El horario habitual pertenece al Lugar y se mantiene
-- deliberadamente como texto libre hasta que exista necesidad real de un
-- calendario estructurado.

alter table public.places
  add column if not exists opening_hours_text text,
  add column if not exists opening_hours_verified_at date;

create policy "Editors can create municipalities"
on public.municipalities for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update municipalities"
on public.municipalities for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Editors can create places"
on public.places for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update places"
on public.places for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

grant insert, update on public.municipalities to authenticated;
grant insert, update on public.places to authenticated;
