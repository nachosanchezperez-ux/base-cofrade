-- Hilo Cofrade · Panel de control, perfiles y permisos editoriales
-- Migración 016

-- El acceso se apoya en Supabase Auth. Esta tabla añade la autorización
-- editorial de la aplicación sin exponer credenciales privilegiadas al cliente.
create table public.panel_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'collaborator' check (
    role in ('admin', 'editor', 'collaborator')
  ),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger panel_users_set_updated_at
before update on public.panel_users
for each row execute function public.set_updated_at();

alter table public.panel_users enable row level security;

create or replace function public.current_panel_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select profile.role
  from public.panel_users as profile
  where profile.user_id = (select auth.uid())
    and profile.active = true
  limit 1
$$;

create or replace function public.is_panel_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_panel_role() is not null
$$;

create or replace function public.can_edit_panel()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_panel_role() in ('admin', 'editor', 'collaborator')
$$;

create or replace function public.can_publish_panel()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_panel_role() in ('admin', 'editor')
$$;

create or replace function public.can_admin_panel()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_panel_role() = 'admin'
$$;

revoke all on function public.current_panel_role() from public, anon, authenticated;
revoke all on function public.is_panel_member() from public, anon, authenticated;
revoke all on function public.can_edit_panel() from public, anon, authenticated;
revoke all on function public.can_publish_panel() from public, anon, authenticated;
revoke all on function public.can_admin_panel() from public, anon, authenticated;

grant execute on function public.current_panel_role() to authenticated;
grant execute on function public.is_panel_member() to authenticated;
grant execute on function public.can_edit_panel() to authenticated;
grant execute on function public.can_publish_panel() to authenticated;
grant execute on function public.can_admin_panel() to authenticated;

create policy "Panel users can read their profile"
on public.panel_users for select to authenticated
using (user_id = (select auth.uid()) or (select public.can_admin_panel()));

create policy "Admins can add panel users"
on public.panel_users for insert to authenticated
with check ((select public.can_admin_panel()));

create policy "Admins can update panel users"
on public.panel_users for update to authenticated
using ((select public.can_admin_panel()))
with check ((select public.can_admin_panel()));

create policy "Admins can delete panel users"
on public.panel_users for delete to authenticated
using ((select public.can_admin_panel()));

grant select, insert, update, delete on public.panel_users to authenticated;

-- Los miembros del panel pueden consultar también borradores y elementos en
-- revisión. Las políticas públicas existentes siguen limitadas a publicados.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'entities', 'brotherhoods', 'brotherhood_colors', 'images',
    'brotherhood_images', 'steps', 'brotherhood_steps', 'agents', 'agent_roles',
    'bands', 'marches', 'march_authors', 'outings', 'outing_entities',
    'outing_route_points', 'outing_schedule_items', 'outing_series',
    'outing_series_movements', 'cults', 'cult_entities', 'cult_occurrences',
    'cult_occurrence_days', 'heritage_assets', 'heritage_interventions',
    'heritage_updates', 'heritage_update_agents', 'editorial_content',
    'editorial_content_links', 'sources', 'source_links', 'media_assets',
    'entity_media', 'audit_log'
  ]
  loop
    execute format('create policy %I on public.%I for select to authenticated using ((select public.is_panel_member()))',
      'Panel members can read ' || table_name, table_name);
    execute format('grant select on public.%I to authenticated', table_name);
  end loop;
end
$$;

-- Registros con estado editorial: colaboradores trabajan con borradores y
-- revisiones; editores y administradores pueden publicar.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'entities', 'brotherhood_colors', 'brotherhood_images', 'brotherhood_steps',
    'outings', 'outing_series', 'cults', 'cult_occurrences',
    'heritage_interventions', 'heritage_updates', 'editorial_content'
  ]
  loop
    execute format('create policy %I on public.%I for insert to authenticated with check ((select public.can_edit_panel()) and (status <> ''published'' or (select public.can_publish_panel())))',
      'Panel members can create ' || table_name, table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select public.can_edit_panel()) and (status <> ''published'' or (select public.can_publish_panel()))) with check ((select public.can_edit_panel()) and (status <> ''published'' or (select public.can_publish_panel())))',
      'Panel members can update ' || table_name, table_name);
    execute format('create policy %I on public.%I for delete to authenticated using ((select public.can_admin_panel()))',
      'Admins can delete ' || table_name, table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
  end loop;
end
$$;

-- Tablas auxiliares sin estado propio. Solo editor y administrador pueden
-- modificarlas; el borrado definitivo queda reservado al administrador.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'brotherhoods', 'images', 'steps', 'agents', 'agent_roles', 'bands',
    'marches', 'march_authors', 'outing_entities', 'outing_route_points',
    'outing_schedule_items', 'outing_series_movements', 'cult_entities',
    'cult_occurrence_days', 'heritage_assets', 'heritage_update_agents',
    'editorial_content_links', 'sources', 'source_links', 'media_assets',
    'entity_media'
  ]
  loop
    execute format('create policy %I on public.%I for insert to authenticated with check ((select public.can_publish_panel()))',
      'Editors can create ' || table_name, table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select public.can_publish_panel())) with check ((select public.can_publish_panel()))',
      'Editors can update ' || table_name, table_name);
    execute format('create policy %I on public.%I for delete to authenticated using ((select public.can_admin_panel()))',
      'Admins can delete ' || table_name, table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
  end loop;
end
$$;

create policy "Panel members can write audit log"
on public.audit_log for insert to authenticated
with check (
  (select public.is_panel_member())
  and (actor_user_id is null or actor_user_id = (select auth.uid()))
);

grant insert on public.audit_log to authenticated;

-- Permite deshacer una subida incompleta sin conceder borrado del resto del
-- contenido estructurado a los perfiles editoriales.
create policy "Editors can delete media assets"
on public.media_assets for delete to authenticated
using ((select public.can_publish_panel()));

create policy "Editors can delete entity media"
on public.entity_media for delete to authenticated
using ((select public.can_publish_panel()));

-- Archivo visual del panel. Los ficheros publicados se sirven desde un bucket
-- público; las escrituras siguen protegidas por los perfiles editoriales.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hilo-media',
  'hilo-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view Hilo media"
on storage.objects for select
using (bucket_id = 'hilo-media');

create policy "Editors can upload Hilo media"
on storage.objects for insert to authenticated
with check (bucket_id = 'hilo-media' and (select public.can_publish_panel()));

create policy "Editors can update Hilo media"
on storage.objects for update to authenticated
using (bucket_id = 'hilo-media' and (select public.can_publish_panel()))
with check (bucket_id = 'hilo-media' and (select public.can_publish_panel()));

create policy "Editors can delete Hilo media"
on storage.objects for delete to authenticated
using (bucket_id = 'hilo-media' and (select public.can_publish_panel()));

-- El primer administrador se vincula después de crear su usuario en Auth:
-- insert into public.panel_users (user_id, display_name, role)
-- select id, 'Nombre', 'admin' from auth.users where email = 'correo@ejemplo.com';
