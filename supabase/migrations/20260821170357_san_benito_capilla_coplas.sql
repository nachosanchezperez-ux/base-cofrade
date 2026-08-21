-- Completa el cuarto bloque del Archivo musical oficial de San Benito.
-- Estas nueve obras no se modelan como Marcha: son patrimonio musical no procesional.
-- Se reutilizan heritage_asset + entity_relations(author_of), preservando Música/Letra en notes.

do $$
declare
  v_brotherhood uuid;
  v_source uuid;
  v_work uuid;
  v_agent uuid;
  r record;
begin
  select id into v_brotherhood
  from entities
  where slug = 'san-benito' and entity_type = 'brotherhood';

  if v_brotherhood is null then
    raise exception 'San Benito brotherhood not found';
  end if;

  select id into v_source
  from sources
  where url = 'https://hermandaddesanbenito.net/musica-de-capilla-y-coplas/'
  limit 1;

  if v_source is null then
    insert into sources (name, url, source_type, author_or_publisher, accessed_at)
    values (
      'Música de capilla y coplas · Hermandad de San Benito',
      'https://hermandaddesanbenito.net/musica-de-capilla-y-coplas/',
      'web',
      'Hermandad de San Benito',
      current_date
    ) returning id into v_source;
  end if;

  for r in
    select * from (values
      ('Sanguis Christi','sanguis-christi-san-benito-capilla','Música de capilla','1998',1,'Composición de música de capilla incorporada al archivo musical de la Hermandad de San Benito.',null),
      ('Sangre en la Cruz','sangre-en-la-cruz-san-benito-capilla','Música de capilla','1999',2,'Composición de música de capilla incorporada al archivo musical de la Hermandad de San Benito.','Autoría anónima'),
      ('Plegaria a la Virgen de la Encarnación','plegaria-virgen-encarnacion-1991-san-benito','Copla','1991',1,'Copla para cultos internos de la Hermandad de San Benito.',null),
      ('Himno de la Coronación','himno-coronacion-1994-san-benito-copla','Copla','1994',2,'Copla para cultos internos vinculada a la Coronación de Nuestra Señora de la Encarnación.',null),
      ('Santísimo Cristo de la Sangre','santisimo-cristo-sangre-1998-san-benito-copla','Copla','1998',3,'Copla para cultos internos dedicada al Santísimo Cristo de la Sangre.',null),
      ('Canto a la Sagrada Presentación de Jesús al Pueblo','canto-sagrada-presentacion-2008-san-benito','Copla','2008',4,'Copla para cultos internos dedicada a la Sagrada Presentación de Jesús al Pueblo.',null),
      ('Motete al Santísimo Cristo de la Sangre','motete-cristo-sangre-2008-san-benito','Copla','2008',5,'Motete incluido entre las coplas para cultos internos de la Hermandad de San Benito.',null),
      ('Plegaria a la Virgen de la Encarnación','plegaria-virgen-encarnacion-2008-san-benito','Copla','2008',6,'Copla para cultos internos dedicada a Nuestra Señora de la Encarnación.',null),
      ('Quién te coronó Señora','quien-te-corono-senora-2019-san-benito','Copla','2019',7,'Copla para cultos internos compuesta para la celebración del XXV aniversario de la coronación de Nuestra Señora de la Encarnación.',null)
    ) as x(name, slug, asset_type, year_text, display_order, description, notes)
  loop
    select id into v_work from entities where slug = r.slug limit 1;
    if v_work is null then
      insert into entities (name, slug, entity_type, status)
      values (r.name, r.slug, 'heritage_asset', 'published')
      returning id into v_work;

      insert into heritage_assets (
        entity_id, parent_entity_id, asset_type, date_from_text,
        is_current, display_order, description, notes
      ) values (
        v_work, v_brotherhood, r.asset_type, r.year_text,
        true, r.display_order, r.description, r.notes
      );
    end if;

    if not exists (
      select 1 from source_links where source_id = v_source and entity_id = v_work
    ) then
      insert into source_links (source_id, entity_id, scope)
      values (
        v_source,
        v_work,
        case when r.asset_type = 'Música de capilla'
          then 'Música de capilla · ficha oficial'
          else 'Coplas para cultos internos · ficha oficial'
        end
      );
    end if;
  end loop;

  for r in
    select * from (values
      ('paulina-ferrer-garrofe','Paulina Ferrer Garrofé','sanguis-christi-san-benito-capilla','Música'),
      ('rafael-bermudez','Rafael Bermúdez','plegaria-virgen-encarnacion-1991-san-benito','Autoría'),
      ('pascual-gonzalez-moreno','Pascual González Moreno','himno-coronacion-1994-san-benito-copla','Autoría'),
      ('arturo-artigas-campos','Arturo Artigas Campos','santisimo-cristo-sangre-1998-san-benito-copla','Música'),
      ('fidelia-tercero-valero','Fidelia Tercero Valero','santisimo-cristo-sangre-1998-san-benito-copla','Letra'),
      ('miguel-angel-rodriguez-villacorta','Miguel Ángel Rodríguez Villacorta','canto-sagrada-presentacion-2008-san-benito','Autoría'),
      ('clara-isabel-rufino-baquero','Clara Isabel Rufino Baquero','motete-cristo-sangre-2008-san-benito','Música'),
      ('miguel-cruz-giraldez','Miguel Cruz Giráldez','motete-cristo-sangre-2008-san-benito','Letra'),
      ('ma-dolores-segura-bernal','Mª Dolores Segura Bernal','plegaria-virgen-encarnacion-2008-san-benito','Autoría'),
      ('luis-gallardo-cerrejon','Luis Gallardo Cerrejón','quien-te-corono-senora-2019-san-benito','Autoría')
    ) as x(agent_slug, agent_name, work_slug, role_name)
  loop
    select id into v_agent
    from entities
    where entity_type = 'agent'
      and (slug = r.agent_slug or lower(name) = lower(r.agent_name))
    limit 1;

    if v_agent is null then
      insert into entities (name, slug, entity_type, status)
      values (r.agent_name, r.agent_slug, 'agent', 'published')
      returning id into v_agent;
      insert into agents (entity_id, agent_kind) values (v_agent, 'person');
    end if;

    select id into v_work from entities where slug = r.work_slug limit 1;

    if not exists (
      select 1 from entity_relations
      where source_entity_id = v_agent
        and target_entity_id = v_work
        and relation_type = 'author_of'
    ) then
      insert into entity_relations (
        source_entity_id, relation_type, target_entity_id, notes, status
      ) values (v_agent, 'author_of', v_work, r.role_name, 'published');
    end if;
  end loop;
end $$;
