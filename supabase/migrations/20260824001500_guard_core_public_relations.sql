-- Hilo Cofrade · Salud del grafo · ciclo 1
--
-- Las relaciones nucleares Hermandad–Imagen, Hermandad–Paso e Imagen–Paso
-- no tienen un contrato de proyección pública desacoplada. Por tanto, solo
-- pueden permanecer publicadas cuando sus dos extremos canónicos también lo
-- están y conservan el tipo esperado.
--
-- Este corte no afecta a music_accompaniment_periods ni march_dedications:
-- ambas superficies sí cuentan con campos de proyección pública deliberados.

create or replace function public.guard_core_relation_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  source_entity_id uuid;
  target_entity_id uuid;
  source_entity_type text;
  target_entity_type text;
  source_status text;
  target_status text;
begin
  if new.status <> 'published' then
    return new;
  end if;

  source_entity_id := (to_jsonb(new) ->> tg_argv[0])::uuid;
  target_entity_id := (to_jsonb(new) ->> tg_argv[1])::uuid;

  select entity_type, status
    into source_entity_type, source_status
  from public.entities
  where id = source_entity_id;

  select entity_type, status
    into target_entity_type, target_status
  from public.entities
  where id = target_entity_id;

  if source_entity_type is distinct from tg_argv[2]
     or target_entity_type is distinct from tg_argv[3]
     or source_status is distinct from 'published'
     or target_status is distinct from 'published' then
    new.status := 'draft';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_core_relation_publication() from public;

drop trigger if exists brotherhood_images_guard_publication
  on public.brotherhood_images;
create trigger brotherhood_images_guard_publication
before insert or update on public.brotherhood_images
for each row execute function public.guard_core_relation_publication(
  'brotherhood_entity_id',
  'image_entity_id',
  'brotherhood',
  'image'
);

drop trigger if exists brotherhood_steps_guard_publication
  on public.brotherhood_steps;
create trigger brotherhood_steps_guard_publication
before insert or update on public.brotherhood_steps
for each row execute function public.guard_core_relation_publication(
  'brotherhood_entity_id',
  'step_entity_id',
  'brotherhood',
  'step'
);

drop trigger if exists image_steps_guard_publication
  on public.image_steps;
create trigger image_steps_guard_publication
before insert or update on public.image_steps
for each row execute function public.guard_core_relation_publication(
  'image_entity_id',
  'step_entity_id',
  'image',
  'step'
);

-- Reconciliación de las incoherencias ya presentes. Las Fuentes y los UUID se
-- conservan; únicamente cambia la visibilidad editorial de la relación.
update public.brotherhood_images relation
set status = 'draft'
where relation.status = 'published'
  and not exists (
    select 1
    from public.entities brotherhood
    join public.entities image
      on image.id = relation.image_entity_id
    where brotherhood.id = relation.brotherhood_entity_id
      and brotherhood.entity_type = 'brotherhood'
      and brotherhood.status = 'published'
      and image.entity_type = 'image'
      and image.status = 'published'
  );

update public.brotherhood_steps relation
set status = 'draft'
where relation.status = 'published'
  and not exists (
    select 1
    from public.entities brotherhood
    join public.entities step
      on step.id = relation.step_entity_id
    where brotherhood.id = relation.brotherhood_entity_id
      and brotherhood.entity_type = 'brotherhood'
      and brotherhood.status = 'published'
      and step.entity_type = 'step'
      and step.status = 'published'
  );

update public.image_steps relation
set status = 'draft'
where relation.status = 'published'
  and not exists (
    select 1
    from public.entities image
    join public.entities step
      on step.id = relation.step_entity_id
    where image.id = relation.image_entity_id
      and image.entity_type = 'image'
      and image.status = 'published'
      and step.entity_type = 'step'
      and step.status = 'published'
  );

-- Defensa en profundidad: aunque una fila heredada llegara a conservar el
-- estado published, anon solo puede leerla si ambos extremos están publicados.
drop policy if exists "Published brotherhood image relations"
  on public.brotherhood_images;
create policy "Published brotherhood image relations"
on public.brotherhood_images
for select
to public
using (
  status = 'published'
  and exists (
    select 1
    from public.entities brotherhood
    where brotherhood.id = brotherhood_images.brotherhood_entity_id
      and brotherhood.entity_type = 'brotherhood'
      and brotherhood.status = 'published'
  )
  and exists (
    select 1
    from public.entities image
    where image.id = brotherhood_images.image_entity_id
      and image.entity_type = 'image'
      and image.status = 'published'
  )
);

drop policy if exists "Published brotherhood step relations"
  on public.brotherhood_steps;
create policy "Published brotherhood step relations"
on public.brotherhood_steps
for select
to public
using (
  status = 'published'
  and exists (
    select 1
    from public.entities brotherhood
    where brotherhood.id = brotherhood_steps.brotherhood_entity_id
      and brotherhood.entity_type = 'brotherhood'
      and brotherhood.status = 'published'
  )
  and exists (
    select 1
    from public.entities step
    where step.id = brotherhood_steps.step_entity_id
      and step.entity_type = 'step'
      and step.status = 'published'
  )
);

drop policy if exists "Published image step relations"
  on public.image_steps;
create policy "Published image step relations"
on public.image_steps
for select
to public
using (
  status = 'published'
  and exists (
    select 1
    from public.entities image
    where image.id = image_steps.image_entity_id
      and image.entity_type = 'image'
      and image.status = 'published'
  )
  and exists (
    select 1
    from public.entities step
    where step.id = image_steps.step_entity_id
      and step.entity_type = 'step'
      and step.status = 'published'
  )
);
