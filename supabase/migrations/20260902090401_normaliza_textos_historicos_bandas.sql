begin;

do $$
declare
  v_expected integer := 34;
  v_found integer;
  v_updated integer;
begin
  with editorial_copy(id, notes) as (
    values
      ('92add179-7ff1-4634-9739-fcaaacad39fc'::uuid, 'La vinculación concluyó tras la Semana Santa de 2026.'::text),
      ('279dc0a1-4058-43bf-89b3-3b137d527c01'::uuid, 'La relación con la Hermandad de las Viñas concluyó tras la Semana Santa de 2026.'::text),
      ('3833522e-5017-4d0c-948d-d74a565acf02'::uuid, null::text),
      ('86913154-ccce-4a25-ad2c-5df04944c333'::uuid, 'Primera etapa de la vinculación con San Esteban.'::text),
      ('6793150a-0e4b-41d3-ab3d-84d897ce2c31'::uuid, 'Primera etapa de la vinculación con Jesús Despojado.'::text),
      ('dd0ae1ea-597d-4703-9263-b0631f053207'::uuid, 'Primera etapa de la vinculación con La Resurrección.'::text),
      ('36597ce8-bac5-4153-8040-1d04c4bee5fd'::uuid, 'La Banda Municipal de Coria del Río tomará el relevo en 2027.'::text),
      ('a9562180-be62-4a83-bf1e-b7651795cbc3'::uuid, 'La relación comenzó en 2009 tras María Santísima Madre de los Desamparados y se mantuvo hasta 2020.'::text),
      ('c5769df7-af1d-4d65-816c-da77e505b30b'::uuid, 'La relación concluyó en 2025. AMUECI tomó el relevo en 2026 y renovó después por tres años.'::text),
      ('30545f53-7068-4e6e-8ee9-646b12f6ea3c'::uuid, 'Segunda etapa de la vinculación con San Bernardo, anterior al periodo actual.'::text),
      ('a1af7d1a-b6d3-441b-aa69-09d4f493de52'::uuid, 'Primera etapa de la vinculación bajo la denominación Cruz Roja.'::text),
      ('3d083966-014e-4faf-8f46-1f8a743abc51'::uuid, 'La formación participó en las fiestas de la Santa Cruz del Cerrillo el 30 de mayo de 2026.'::text),
      ('252049b2-72fb-4ca8-8d40-d7a62bc39720'::uuid, 'La formación participó en el Día del Romero el 31 de mayo de 2026.'::text),
      ('b081f8eb-b21c-4d9f-afb4-a16d84c2f9fc'::uuid, 'La Redención acompañó a la Hermandad hasta 2025. La fecha de inicio sigue pendiente de precisar.'::text),
      ('b358702e-6f84-4550-b8ac-372b57e2e0a9'::uuid, 'La Redención acompañó a la Hermandad hasta 2025. La fecha de inicio sigue pendiente de precisar.'::text),
      ('a08ea143-6656-4922-bbec-55786a1194ea'::uuid, 'La relación concluyó en 2026; la Hermandad anunció otra formación para 2027.'::text),
      ('b0217fb0-4e10-4a1e-9283-a0f77e678310'::uuid, 'La relación concluyó tras el Lunes Santo de 2026.'::text),
      ('0f91f98c-ce6b-4a7b-b048-8b4d2a710e53'::uuid, 'La participación de 2026 no tiene continuidad confirmada para 2027.'::text),
      ('23001159-a7df-42b3-839f-4ae24121a1d6'::uuid, 'La vinculación se mantuvo durante 33 Semanas Santas, desde 1991 hasta 2023.'::text),
      ('211fbef3-7524-4d6d-b312-6ba5685ef658'::uuid, 'La relación se mantuvo desde 1992 hasta la Semana Santa de 2023.'::text),
      ('7b353ce2-95f1-489b-9d7f-cea9e1aeecee'::uuid, 'Tres Semanas Santas de vinculación: 1997, 1998 y 1999.'::text),
      ('32bb1f16-0388-4db3-8020-5a1d6831f4c1'::uuid, 'Acompañó al Santísimo Cristo de la Sangre en 1995 y 1996.'::text),
      ('1b5b079c-58c5-4b2e-934d-dc81707ec293'::uuid, null::text),
      ('f06810c7-f8b7-413a-9626-1d19a67893f7'::uuid, null::text),
      ('259e0f99-5645-4251-8695-129637ab0ed8'::uuid, 'Fue el primer Domingo de Ramos de la formación.'::text),
      ('2cd0ad54-fb6e-4e64-978c-aabbf97a543d'::uuid, null::text),
      ('ac20d49f-f09b-4e42-a0e7-288b69f87fc7'::uuid, null::text),
      ('a5cdcae8-f2d2-4b6b-9f2a-1acfd2c833df'::uuid, 'La sexta participación desde 2020 cerró esta etapa en 2026.'::text),
      ('830628cd-d6d6-40be-90e1-5fb8dc98633a'::uuid, null::text),
      ('557002cc-ac7f-4f09-b185-a86b5aa71b47'::uuid, 'Entre 1993 y 1996 abrió el cortejo de San Benito. Desde 1997 acompaña al Santísimo Cristo de la Sangre.'::text),
      ('15d76d63-12da-4019-a45d-8690b466033a'::uuid, 'La vinculación concluyó tras la Semana Santa de 2026.'::text),
      ('b2500dee-6d62-411d-aeb9-5f9842412fb2'::uuid, 'La relación concluyó en 2026. Para 2027, la Hermandad anunció a la Agrupación Musical Nuestro Padre Jesús Nazareno de La Algaba.'::text),
      ('804991f0-d84a-4029-83d8-554a4d8f2ee6'::uuid, 'La vinculación concluyó tras la Semana Santa de 2026.'::text),
      ('404dc862-9ad6-4923-a16e-2a1fe826b19c'::uuid, 'Abrió el cortejo el 12 de octubre de 2025, con Maestro Tejera tras la imagen. Su participación en 2026 sigue sin confirmarse.'::text)
  )
  select count(*) into v_found
  from public.music_accompaniment_periods period
  join editorial_copy copy on copy.id = period.id
  where period.is_current = false
    and period.status = 'published';

  if v_found <> v_expected then
    raise exception 'Se esperaban % acompañamientos históricos publicados y se encontraron %', v_expected, v_found;
  end if;

  with editorial_copy(id, notes) as (
    values
      ('92add179-7ff1-4634-9739-fcaaacad39fc'::uuid, 'La vinculación concluyó tras la Semana Santa de 2026.'::text),
      ('279dc0a1-4058-43bf-89b3-3b137d527c01'::uuid, 'La relación con la Hermandad de las Viñas concluyó tras la Semana Santa de 2026.'::text),
      ('3833522e-5017-4d0c-948d-d74a565acf02'::uuid, null::text),
      ('86913154-ccce-4a25-ad2c-5df04944c333'::uuid, 'Primera etapa de la vinculación con San Esteban.'::text),
      ('6793150a-0e4b-41d3-ab3d-84d897ce2c31'::uuid, 'Primera etapa de la vinculación con Jesús Despojado.'::text),
      ('dd0ae1ea-597d-4703-9263-b0631f053207'::uuid, 'Primera etapa de la vinculación con La Resurrección.'::text),
      ('36597ce8-bac5-4153-8040-1d04c4bee5fd'::uuid, 'La Banda Municipal de Coria del Río tomará el relevo en 2027.'::text),
      ('a9562180-be62-4a83-bf1e-b7651795cbc3'::uuid, 'La relación comenzó en 2009 tras María Santísima Madre de los Desamparados y se mantuvo hasta 2020.'::text),
      ('c5769df7-af1d-4d65-816c-da77e505b30b'::uuid, 'La relación concluyó en 2025. AMUECI tomó el relevo en 2026 y renovó después por tres años.'::text),
      ('30545f53-7068-4e6e-8ee9-646b12f6ea3c'::uuid, 'Segunda etapa de la vinculación con San Bernardo, anterior al periodo actual.'::text),
      ('a1af7d1a-b6d3-441b-aa69-09d4f493de52'::uuid, 'Primera etapa de la vinculación bajo la denominación Cruz Roja.'::text),
      ('3d083966-014e-4faf-8f46-1f8a743abc51'::uuid, 'La formación participó en las fiestas de la Santa Cruz del Cerrillo el 30 de mayo de 2026.'::text),
      ('252049b2-72fb-4ca8-8d40-d7a62bc39720'::uuid, 'La formación participó en el Día del Romero el 31 de mayo de 2026.'::text),
      ('b081f8eb-b21c-4d9f-afb4-a16d84c2f9fc'::uuid, 'La Redención acompañó a la Hermandad hasta 2025. La fecha de inicio sigue pendiente de precisar.'::text),
      ('b358702e-6f84-4550-b8ac-372b57e2e0a9'::uuid, 'La Redención acompañó a la Hermandad hasta 2025. La fecha de inicio sigue pendiente de precisar.'::text),
      ('a08ea143-6656-4922-bbec-55786a1194ea'::uuid, 'La relación concluyó en 2026; la Hermandad anunció otra formación para 2027.'::text),
      ('b0217fb0-4e10-4a1e-9283-a0f77e678310'::uuid, 'La relación concluyó tras el Lunes Santo de 2026.'::text),
      ('0f91f98c-ce6b-4a7b-b048-8b4d2a710e53'::uuid, 'La participación de 2026 no tiene continuidad confirmada para 2027.'::text),
      ('23001159-a7df-42b3-839f-4ae24121a1d6'::uuid, 'La vinculación se mantuvo durante 33 Semanas Santas, desde 1991 hasta 2023.'::text),
      ('211fbef3-7524-4d6d-b312-6ba5685ef658'::uuid, 'La relación se mantuvo desde 1992 hasta la Semana Santa de 2023.'::text),
      ('7b353ce2-95f1-489b-9d7f-cea9e1aeecee'::uuid, 'Tres Semanas Santas de vinculación: 1997, 1998 y 1999.'::text),
      ('32bb1f16-0388-4db3-8020-5a1d6831f4c1'::uuid, 'Acompañó al Santísimo Cristo de la Sangre en 1995 y 1996.'::text),
      ('1b5b079c-58c5-4b2e-934d-dc81707ec293'::uuid, null::text),
      ('f06810c7-f8b7-413a-9626-1d19a67893f7'::uuid, null::text),
      ('259e0f99-5645-4251-8695-129637ab0ed8'::uuid, 'Fue el primer Domingo de Ramos de la formación.'::text),
      ('2cd0ad54-fb6e-4e64-978c-aabbf97a543d'::uuid, null::text),
      ('ac20d49f-f09b-4e42-a0e7-288b69f87fc7'::uuid, null::text),
      ('a5cdcae8-f2d2-4b6b-9f2a-1acfd2c833df'::uuid, 'La sexta participación desde 2020 cerró esta etapa en 2026.'::text),
      ('830628cd-d6d6-40be-90e1-5fb8dc98633a'::uuid, null::text),
      ('557002cc-ac7f-4f09-b185-a86b5aa71b47'::uuid, 'Entre 1993 y 1996 abrió el cortejo de San Benito. Desde 1997 acompaña al Santísimo Cristo de la Sangre.'::text),
      ('15d76d63-12da-4019-a45d-8690b466033a'::uuid, 'La vinculación concluyó tras la Semana Santa de 2026.'::text),
      ('b2500dee-6d62-411d-aeb9-5f9842412fb2'::uuid, 'La relación concluyó en 2026. Para 2027, la Hermandad anunció a la Agrupación Musical Nuestro Padre Jesús Nazareno de La Algaba.'::text),
      ('804991f0-d84a-4029-83d8-554a4d8f2ee6'::uuid, 'La vinculación concluyó tras la Semana Santa de 2026.'::text),
      ('404dc862-9ad6-4923-a16e-2a1fe826b19c'::uuid, 'Abrió el cortejo el 12 de octubre de 2025, con Maestro Tejera tras la imagen. Su participación en 2026 sigue sin confirmarse.'::text)
  )
  update public.music_accompaniment_periods period
  set notes = copy.notes,
      updated_at = now()
  from editorial_copy copy
  where period.id = copy.id
    and period.is_current = false
    and period.status = 'published';

  get diagnostics v_updated = row_count;
  if v_updated <> v_expected then
    raise exception 'Se esperaban % acompañamientos actualizados y se actualizaron %', v_expected, v_updated;
  end if;
end
$$;

commit;
