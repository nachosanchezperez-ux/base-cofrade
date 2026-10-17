-- Limpieza de textos internos visibles en páginas públicas (17/10/2026).
-- Solo se quitan notas de proceso («HC-016», «macrolote», «evidencia posterior»,
-- «ECI-F01 ·»…). No se inventa ni se reescribe ningún dato: o se borra la frase
-- interna o el campo queda vacío y la web no muestra nada.
-- Idempotente. Vuelta atrás: limpieza-jerga-rollback.sql (valores originales).
begin;

-- 1. Hermandades con contenido real mezclado: se conserva lo editorial.
update public.brotherhoods set notes = regexp_replace(notes, '^Ficha completada en el macrolote HC-016 de Glorias de octubre de 2026\. ', '')
where notes like 'Ficha completada en el macrolote HC-016 de Glorias de octubre de 2026. La corporación tiene sede canónica%';
update public.brotherhoods set notes = replace(notes, '; identidad reconciliada por el sexto macrolote municipal HC-016.', '.')
where notes like 'Corporación penitencial y patronal de Lebrija; identidad reconciliada por el sexto macrolote municipal HC-016.';

-- 2. Campos cuyo texto completo es una nota interna: quedan vacíos.
update public.brotherhoods b set notes = null from public.entities e
where e.id = b.entity_id and e.status = 'published'
  and b.notes ~ '(HC-0[0-9][0-9]|macrolote|Primera edición HC|evidencia posterior|Permanece announced|Alta relacional mínima)';
update public.entities set summary = null
where status = 'published' and summary ~ '(documentada? en (el macrolote|HC-0[0-9][0-9])|HC-0[0-9][0-9])';
update public.images i set description = null from public.entities e
where e.id = i.entity_id and e.status = 'published' and i.description ~ 'inventario HC-0[0-9][0-9]';
update public.outings set description = null
where status = 'published' and description ~ '(evidencia posterior|Permanece announced)';
update public.agents set description = null
where description ~ '^Imaginero documentado en el lote de [A-ZÁÉÍÓÚ][a-záéíóúñ]+\.$';

-- 3. Notas públicas de salidas: se quitan solo las frases internas.
update public.outings set public_notes = nullif(btrim(regexp_replace(regexp_replace(regexp_replace(regexp_replace(public_notes,
    ' ?Soporte procesional: pendiente de documentación específica; no se crea paso ni andas sin fuente suficiente\.', '', 'g'),
    ' ?Recorrido: pendiente de documentación específica; no se ha incorporado un itinerario no confirmado\.', '', 'g'),
    ' ?Se mantiene announced hasta localizar evidencia posterior\.', '', 'g'),
    '^(Celebración (respaldada|acreditada) por evidencia posterior\.|Convocatoria documentada; no se eleva a held sin evidencia posterior suficiente\.)$', '')), '')
where status = 'published' and public_notes ~ '(evidencia posterior|pendiente de documentación específica)';

-- 4. Fuentes: fuera el código interno del nombre («ECI-F03 · …»).
update public.sources set name = regexp_replace(name, '^[A-Z]{3}-F[0-9]{2} · ', '')
where name ~ '^[A-Z]{3}-F[0-9]{2} · ';

-- 5. Ediciones de cultos cuya «descripción» es solo la fecha.
update public.cult_occurrences set description_override = null
where description_override ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}( a [0-9]{4}-[0-9]{2}-[0-9]{2})?$';

-- 6. Tipos de paso en inglés o en minúscula.
update public.steps set step_type = case step_type when 'mystery' then 'Misterio' when 'misterio' then 'Misterio' when 'palio' then 'Palio' end
where step_type in ('mystery', 'misterio', 'palio');

commit;
