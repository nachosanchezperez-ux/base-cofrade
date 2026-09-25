-- RECONCILIACIÓN STAGING POST-APPLY · HC-016 · CARMONA
-- DML SOLO SOBRE bulk_imports / bulk_import_items.
-- EJECUTAR ÚNICAMENTE DESPUÉS DE APPLY AUTORIZADO + QA POST-APPLY VERDE.

begin;

do $$
begin
  if (select count(*) from public.entities where id::text like 'c0160035-%') <> 75 then raise exception 'carmona_post_apply_entities_not_ready'; end if;
  if (select count(*) from public.outings where id::text like 'c0160035-%') <> 11 then raise exception 'carmona_post_apply_outings_not_ready'; end if;
  if (select count(*) from public.source_links where id::text like 'c0160035-%') <> 129 then raise exception 'carmona_post_apply_source_links_not_ready'; end if;
  if not exists (
    select 1 from public.outings
    where id='ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218'
      and event_status='held'
      and brotherhood_entity_id='c0160035-0301-4000-8000-000000000001'
  ) then raise exception 'carmona_post_apply_servitas_not_ready'; end if;
end $$;

update public.bulk_import_items
set
  status='applied',
  result=jsonb_build_object(
    'applied',true,
    'apply_marker','APPLY_CARMONA_SQL_OK_COMMITTED',
    'payload_commit','8ffd1ccf82c32979765ac253cea5854bbf6dd2f0'
  ),
  applied_at=now(),
  updated_at=now()
where import_id='c0160035-0000-4000-8000-000000000001'
  and status='valid';

update public.bulk_imports
set
  status='completed',
  applied_items=530,
  failed_items=0,
  completed_at=now(),
  updated_at=now(),
  metadata=metadata || jsonb_build_object(
    'phase','completed',
    'apply_result','APPLY_CARMONA_SQL_OK_COMMITTED',
    'applied_dml',530,
    'applied_at',now(),
    'post_apply_qa','PASS'
  )
where id='c0160035-0000-4000-8000-000000000001'
  and status='ready'
  and valid_items=530
  and invalid_items=0
  and applied_items=0;

do $$
begin
  if not exists (
    select 1 from public.bulk_imports
    where id='c0160035-0000-4000-8000-000000000001'
      and status='completed'
      and applied_items=530
      and failed_items=0
  ) then raise exception 'carmona_staging_reconciliation_failed'; end if;
end $$;

commit;

select 'RECONCILE_CARMONA_STAGING_OK_COMMITTED' as result, 530 as applied_items;
