alter table public.events drop constraint if exists events_category_check;

alter table public.events
  add constraint events_category_check
  check (event_category = any (array['historical'::text, 'crew_call'::text, 'concert'::text]));

alter table public.events drop constraint if exists concert_event_required_fields_check;

alter table public.events
  add constraint concert_event_required_fields_check
  check (
    event_category <> 'concert'::text
    or (
      event_date is not null
      and event_type = any (array[
        'concierto'::text,
        'certamen'::text,
        'presentacion'::text,
        'estreno'::text,
        'encuentro'::text,
        'otro_musical'::text
      ])
    )
  );
