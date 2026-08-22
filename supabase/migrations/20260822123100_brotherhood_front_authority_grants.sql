-- Hilo Cofrade · Grants explícitos para la autoridad editorial de Hermandades
--
-- Los proyectos Supabase recientes no exponen necesariamente nuevas tablas al
-- Data API por defecto. RLS sigue siendo la capa que decide qué filas ve cada rol.

grant select on table public.brotherhood_section_authority to anon;
grant select, insert, update, delete on table public.brotherhood_section_authority to authenticated;
