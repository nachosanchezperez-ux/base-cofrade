alter table public.image_authorships
  alter column agent_entity_id drop not null;

alter table public.image_authorships
  add constraint image_authorships_agent_presence_check
  check (
    (authorship_type = 'anonymous' and agent_entity_id is null and certainty = 'unknown')
    or
    (authorship_type <> 'anonymous' and agent_entity_id is not null)
  );

create unique index if not exists image_authorships_one_anonymous_role_idx
  on public.image_authorships (image_entity_id, authorship_type, role_name)
  where agent_entity_id is null;
