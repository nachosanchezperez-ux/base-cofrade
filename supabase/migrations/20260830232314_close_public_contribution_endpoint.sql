-- Hilo Cofrade · Cierre preventivo del canal público de aportaciones
--
-- La ruta /colabora permanece cerrada durante el FIRST EDITION FREEZE. La
-- tabla histórica de aportaciones no debe conservar un endpoint de escritura
-- directo mientras no existan validación de servidor, control antiabuso,
-- privacidad y moderación operativa.

drop policy if exists "Anyone can submit contributions"
on public.contributions;

revoke all privileges on table public.contributions
from public, anon, authenticated;

grant all privileges on table public.contributions
to service_role;

alter table public.contributions enable row level security;

comment on table public.contributions is
  'Cola editorial privada. El canal público permanece cerrado hasta implantar HC-018 con validación de servidor y control antiabuso.';

do $$
begin
  if has_table_privilege('anon', 'public.contributions', 'select')
    or has_table_privilege('anon', 'public.contributions', 'insert')
    or has_table_privilege('anon', 'public.contributions', 'update')
    or has_table_privilege('anon', 'public.contributions', 'delete') then
    raise exception 'HC-018 security: anon conserva privilegios directos sobre contributions';
  end if;

  if has_table_privilege('authenticated', 'public.contributions', 'select')
    or has_table_privilege('authenticated', 'public.contributions', 'insert')
    or has_table_privilege('authenticated', 'public.contributions', 'update')
    or has_table_privilege('authenticated', 'public.contributions', 'delete') then
    raise exception 'HC-018 security: authenticated conserva privilegios directos sobre contributions';
  end if;
end
$$;
