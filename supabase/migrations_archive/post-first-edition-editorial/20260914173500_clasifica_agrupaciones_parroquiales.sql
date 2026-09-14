begin;

update public.brotherhoods as brotherhood
set brotherhood_types = array_prepend(
  'Agrupación Parroquial',
  coalesce(brotherhood.brotherhood_types, '{}'::text[])
)
where brotherhood.entity_id = (
  select entity.id
  from public.entities as entity
  where entity.slug = 'maravillas-san-diego'
    and entity.entity_type = 'brotherhood'
)
and not coalesce(brotherhood.brotherhood_types, '{}'::text[]) @> array['Agrupación Parroquial']::text[];

do $$
begin
  if not exists (
    select 1
    from public.entities as entity
    join public.brotherhoods as brotherhood on brotherhood.entity_id = entity.id
    where entity.slug = 'maravillas-san-diego'
      and entity.entity_type = 'brotherhood'
      and brotherhood.brotherhood_types @> array['Agrupación Parroquial']::text[]
  ) then
    raise exception 'Las Maravillas de San Diego no quedó clasificada como Agrupación Parroquial';
  end if;
end
$$;

commit;
