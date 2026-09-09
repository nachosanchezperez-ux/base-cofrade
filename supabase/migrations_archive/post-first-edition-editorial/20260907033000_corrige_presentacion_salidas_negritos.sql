-- Hilo Cofrade · corrige la presentación de salidas de Los Negritos
-- Corte editorial: 2026-09-07
-- Solo DML editorial. Sin DDL, tablas nuevas, RLS ni arquitectura.

update public.entity_relations
set status='published'
where source_entity_id=(select id from public.entities where slug='via-crucis-cofradias-sevilla-1977')
  and target_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos')
  and relation_type='involves'
  and status<>'archived';

insert into public.entity_relations(source_entity_id,relation_type,target_entity_id,date_from_text,notes,status)
select ev.id,'involves',i.id,'1977','El Santísimo Cristo de la Fundación presidió el Vía Crucis de las Cofradías de 1977.','published'
from public.entities ev
join public.entities i on i.slug='santisimo-cristo-fundacion-negritos'
where ev.slug='via-crucis-cofradias-sevilla-1977'
  and not exists(
    select 1 from public.entity_relations er
    where er.source_entity_id=ev.id
      and er.target_entity_id=i.id
      and er.relation_type='involves'
      and er.status<>'archived'
  );

update public.outings
set outing_type='Vía Crucis del Consejo',
    updated_at=now()
where slug='via-crucis-consejo-1977-hermandad-de-los-negritos'
  and brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos');

do $$
declare
  h_id uuid := (select id from public.entities where slug='hermandad-de-los-negritos');
  event_id uuid := (select id from public.entities where slug='via-crucis-cofradias-sevilla-1977');
  christ_id uuid := (select id from public.entities where slug='santisimo-cristo-fundacion-negritos');
begin
  if (select count(*) from public.entity_relations where source_entity_id=event_id and target_entity_id=h_id and relation_type='involves' and status='published') <> 1 then
    raise exception 'El Vía Crucis de 1977 no quedó relacionado con la Hermandad';
  end if;
  if (select count(*) from public.entity_relations where source_entity_id=event_id and target_entity_id=christ_id and relation_type='involves' and status='published') <> 1 then
    raise exception 'El Cristo de la Fundación no quedó como protagonista del Vía Crucis de 1977';
  end if;
  if (select count(*) from public.outings where brotherhood_entity_id=h_id and slug='via-crucis-consejo-1977-hermandad-de-los-negritos' and outing_type='Vía Crucis del Consejo' and status='published') <> 1 then
    raise exception 'La salida histórica no quedó reservada para el módulo institucional';
  end if;
end $$;
