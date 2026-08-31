do $$
declare
  view_name text;
begin
  foreach view_name in array array[
    'advocation_images','agent_activity','agent_profile_summary',
    'brotherhood_completeness','brotherhood_completeness_signals',
    'calendar_cult_days','calendar_items','calendar_outings',
    'current_image_locations','current_music_accompaniments',
    'current_step_elements','current_step_personnel',
    'daily_editorial_candidates','daily_march_candidates',
    'image_authorship_details','image_brotherhood_history',
    'image_restorations','marches_with_dedications','outing_music_details',
    'published_band_colors','published_brotherhood_colors',
    'step_brotherhood_history','step_image_history','step_phase_details',
    'today_calendar_items','today_ephemeris_candidates',
    'upcoming_calendar_items','upcoming_extraordinary_outings'
  ]
  loop
    execute format('alter view public.%I set (security_invoker = true)', view_name);
  end loop;
end $$;

alter function public.set_updated_at() set search_path = '';
alter function public.guard_entity_relation_publication() set search_path = '';
