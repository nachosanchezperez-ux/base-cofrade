-- Hilo Cofrade · Wikimedia Commons y media abierta
--
-- Una URL externa no convierte por sí sola un archivo en publicable. Este
-- contrato exige una licencia abierta admitida, autoría, titular de derechos,
-- Fuente verificable, texto alternativo y nota editorial de permiso.

create or replace function public.open_media_provenance_is_valid(
  p_storage_path text,
  p_rights_status text,
  p_license text,
  p_author_name text,
  p_rights_holder text,
  p_source_name text,
  p_source_url text,
  p_alt_text text,
  p_permission_notes text
)
returns boolean
language sql
immutable
parallel safe
set search_path = ''
as $$
  select case
    when coalesce(p_rights_status, '') not in ('licensed', 'public_domain') then true
    when nullif(btrim(coalesce(p_license, '')), '') is null then false
    when nullif(btrim(coalesce(p_author_name, '')), '') is null then false
    when nullif(btrim(coalesce(p_rights_holder, '')), '') is null then false
    when nullif(btrim(coalesce(p_source_name, '')), '') is null then false
    when nullif(btrim(coalesce(p_source_url, '')), '') is null then false
    when nullif(btrim(coalesce(p_alt_text, '')), '') is null then false
    when nullif(btrim(coalesce(p_permission_notes, '')), '') is null then false
    when p_source_url !~* '^https://[^[:space:]]+$' then false
    when p_source_url ~* '^https://(www[.])?(google[.][^/]+/search|bing[.]com/search|search[.]yahoo[.]com/)' then false
    when p_rights_status = 'licensed'
      and not (
        upper(btrim(p_license)) = any (array[
          'CC BY 1.0',
          'CC BY 2.0',
          'CC BY 2.5',
          'CC BY 3.0',
          'CC BY 4.0',
          'CC BY-SA 1.0',
          'CC BY-SA 2.0',
          'CC BY-SA 2.5',
          'CC BY-SA 3.0',
          'CC BY-SA 4.0'
        ]::text[])
      ) then false
    when p_rights_status = 'public_domain'
      and not (
        lower(btrim(p_license)) = any (array[
          'cc0 1.0',
          'public domain mark 1.0',
          'pdm 1.0',
          'public domain',
          'dominio público'
        ]::text[])
      ) then false
    when coalesce(p_storage_path, '') ~* '^https://upload[.]wikimedia[.]org/wikipedia/commons/'
      and (
        lower(btrim(p_source_name)) not like 'wikimedia commons%'
        or p_source_url !~* '^https://commons[.]wikimedia[.]org/wiki/(File|Archivo):[^[:space:]]+$'
      ) then false
    else true
  end;
$$;

comment on function public.open_media_provenance_is_valid(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
) is
  'Valida licencia, atribución, procedencia y accesibilidad de recursos con licencia abierta o dominio público.';

alter table public.media_assets
  drop constraint if exists media_assets_open_provenance_check;

alter table public.media_assets
  add constraint media_assets_open_provenance_check
  check (
    public.open_media_provenance_is_valid(
      storage_path,
      rights_status,
      license,
      author_name,
      rights_holder,
      source_name,
      source_url,
      alt_text,
      permission_notes
    )
  );

comment on constraint media_assets_open_provenance_check
  on public.media_assets
  is 'Los recursos abiertos solo pueden guardarse con licencia admitida, atribución completa y Fuente HTTPS verificable.';

drop policy if exists "Publishable media assets"
  on public.media_assets;

create policy "Publishable media assets"
on public.media_assets
for select
to public
using (
  rights_status in ('owned', 'authorized')
  or (
    rights_status in ('licensed', 'public_domain')
    and public.open_media_provenance_is_valid(
      storage_path,
      rights_status,
      license,
      author_name,
      rights_holder,
      source_name,
      source_url,
      alt_text,
      permission_notes
    )
  )
);

comment on policy "Publishable media assets"
  on public.media_assets
  is 'Publica media propia o autorizada y media abierta únicamente cuando conserva su procedencia editorial completa.';
