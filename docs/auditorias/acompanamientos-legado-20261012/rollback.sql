-- Reversión de candidate.sql. Borra solo las posiciones con ID determinista
-- derivado de public.accompaniments; sus asignaciones caen por ON DELETE CASCADE.
-- No toca posiciones ni asignaciones creadas por otras vías.

delete from public.outing_music_positions p
using public.accompaniments a
where p.id = md5('hc006-legacy-position:' || a.id::text)::uuid;
