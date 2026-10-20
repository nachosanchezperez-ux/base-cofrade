-- APPLY · vacía las 157 descripciones genéricas (una transacción, con guardas)
-- Coletillas genéricas en public.cults.description · auditoría del 19/10/2026.
-- NO forma parte de la cadena ejecutable (migrations_archive): se ejecuta a mano y
-- solo con autorización expresa del propietario.
-- Alcance fijado por huella: exactamente 157 cultos publicados de 35 hermandades
-- (md5 de «id|descripción» ordenado por id = 6193c316a210248fdd7caceb609ece44).
-- Si un solo culto ha cambiado desde la auditoría, la huella no coincide y no se toca nada.
-- Copia y reversión: docs/datos/coletillas-cultos-2026-10-19.json y 20261019010200_rollback_coletillas_cultos.sql
do $$
declare
  coinciden integer;
  actualizados integer;
  huella text;
begin
  create temp table coletillas_frases (frase text primary key) on commit drop;
  insert into coletillas_frases (frase) values
    ('Culto anual documentado por la corporación.'),
    ('Culto anual documentado por la Hermandad.'),
    ('Culto anual documentado por la corporación o la ficha institucional.'),
    ('Culto anual documentado en el calendario oficial de la Archicofradía.'),
    ('Culto documentado para la edición de 2026.'),
    ('Culto anual recogido en las Reglas y fuentes oficiales.'),
    ('Culto anual de la corporación.'),
    ('Culto interno documentado en la agenda oficial de la Hermandad.'),
    ('Culto anunciado en el calendario oficial de 2026.'),
    ('Culto incluido en el calendario oficial del curso 2026-2027 de la Archicofradía.');

  select count(*), md5(string_agg(c.id::text || '|' || c.description, ',' order by c.id))
    into coinciden, huella
  from public.cults c join coletillas_frases f on f.frase = c.description;
  if coinciden <> 157 or huella <> '6193c316a210248fdd7caceb609ece44' then
    raise exception 'APPLY_COLETILLAS_ABORT: coinciden %, huella %; no se modifica nada', coinciden, huella;
  end if;

  update public.cults c set description = null
  from coletillas_frases f where f.frase = c.description;
  get diagnostics actualizados = row_count;
  if actualizados <> 157 then
    raise exception 'APPLY_COLETILLAS_ABORT: % filas en lugar de 157; se deshace todo', actualizados;
  end if;

  raise notice 'APPLY_COLETILLAS_OK_COMMITTED: % descripciones vaciadas', actualizados;
end $$;
