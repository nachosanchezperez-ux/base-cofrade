begin;

drop policy if exists "Public source links" on public.source_links;

create policy "Public source links"
on public.source_links
for select
to anon, authenticated
using (
  num_nonnulls(
    source_links.entity_id,
    source_links.outing_id,
    source_links.cult_id,
    source_links.intervention_id,
    source_links.heritage_update_id,
    source_links.editorial_content_id,
    source_links.music_accompaniment_period_id,
    source_links.march_dedication_id,
    source_links.march_recording_id,
    source_links.image_authorship_id,
    source_links.brotherhood_image_id,
    source_links.entity_location_id,
    source_links.entity_relation_id,
    source_links.step_phase_id,
    source_links.step_personnel_period_id,
    source_links.brotherhood_step_id,
    source_links.image_step_id,
    source_links.agent_name_id,
    source_links.agent_role_id,
    source_links.cult_occurrence_id,
    source_links.outing_music_position_id,
    source_links.outing_music_assignment_id,
    source_links.outing_series_id,
    source_links.band_premiere_id,
    source_links.brotherhood_habit_id
  ) = 1
  and case
    when source_links.entity_id is not null then
      exists (select 1 from public.entities target where target.id = source_links.entity_id)
    when source_links.outing_id is not null then
      exists (select 1 from public.outings target where target.id = source_links.outing_id)
    when source_links.cult_id is not null then
      exists (select 1 from public.cults target where target.id = source_links.cult_id)
    when source_links.intervention_id is not null then
      exists (select 1 from public.heritage_interventions target where target.id = source_links.intervention_id)
    when source_links.heritage_update_id is not null then
      exists (select 1 from public.heritage_updates target where target.id = source_links.heritage_update_id)
    when source_links.editorial_content_id is not null then
      exists (select 1 from public.editorial_content target where target.id = source_links.editorial_content_id)
    when source_links.music_accompaniment_period_id is not null then
      exists (select 1 from public.music_accompaniment_periods target where target.id = source_links.music_accompaniment_period_id)
    when source_links.march_dedication_id is not null then
      exists (select 1 from public.march_dedications target where target.id = source_links.march_dedication_id)
    when source_links.march_recording_id is not null then
      exists (select 1 from public.march_recordings target where target.id = source_links.march_recording_id)
    when source_links.image_authorship_id is not null then
      exists (select 1 from public.image_authorships target where target.id = source_links.image_authorship_id)
    when source_links.brotherhood_image_id is not null then
      exists (select 1 from public.brotherhood_images target where target.id = source_links.brotherhood_image_id)
    when source_links.entity_location_id is not null then
      exists (select 1 from public.entity_locations target where target.id = source_links.entity_location_id)
    when source_links.entity_relation_id is not null then
      exists (select 1 from public.entity_relations target where target.id = source_links.entity_relation_id)
    when source_links.step_phase_id is not null then
      exists (select 1 from public.step_phases target where target.id = source_links.step_phase_id)
    when source_links.step_personnel_period_id is not null then
      exists (select 1 from public.step_personnel_periods target where target.id = source_links.step_personnel_period_id)
    when source_links.brotherhood_step_id is not null then
      exists (select 1 from public.brotherhood_steps target where target.id = source_links.brotherhood_step_id)
    when source_links.image_step_id is not null then
      exists (select 1 from public.image_steps target where target.id = source_links.image_step_id)
    when source_links.agent_name_id is not null then
      exists (select 1 from public.agent_names target where target.id = source_links.agent_name_id)
    when source_links.agent_role_id is not null then
      exists (select 1 from public.agent_roles target where target.id = source_links.agent_role_id)
    when source_links.cult_occurrence_id is not null then
      exists (select 1 from public.cult_occurrences target where target.id = source_links.cult_occurrence_id)
    when source_links.outing_music_position_id is not null then
      exists (select 1 from public.outing_music_positions target where target.id = source_links.outing_music_position_id)
    when source_links.outing_music_assignment_id is not null then
      exists (select 1 from public.outing_music_assignments target where target.id = source_links.outing_music_assignment_id)
    when source_links.outing_series_id is not null then
      exists (select 1 from public.outing_series target where target.id = source_links.outing_series_id)
    when source_links.band_premiere_id is not null then
      exists (select 1 from public.band_premieres target where target.id = source_links.band_premiere_id)
    when source_links.brotherhood_habit_id is not null then
      exists (select 1 from public.brotherhood_habits target where target.id = source_links.brotherhood_habit_id)
    else false
  end
);

comment on policy "Public source links" on public.source_links is
  'Expone un enlace documental solo cuando tiene un único objetivo y ese objetivo es visible mediante su propia RLS pública.';

commit;
