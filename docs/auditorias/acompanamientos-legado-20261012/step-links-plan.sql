-- HC-006 · Enlace de periodos musicales (vigentes e históricos) con su Paso.
-- PLAN DE SOLO LECTURA. Devuelve un paso candidato único por periodo o nada.
--
-- Reglas, por orden y siempre dentro de los pasos publicados de la MISMA Hermandad:
--   0. Se excluyen las posiciones que no van tras un paso (Cruz de Guía, apertura,
--      cabecera, cortejo): esas bandas no se enlazan a ningún paso.
--   1. Tipo: si el texto habla de «palio», solo pasos de palio; si habla de «misterio»
--      (singular, sin «Misterios Dolorosos»), solo pasos que no son de palio.
--   2. Palabras distintivas: se comparan las palabras de la posición y del nombre de
--      paso guardado (public_step_name) con el nombre real de cada paso, sin palabras
--      genéricas (paso, nuestro padre, santísimo, coronada…).
--   3. Se acepta el paso con más palabras en común solo si es ÚNICO.
--   4. Sin palabras en común solo se acepta si el texto declara el tipo (palio o
--      misterio), no nombra un paso concreto y el filtro deja un único candidato.
--      «Tras el paso» a secas nunca se enlaza: el paso real puede no existir aún.
--   5. «Jesús» y «Cristo» designan imágenes distintas: si el texto nombra uno y el paso
--      solo el otro, se descarta. La Cruz de Mayo no se enlaza a pasos de la Hermandad.
--   Cualquier empate o descarte queda sin enlazar, para revisión editorial.
--   Revisión manual de la primera versión: corrigió San Gil de Écija, Quinta Angustia,
--   Vera Cruz de Tocina y Maravillas de San Diego.

with stop(w) as (
  values ('paso'),('pasos'),('de'),('del'),('la'),('las'),('el'),('los'),('en'),('sus'),('su'),('y'),('a'),('al'),
         ('tras'),('ante'),('delante'),('nuestra'),('nuestro'),('senora'),('senor'),('padre'),('jesus'),('maria'),
         ('santisima'),('santisimo'),('cristo'),('coronada'),('virgen'),('palio'),('misterio'),('misterios'),
         ('procesional'),('acompanamiento'),('musical'),('banda'),('tramo'),('vuelta'),('ida'),('regreso'),('madre'),
         ('hermandad'),('imagen'),('titular'),('dolorosa')
),
steps as (
  select bs.brotherhood_entity_id as brotherhood_id, e.id as step_id, e.name as step_name,
         lower(translate(e.name, 'áéíóúÁÉÍÓÚüÜñÑ', 'aeiouaeiouuunn')) as norm
  from public.brotherhood_steps bs
  join public.entities e on e.id = bs.step_entity_id and e.status = 'published' and e.entity_type = 'step'
  where bs.status = 'published'
),
periods as (
  select m.id, m.brotherhood_entity_id, m.is_current, m.position, m.public_step_name,
         lower(translate(coalesce(m.position, '') || ' ' || coalesce(m.public_step_name, ''), 'áéíóúÁÉÍÓÚüÜñÑ', 'aeiouaeiouuunn')) as ctx
  from public.music_accompaniment_periods m
  where m.status = 'published' and m.step_entity_id is null
),
eligible as (
  select p.*,
    p.ctx ~ '\mpalio\M' as wants_palio,
    p.ctx ~ '\mmisterio\M' as wants_mystery
  from periods p
  where p.ctx !~ '(cruz de guia|abriendo|apertura|cabecera|cortejo|escolta|cruz de mayo)'
),
candidates as (
  select e.id as period_id, s.step_id, s.step_name,
    (select count(distinct w) from regexp_split_to_table(e.ctx, '[^a-z0-9]+') w
      where length(w) > 2 and w not in (select w from stop)
        and s.norm ~ ('\m' || w || '\M')) as score
  from eligible e
  join steps s on s.brotherhood_id = e.brotherhood_entity_id
  where (not e.wants_palio or s.norm ~ '\mpalio\M')
    and (not e.wants_mystery or e.wants_palio or s.norm !~ '\mpalio\M')
    and not (e.ctx ~ '\mjesus\M' and e.ctx !~ '\mcristo\M' and s.norm ~ '\mcristo\M' and s.norm !~ '\mjesus\M')
    and not (e.ctx ~ '\mcristo\M' and e.ctx !~ '\mjesus\M' and s.norm ~ '\mjesus\M' and s.norm !~ '\mcristo\M')
),
ranked as (
  select c.*,
    count(*) over (partition by c.period_id) as n_candidates,
    max(c.score) over (partition by c.period_id) as best,
    count(*) filter (where true) over (partition by c.period_id, c.score) as tied
  from candidates c
)
select r.period_id, r.step_id, r.step_name, r.score, r.n_candidates
from ranked r
join eligible e on e.id = r.period_id
where (r.best > 0 and r.score = r.best and r.tied = 1)
   or (r.best = 0 and r.n_candidates = 1
       and (e.wants_palio or e.wants_mystery)
       and nullif(btrim(coalesce(e.public_step_name, '')), '') is null);
