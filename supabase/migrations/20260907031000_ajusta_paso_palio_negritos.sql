-- Hilo Cofrade · ajuste relacional del palio de Los Negritos
-- Corte editorial: 2026-09-06
-- Solo DML editorial sobre nodos ya publicados.

update public.music_accompaniment_periods
set step_entity_id=(select id from public.entities where slug='paso-palio-virgen-angeles-negritos'),
    public_step_name='Paso de palio de Nuestra Señora de los Ángeles',
    updated_at=now()
where brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos')
  and band_entity_id=(select id from public.entities where slug='asociacion-filarmonica-cultural-santa-maria-nieves-olivares')
  and is_current
  and status='published';

insert into public.outing_music_assignments(music_position_id,band_entity_id,participation_mode,sequence_no,notes,status)
select p.id,b.id,'full_route',1,'Formación anunciada por el Consejo tras el paso de palio.','published'
from public.outing_music_positions p
join public.outings o on o.id=p.outing_id
join public.entities b on b.slug='asociacion-filarmonica-cultural-santa-maria-nieves-olivares'
where o.slug='los-negritos-estacion-penitencia-2026'
  and p.position_code='behind_palio'
  and not exists(select 1 from public.outing_music_assignments a where a.music_position_id=p.id and a.band_entity_id=b.id and a.sequence_no=1);

insert into public.accompaniments(outing_id,band_entity_id,step_entity_id,position,year,notes,status)
select o.id,b.id,s.id,'Tras el paso de palio',2026,'Acompañamiento anunciado para la edición de 2026.','published'
from public.outings o
join public.entities b on b.slug='asociacion-filarmonica-cultural-santa-maria-nieves-olivares'
join public.entities s on s.slug='paso-palio-virgen-angeles-negritos'
where o.slug='los-negritos-estacion-penitencia-2026'
  and not exists(select 1 from public.accompaniments a where a.outing_id=o.id and a.band_entity_id=b.id and a.step_entity_id=s.id and a.year=2026);

do $$
declare
  h_id uuid := (select id from public.entities where slug='hermandad-de-los-negritos');
  palio_id uuid := (select id from public.entities where slug='paso-palio-virgen-angeles-negritos');
begin
  if (select count(*) from public.music_accompaniment_periods mp join public.entities b on b.id=mp.band_entity_id where mp.brotherhood_entity_id=h_id and mp.step_entity_id=palio_id and mp.is_current and mp.status='published' and b.slug='asociacion-filarmonica-cultural-santa-maria-nieves-olivares') <> 1 then
    raise exception 'Las Nieves no quedó vinculada al paso de palio';
  end if;
  if (select count(*) from public.outing_music_assignments a join public.outing_music_positions p on p.id=a.music_position_id join public.outings o on o.id=p.outing_id where o.slug='los-negritos-estacion-penitencia-2026' and a.status='published') <> 3 then
    raise exception 'La salida de 2026 no conserva sus tres asignaciones musicales';
  end if;
end $$;
