alter table public.brotherhood_habits
  add column if not exists gloves_color text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'brotherhood_habits_gloves_color_check'
      and conrelid = 'public.brotherhood_habits'::regclass
  ) then
    alter table public.brotherhood_habits
      add constraint brotherhood_habits_gloves_color_check
      check (gloves_color is null or gloves_color in ('Blanco', 'Negro'));
  end if;
end
$$;

update public.brotherhood_habits
set
  gloves_color = case footwear_description
    when 'Guantes negros, calcetines blancos y zapatos negros de vestir.' then 'Negro'
    when 'Negro con hebillas plateadas; guantes y calcetines negros.' then 'Negro'
    when 'Guantes y calcetines blancos; zapatos negros o pies descalzos.' then 'Blanco'
    when 'Guantes y calcetines blancos; sandalias o zapatos negros.' then 'Blanco'
    when 'Guantes, calcetines y zapatos negros, sin hebilla ni adorno.' then 'Negro'
    when 'Calcetines blancos, zapatos negros y guantes blancos' then 'Blanco'
    when 'Guantes de piel negra; la fuente institucional no concreta el calzado.' then 'Negro'
    when 'Calcetines blancos lisos, zapatos negros y guantes blancos lisos' then 'Blanco'
    when 'Negro y guantes blancos' then 'Blanco'
    else gloves_color
  end,
  footwear_description = case footwear_description
    when 'Guantes negros, calcetines blancos y zapatos negros de vestir.' then 'Calcetines blancos y zapatos negros de vestir.'
    when 'Negro con hebillas plateadas; guantes y calcetines negros.' then 'Negro con hebillas plateadas; calcetines negros.'
    when 'Guantes y calcetines blancos; zapatos negros o pies descalzos.' then 'Calcetines blancos; zapatos negros o pies descalzos.'
    when 'Guantes y calcetines blancos; sandalias o zapatos negros.' then 'Calcetines blancos; sandalias o zapatos negros.'
    when 'Guantes, calcetines y zapatos negros, sin hebilla ni adorno.' then 'Calcetines y zapatos negros, sin hebilla ni adorno.'
    when 'Calcetines blancos, zapatos negros y guantes blancos' then 'Calcetines blancos y zapatos negros'
    when 'Guantes de piel negra; la fuente institucional no concreta el calzado.' then 'La fuente institucional no concreta el calzado.'
    when 'Calcetines blancos lisos, zapatos negros y guantes blancos lisos' then 'Calcetines blancos lisos y zapatos negros'
    when 'Negro y guantes blancos' then 'Negro'
    else footwear_description
  end
where gloves_color is null
  and footwear_description in (
    'Guantes negros, calcetines blancos y zapatos negros de vestir.',
    'Negro con hebillas plateadas; guantes y calcetines negros.',
    'Guantes y calcetines blancos; zapatos negros o pies descalzos.',
    'Guantes y calcetines blancos; sandalias o zapatos negros.',
    'Guantes, calcetines y zapatos negros, sin hebilla ni adorno.',
    'Calcetines blancos, zapatos negros y guantes blancos',
    'Guantes de piel negra; la fuente institucional no concreta el calzado.',
    'Calcetines blancos lisos, zapatos negros y guantes blancos lisos',
    'Negro y guantes blancos'
  );
