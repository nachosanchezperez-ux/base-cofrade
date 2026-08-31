-- Hilo Cofrade First Edition schema baseline
-- Generated from canonical production schema on 2026-08-31.
-- Excludes production rows, Auth users, audit data and public contributions.
set statement_timeout = 0;
set lock_timeout = 0;
set client_min_messages = warning;

create table public.municipalities (
  id uuid default gen_random_uuid() not null,
  name text not null,
  slug text not null,
  province text default 'Sevilla'::text not null,
  autonomous_community text default 'Andalucía'::text not null,
  country text default 'España'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.places (
  id uuid default gen_random_uuid() not null,
  municipality_id uuid,
  name text not null,
  slug text,
  place_type text,
  address text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  opening_hours_text text,
  opening_hours_verified_at date
);

create table public.entities (
  id uuid default gen_random_uuid() not null,
  entity_type text not null,
  name text not null,
  slug text,
  summary text,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.brotherhoods (
  entity_id uuid not null,
  official_name text not null,
  popular_name text not null,
  foundation_text text,
  municipality_id uuid,
  canonical_see_place_id uuid,
  neighborhood text,
  website_url text,
  instagram_url text,
  crest_path text,
  brotherhood_types text[] default '{}'::text[] not null,
  current_procession_day text,
  notes text,
  history_text text
);

create table public.advocations (
  entity_id uuid not null,
  advocation_type text,
  description text
);

create table public.images (
  entity_id uuid not null,
  advocation_entity_id uuid,
  image_type text,
  execution_date date,
  execution_date_text text,
  material text,
  current_condition text,
  description text,
  notes text,
  technique text,
  polychromy text,
  dimensions_text text,
  height_cm numeric(7,2),
  width_cm numeric(7,2),
  depth_cm numeric(7,2),
  iconography text,
  anatomical_type text,
  is_dress_image boolean,
  current_state_notes text
);

create table public.brotherhood_images (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  image_entity_id uuid not null,
  relation_type text default 'titular'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.agents (
  entity_id uuid not null,
  agent_kind text not null,
  municipality_id uuid,
  foundation_or_birth_text text,
  death_or_end_text text,
  website_url text,
  instagram_url text,
  description text,
  birth_or_foundation_date date,
  death_or_end_date date,
  address text,
  email text,
  phone text,
  active_notes text
);

create table public.agent_roles (
  id uuid default gen_random_uuid() not null,
  agent_entity_id uuid not null,
  role_name text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text
);

create table public.steps (
  entity_id uuid not null,
  step_type text,
  current_condition text,
  description text,
  notes text,
  style text,
  materials text,
  dimensions_text text,
  length_cm numeric(8,2),
  width_cm numeric(8,2),
  height_cm numeric(8,2),
  workbenches_count integer,
  carrier_system text,
  execution_date_text text,
  current_state_notes text
);

create table public.brotherhood_steps (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  step_entity_id uuid not null,
  relation_type text default 'processional_step'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.image_steps (
  id uuid default gen_random_uuid() not null,
  image_entity_id uuid not null,
  step_entity_id uuid not null,
  relation_type text default 'processes_on'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.entity_relations (
  id uuid default gen_random_uuid() not null,
  source_entity_id uuid not null,
  relation_type text not null,
  target_entity_id uuid not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.entity_locations (
  id uuid default gen_random_uuid() not null,
  entity_id uuid not null,
  place_id uuid,
  municipality_id uuid,
  custodian_entity_id uuid,
  location_type text default 'physical_location'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean default false not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.heritage_assets (
  entity_id uuid not null,
  parent_entity_id uuid,
  asset_type text,
  description text,
  current_condition text,
  notes text,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean default true not null,
  origin_notes text,
  technique text,
  materials text,
  dimensions_text text,
  iconography text,
  historical_context text,
  provenance_text text,
  blessing_date date,
  blessing_date_text text,
  display_order integer default 0 not null,
  is_featured boolean default false not null,
  public_image_path text,
  public_image_alt text,
  public_image_credit text,
  usage_text text
);

create table public.heritage_interventions (
  id uuid default gen_random_uuid() not null,
  target_entity_id uuid not null,
  agent_entity_id uuid,
  discipline text not null,
  element_name text,
  intervention_type text,
  phase text,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  description text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  step_phase_id uuid
);

create table public.bands (
  entity_id uuid not null,
  band_type text,
  municipality_id uuid,
  foundation_text text,
  website_url text,
  instagram_url text,
  description text,
  primary_color text,
  secondary_color text,
  logo_path text,
  hero_image_path text,
  hero_image_alt text,
  hero_image_credit text,
  linked_brotherhood_name text,
  headquarters_text text,
  youtube_url text,
  banderin_entity_id uuid
);

create table public.marches (
  entity_id uuid not null,
  composition_year integer,
  composition_date_text text,
  music_type text,
  youtube_video_id text,
  description text,
  eligible_for_daily boolean default true not null,
  daily_priority smallint default 0 not null,
  premiere_date date,
  premiere_date_text text,
  premiere_place_id uuid,
  premiered_by_band_entity_id uuid,
  score_reference text,
  notes text,
  work_type text default 'Marcha procesional'::text not null
);

create table public.march_authors (
  id uuid default gen_random_uuid() not null,
  march_entity_id uuid not null,
  agent_entity_id uuid not null,
  author_role text default 'composer'::text not null,
  notes text,
  status text default 'published'::text not null
);

create table public.outings (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid,
  outing_type text not null,
  "character" text default 'ordinary'::text not null,
  title text,
  outing_date date,
  year integer,
  departure_time time without time zone,
  return_time time without time zone,
  municipality_id uuid,
  origin_place_id uuid,
  destination_place_id uuid,
  reason text,
  route jsonb,
  description text,
  event_status text default 'announced'::text not null,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  return_date date,
  route_summary text,
  public_notes text,
  organizer_name text,
  organizer_notes text,
  outing_series_id uuid,
  hero_image_path text,
  hero_image_alt text,
  hero_image_credit text,
  slug text,
  reference_code text,
  origin_text text,
  destination_text text
);

create table public.outing_entities (
  id uuid default gen_random_uuid() not null,
  outing_id uuid not null,
  entity_id uuid not null,
  role text not null,
  notes text
);

create table public.accompaniments (
  id uuid default gen_random_uuid() not null,
  outing_id uuid not null,
  band_entity_id uuid not null,
  step_entity_id uuid,
  "position" text not null,
  year integer,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.cults (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  image_entity_id uuid,
  cult_type text not null,
  title text not null,
  cult_date date,
  date_rule text,
  month smallint,
  time_text text,
  place_id uuid,
  description text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  is_recurring boolean default true not null,
  recurrence_label text,
  display_order integer,
  notes text
);

create table public.events (
  entity_id uuid not null,
  event_type text not null,
  event_date date,
  event_date_text text,
  place_id uuid,
  description text,
  event_category text default 'historical'::text not null,
  brotherhood_entity_id uuid,
  municipality_id uuid,
  start_time time without time zone,
  end_time time without time zone,
  time_text text,
  event_status text default 'announced'::text not null,
  location_text text,
  requirements text,
  public_notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.sources (
  id uuid default gen_random_uuid() not null,
  name text not null,
  url text,
  source_type text not null,
  author_or_publisher text,
  publication_date date,
  accessed_at date,
  license text,
  notes text,
  created_at timestamp with time zone default now() not null
);

create table public.source_links (
  id uuid default gen_random_uuid() not null,
  source_id uuid not null,
  entity_id uuid,
  outing_id uuid,
  cult_id uuid,
  intervention_id uuid,
  scope text,
  notes text,
  created_at timestamp with time zone default now() not null,
  heritage_update_id uuid,
  editorial_content_id uuid,
  music_accompaniment_period_id uuid,
  march_dedication_id uuid,
  march_recording_id uuid,
  image_authorship_id uuid,
  brotherhood_image_id uuid,
  entity_location_id uuid,
  entity_relation_id uuid,
  step_phase_id uuid,
  step_personnel_period_id uuid,
  brotherhood_step_id uuid,
  image_step_id uuid,
  agent_name_id uuid,
  agent_role_id uuid,
  cult_occurrence_id uuid,
  outing_music_position_id uuid,
  outing_music_assignment_id uuid,
  outing_series_id uuid,
  band_premiere_id uuid,
  brotherhood_habit_id uuid
);

create table public.daily_overrides (
  id uuid default gen_random_uuid() not null,
  publish_date date not null,
  content_type text not null,
  title text,
  summary text,
  entity_id uuid,
  sort_order smallint default 0 not null,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  editorial_content_id uuid,
  march_entity_id uuid,
  event_entity_id uuid,
  reason text
);

create table public.contributions (
  id uuid default gen_random_uuid() not null,
  contribution_type text not null,
  entity_id uuid,
  title text,
  description text not null,
  source_url text,
  contact_name text,
  contact_email text,
  status text default 'pending'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.heritage_updates (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  update_type text not null,
  title text not null,
  update_date date,
  year integer,
  target_entity_id uuid,
  element_name text,
  discipline text,
  description text,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.heritage_update_agents (
  id uuid default gen_random_uuid() not null,
  heritage_update_id uuid not null,
  agent_entity_id uuid not null,
  role_name text not null,
  discipline text,
  notes text
);

create table public.editorial_content (
  id uuid default gen_random_uuid() not null,
  content_type text not null,
  title text not null,
  subtitle text,
  summary text,
  body text,
  publish_date date,
  author_name text,
  cover_image_path text,
  eligible_for_daily boolean default false not null,
  daily_priority smallint default 0 not null,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.editorial_content_links (
  id uuid default gen_random_uuid() not null,
  editorial_content_id uuid not null,
  entity_id uuid not null,
  relation_type text default 'related'::text not null,
  is_primary boolean default false not null,
  notes text
);

create table public.media_assets (
  id uuid default gen_random_uuid() not null,
  storage_path text not null,
  media_type text not null,
  title text,
  caption text,
  alt_text text,
  author_name text,
  source_name text,
  source_url text,
  rights_status text default 'pending'::text not null,
  rights_holder text,
  license text,
  permission_notes text,
  taken_or_created_date date,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  width_px integer,
  height_px integer
);

create table public.entity_media (
  id uuid default gen_random_uuid() not null,
  entity_id uuid not null,
  media_asset_id uuid not null,
  relation_type text default 'gallery'::text not null,
  sort_order integer default 0 not null,
  is_cover boolean default false not null,
  notes text,
  focus_x numeric(5,2) default 50 not null,
  focus_y numeric(5,2) default 50 not null,
  mobile_focus_x numeric(5,2),
  mobile_focus_y numeric(5,2),
  fit_mode text default 'auto'::text not null
);

create table public.audit_log (
  id uuid default gen_random_uuid() not null,
  actor_user_id uuid,
  actor_label text,
  action_type text not null,
  object_type text not null,
  object_id uuid,
  entity_id uuid,
  summary text not null,
  changed_fields jsonb,
  created_at timestamp with time zone default now() not null
);

create table public.completeness_rules (
  id uuid default gen_random_uuid() not null,
  entity_type text not null,
  rule_key text not null,
  label text not null,
  section_name text not null,
  weight smallint default 1 not null,
  active boolean default true not null,
  sort_order integer default 0 not null
);

create table public.band_names (
  id uuid default gen_random_uuid() not null,
  band_entity_id uuid not null,
  name text not null,
  short_name text,
  name_type text default 'official'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean default false not null,
  notes text,
  created_at timestamp with time zone default now() not null
);

create table public.band_agents (
  id uuid default gen_random_uuid() not null,
  band_entity_id uuid not null,
  agent_entity_id uuid not null,
  role_name text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean default false not null,
  notes text,
  created_at timestamp with time zone default now() not null,
  is_public boolean default true not null
);

create table public.music_accompaniment_periods (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  band_entity_id uuid not null,
  step_entity_id uuid,
  "position" text not null,
  outing_type text,
  date_from date,
  date_from_text text,
  year_from integer,
  date_to date,
  date_to_text text,
  year_to integer,
  is_current boolean default false not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  public_brotherhood_name text,
  public_step_name text,
  public_brotherhood_slug text,
  public_municipality_name text,
  public_municipality_slug text,
  public_province text
);

create table public.march_dedications (
  id uuid default gen_random_uuid() not null,
  march_entity_id uuid not null,
  dedicatee_entity_id uuid not null,
  dedication_type text default 'dedicated_to'::text not null,
  dedication_text text,
  date_from date,
  date_from_text text,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.march_recordings (
  id uuid default gen_random_uuid() not null,
  march_entity_id uuid not null,
  band_entity_id uuid,
  recording_date date,
  recording_date_text text,
  place_id uuid,
  youtube_video_id text,
  external_url text,
  title text,
  notes text,
  is_featured boolean default false not null,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.image_authorships (
  id uuid default gen_random_uuid() not null,
  image_entity_id uuid not null,
  agent_entity_id uuid,
  authorship_type text not null,
  role_name text default 'autor'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  certainty text default 'documented'::text not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.image_names (
  id uuid default gen_random_uuid() not null,
  image_entity_id uuid not null,
  name text not null,
  name_type text default 'popular'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean default false not null,
  notes text,
  created_at timestamp with time zone default now() not null
);

create table public.step_phases (
  id uuid default gen_random_uuid() not null,
  step_entity_id uuid not null,
  phase_name text not null,
  phase_type text,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  description text,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.step_phase_agents (
  id uuid default gen_random_uuid() not null,
  step_phase_id uuid not null,
  agent_entity_id uuid not null,
  discipline text not null,
  role_name text,
  element_entity_id uuid,
  notes text
);

create table public.step_personnel_periods (
  id uuid default gen_random_uuid() not null,
  step_entity_id uuid not null,
  agent_entity_id uuid not null,
  role_name text not null,
  date_from date,
  date_from_text text,
  year_from integer,
  date_to date,
  date_to_text text,
  year_to integer,
  is_current boolean default false not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.agent_names (
  id uuid default gen_random_uuid() not null,
  agent_entity_id uuid not null,
  name text not null,
  name_type text default 'official'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean default false not null,
  notes text,
  created_at timestamp with time zone default now() not null
);

create table public.agent_disciplines (
  id uuid default gen_random_uuid() not null,
  agent_entity_id uuid not null,
  discipline text not null,
  is_primary boolean default false not null,
  notes text
);

create table public.cult_entities (
  id uuid default gen_random_uuid() not null,
  cult_id uuid not null,
  entity_id uuid not null,
  role text default 'honoree'::text not null,
  notes text,
  created_at timestamp with time zone default now() not null
);

create table public.cult_occurrences (
  id uuid default gen_random_uuid() not null,
  cult_id uuid not null,
  year integer,
  title_override text,
  start_date date not null,
  end_date date,
  place_id uuid,
  description_override text,
  event_status text default 'announced'::text not null,
  status text default 'published'::text not null,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.cult_occurrence_days (
  id uuid default gen_random_uuid() not null,
  cult_occurrence_id uuid not null,
  day_number integer,
  day_label text,
  celebration_date date not null,
  start_time time without time zone,
  time_text text,
  place_id uuid,
  notes text,
  created_at timestamp with time zone default now() not null
);

create table public.outing_route_points (
  id uuid default gen_random_uuid() not null,
  outing_id uuid not null,
  sequence_no integer not null,
  point_type text default 'street'::text not null,
  label text not null,
  place_id uuid,
  planned_time time without time zone,
  notes text,
  created_at timestamp with time zone default now() not null
);

create table public.outing_schedule_items (
  id uuid default gen_random_uuid() not null,
  outing_id uuid not null,
  sequence_no integer not null,
  label text not null,
  item_date date,
  item_time time without time zone,
  time_text text,
  place_id uuid,
  notes text,
  created_at timestamp with time zone default now() not null,
  place_text text
);

create table public.outing_music_positions (
  id uuid default gen_random_uuid() not null,
  outing_id uuid not null,
  step_entity_id uuid,
  position_code text not null,
  position_label text,
  sequence_no integer default 1 not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.outing_music_assignments (
  id uuid default gen_random_uuid() not null,
  music_position_id uuid not null,
  band_entity_id uuid,
  participation_mode text default 'full_route'::text not null,
  sequence_no integer default 1 not null,
  segment_start_label text,
  segment_end_label text,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  band_name_text text
);

create table public.brotherhood_colors (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  color_name text not null,
  hex_value text,
  color_role text default 'identity'::text not null,
  sort_order smallint default 0 not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.outing_series (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  outing_type text not null,
  "character" text default 'ordinary'::text not null,
  title text not null,
  month smallint,
  date_rule text,
  time_text text,
  municipality_id uuid,
  origin_place_id uuid,
  destination_place_id uuid,
  route_summary text,
  description text,
  display_order integer,
  status text default 'published'::text not null,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.outing_series_movements (
  id uuid default gen_random_uuid() not null,
  outing_series_id uuid not null,
  sequence_no integer not null,
  direction text not null,
  date_rule text,
  time_text text,
  origin_place_id uuid,
  destination_place_id uuid,
  route_summary text,
  description text,
  created_at timestamp with time zone default now() not null
);

create table public.panel_users (
  user_id uuid not null,
  display_name text not null,
  role text default 'collaborator'::text not null,
  active boolean default true not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.entity_social_links (
  id uuid default gen_random_uuid() not null,
  entity_id uuid not null,
  platform text not null,
  url text not null,
  label text,
  display_order smallint default 0 not null,
  is_public boolean default true not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.band_premieres (
  id uuid default gen_random_uuid() not null,
  band_entity_id uuid not null,
  title text not null,
  composer_name text not null,
  premiere_year integer not null,
  premiere_date date,
  venue_text text,
  municipality_text text,
  video_url text,
  description text,
  source_id uuid,
  status text default 'draft'::text not null,
  display_order integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  march_entity_id uuid
);

create table public.band_releases (
  id uuid default gen_random_uuid() not null,
  band_entity_id uuid not null,
  title text not null,
  release_type text default 'album'::text not null,
  release_year integer,
  release_date date,
  release_date_text text,
  ordinal_number integer,
  description text,
  cover_image_path text,
  cover_image_alt text,
  cover_image_credit text,
  spotify_url text,
  external_url text,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.band_release_tracks (
  id uuid default gen_random_uuid() not null,
  release_id uuid not null,
  sequence_no integer not null,
  title text not null,
  march_entity_id uuid,
  duration_text text,
  notes text,
  created_at timestamp with time zone default now() not null,
  spotify_url text
);

create table public.band_release_sources (
  release_id uuid not null,
  source_id uuid not null,
  scope text,
  created_at timestamp with time zone default now() not null
);

create table public.document_imports (
  id uuid default gen_random_uuid() not null,
  target_entity_id uuid,
  source_id uuid,
  source_url text not null,
  source_title text,
  status text default 'review'::text not null,
  analysis_version integer default 1 not null,
  analysis jsonb default '{}'::jsonb not null,
  application_summary jsonb,
  model_name text,
  content_sha256 text,
  fetched_at timestamp with time zone,
  applied_at timestamp with time zone,
  error_text text,
  created_by uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.band_colors (
  id uuid default gen_random_uuid() not null,
  band_entity_id uuid not null,
  color_name text not null,
  hex_value text,
  color_role text default 'identity'::text not null,
  sort_order smallint default 0 not null,
  notes text,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.brotherhood_habits (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  name text not null,
  tunic_description text,
  hood_description text,
  cord_description text,
  buttons_description text,
  shield_description text,
  footwear_description text,
  image_path text,
  image_alt text,
  sort_order smallint default 0 not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.brotherhood_procession_stats (
  id uuid default gen_random_uuid() not null,
  brotherhood_entity_id uuid not null,
  year smallint not null,
  procession_date date,
  procession_day text,
  nazarenos_count integer,
  penitents_count integer,
  total_nazarenos_count integer,
  acolytes_count integer,
  monaguillos_count integer,
  musical_accompaniment_count integer,
  total_procession_count integer,
  position_by_nazarenos smallint,
  position_by_procession smallint,
  brotherhoods_in_day smallint,
  official_route_duration_minutes integer,
  official_career_duration_minutes integer,
  departure_time time without time zone,
  entrance_time time without time zone,
  source_id uuid,
  status text default 'published'::text not null,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.brotherhood_section_authority (
  brotherhood_entity_id uuid not null,
  section_key text not null,
  source text default 'panel'::text not null,
  managed_at timestamp with time zone default now() not null
);

create table public.outing_media (
  id uuid default gen_random_uuid() not null,
  outing_id uuid not null,
  media_asset_id uuid not null,
  role text not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.bulk_imports (
  id uuid default gen_random_uuid() not null,
  label text not null,
  source_name text,
  source_format text default 'json'::text not null,
  status text default 'staging'::text not null,
  expected_items integer default 0 not null,
  staged_items integer default 0 not null,
  valid_items integer default 0 not null,
  invalid_items integer default 0 not null,
  applied_items integer default 0 not null,
  failed_items integer default 0 not null,
  metadata jsonb default '{}'::jsonb not null,
  created_by uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  completed_at timestamp with time zone
);

create table public.bulk_import_items (
  id uuid default gen_random_uuid() not null,
  import_id uuid not null,
  "position" integer not null,
  table_name text not null,
  operation text default 'insert'::text not null,
  priority smallint default 100 not null,
  record jsonb not null,
  status text default 'valid'::text not null,
  validation_errors jsonb default '[]'::jsonb not null,
  error_text text,
  result jsonb,
  applied_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.entity_names (
  id uuid default gen_random_uuid() not null,
  entity_id uuid not null,
  name text not null,
  name_type text default 'alternative'::text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean default true not null,
  notes text,
  status text default 'published'::text not null,
  created_at timestamp with time zone default now() not null
);

create table public.cult_media (
  id uuid default gen_random_uuid() not null,
  cult_id uuid not null,
  media_asset_id uuid not null,
  role text default 'gallery'::text not null,
  sort_order integer default 0 not null,
  is_cover boolean default false not null,
  focus_x numeric default 50 not null,
  focus_y numeric default 50 not null,
  mobile_focus_x numeric,
  mobile_focus_y numeric,
  fit_mode text default 'cover'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.legal_drafts (
  id uuid default gen_random_uuid() not null,
  document_key text not null,
  title text not null,
  body text default ''::text not null,
  status text default 'draft'::text not null,
  internal_notes text,
  updated_by uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.crew_event_steps (
  id uuid default gen_random_uuid() not null,
  event_entity_id uuid not null,
  step_entity_id uuid not null,
  is_primary boolean default false not null,
  sort_order integer default 0 not null,
  notes text,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table public.crew_event_agents (
  id uuid default gen_random_uuid() not null,
  event_entity_id uuid not null,
  agent_entity_id uuid not null,
  role_name text default 'Capataz'::text not null,
  is_primary boolean default false not null,
  sort_order integer default 0 not null,
  notes text,
  status text default 'draft'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.current_panel_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select profile.role
  from public.panel_users as profile
  where profile.user_id = (select auth.uid())
    and profile.active = true
  limit 1
$function$
;

CREATE OR REPLACE FUNCTION public.is_panel_member()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select public.current_panel_role() is not null
$function$
;

CREATE OR REPLACE FUNCTION public.can_edit_panel()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select public.current_panel_role() in ('admin', 'editor')
$function$
;

CREATE OR REPLACE FUNCTION public.can_publish_panel()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select public.current_panel_role() in ('admin', 'editor')
$function$
;

CREATE OR REPLACE FUNCTION public.can_admin_panel()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select public.current_panel_role() = 'admin'
$function$
;

CREATE OR REPLACE FUNCTION public.guard_entity_relation_publication()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  source_status text;
  target_status text;
begin
  if new.status <> 'published' then
    return new;
  end if;

  select status into source_status
  from public.entities
  where id = new.source_entity_id;

  select status into target_status
  from public.entities
  where id = new.target_entity_id;

  if source_status is distinct from 'published'
     or target_status is distinct from 'published' then
    new.status := 'draft';
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.apply_document_import_core(p_import_id uuid, p_resolutions jsonb, p_relation_indexes integer[] DEFAULT '{}'::integer[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_import public.document_imports%rowtype;
  v_source_id uuid;
  v_source_title text;
  v_source_type text;
  v_source_publisher text;
  v_source_publication_text text;
  v_source_publication_date date;

  v_candidate jsonb;
  v_attribute jsonb;
  v_attributes jsonb;
  v_local_id text;
  v_resolution text;
  v_entity_id uuid;
  v_entity_type text;
  v_agent_kind text;
  v_mapping jsonb := '{}'::jsonb;

  v_relation jsonb;
  v_relation_index integer;
  v_source_ref text;
  v_target_ref text;
  v_source_entity_id uuid;
  v_target_entity_id uuid;
  v_source_entity_type text;
  v_target_entity_type text;
  v_relation_type text;
  v_relation_id uuid;
  v_relation_created boolean;

  v_created_entities integer := 0;
  v_reused_entities integer := 0;
  v_ignored_entities integer := 0;
  v_created_relations integer := 0;
  v_reused_relations integer := 0;
  v_skipped_relations integer := 0;
  v_summary jsonb;
begin
  if not public.can_edit_panel() then
    raise exception '049: el usuario no tiene permiso editorial';
  end if;

  select *
  into v_import
  from public.document_imports
  where id = p_import_id
  for update;

  if not found then
    raise exception '049: la importación no existe';
  end if;

  if v_import.status <> 'review' then
    raise exception '049: solo se puede aplicar una importación en revisión';
  end if;

  if v_import.target_entity_id is not null and not exists (
    select 1 from public.entities
    where id = v_import.target_entity_id
      and status <> 'archived'
  ) then
    raise exception '049: la entidad objetivo ya no está disponible';
  end if;

  -- ---------------------------------------------------------------------------
  -- Fuente reutilizable por URL
  -- ---------------------------------------------------------------------------

  v_source_title := nullif(v_import.analysis #>> '{source,title}', '');
  v_source_type := coalesce(nullif(v_import.analysis #>> '{source,source_type}', ''), 'website');
  v_source_publisher := nullif(v_import.analysis #>> '{source,publisher}', '');
  v_source_publication_text := nullif(v_import.analysis #>> '{source,publication_date}', '');

  if v_source_publication_text ~ '^\d{4}-\d{2}-\d{2}$' then
    begin
      v_source_publication_date := v_source_publication_text::date;
    exception when others then
      v_source_publication_date := null;
    end;
  end if;

  select id
  into v_source_id
  from public.sources
  where url = v_import.source_url
     or rtrim(url, '/') = rtrim(v_import.source_url, '/')
  order by created_at
  limit 1;

  if v_source_id is null then
    insert into public.sources (
      name,
      url,
      source_type,
      author_or_publisher,
      publication_date,
      accessed_at,
      notes
    ) values (
      coalesce(v_source_title, v_import.source_title, v_import.source_url),
      v_import.source_url,
      v_source_type,
      v_source_publisher,
      v_source_publication_date,
      current_date,
      'Fuente incorporada mediante Importador documental; revisar metadatos si procede.'
    )
    returning id into v_source_id;
  end if;

  -- ---------------------------------------------------------------------------
  -- Entidades aceptadas
  -- ---------------------------------------------------------------------------

  for v_candidate in
    select value
    from jsonb_array_elements(coalesce(v_import.analysis->'entities', '[]'::jsonb))
  loop
    v_local_id := v_candidate->>'local_id';
    v_entity_type := v_candidate->>'entity_type';
    v_resolution := p_resolutions->>v_local_id;
    v_entity_id := null;
    v_attributes := '{}'::jsonb;

    if v_resolution is null or v_resolution = '' or v_resolution = 'ignore' then
      v_ignored_entities := v_ignored_entities + 1;
      continue;
    end if;

    for v_attribute in
      select value
      from jsonb_array_elements(coalesce(v_candidate->'attributes', '[]'::jsonb))
    loop
      if nullif(v_attribute->>'key', '') is not null then
        v_attributes := v_attributes || jsonb_build_object(
          v_attribute->>'key',
          coalesce(v_attribute->>'value', '')
        );
      end if;
    end loop;

    if v_resolution like 'existing:%' then
      begin
        v_entity_id := substring(v_resolution from 10)::uuid;
      exception when others then
        raise exception '049: resolución inválida para %', v_local_id;
      end;

      if not exists (
        select 1 from public.entities
        where id = v_entity_id
          and entity_type = v_entity_type
          and status <> 'archived'
      ) then
        raise exception '049: la entidad existente elegida para % no coincide con el tipo esperado', v_local_id;
      end if;

      v_reused_entities := v_reused_entities + 1;

    elsif v_resolution = 'new' then
      if v_entity_type not in (
        'advocation',
        'image',
        'step',
        'agent',
        'band',
        'march',
        'heritage_asset'
      ) then
        raise exception '049: el MVP no permite crear automáticamente entidades de tipo %', v_entity_type;
      end if;

      if nullif(v_candidate->>'name', '') is null then
        raise exception '049: la entidad % no tiene nombre', v_local_id;
      end if;

      v_entity_id := gen_random_uuid();

      insert into public.entities (
        id,
        entity_type,
        name,
        slug,
        summary,
        status
      ) values (
        v_entity_id,
        v_entity_type,
        v_candidate->>'name',
        null,
        nullif(v_candidate->>'description', ''),
        'draft'
      );

      if v_entity_type = 'advocation' then
        insert into public.advocations (
          entity_id,
          advocation_type,
          description
        ) values (
          v_entity_id,
          nullif(v_attributes->>'advocation_type', ''),
          coalesce(
            nullif(v_candidate->>'description', ''),
            nullif(v_attributes->>'description', '')
          )
        );

      elsif v_entity_type = 'image' then
        insert into public.images (
          entity_id,
          image_type,
          execution_date_text,
          material,
          current_condition,
          description,
          notes
        ) values (
          v_entity_id,
          nullif(v_attributes->>'image_type', ''),
          coalesce(
            nullif(v_attributes->>'execution_date_text', ''),
            nullif(v_attributes->>'execution_date', '')
          ),
          nullif(v_attributes->>'material', ''),
          case
            when v_attributes->>'current_condition' in (
              'extant',
              'lost',
              'destroyed',
              'unknown'
            )
              then v_attributes->>'current_condition'
            else null
          end,
          coalesce(
            nullif(v_candidate->>'description', ''),
            nullif(v_attributes->>'description', '')
          ),
          'Borrador creado mediante Importador documental.'
        );

      elsif v_entity_type = 'step' then
        insert into public.steps (
          entity_id,
          step_type,
          current_condition,
          description,
          notes
        ) values (
          v_entity_id,
          nullif(v_attributes->>'step_type', ''),
          case
            when v_attributes->>'current_condition' in (
              'in_use',
              'stored',
              'transferred',
              'sold',
              'dismantled',
              'partially_preserved',
              'lost',
              'unknown'
            )
              then v_attributes->>'current_condition'
            else null
          end,
          coalesce(
            nullif(v_candidate->>'description', ''),
            nullif(v_attributes->>'description', '')
          ),
          'Borrador creado mediante Importador documental.'
        );

      elsif v_entity_type = 'agent' then
        v_agent_kind := lower(nullif(v_attributes->>'agent_kind', ''));

        if v_agent_kind not in (
          'person',
          'workshop',
          'company',
          'institution'
        ) then
          raise exception '049: el Agente % necesita agent_kind documentado antes de crearse', v_candidate->>'name';
        end if;

        insert into public.agents (
          entity_id,
          agent_kind,
          foundation_or_birth_text,
          death_or_end_text,
          website_url,
          instagram_url,
          description
        ) values (
          v_entity_id,
          v_agent_kind,
          nullif(v_attributes->>'foundation_or_birth_text', ''),
          nullif(v_attributes->>'death_or_end_text', ''),
          nullif(v_attributes->>'website_url', ''),
          nullif(v_attributes->>'instagram_url', ''),
          coalesce(
            nullif(v_candidate->>'description', ''),
            nullif(v_attributes->>'description', '')
          )
        );

      elsif v_entity_type = 'band' then
        insert into public.bands (
          entity_id,
          band_type,
          foundation_text,
          website_url,
          instagram_url,
          description
        ) values (
          v_entity_id,
          nullif(v_attributes->>'band_type', ''),
          nullif(v_attributes->>'foundation_text', ''),
          nullif(v_attributes->>'website_url', ''),
          nullif(v_attributes->>'instagram_url', ''),
          coalesce(
            nullif(v_candidate->>'description', ''),
            nullif(v_attributes->>'description', '')
          )
        );

      elsif v_entity_type = 'march' then
        insert into public.marches (
          entity_id,
          composition_year,
          composition_date_text,
          music_type,
          description,
          premiere_date_text,
          notes
        ) values (
          v_entity_id,
          case
            when v_attributes->>'composition_year' ~ '^\d{4}$'
              then (v_attributes->>'composition_year')::integer
            else null
          end,
          nullif(v_attributes->>'composition_date_text', ''),
          nullif(v_attributes->>'music_type', ''),
          coalesce(
            nullif(v_candidate->>'description', ''),
            nullif(v_attributes->>'description', '')
          ),
          nullif(v_attributes->>'premiere_date_text', ''),
          'Borrador creado mediante Importador documental.'
        );

      elsif v_entity_type = 'heritage_asset' then
        insert into public.heritage_assets (
          entity_id,
          parent_entity_id,
          asset_type,
          description,
          current_condition,
          notes
        ) values (
          v_entity_id,
          case
            when v_import.target_entity_id is not null
              then v_import.target_entity_id
            else null
          end,
          nullif(v_attributes->>'asset_type', ''),
          coalesce(
            nullif(v_candidate->>'description', ''),
            nullif(v_attributes->>'description', '')
          ),
          nullif(v_attributes->>'current_condition', ''),
          'Borrador creado mediante Importador documental.'
        );
      end if;

      v_created_entities := v_created_entities + 1;

    else
      raise exception '049: resolución desconocida para %', v_local_id;
    end if;

    v_mapping := jsonb_set(
      v_mapping,
      array[v_local_id],
      to_jsonb(v_entity_id::text),
      true
    );

    if not exists (
      select 1
      from public.source_links
      where source_id = v_source_id
        and entity_id = v_entity_id
    ) then
      insert into public.source_links (
        source_id,
        entity_id,
        scope,
        notes
      ) values (
        v_source_id,
        v_entity_id,
        'Importación documental · entidad',
        nullif(v_candidate->>'evidence', '')
      );
    end if;
  end loop;

  -- ---------------------------------------------------------------------------
  -- Relaciones aceptadas y soportadas por el MVP
  -- ---------------------------------------------------------------------------

  for v_relation, v_relation_index in
    select
      value,
      ordinality::integer - 1
    from jsonb_array_elements(
      coalesce(v_import.analysis->'relations', '[]'::jsonb)
    ) with ordinality
  loop
    if not (
      v_relation_index = any(
        coalesce(p_relation_indexes, '{}'::integer[])
      )
    ) then
      continue;
    end if;

    v_source_ref := v_relation->>'source_ref';
    v_target_ref := v_relation->>'target_ref';
    v_relation_type := v_relation->>'relation_type';

    v_source_entity_id := null;
    v_target_entity_id := null;
    v_relation_id := null;
    v_relation_created := false;

    if v_source_ref = '$target' then
      v_source_entity_id := v_import.target_entity_id;
    elsif v_mapping ? v_source_ref then
      v_source_entity_id := (v_mapping->>v_source_ref)::uuid;
    end if;

    if v_target_ref = '$target' then
      v_target_entity_id := v_import.target_entity_id;
    elsif v_mapping ? v_target_ref then
      v_target_entity_id := (v_mapping->>v_target_ref)::uuid;
    end if;

    if v_source_entity_id is null
       or v_target_entity_id is null then
      v_skipped_relations := v_skipped_relations + 1;
      continue;
    end if;

    select entity_type
    into v_source_entity_type
    from public.entities
    where id = v_source_entity_id;

    select entity_type
    into v_target_entity_type
    from public.entities
    where id = v_target_entity_id;

    -- Hermandad → titular conceptual
    if v_relation_type in ('has_titular', 'titular')
       and 'brotherhood' in (
         v_source_entity_type,
         v_target_entity_type
       )
       and 'advocation' in (
         v_source_entity_type,
         v_target_entity_type
       ) then

      if v_source_entity_type = 'advocation' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id
      into v_relation_id
      from public.entity_relations
      where source_entity_id = v_source_entity_id
        and target_entity_id = v_target_entity_id
        and relation_type = 'has_titular'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.entity_relations (
          source_entity_id,
          relation_type,
          target_entity_id,
          notes,
          status
        ) values (
          v_source_entity_id,
          'has_titular',
          v_target_entity_id,
          coalesce(
            nullif(v_relation->>'notes', ''),
            'Propuesta aceptada desde Importador documental.'
          ),
          'draft'
        )
        returning id into v_relation_id;

        v_relation_created := true;
      end if;

      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and entity_relation_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id,
          entity_relation_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_relation_id,
          'Titularidad conceptual',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Hermandad → Imagen titular
    elsif v_relation_type in ('titular', 'has_titular')
       and 'brotherhood' in (
         v_source_entity_type,
         v_target_entity_type
       )
       and 'image' in (
         v_source_entity_type,
         v_target_entity_type
       ) then

      if v_source_entity_type = 'image' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id
      into v_relation_id
      from public.brotherhood_images
      where brotherhood_entity_id = v_source_entity_id
        and image_entity_id = v_target_entity_id
        and relation_type = 'titular'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.brotherhood_images (
          brotherhood_entity_id,
          image_entity_id,
          relation_type,
          notes,
          status
        ) values (
          v_source_entity_id,
          v_target_entity_id,
          'titular',
          coalesce(
            nullif(v_relation->>'notes', ''),
            'Propuesta aceptada desde Importador documental.'
          ),
          'draft'
        )
        returning id into v_relation_id;

        v_relation_created := true;
      end if;

      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and brotherhood_image_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id,
          brotherhood_image_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_relation_id,
          'Titularidad de Imagen',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Hermandad → Paso procesional
    elsif v_relation_type = 'processional_step'
       and 'brotherhood' in (
         v_source_entity_type,
         v_target_entity_type
       )
       and 'step' in (
         v_source_entity_type,
         v_target_entity_type
       ) then

      if v_source_entity_type = 'step' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id
      into v_relation_id
      from public.brotherhood_steps
      where brotherhood_entity_id = v_source_entity_id
        and step_entity_id = v_target_entity_id
        and relation_type = 'processional_step'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.brotherhood_steps (
          brotherhood_entity_id,
          step_entity_id,
          relation_type,
          notes,
          status
        ) values (
          v_source_entity_id,
          v_target_entity_id,
          'processional_step',
          coalesce(
            nullif(v_relation->>'notes', ''),
            'Propuesta aceptada desde Importador documental.'
          ),
          'draft'
        )
        returning id into v_relation_id;

        v_relation_created := true;
      end if;

      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and brotherhood_step_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id,
          brotherhood_step_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_relation_id,
          'Paso procesional',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Imagen → Paso
    elsif v_relation_type = 'processes_on'
       and 'image' in (
         v_source_entity_type,
         v_target_entity_type
       )
       and 'step' in (
         v_source_entity_type,
         v_target_entity_type
       ) then

      if v_source_entity_type = 'step' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id
      into v_relation_id
      from public.image_steps
      where image_entity_id = v_source_entity_id
        and step_entity_id = v_target_entity_id
        and relation_type = 'processes_on'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.image_steps (
          image_entity_id,
          step_entity_id,
          relation_type,
          notes,
          status
        ) values (
          v_source_entity_id,
          v_target_entity_id,
          'processes_on',
          coalesce(
            nullif(v_relation->>'notes', ''),
            'Propuesta aceptada desde Importador documental.'
          ),
          'draft'
        )
        returning id into v_relation_id;

        v_relation_created := true;
      end if;

      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and image_step_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id,
          image_step_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_relation_id,
          'Imagen en Paso',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Banda → Hermandad institucional
    elsif v_relation_type = 'belongs_to_brotherhood'
       and 'band' in (
         v_source_entity_type,
         v_target_entity_type
       )
       and 'brotherhood' in (
         v_source_entity_type,
         v_target_entity_type
       ) then

      if v_source_entity_type = 'brotherhood' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id
      into v_relation_id
      from public.entity_relations
      where source_entity_id = v_source_entity_id
        and target_entity_id = v_target_entity_id
        and relation_type = 'belongs_to_brotherhood'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.entity_relations (
          source_entity_id,
          relation_type,
          target_entity_id,
          notes,
          status
        ) values (
          v_source_entity_id,
          'belongs_to_brotherhood',
          v_target_entity_id,
          coalesce(
            nullif(v_relation->>'notes', ''),
            'Propuesta aceptada desde Importador documental.'
          ),
          'draft'
        )
        returning id into v_relation_id;

        v_relation_created := true;
      end if;

      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and entity_relation_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id,
          entity_relation_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_relation_id,
          'Vínculo institucional Banda-Hermandad',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    else
      v_skipped_relations := v_skipped_relations + 1;
      continue;
    end if;

    if v_relation_created then
      v_created_relations := v_created_relations + 1;
    else
      v_reused_relations := v_reused_relations + 1;
    end if;
  end loop;

  v_summary := jsonb_build_object(
    'created_entities', v_created_entities,
    'reused_entities', v_reused_entities,
    'ignored_entities', v_ignored_entities,
    'created_relations', v_created_relations,
    'reused_relations', v_reused_relations,
    'skipped_relations', v_skipped_relations,
    'source_id', v_source_id,
    'entity_mapping', v_mapping
  );

  update public.document_imports
  set
    status = 'applied',
    source_id = v_source_id,
    application_summary = v_summary,
    applied_at = now(),
    error_text = null
  where id = p_import_id;

  return v_summary;
end
$function$
;

CREATE OR REPLACE FUNCTION public.apply_document_import_music_core(p_import_id uuid, p_resolutions jsonb, p_relation_indexes integer[] DEFAULT '{}'::integer[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_import public.document_imports%rowtype;
  v_summary jsonb;
  v_mapping jsonb;
  v_source_id uuid;

  v_relation jsonb;
  v_relation_index integer;
  v_source_ref text;
  v_target_ref text;
  v_relation_type text;
  v_source_entity_id uuid;
  v_target_entity_id uuid;
  v_source_entity_type text;
  v_target_entity_type text;
  v_relation_id uuid;
  v_relation_created boolean;

  v_candidate jsonb;
  v_attribute jsonb;
  v_attributes jsonb;
  v_local_id text;
  v_march_entity_id uuid;
  v_target_type text;
  v_recorded_flag text;
  v_release_title text;
  v_track_title text;
  v_track_sequence integer;
  v_track_matches integer;
  v_track_id uuid;
  v_release_id uuid;
  v_current_track_march uuid;

  v_music_created integer := 0;
  v_music_reused integer := 0;
  v_track_linked integer := 0;
  v_track_reused integer := 0;
  v_track_ambiguous integer := 0;
  v_track_unmatched integer := 0;
  v_track_conflicts integer := 0;

  v_base_created integer := 0;
  v_base_reused integer := 0;
  v_base_skipped integer := 0;
begin
  if not public.can_edit_panel() then
    raise exception '050: el usuario no tiene permiso editorial';
  end if;

  -- 049 crea/reutiliza entidades, Fuente y relaciones genéricas. Si cualquier
  -- operación posterior falla, toda esta llamada se revierte de forma atómica.
  v_summary := public.apply_document_import_core(
    p_import_id,
    p_resolutions,
    p_relation_indexes
  );

  select *
  into v_import
  from public.document_imports
  where id = p_import_id;

  if not found then
    raise exception '050: la importación ha desaparecido durante la aplicación';
  end if;

  v_mapping := coalesce(v_summary->'entity_mapping', '{}'::jsonb);

  begin
    v_source_id := nullif(v_summary->>'source_id', '')::uuid;
  exception when others then
    raise exception '050: 049 no devolvió una Fuente válida';
  end;

  -- ---------------------------------------------------------------------------
  -- AUTORÍAS Y DEDICATORIAS MUSICALES REVISADAS
  -- ---------------------------------------------------------------------------

  for v_relation, v_relation_index in
    select value, ordinality::integer - 1
    from jsonb_array_elements(
      coalesce(v_import.analysis->'relations', '[]'::jsonb)
    ) with ordinality
  loop
    if not (
      v_relation_index = any(
        coalesce(p_relation_indexes, '{}'::integer[])
      )
    ) then
      continue;
    end if;

    v_relation_type := v_relation->>'relation_type';

    if v_relation_type not in ('authored_by', 'dedicated_to') then
      continue;
    end if;

    v_source_ref := v_relation->>'source_ref';
    v_target_ref := v_relation->>'target_ref';
    v_source_entity_id := null;
    v_target_entity_id := null;
    v_relation_id := null;
    v_relation_created := false;

    if v_source_ref = '$target' then
      v_source_entity_id := v_import.target_entity_id;
    elsif v_mapping ? v_source_ref then
      v_source_entity_id := (v_mapping->>v_source_ref)::uuid;
    end if;

    if v_target_ref = '$target' then
      v_target_entity_id := v_import.target_entity_id;
    elsif v_mapping ? v_target_ref then
      v_target_entity_id := (v_mapping->>v_target_ref)::uuid;
    end if;

    -- Si el editor ignoró uno de los extremos, 049 ya lo contabilizó como
    -- relación no aplicada y aquí no se fuerza nada.
    if v_source_entity_id is null
       or v_target_entity_id is null then
      continue;
    end if;

    select entity_type
    into v_source_entity_type
    from public.entities
    where id = v_source_entity_id;

    select entity_type
    into v_target_entity_type
    from public.entities
    where id = v_target_entity_id;

    -- Marcha → compositor. En este MVP authored_by significa composición;
    -- arreglos/adaptaciones siguen requiriendo modelado explícito posterior.
    if v_relation_type = 'authored_by'
       and 'march' in (
         v_source_entity_type,
         v_target_entity_type
       )
       and 'agent' in (
         v_source_entity_type,
         v_target_entity_type
       ) then

      if v_source_entity_type = 'agent' then
        v_march_entity_id := v_target_entity_id;
        v_target_entity_id := v_source_entity_id;
      else
        v_march_entity_id := v_source_entity_id;
      end if;

      -- La clave de identidad de march_authors ya es Marcha + Agente + rol.
      -- No dependemos de created_at y reutilizamos también una relación archivada
      -- para evitar chocar con su restricción unique.
      select id
      into v_relation_id
      from public.march_authors
      where march_entity_id = v_march_entity_id
        and agent_entity_id = v_target_entity_id
        and author_role = 'composer'
      limit 1;

      if v_relation_id is null then
        insert into public.march_authors (
          march_entity_id,
          agent_entity_id,
          author_role,
          notes,
          status
        ) values (
          v_march_entity_id,
          v_target_entity_id,
          'composer',
          coalesce(
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', ''),
            'Autoría propuesta y aceptada desde Importador documental.'
          ),
          'draft'
        )
        returning id into v_relation_id;

        v_relation_created := true;
      else
        update public.march_authors
        set
          status = case
            when status = 'archived' then 'draft'
            else status
          end,
          notes = coalesce(
            nullif(notes, ''),
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', '')
          )
        where id = v_relation_id;
      end if;

      -- source_links todavía no tiene destino march_author. Conservamos la
      -- trazabilidad sobre la Marcha, igual que el primer caso relacional 047.
      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and entity_id = v_march_entity_id
      ) then
        insert into public.source_links (
          source_id,
          entity_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_march_entity_id,
          'Autoría musical documentada',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Marcha → entidad destinataria.
    elsif v_relation_type = 'dedicated_to'
       and v_source_entity_type = 'march'
       and v_target_entity_type <> 'march' then

      v_march_entity_id := v_source_entity_id;

      -- La dedicatoria tiene identidad única aunque esté archivada; si el editor
      -- acepta de nuevo una fuente que la documenta, se reactiva en borrador.
      select id
      into v_relation_id
      from public.march_dedications
      where march_entity_id = v_march_entity_id
        and dedicatee_entity_id = v_target_entity_id
        and dedication_type = 'dedicated_to'
      limit 1;

      if v_relation_id is null then
        insert into public.march_dedications (
          march_entity_id,
          dedicatee_entity_id,
          dedication_type,
          dedication_text,
          notes,
          status
        )
        select
          v_march_entity_id,
          v_target_entity_id,
          'dedicated_to',
          target.name,
          coalesce(
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', ''),
            'Dedicatoria propuesta y aceptada desde Importador documental.'
          ),
          'draft'
        from public.entities target
        where target.id = v_target_entity_id
        returning id into v_relation_id;

        v_relation_created := true;
      else
        update public.march_dedications
        set
          status = case
            when status = 'archived' then 'draft'
            else status
          end,
          notes = coalesce(
            nullif(notes, ''),
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', '')
          )
        where id = v_relation_id;
      end if;

      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and march_dedication_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id,
          march_dedication_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_relation_id,
          'Dedicatoria musical',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    else
      continue;
    end if;

    if v_relation_created then
      v_music_created := v_music_created + 1;
    else
      v_music_reused := v_music_reused + 1;
    end if;
  end loop;

  -- ---------------------------------------------------------------------------
  -- MARCHA ↔ PISTA DISCOGRÁFICA EXISTENTE
  -- ---------------------------------------------------------------------------
  -- Solo se ejecuta cuando la entidad objetivo de la importación es una Banda y
  -- la IA ha marcado expresamente la Marcha como documentada en una discografía.
  -- La IA aporta contexto textual; PostgreSQL decide si existe UNA pista inequívoca.

  if v_import.target_entity_id is not null then
    select entity_type
    into v_target_type
    from public.entities
    where id = v_import.target_entity_id;
  end if;

  if v_target_type = 'band' then
    for v_candidate in
      select value
      from jsonb_array_elements(
        coalesce(v_import.analysis->'entities', '[]'::jsonb)
      )
    loop
      v_local_id := v_candidate->>'local_id';

      if v_candidate->>'entity_type' <> 'march'
         or not (v_mapping ? v_local_id) then
        continue;
      end if;

      v_march_entity_id := (v_mapping->>v_local_id)::uuid;
      v_attributes := '{}'::jsonb;

      for v_attribute in
        select value
        from jsonb_array_elements(
          coalesce(v_candidate->'attributes', '[]'::jsonb)
        )
      loop
        if nullif(v_attribute->>'key', '') is not null then
          v_attributes := v_attributes || jsonb_build_object(
            v_attribute->>'key',
            coalesce(v_attribute->>'value', '')
          );
        end if;
      end loop;

      v_recorded_flag := lower(
        trim(
          coalesce(
            v_attributes->>'recorded_in_discography',
            ''
          )
        )
      );

      if v_recorded_flag not in (
        'yes',
        'si',
        'sí',
        'true',
        '1'
      ) then
        continue;
      end if;

      v_release_title := nullif(
        trim(v_attributes->>'discography_release_title'),
        ''
      );

      v_track_title := coalesce(
        nullif(
          trim(v_attributes->>'discography_track_title'),
          ''
        ),
        nullif(
          trim(v_candidate->>'name'),
          ''
        )
      );

      v_track_sequence := null;

      if coalesce(
        v_attributes->>'discography_track_sequence_no',
        ''
      ) ~ '^\d+$' then
        v_track_sequence :=
          (v_attributes->>'discography_track_sequence_no')::integer;
      end if;

      if v_track_title is null then
        v_track_unmatched := v_track_unmatched + 1;
        continue;
      end if;

      select count(*)
      into v_track_matches
      from public.band_release_tracks track
      join public.band_releases release
        on release.id = track.release_id
      where release.band_entity_id = v_import.target_entity_id
        and release.status <> 'archived'
        and (
          v_release_title is null
          or lower(trim(release.title)) = lower(v_release_title)
        )
        and (
          v_track_sequence is null
          or track.sequence_no = v_track_sequence
        )
        and lower(trim(track.title)) = lower(v_track_title);

      if v_track_matches = 0 then
        v_track_unmatched := v_track_unmatched + 1;
        continue;

      elsif v_track_matches > 1 then
        v_track_ambiguous := v_track_ambiguous + 1;
        continue;
      end if;

      select
        track.id,
        release.id,
        track.march_entity_id
      into
        v_track_id,
        v_release_id,
        v_current_track_march
      from public.band_release_tracks track
      join public.band_releases release
        on release.id = track.release_id
      where release.band_entity_id = v_import.target_entity_id
        and release.status <> 'archived'
        and (
          v_release_title is null
          or lower(trim(release.title)) = lower(v_release_title)
        )
        and (
          v_track_sequence is null
          or track.sequence_no = v_track_sequence
        )
        and lower(trim(track.title)) = lower(v_track_title)
      limit 1;

      if v_current_track_march is null then
        update public.band_release_tracks
        set march_entity_id = v_march_entity_id
        where id = v_track_id;

        v_track_linked := v_track_linked + 1;

      elsif v_current_track_march = v_march_entity_id then
        v_track_reused := v_track_reused + 1;

      else
        -- Nunca se sustituye silenciosamente una Marcha ya vinculada a la pista.
        v_track_conflicts := v_track_conflicts + 1;
        continue;
      end if;

      insert into public.band_release_sources (
        release_id,
        source_id,
        scope
      ) values (
        v_release_id,
        v_source_id,
        'Discografía oficial y relación entre pista y Marcha'
      )
      on conflict (release_id, source_id) do nothing;

      if not exists (
        select 1
        from public.source_links
        where source_id = v_source_id
          and entity_id = v_march_entity_id
      ) then
        insert into public.source_links (
          source_id,
          entity_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_march_entity_id,
          'Grabación discográfica documentada',
          concat(
            'Pista ',
            coalesce(v_track_sequence::text, 's/n'),
            ' · ',
            v_track_title
          )
        );
      end if;
    end loop;
  end if;

  -- 049 cuenta authored_by/dedicated_to seleccionadas como no soportadas.
  -- Ajustamos el resumen para reflejar las que 050 sí ha aplicado sin ocultar
  -- las restantes.

  v_base_created :=
    coalesce((v_summary->>'created_relations')::integer, 0);

  v_base_reused :=
    coalesce((v_summary->>'reused_relations')::integer, 0);

  v_base_skipped :=
    coalesce((v_summary->>'skipped_relations')::integer, 0);

  v_summary := jsonb_set(
    v_summary,
    '{created_relations}',
    to_jsonb(v_base_created + v_music_created),
    true
  );

  v_summary := jsonb_set(
    v_summary,
    '{reused_relations}',
    to_jsonb(v_base_reused + v_music_reused),
    true
  );

  v_summary := jsonb_set(
    v_summary,
    '{skipped_relations}',
    to_jsonb(
      greatest(
        v_base_skipped
          - v_music_created
          - v_music_reused,
        0
      )
    ),
    true
  );

  v_summary := v_summary || jsonb_build_object(
    'music_created_relations', v_music_created,
    'music_reused_relations', v_music_reused,
    'discography_tracks_linked', v_track_linked,
    'discography_tracks_reused', v_track_reused,
    'discography_tracks_ambiguous', v_track_ambiguous,
    'discography_tracks_unmatched', v_track_unmatched,
    'discography_tracks_conflicts', v_track_conflicts
  );

  update public.document_imports
  set application_summary = v_summary
  where id = p_import_id;

  return v_summary;
end
$function$
;

CREATE OR REPLACE FUNCTION public.apply_document_import(p_import_id uuid, p_resolutions jsonb, p_relation_indexes integer[] DEFAULT '{}'::integer[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_import public.document_imports%rowtype;
  v_candidate jsonb;
  v_attribute jsonb;
  v_local_id text;
  v_agent_kind text;
begin
  if not public.can_edit_panel() then
    raise exception '051: el usuario no tiene permiso editorial';
  end if;

  select *
  into v_import
  from public.document_imports
  where id = p_import_id;

  if not found then
    raise exception '051: la importación no existe';
  end if;

  for v_candidate in
    select value
    from jsonb_array_elements(
      coalesce(v_import.analysis->'entities', '[]'::jsonb)
    )
  loop
    if v_candidate->>'entity_type' <> 'agent' then
      continue;
    end if;

    v_local_id := v_candidate->>'local_id';

    if coalesce(p_resolutions->>v_local_id, '') <> 'new' then
      continue;
    end if;

    v_agent_kind := null;

    for v_attribute in
      select value
      from jsonb_array_elements(
        coalesce(v_candidate->'attributes', '[]'::jsonb)
      )
    loop
      if v_attribute->>'key' = 'agent_kind' then
        v_agent_kind :=
          lower(nullif(trim(v_attribute->>'value'), ''));
        exit;
      end if;
    end loop;

    if v_agent_kind is null
       or v_agent_kind not in (
         'person',
         'workshop',
         'company',
         'institution'
       ) then
      raise exception
        '051: el Agente % necesita agent_kind documentado antes de crearse',
        coalesce(
          nullif(v_candidate->>'name', ''),
          v_local_id
        );
    end if;
  end loop;

  return public.apply_document_import_music_core(
    p_import_id,
    p_resolutions,
    p_relation_indexes
  );
end
$function$
;

CREATE OR REPLACE FUNCTION public.sync_music_accompaniment_public_location()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  location_name text;
  location_slug text;
  location_province text;
begin
  if new.brotherhood_entity_id is null then
    return new;
  end if;

  select municipality.name, municipality.slug, municipality.province
    into location_name, location_slug, location_province
  from public.brotherhoods brotherhood
  join public.municipalities municipality
    on municipality.id = brotherhood.municipality_id
  where brotherhood.entity_id = new.brotherhood_entity_id;

  if found then
    new.public_municipality_name := location_name;
    new.public_municipality_slug := location_slug;
    new.public_province := location_province;
  end if;

  return new;
end
$function$
;

CREATE OR REPLACE FUNCTION public.hc_set_brotherhood_section_authority(p_brotherhood_id uuid, p_section_key text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  if p_brotherhood_id is null or p_section_key is null then
    return;
  end if;

  if not exists (
    select 1
    from public.entities entity
    where entity.id = p_brotherhood_id
      and entity.entity_type = 'brotherhood'
  ) then
    return;
  end if;

  insert into public.brotherhood_section_authority (
    brotherhood_entity_id, section_key, source, managed_at
  ) values (
    p_brotherhood_id, p_section_key, 'panel', now()
  )
  on conflict (brotherhood_entity_id, section_key)
  do update set source = excluded.source, managed_at = excluded.managed_at;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.hc_authority_for_event_target(p_target_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  target_type text;
  brotherhood_id uuid;
begin
  select entity_type into target_type
  from public.entities
  where id = p_target_id;

  if target_type = 'brotherhood' then
    perform public.hc_set_brotherhood_section_authority(p_target_id, 'acontecimientos');
    return;
  end if;

  if target_type = 'image' then
    for brotherhood_id in
      select distinct relation.brotherhood_entity_id
      from public.brotherhood_images relation
      where relation.image_entity_id = p_target_id
        and relation.status = 'published'
    loop
      perform public.hc_set_brotherhood_section_authority(brotherhood_id, 'acontecimientos');
    end loop;
  end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.hc_mark_brotherhood_authority_from_audit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  brotherhood_id uuid;
  section_name text;
  recorded_status text;
  relation_type text;
  source_id uuid;
  target_id uuid;
  relation_row record;
begin
  if new.object_type = 'event' then
    if new.action_type not in ('publish', 'archive', 'unpublish')
      and coalesce(new.changed_fields -> 'entity' ->> 'status', new.changed_fields ->> 'status', '') <> 'published'
    then
      return new;
    end if;

    for relation_row in
      select relation.target_entity_id
      from public.entity_relations relation
      where relation.source_entity_id = new.entity_id
        and relation.relation_type = 'involves'
        and relation.status = 'published'
    loop
      perform public.hc_authority_for_event_target(relation_row.target_entity_id);
    end loop;
    return new;
  end if;

  if new.object_type = 'entity_relation' then
    relation_type := new.changed_fields ->> 'relation_type';
    if relation_type <> 'involves' then
      return new;
    end if;

    begin
      source_id := nullif(new.changed_fields ->> 'source_entity_id', '')::uuid;
      target_id := nullif(new.changed_fields ->> 'target_entity_id', '')::uuid;
    exception when invalid_text_representation then
      return new;
    end;

    if source_id is null or target_id is null then
      return new;
    end if;

    if not exists (
      select 1 from public.entities entity
      where entity.id = source_id and entity.entity_type = 'event'
    ) then
      return new;
    end if;

    recorded_status := coalesce(new.changed_fields ->> 'status', '');
    if new.action_type not in ('archive', 'unlink', 'unpublish', 'publish')
      and recorded_status <> 'published'
    then
      return new;
    end if;

    perform public.hc_authority_for_event_target(target_id);
    return new;
  end if;

  if new.entity_id is not null and exists (
    select 1
    from public.entities entity
    where entity.id = new.entity_id
      and entity.entity_type = 'brotherhood'
  ) then
    brotherhood_id := new.entity_id;
  end if;

  if brotherhood_id is null and new.changed_fields ? 'brotherhood_entity_id' then
    begin
      brotherhood_id := nullif(new.changed_fields ->> 'brotherhood_entity_id', '')::uuid;
    exception when invalid_text_representation then
      brotherhood_id := null;
    end;
  end if;

  if brotherhood_id is null then
    return new;
  end if;

  case new.object_type
    when 'brotherhood' then section_name := 'identidad';
    when 'brotherhood_history' then section_name := 'historia';
    when 'entity_social_link' then section_name := 'enlaces';
    when 'brotherhood_image' then section_name := 'titulares';
    when 'brotherhood_step' then section_name := 'pasos';
    when 'outing' then section_name := 'salidas';
    when 'outing_series' then section_name := 'salidas';
    when 'outing_series_movement' then section_name := 'salidas';
    when 'outing_music_position' then section_name := 'salidas';
    when 'outing_music_assignment' then section_name := 'salidas';
    when 'cult' then section_name := 'cultos';
    when 'cult_occurrence' then section_name := 'cultos';
    when 'heritage_asset' then section_name := 'patrimonio';
    when 'heritage_intervention' then section_name := 'patrimonio';
    when 'heritage_update' then section_name := 'estrenos';
    when 'music_accompaniment_period' then section_name := 'acompanamiento';
    when 'brotherhood_procession_stats' then section_name := 'jornada';
    when 'source_link' then section_name := 'fuentes';
    else section_name := null;
  end case;

  if section_name is null then
    return new;
  end if;

  if new.object_type = 'brotherhood' then
    recorded_status := coalesce(new.changed_fields -> 'entity' ->> 'status', '');
  else
    recorded_status := coalesce(new.changed_fields ->> 'status', '');
  end if;

  if new.object_type not in ('entity_social_link', 'source_link', 'brotherhood_history')
    and new.action_type not in ('archive', 'unlink', 'unpublish', 'publish')
    and recorded_status <> 'published'
  then
    return new;
  end if;

  perform public.hc_set_brotherhood_section_authority(brotherhood_id, section_name);

  if new.object_type = 'brotherhood' then
    perform public.hc_set_brotherhood_section_authority(brotherhood_id, 'colores');
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.guard_band_identity_collision()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  candidate_name text;
  collision_name text;
begin
  select e.name into candidate_name
  from public.entities e
  where e.id=new.entity_id and e.entity_type='band';

  if candidate_name is null then return new; end if;

  select e.name into collision_name
  from public.bands b
  join public.entities e on e.id=b.entity_id
  where b.entity_id <> new.entity_id
    and b.municipality_id is not distinct from new.municipality_id
    and (
      regexp_replace(lower(trim(e.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(trim(candidate_name)), '[[:space:]]+', ' ', 'g')
      or exists (
        select 1 from public.band_names bn
        where bn.band_entity_id=b.entity_id
          and bn.is_current=true
          and (
            regexp_replace(lower(trim(bn.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(trim(candidate_name)), '[[:space:]]+', ' ', 'g')
            or (coalesce(trim(bn.short_name),'') <> '' and regexp_replace(lower(trim(bn.short_name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(trim(candidate_name)), '[[:space:]]+', ' ', 'g'))
          )
      )
    )
  limit 1;

  if collision_name is not null then
    raise exception using errcode='23505', message=format('La formación «%s» coincide con una formación o denominación vigente ya existente en el mismo municipio: «%s». Reutiliza la entidad canónica.', candidate_name, collision_name);
  end if;
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.guard_band_name_alias_collision()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  candidate_municipality uuid;
  collision_name text;
  candidate_name text;
  candidate_short text;
begin
  if coalesce(new.is_current,false)=false then return new; end if;
  select b.municipality_id into candidate_municipality from public.bands b where b.entity_id=new.band_entity_id;
  candidate_name := nullif(trim(new.name),'');
  candidate_short := nullif(trim(new.short_name),'');

  select e.name into collision_name
  from public.bands b
  join public.entities e on e.id=b.entity_id
  where b.entity_id <> new.band_entity_id
    and b.municipality_id is not distinct from candidate_municipality
    and (
      (candidate_name is not null and regexp_replace(lower(trim(e.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_name), '[[:space:]]+', ' ', 'g'))
      or (candidate_short is not null and regexp_replace(lower(trim(e.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_short), '[[:space:]]+', ' ', 'g'))
      or exists (
        select 1 from public.band_names other
        where other.band_entity_id=b.entity_id and other.is_current=true
          and (
            (candidate_name is not null and (regexp_replace(lower(trim(other.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_name), '[[:space:]]+', ' ', 'g') or (coalesce(trim(other.short_name),'')<>'' and regexp_replace(lower(trim(other.short_name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_name), '[[:space:]]+', ' ', 'g'))))
            or (candidate_short is not null and (regexp_replace(lower(trim(other.name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_short), '[[:space:]]+', ' ', 'g') or (coalesce(trim(other.short_name),'')<>'' and regexp_replace(lower(trim(other.short_name)), '[[:space:]]+', ' ', 'g') = regexp_replace(lower(candidate_short), '[[:space:]]+', ' ', 'g'))))
          )
      )
    )
  limit 1;

  if collision_name is not null then
    raise exception using errcode='23505', message=format('La denominación «%s» entra en conflicto con otra formación vigente del mismo municipio: «%s».', coalesce(candidate_name,candidate_short), collision_name);
  end if;
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.guard_core_relation_publication()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  source_entity_id uuid;
  target_entity_id uuid;
  source_entity_type text;
  target_entity_type text;
  source_status text;
  target_status text;
begin
  if new.status <> 'published' then
    return new;
  end if;

  source_entity_id := (to_jsonb(new) ->> tg_argv[0])::uuid;
  target_entity_id := (to_jsonb(new) ->> tg_argv[1])::uuid;

  select entity_type, status
    into source_entity_type, source_status
  from public.entities
  where id = source_entity_id
  for share;

  select entity_type, status
    into target_entity_type, target_status
  from public.entities
  where id = target_entity_id
  for share;

  if source_entity_type is distinct from tg_argv[2]
     or target_entity_type is distinct from tg_argv[3]
     or source_status is distinct from 'published'
     or target_status is distinct from 'published' then
    new.status := 'draft';
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.demote_invalid_core_relations_after_entity_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  update public.brotherhood_images relation
  set status = 'draft'
  where relation.status = 'published'
    and (
      relation.brotherhood_entity_id = new.id
      or relation.image_entity_id = new.id
    )
    and not exists (
      select 1
      from public.entities brotherhood
      join public.entities image
        on image.id = relation.image_entity_id
      where brotherhood.id = relation.brotherhood_entity_id
        and brotherhood.entity_type = 'brotherhood'
        and brotherhood.status = 'published'
        and image.entity_type = 'image'
        and image.status = 'published'
    );

  update public.brotherhood_steps relation
  set status = 'draft'
  where relation.status = 'published'
    and (
      relation.brotherhood_entity_id = new.id
      or relation.step_entity_id = new.id
    )
    and not exists (
      select 1
      from public.entities brotherhood
      join public.entities step
        on step.id = relation.step_entity_id
      where brotherhood.id = relation.brotherhood_entity_id
        and brotherhood.entity_type = 'brotherhood'
        and brotherhood.status = 'published'
        and step.entity_type = 'step'
        and step.status = 'published'
    );

  update public.image_steps relation
  set status = 'draft'
  where relation.status = 'published'
    and (
      relation.image_entity_id = new.id
      or relation.step_entity_id = new.id
    )
    and not exists (
      select 1
      from public.entities image
      join public.entities step
        on step.id = relation.step_entity_id
      where image.id = relation.image_entity_id
        and image.entity_type = 'image'
        and image.status = 'published'
        and step.entity_type = 'step'
        and step.status = 'published'
    );

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.open_media_provenance_is_valid(p_storage_path text, p_rights_status text, p_license text, p_author_name text, p_rights_holder text, p_source_name text, p_source_url text, p_alt_text text, p_permission_notes text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
 SET search_path TO ''
AS $function$
  select case
    when coalesce(p_rights_status, '') not in ('licensed', 'public_domain') then true
    when nullif(btrim(coalesce(p_license, '')), '') is null then false
    when nullif(btrim(coalesce(p_author_name, '')), '') is null then false
    when nullif(btrim(coalesce(p_rights_holder, '')), '') is null then false
    when nullif(btrim(coalesce(p_source_name, '')), '') is null then false
    when nullif(btrim(coalesce(p_source_url, '')), '') is null then false
    when nullif(btrim(coalesce(p_alt_text, '')), '') is null then false
    when nullif(btrim(coalesce(p_permission_notes, '')), '') is null then false
    when p_source_url !~* '^https://[^[:space:]]+$' then false
    when p_source_url ~* '^https://(www[.])?(google[.][^/]+/search|bing[.]com/search|search[.]yahoo[.]com/)' then false
    when p_rights_status = 'licensed'
      and not (
        upper(btrim(p_license)) = any (array[
          'CC BY 1.0',
          'CC BY 2.0',
          'CC BY 2.5',
          'CC BY 3.0',
          'CC BY 4.0',
          'CC BY-SA 1.0',
          'CC BY-SA 2.0',
          'CC BY-SA 2.5',
          'CC BY-SA 3.0',
          'CC BY-SA 4.0'
        ]::text[])
      ) then false
    when p_rights_status = 'public_domain'
      and not (
        lower(btrim(p_license)) = any (array[
          'cc0 1.0',
          'public domain mark 1.0',
          'pdm 1.0',
          'public domain',
          'dominio público'
        ]::text[])
      ) then false
    when coalesce(p_storage_path, '') ~* '^https://upload[.]wikimedia[.]org/wikipedia/commons/'
      and (
        lower(btrim(p_source_name)) not like 'wikimedia commons%'
        or p_source_url !~* '^https://commons[.]wikimedia[.]org/wiki/(File|Archivo):[^[:space:]]+$'
      ) then false
    else true
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.guard_crew_event_record()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  event_entity_type text;
  event_entity_status text;
  brotherhood_type text;
  brotherhood_status text;
begin
  select entity_type, status
    into event_entity_type, event_entity_status
  from public.entities
  where id = new.entity_id;

  if event_entity_type is distinct from 'event' then
    raise exception 'crew_event_entity_type_invalid';
  end if;

  if new.brotherhood_entity_id is not null then
    select entity_type, status
      into brotherhood_type, brotherhood_status
    from public.entities
    where id = new.brotherhood_entity_id;

    if brotherhood_type is distinct from 'brotherhood' then
      raise exception 'crew_event_brotherhood_type_invalid';
    end if;
  end if;

  if new.event_category = 'crew_call'
     and event_entity_status = 'published'
     and brotherhood_status is distinct from 'published' then
    raise exception 'crew_event_published_brotherhood_required';
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.guard_published_crew_event_entity()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  stored_category text;
  stored_brotherhood_id uuid;
  stored_brotherhood_status text;
begin
  if new.entity_type = 'event' and new.status = 'published' then
    select event_category, brotherhood_entity_id
      into stored_category, stored_brotherhood_id
    from public.events
    where entity_id = new.id;

    if stored_category = 'crew_call' then
      select status
        into stored_brotherhood_status
      from public.entities
      where id = stored_brotherhood_id
        and entity_type = 'brotherhood';

      if stored_brotherhood_status is distinct from 'published' then
        raise exception 'crew_event_published_brotherhood_required';
      end if;
    end if;
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.guard_crew_event_link()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  event_type text;
  event_status text;
  event_category text;
  target_type text;
  target_status text;
  target_id uuid;
begin
  select entity.entity_type, entity.status, event.event_category
    into event_type, event_status, event_category
  from public.entities entity
  join public.events event on event.entity_id = entity.id
  where entity.id = new.event_entity_id;

  if event_type is distinct from 'event'
     or event_category is distinct from 'crew_call' then
    raise exception 'crew_event_link_source_invalid';
  end if;

  if tg_table_name = 'crew_event_steps' then
    target_id := new.step_entity_id;
  else
    target_id := new.agent_entity_id;
  end if;

  select entity_type, status
    into target_type, target_status
  from public.entities
  where id = target_id;

  if target_type is distinct from tg_argv[0] then
    raise exception 'crew_event_link_target_invalid';
  end if;

  if new.status = 'published'
     and (event_status is distinct from 'published'
       or target_status is distinct from 'published') then
    raise exception 'crew_event_link_publication_invalid';
  end if;

  return new;
end;
$function$
;

alter table only public.municipalities add constraint municipalities_pkey PRIMARY KEY (id);

alter table only public.municipalities add constraint municipalities_slug_key UNIQUE (slug);

alter table only public.places add constraint places_pkey PRIMARY KEY (id);

alter table only public.places add constraint places_slug_key UNIQUE (slug);

alter table only public.places add constraint places_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.entities add constraint entities_entity_type_check CHECK (entity_type = ANY (ARRAY['brotherhood'::text, 'advocation'::text, 'image'::text, 'step'::text, 'agent'::text, 'band'::text, 'march'::text, 'event'::text, 'heritage_asset'::text]));

alter table only public.entities add constraint entities_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.entities add constraint entities_pkey PRIMARY KEY (id);

alter table only public.entities add constraint entities_slug_key UNIQUE (slug);

alter table only public.brotherhoods add constraint brotherhoods_pkey PRIMARY KEY (entity_id);

alter table only public.brotherhoods add constraint brotherhoods_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.brotherhoods add constraint brotherhoods_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.brotherhoods add constraint brotherhoods_canonical_see_place_id_fkey FOREIGN KEY (canonical_see_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.advocations add constraint advocations_pkey PRIMARY KEY (entity_id);

alter table only public.advocations add constraint advocations_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.images add constraint images_current_condition_check CHECK (current_condition IS NULL OR (current_condition = ANY (ARRAY['extant'::text, 'lost'::text, 'destroyed'::text, 'unknown'::text])));

alter table only public.images add constraint images_pkey PRIMARY KEY (entity_id);

alter table only public.images add constraint images_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.images add constraint images_advocation_entity_id_fkey FOREIGN KEY (advocation_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.brotherhood_images add constraint brotherhood_images_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.brotherhood_images add constraint brotherhood_images_pkey PRIMARY KEY (id);

alter table only public.brotherhood_images add constraint brotherhood_images_brotherhood_entity_id_image_entity_id_re_key UNIQUE (brotherhood_entity_id, image_entity_id, relation_type, date_from);

alter table only public.brotherhood_images add constraint brotherhood_images_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.brotherhood_images add constraint brotherhood_images_image_entity_id_fkey FOREIGN KEY (image_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.agents add constraint agents_agent_kind_check CHECK (agent_kind = ANY (ARRAY['person'::text, 'workshop'::text, 'company'::text, 'institution'::text]));

alter table only public.agents add constraint agents_pkey PRIMARY KEY (entity_id);

alter table only public.agents add constraint agents_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.agents add constraint agents_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.agent_roles add constraint agent_roles_pkey PRIMARY KEY (id);

alter table only public.agent_roles add constraint agent_roles_agent_entity_id_role_name_date_from_key UNIQUE (agent_entity_id, role_name, date_from);

alter table only public.agent_roles add constraint agent_roles_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.steps add constraint steps_pkey PRIMARY KEY (entity_id);

alter table only public.steps add constraint steps_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.brotherhood_steps add constraint brotherhood_steps_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.brotherhood_steps add constraint brotherhood_steps_pkey PRIMARY KEY (id);

alter table only public.brotherhood_steps add constraint brotherhood_steps_brotherhood_entity_id_step_entity_id_rela_key UNIQUE (brotherhood_entity_id, step_entity_id, relation_type, date_from);

alter table only public.brotherhood_steps add constraint brotherhood_steps_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.brotherhood_steps add constraint brotherhood_steps_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.image_steps add constraint image_steps_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.image_steps add constraint image_steps_pkey PRIMARY KEY (id);

alter table only public.image_steps add constraint image_steps_image_entity_id_step_entity_id_relation_type_da_key UNIQUE (image_entity_id, step_entity_id, relation_type, date_from);

alter table only public.image_steps add constraint image_steps_image_entity_id_fkey FOREIGN KEY (image_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.image_steps add constraint image_steps_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.entity_relations add constraint entity_relations_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.entity_relations add constraint entity_relations_not_self CHECK (source_entity_id <> target_entity_id);

alter table only public.entity_relations add constraint entity_relations_pkey PRIMARY KEY (id);

alter table only public.entity_relations add constraint entity_relations_source_entity_id_fkey FOREIGN KEY (source_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.entity_relations add constraint entity_relations_target_entity_id_fkey FOREIGN KEY (target_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.entity_locations add constraint entity_locations_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.entity_locations add constraint entity_locations_pkey PRIMARY KEY (id);

alter table only public.entity_locations add constraint entity_locations_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.entity_locations add constraint entity_locations_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.entity_locations add constraint entity_locations_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.entity_locations add constraint entity_locations_custodian_entity_id_fkey FOREIGN KEY (custodian_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.heritage_assets add constraint heritage_assets_pkey PRIMARY KEY (entity_id);

alter table only public.heritage_assets add constraint heritage_assets_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.heritage_assets add constraint heritage_assets_parent_entity_id_fkey FOREIGN KEY (parent_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.heritage_interventions add constraint heritage_interventions_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.heritage_interventions add constraint heritage_interventions_pkey PRIMARY KEY (id);

alter table only public.heritage_interventions add constraint heritage_interventions_target_entity_id_fkey FOREIGN KEY (target_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.heritage_interventions add constraint heritage_interventions_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.bands add constraint bands_pkey PRIMARY KEY (entity_id);

alter table only public.bands add constraint bands_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.bands add constraint bands_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.marches add constraint marches_pkey PRIMARY KEY (entity_id);

alter table only public.marches add constraint marches_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.march_authors add constraint march_authors_pkey PRIMARY KEY (id);

alter table only public.march_authors add constraint march_authors_march_entity_id_agent_entity_id_author_role_key UNIQUE (march_entity_id, agent_entity_id, author_role);

alter table only public.march_authors add constraint march_authors_march_entity_id_fkey FOREIGN KEY (march_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.march_authors add constraint march_authors_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.outings add constraint outings_character_check CHECK ("character" = ANY (ARRAY['ordinary'::text, 'extraordinary'::text]));

alter table only public.outings add constraint outings_event_status_check CHECK (event_status = ANY (ARRAY['announced'::text, 'held'::text, 'cancelled'::text]));

alter table only public.outings add constraint outings_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.outings add constraint outings_pkey PRIMARY KEY (id);

alter table only public.outings add constraint outings_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.outings add constraint outings_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.outings add constraint outings_origin_place_id_fkey FOREIGN KEY (origin_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outings add constraint outings_destination_place_id_fkey FOREIGN KEY (destination_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outing_entities add constraint outing_entities_pkey PRIMARY KEY (id);

alter table only public.outing_entities add constraint outing_entities_outing_id_entity_id_role_key UNIQUE (outing_id, entity_id, role);

alter table only public.outing_entities add constraint outing_entities_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES outings(id) ON DELETE CASCADE;

alter table only public.outing_entities add constraint outing_entities_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.accompaniments add constraint accompaniments_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.accompaniments add constraint accompaniments_pkey PRIMARY KEY (id);

alter table only public.accompaniments add constraint accompaniments_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES outings(id) ON DELETE CASCADE;

alter table only public.accompaniments add constraint accompaniments_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.accompaniments add constraint accompaniments_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.cults add constraint cults_month_check CHECK (month >= 1 AND month <= 12);

alter table only public.cults add constraint cults_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.cults add constraint cults_pkey PRIMARY KEY (id);

alter table only public.cults add constraint cults_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.cults add constraint cults_image_entity_id_fkey FOREIGN KEY (image_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.cults add constraint cults_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.events add constraint events_pkey PRIMARY KEY (entity_id);

alter table only public.events add constraint events_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.events add constraint events_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.sources add constraint sources_pkey PRIMARY KEY (id);

alter table only public.source_links add constraint source_links_pkey PRIMARY KEY (id);

alter table only public.source_links add constraint source_links_source_id_fkey FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES outings(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_cult_id_fkey FOREIGN KEY (cult_id) REFERENCES cults(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES heritage_interventions(id) ON DELETE CASCADE;

alter table only public.daily_overrides add constraint daily_content_content_type_check CHECK (content_type = ANY (ARRAY['ephemeris'::text, 'fact'::text, 'curiosity'::text, 'march'::text]));

alter table only public.daily_overrides add constraint daily_content_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.daily_overrides add constraint daily_content_pkey PRIMARY KEY (id);

alter table only public.daily_overrides add constraint daily_content_publish_date_content_type_key UNIQUE (publish_date, content_type);

alter table only public.daily_overrides add constraint daily_content_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.contributions add constraint contributions_status_check CHECK (status = ANY (ARRAY['pending'::text, 'review'::text, 'accepted'::text, 'rejected'::text, 'published'::text]));

alter table only public.contributions add constraint contributions_pkey PRIMARY KEY (id);

alter table only public.contributions add constraint contributions_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.heritage_updates add constraint heritage_updates_update_type_check CHECK (update_type = ANY (ARRAY['estreno'::text, 'restauracion'::text]));

alter table only public.heritage_updates add constraint heritage_updates_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.heritage_updates add constraint heritage_updates_date_or_year CHECK (update_date IS NOT NULL OR year IS NOT NULL);

alter table only public.heritage_updates add constraint heritage_updates_pkey PRIMARY KEY (id);

alter table only public.heritage_updates add constraint heritage_updates_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.heritage_updates add constraint heritage_updates_target_entity_id_fkey FOREIGN KEY (target_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.heritage_update_agents add constraint heritage_update_agents_pkey PRIMARY KEY (id);

alter table only public.heritage_update_agents add constraint heritage_update_agents_heritage_update_id_agent_entity_id_r_key UNIQUE (heritage_update_id, agent_entity_id, role_name);

alter table only public.heritage_update_agents add constraint heritage_update_agents_heritage_update_id_fkey FOREIGN KEY (heritage_update_id) REFERENCES heritage_updates(id) ON DELETE CASCADE;

alter table only public.heritage_update_agents add constraint heritage_update_agents_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.editorial_content add constraint editorial_content_content_type_check CHECK (content_type = ANY (ARRAY['article'::text, 'news'::text, 'curiosity'::text, 'fact'::text, 'ephemeris'::text]));

alter table only public.editorial_content add constraint editorial_content_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.editorial_content add constraint editorial_content_pkey PRIMARY KEY (id);

alter table only public.editorial_content_links add constraint editorial_content_links_pkey PRIMARY KEY (id);

alter table only public.editorial_content_links add constraint editorial_content_links_editorial_content_id_entity_id_rela_key UNIQUE (editorial_content_id, entity_id, relation_type);

alter table only public.editorial_content_links add constraint editorial_content_links_editorial_content_id_fkey FOREIGN KEY (editorial_content_id) REFERENCES editorial_content(id) ON DELETE CASCADE;

alter table only public.editorial_content_links add constraint editorial_content_links_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.daily_overrides add constraint daily_overrides_editorial_content_id_fkey FOREIGN KEY (editorial_content_id) REFERENCES editorial_content(id) ON DELETE SET NULL;

alter table only public.daily_overrides add constraint daily_overrides_march_entity_id_fkey FOREIGN KEY (march_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.daily_overrides add constraint daily_overrides_event_entity_id_fkey FOREIGN KEY (event_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.daily_overrides add constraint daily_overrides_single_reference CHECK (num_nonnulls(editorial_content_id, march_entity_id, event_entity_id, entity_id) <= 1);

alter table only public.source_links add constraint source_links_heritage_update_id_fkey FOREIGN KEY (heritage_update_id) REFERENCES heritage_updates(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_editorial_content_id_fkey FOREIGN KEY (editorial_content_id) REFERENCES editorial_content(id) ON DELETE CASCADE;

alter table only public.media_assets add constraint media_assets_media_type_check CHECK (media_type = ANY (ARRAY['image'::text, 'document'::text, 'video'::text, 'audio'::text]));

alter table only public.media_assets add constraint media_assets_rights_status_check CHECK (rights_status = ANY (ARRAY['pending'::text, 'owned'::text, 'authorized'::text, 'licensed'::text, 'public_domain'::text, 'restricted'::text]));

alter table only public.media_assets add constraint media_assets_pkey PRIMARY KEY (id);

alter table only public.media_assets add constraint media_assets_storage_path_key UNIQUE (storage_path);

alter table only public.entity_media add constraint entity_media_pkey PRIMARY KEY (id);

alter table only public.entity_media add constraint entity_media_entity_id_media_asset_id_relation_type_key UNIQUE (entity_id, media_asset_id, relation_type);

alter table only public.entity_media add constraint entity_media_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.entity_media add constraint entity_media_media_asset_id_fkey FOREIGN KEY (media_asset_id) REFERENCES media_assets(id) ON DELETE CASCADE;

alter table only public.audit_log add constraint audit_log_action_type_check CHECK (action_type = ANY (ARRAY['create'::text, 'update'::text, 'publish'::text, 'unpublish'::text, 'archive'::text, 'restore'::text, 'delete'::text, 'link'::text, 'unlink'::text]));

alter table only public.audit_log add constraint audit_log_pkey PRIMARY KEY (id);

alter table only public.audit_log add constraint audit_log_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.completeness_rules add constraint completeness_rules_weight_check CHECK (weight > 0);

alter table only public.completeness_rules add constraint completeness_rules_pkey PRIMARY KEY (id);

alter table only public.completeness_rules add constraint completeness_rules_entity_type_rule_key_key UNIQUE (entity_type, rule_key);

alter table only public.band_names add constraint band_names_name_type_check CHECK (name_type = ANY (ARRAY['official'::text, 'popular'::text, 'former'::text, 'acronym'::text]));

alter table only public.band_names add constraint band_names_pkey PRIMARY KEY (id);

alter table only public.band_names add constraint band_names_band_entity_id_name_date_from_key UNIQUE (band_entity_id, name, date_from);

alter table only public.band_names add constraint band_names_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.band_agents add constraint band_agents_pkey PRIMARY KEY (id);

alter table only public.band_agents add constraint band_agents_band_entity_id_agent_entity_id_role_name_date_f_key UNIQUE (band_entity_id, agent_entity_id, role_name, date_from);

alter table only public.band_agents add constraint band_agents_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.band_agents add constraint band_agents_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.music_accompaniment_periods add constraint music_accompaniment_periods_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.music_accompaniment_periods add constraint music_period_start_present CHECK (date_from IS NOT NULL OR date_from_text IS NOT NULL OR year_from IS NOT NULL);

alter table only public.music_accompaniment_periods add constraint music_period_year_order CHECK (year_to IS NULL OR year_from IS NULL OR year_to >= year_from);

alter table only public.music_accompaniment_periods add constraint music_accompaniment_periods_pkey PRIMARY KEY (id);

alter table only public.music_accompaniment_periods add constraint music_accompaniment_periods_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.music_accompaniment_periods add constraint music_accompaniment_periods_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.music_accompaniment_periods add constraint music_accompaniment_periods_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.marches add constraint marches_premiere_place_id_fkey FOREIGN KEY (premiere_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.marches add constraint marches_premiered_by_band_entity_id_fkey FOREIGN KEY (premiered_by_band_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.march_dedications add constraint march_dedications_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.march_dedications add constraint march_dedications_pkey PRIMARY KEY (id);

alter table only public.march_dedications add constraint march_dedications_march_entity_id_dedicatee_entity_id_dedic_key UNIQUE (march_entity_id, dedicatee_entity_id, dedication_type);

alter table only public.march_dedications add constraint march_dedications_march_entity_id_fkey FOREIGN KEY (march_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.march_dedications add constraint march_dedications_dedicatee_entity_id_fkey FOREIGN KEY (dedicatee_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.march_recordings add constraint march_recordings_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.march_recordings add constraint march_recordings_pkey PRIMARY KEY (id);

alter table only public.march_recordings add constraint march_recordings_march_entity_id_fkey FOREIGN KEY (march_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.march_recordings add constraint march_recordings_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.march_recordings add constraint march_recordings_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.source_links add constraint source_links_music_accompaniment_period_id_fkey FOREIGN KEY (music_accompaniment_period_id) REFERENCES music_accompaniment_periods(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_march_dedication_id_fkey FOREIGN KEY (march_dedication_id) REFERENCES march_dedications(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_march_recording_id_fkey FOREIGN KEY (march_recording_id) REFERENCES march_recordings(id) ON DELETE CASCADE;

alter table only public.image_authorships add constraint image_authorships_authorship_type_check CHECK (authorship_type = ANY (ARRAY['author'::text, 'attributed_to'::text, 'workshop_of'::text, 'circle_of'::text, 'school_of'::text, 'anonymous'::text]));

alter table only public.image_authorships add constraint image_authorships_certainty_check CHECK (certainty = ANY (ARRAY['documented'::text, 'attributed'::text, 'traditional'::text, 'unknown'::text]));

alter table only public.image_authorships add constraint image_authorships_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.image_authorships add constraint image_authorships_pkey PRIMARY KEY (id);

alter table only public.image_authorships add constraint image_authorships_image_entity_id_agent_entity_id_authorshi_key UNIQUE (image_entity_id, agent_entity_id, authorship_type, role_name);

alter table only public.image_authorships add constraint image_authorships_image_entity_id_fkey FOREIGN KEY (image_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.image_authorships add constraint image_authorships_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.image_names add constraint image_names_name_type_check CHECK (name_type = ANY (ARRAY['official'::text, 'popular'::text, 'former'::text, 'catalogue'::text, 'devotional'::text]));

alter table only public.image_names add constraint image_names_pkey PRIMARY KEY (id);

alter table only public.image_names add constraint image_names_image_entity_id_name_date_from_key UNIQUE (image_entity_id, name, date_from);

alter table only public.image_names add constraint image_names_image_entity_id_fkey FOREIGN KEY (image_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_image_authorship_id_fkey FOREIGN KEY (image_authorship_id) REFERENCES image_authorships(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_brotherhood_image_id_fkey FOREIGN KEY (brotherhood_image_id) REFERENCES brotherhood_images(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_entity_location_id_fkey FOREIGN KEY (entity_location_id) REFERENCES entity_locations(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_entity_relation_id_fkey FOREIGN KEY (entity_relation_id) REFERENCES entity_relations(id) ON DELETE CASCADE;

alter table only public.step_phases add constraint step_phases_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.step_phases add constraint step_phases_pkey PRIMARY KEY (id);

alter table only public.step_phases add constraint step_phases_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.step_phase_agents add constraint step_phase_agents_pkey PRIMARY KEY (id);

alter table only public.step_phase_agents add constraint step_phase_agents_step_phase_id_agent_entity_id_discipline__key UNIQUE (step_phase_id, agent_entity_id, discipline, element_entity_id);

alter table only public.step_phase_agents add constraint step_phase_agents_step_phase_id_fkey FOREIGN KEY (step_phase_id) REFERENCES step_phases(id) ON DELETE CASCADE;

alter table only public.step_phase_agents add constraint step_phase_agents_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.step_phase_agents add constraint step_phase_agents_element_entity_id_fkey FOREIGN KEY (element_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.heritage_interventions add constraint heritage_interventions_step_phase_id_fkey FOREIGN KEY (step_phase_id) REFERENCES step_phases(id) ON DELETE SET NULL;

alter table only public.step_personnel_periods add constraint step_personnel_periods_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.step_personnel_periods add constraint step_personnel_start_present CHECK (date_from IS NOT NULL OR date_from_text IS NOT NULL OR year_from IS NOT NULL);

alter table only public.step_personnel_periods add constraint step_personnel_year_order CHECK (year_to IS NULL OR year_from IS NULL OR year_to >= year_from);

alter table only public.step_personnel_periods add constraint step_personnel_periods_pkey PRIMARY KEY (id);

alter table only public.step_personnel_periods add constraint step_personnel_periods_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.step_personnel_periods add constraint step_personnel_periods_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.source_links add constraint source_links_step_phase_id_fkey FOREIGN KEY (step_phase_id) REFERENCES step_phases(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_step_personnel_period_id_fkey FOREIGN KEY (step_personnel_period_id) REFERENCES step_personnel_periods(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_brotherhood_step_id_fkey FOREIGN KEY (brotherhood_step_id) REFERENCES brotherhood_steps(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_image_step_id_fkey FOREIGN KEY (image_step_id) REFERENCES image_steps(id) ON DELETE CASCADE;

alter table only public.steps add constraint steps_current_condition_check CHECK (current_condition IS NULL OR (current_condition = ANY (ARRAY['preserved'::text, 'partially_preserved'::text, 'not_preserved'::text])));

alter table only public.agent_names add constraint agent_names_name_type_check CHECK (name_type = ANY (ARRAY['official'::text, 'commercial'::text, 'former'::text, 'artistic'::text, 'alias'::text, 'acronym'::text]));

alter table only public.agent_names add constraint agent_names_pkey PRIMARY KEY (id);

alter table only public.agent_names add constraint agent_names_agent_entity_id_name_date_from_key UNIQUE (agent_entity_id, name, date_from);

alter table only public.agent_names add constraint agent_names_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.agent_disciplines add constraint agent_disciplines_pkey PRIMARY KEY (id);

alter table only public.agent_disciplines add constraint agent_disciplines_agent_entity_id_discipline_key UNIQUE (agent_entity_id, discipline);

alter table only public.agent_disciplines add constraint agent_disciplines_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_agent_name_id_fkey FOREIGN KEY (agent_name_id) REFERENCES agent_names(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_agent_role_id_fkey FOREIGN KEY (agent_role_id) REFERENCES agent_roles(id) ON DELETE CASCADE;

alter table only public.cult_entities add constraint cult_entities_pkey PRIMARY KEY (id);

alter table only public.cult_entities add constraint cult_entities_cult_id_entity_id_role_key UNIQUE (cult_id, entity_id, role);

alter table only public.cult_entities add constraint cult_entities_cult_id_fkey FOREIGN KEY (cult_id) REFERENCES cults(id) ON DELETE CASCADE;

alter table only public.cult_entities add constraint cult_entities_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.cult_occurrences add constraint cult_occurrences_event_status_check CHECK (event_status = ANY (ARRAY['announced'::text, 'held'::text, 'cancelled'::text]));

alter table only public.cult_occurrences add constraint cult_occurrences_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.cult_occurrences add constraint cult_occurrence_date_order CHECK (end_date IS NULL OR end_date >= start_date);

alter table only public.cult_occurrences add constraint cult_occurrences_pkey PRIMARY KEY (id);

alter table only public.cult_occurrences add constraint cult_occurrences_cult_id_year_start_date_key UNIQUE (cult_id, year, start_date);

alter table only public.cult_occurrences add constraint cult_occurrences_cult_id_fkey FOREIGN KEY (cult_id) REFERENCES cults(id) ON DELETE CASCADE;

alter table only public.cult_occurrences add constraint cult_occurrences_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.cult_occurrence_days add constraint cult_occurrence_days_pkey PRIMARY KEY (id);

alter table only public.cult_occurrence_days add constraint cult_occurrence_days_cult_occurrence_id_fkey FOREIGN KEY (cult_occurrence_id) REFERENCES cult_occurrences(id) ON DELETE CASCADE;

alter table only public.cult_occurrence_days add constraint cult_occurrence_days_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outing_route_points add constraint outing_route_points_point_type_check CHECK (point_type = ANY (ARRAY['street'::text, 'place'::text, 'milestone'::text]));

alter table only public.outing_route_points add constraint outing_route_points_pkey PRIMARY KEY (id);

alter table only public.outing_route_points add constraint outing_route_points_outing_id_sequence_no_key UNIQUE (outing_id, sequence_no);

alter table only public.outing_route_points add constraint outing_route_points_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES outings(id) ON DELETE CASCADE;

alter table only public.outing_route_points add constraint outing_route_points_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outing_schedule_items add constraint outing_schedule_items_pkey PRIMARY KEY (id);

alter table only public.outing_schedule_items add constraint outing_schedule_items_outing_id_sequence_no_key UNIQUE (outing_id, sequence_no);

alter table only public.outing_schedule_items add constraint outing_schedule_items_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES outings(id) ON DELETE CASCADE;

alter table only public.outing_schedule_items add constraint outing_schedule_items_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.source_links add constraint source_links_cult_occurrence_id_fkey FOREIGN KEY (cult_occurrence_id) REFERENCES cult_occurrences(id) ON DELETE CASCADE;

alter table only public.outing_music_positions add constraint outing_music_positions_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.outing_music_positions add constraint outing_music_positions_pkey PRIMARY KEY (id);

alter table only public.outing_music_positions add constraint outing_music_positions_outing_id_sequence_no_key UNIQUE (outing_id, sequence_no);

alter table only public.outing_music_positions add constraint outing_music_positions_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES outings(id) ON DELETE CASCADE;

alter table only public.outing_music_positions add constraint outing_music_positions_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.outing_music_assignments add constraint outing_music_assignments_participation_mode_check CHECK (participation_mode = ANY (ARRAY['full_route'::text, 'segment'::text, 'alternating'::text, 'unspecified'::text]));

alter table only public.outing_music_assignments add constraint outing_music_assignments_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.outing_music_assignments add constraint outing_music_assignments_pkey PRIMARY KEY (id);

alter table only public.outing_music_assignments add constraint outing_music_assignments_music_position_id_band_entity_id_s_key UNIQUE (music_position_id, band_entity_id, sequence_no);

alter table only public.outing_music_assignments add constraint outing_music_assignments_music_position_id_fkey FOREIGN KEY (music_position_id) REFERENCES outing_music_positions(id) ON DELETE CASCADE;

alter table only public.outing_music_assignments add constraint outing_music_assignments_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.source_links add constraint source_links_outing_music_position_id_fkey FOREIGN KEY (outing_music_position_id) REFERENCES outing_music_positions(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_outing_music_assignment_id_fkey FOREIGN KEY (outing_music_assignment_id) REFERENCES outing_music_assignments(id) ON DELETE CASCADE;

alter table only public.brotherhood_colors add constraint brotherhood_colors_color_role_check CHECK (color_role = ANY (ARRAY['primary'::text, 'secondary'::text, 'accent'::text, 'identity'::text]));

alter table only public.brotherhood_colors add constraint brotherhood_colors_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.brotherhood_colors add constraint brotherhood_colors_hex_format CHECK (hex_value IS NULL OR hex_value ~ '^#[0-9A-Fa-f]{6}$'::text);

alter table only public.brotherhood_colors add constraint brotherhood_colors_pkey PRIMARY KEY (id);

alter table only public.brotherhood_colors add constraint brotherhood_colors_brotherhood_entity_id_color_name_key UNIQUE (brotherhood_entity_id, color_name);

alter table only public.brotherhood_colors add constraint brotherhood_colors_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.outing_series add constraint outing_series_character_check CHECK ("character" = ANY (ARRAY['ordinary'::text, 'extraordinary'::text]));

alter table only public.outing_series add constraint outing_series_month_check CHECK (month >= 1 AND month <= 12);

alter table only public.outing_series add constraint outing_series_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.outing_series add constraint outing_series_pkey PRIMARY KEY (id);

alter table only public.outing_series add constraint outing_series_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.outing_series add constraint outing_series_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.outing_series add constraint outing_series_origin_place_id_fkey FOREIGN KEY (origin_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outing_series add constraint outing_series_destination_place_id_fkey FOREIGN KEY (destination_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outing_series_movements add constraint outing_series_movements_pkey PRIMARY KEY (id);

alter table only public.outing_series_movements add constraint outing_series_movements_outing_series_id_sequence_no_key UNIQUE (outing_series_id, sequence_no);

alter table only public.outing_series_movements add constraint outing_series_movements_outing_series_id_fkey FOREIGN KEY (outing_series_id) REFERENCES outing_series(id) ON DELETE CASCADE;

alter table only public.outing_series_movements add constraint outing_series_movements_origin_place_id_fkey FOREIGN KEY (origin_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outing_series_movements add constraint outing_series_movements_destination_place_id_fkey FOREIGN KEY (destination_place_id) REFERENCES places(id) ON DELETE SET NULL;

alter table only public.outings add constraint outings_outing_series_id_fkey FOREIGN KEY (outing_series_id) REFERENCES outing_series(id) ON DELETE SET NULL;

alter table only public.source_links add constraint source_links_outing_series_id_fkey FOREIGN KEY (outing_series_id) REFERENCES outing_series(id) ON DELETE CASCADE;

alter table only public.panel_users add constraint panel_users_role_check CHECK (role = ANY (ARRAY['admin'::text, 'editor'::text, 'collaborator'::text]));

alter table only public.panel_users add constraint panel_users_pkey PRIMARY KEY (user_id);

alter table only public.panel_users add constraint panel_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table only public.entity_social_links add constraint entity_social_links_url_check CHECK (url ~ '^https?://'::text);

alter table only public.entity_social_links add constraint entity_social_links_pkey PRIMARY KEY (id);

alter table only public.entity_social_links add constraint entity_social_links_entity_id_platform_key UNIQUE (entity_id, platform);

alter table only public.entity_social_links add constraint entity_social_links_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.bands add constraint bands_primary_color_format CHECK (primary_color IS NULL OR primary_color ~ '^#[0-9A-Fa-f]{6}$'::text);

alter table only public.bands add constraint bands_secondary_color_format CHECK (secondary_color IS NULL OR secondary_color ~ '^#[0-9A-Fa-f]{6}$'::text);

alter table only public.band_premieres add constraint band_premieres_premiere_year_check CHECK (premiere_year >= 1800 AND premiere_year <= 2200);

alter table only public.band_premieres add constraint band_premieres_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.band_premieres add constraint band_premieres_pkey PRIMARY KEY (id);

alter table only public.band_premieres add constraint band_premieres_band_entity_id_title_premiere_year_key UNIQUE (band_entity_id, title, premiere_year);

alter table only public.band_premieres add constraint band_premieres_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.band_premieres add constraint band_premieres_source_id_fkey FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE SET NULL;

alter table only public.source_links add constraint source_links_band_premiere_id_fkey FOREIGN KEY (band_premiere_id) REFERENCES band_premieres(id) ON DELETE CASCADE;

alter table only public.band_premieres add constraint band_premieres_march_entity_id_fkey FOREIGN KEY (march_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.march_authors add constraint march_authors_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.bands add constraint bands_banderin_entity_id_fkey FOREIGN KEY (banderin_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.entity_social_links add constraint entity_social_links_platform_check CHECK (platform = ANY (ARRAY['website'::text, 'facebook'::text, 'instagram'::text, 'x'::text, 'youtube'::text, 'spotify'::text, 'tiktok'::text, 'whatsapp'::text]));

alter table only public.band_releases add constraint band_releases_release_type_check CHECK (release_type = ANY (ARRAY['album'::text, 'ep'::text, 'single'::text, 'live'::text, 'compilation'::text, 'other'::text]));

alter table only public.band_releases add constraint band_releases_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.band_releases add constraint band_releases_pkey PRIMARY KEY (id);

alter table only public.band_releases add constraint band_releases_band_entity_id_title_release_year_key UNIQUE (band_entity_id, title, release_year);

alter table only public.band_releases add constraint band_releases_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.band_release_tracks add constraint band_release_tracks_pkey PRIMARY KEY (id);

alter table only public.band_release_tracks add constraint band_release_tracks_release_id_sequence_no_key UNIQUE (release_id, sequence_no);

alter table only public.band_release_tracks add constraint band_release_tracks_release_id_fkey FOREIGN KEY (release_id) REFERENCES band_releases(id) ON DELETE CASCADE;

alter table only public.band_release_tracks add constraint band_release_tracks_march_entity_id_fkey FOREIGN KEY (march_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.band_release_sources add constraint band_release_sources_pkey PRIMARY KEY (release_id, source_id);

alter table only public.band_release_sources add constraint band_release_sources_release_id_fkey FOREIGN KEY (release_id) REFERENCES band_releases(id) ON DELETE CASCADE;

alter table only public.band_release_sources add constraint band_release_sources_source_id_fkey FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE;

alter table only public.document_imports add constraint document_imports_status_check CHECK (status = ANY (ARRAY['review'::text, 'applied'::text, 'discarded'::text, 'failed'::text]));

alter table only public.document_imports add constraint document_imports_pkey PRIMARY KEY (id);

alter table only public.document_imports add constraint document_imports_target_entity_id_fkey FOREIGN KEY (target_entity_id) REFERENCES entities(id) ON DELETE SET NULL;

alter table only public.document_imports add constraint document_imports_source_id_fkey FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE SET NULL;

alter table only public.document_imports add constraint document_imports_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table only public.band_colors add constraint band_colors_color_role_check CHECK (color_role = ANY (ARRAY['primary'::text, 'secondary'::text, 'accent'::text, 'identity'::text]));

alter table only public.band_colors add constraint band_colors_hex_format CHECK (hex_value IS NULL OR hex_value ~ '^#[0-9A-Fa-f]{6}$'::text);

alter table only public.band_colors add constraint band_colors_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.band_colors add constraint band_colors_pkey PRIMARY KEY (id);

alter table only public.band_colors add constraint band_colors_band_entity_id_color_name_key UNIQUE (band_entity_id, color_name);

alter table only public.band_colors add constraint band_colors_band_entity_id_fkey FOREIGN KEY (band_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.brotherhood_habits add constraint brotherhood_habits_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.brotherhood_habits add constraint brotherhood_habits_pkey PRIMARY KEY (id);

alter table only public.brotherhood_habits add constraint brotherhood_habits_brotherhood_entity_id_name_key UNIQUE (brotherhood_entity_id, name);

alter table only public.brotherhood_habits add constraint brotherhood_habits_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_brotherhood_habit_id_fkey FOREIGN KEY (brotherhood_habit_id) REFERENCES brotherhood_habits(id) ON DELETE CASCADE;

alter table only public.source_links add constraint source_links_one_target CHECK (num_nonnulls(entity_id, outing_id, cult_id, intervention_id, heritage_update_id, editorial_content_id, music_accompaniment_period_id, march_dedication_id, march_recording_id, image_authorship_id, brotherhood_image_id, entity_location_id, entity_relation_id, step_phase_id, step_personnel_period_id, brotherhood_step_id, image_step_id, agent_name_id, agent_role_id, cult_occurrence_id, outing_music_position_id, outing_music_assignment_id, outing_series_id, band_premiere_id, brotherhood_habit_id) = 1);

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_year_check CHECK (year >= 1900 AND year <= 2100);

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_nonnegative_counts_check CHECK ((nazarenos_count IS NULL OR nazarenos_count >= 0) AND (penitents_count IS NULL OR penitents_count >= 0) AND (total_nazarenos_count IS NULL OR total_nazarenos_count >= 0) AND (acolytes_count IS NULL OR acolytes_count >= 0) AND (monaguillos_count IS NULL OR monaguillos_count >= 0) AND (musical_accompaniment_count IS NULL OR musical_accompaniment_count >= 0) AND (total_procession_count IS NULL OR total_procession_count >= 0));

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_nonnegative_durations_check CHECK ((official_route_duration_minutes IS NULL OR official_route_duration_minutes >= 0) AND (official_career_duration_minutes IS NULL OR official_career_duration_minutes >= 0));

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_positions_check CHECK ((position_by_nazarenos IS NULL OR position_by_nazarenos > 0) AND (position_by_procession IS NULL OR position_by_procession > 0) AND (brotherhoods_in_day IS NULL OR brotherhoods_in_day > 0) AND (position_by_nazarenos IS NULL OR brotherhoods_in_day IS NULL OR position_by_nazarenos <= brotherhoods_in_day) AND (position_by_procession IS NULL OR brotherhoods_in_day IS NULL OR position_by_procession <= brotherhoods_in_day));

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_pkey PRIMARY KEY (id);

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_brotherhood_year_key UNIQUE (brotherhood_entity_id, year);

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.brotherhood_procession_stats add constraint brotherhood_procession_stats_source_id_fkey FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE SET NULL;

alter table only public.media_assets add constraint media_assets_width_px_check CHECK (width_px IS NULL OR width_px > 0);

alter table only public.media_assets add constraint media_assets_height_px_check CHECK (height_px IS NULL OR height_px > 0);

alter table only public.entity_media add constraint entity_media_focus_x_check CHECK (focus_x >= 0::numeric AND focus_x <= 100::numeric);

alter table only public.entity_media add constraint entity_media_focus_y_check CHECK (focus_y >= 0::numeric AND focus_y <= 100::numeric);

alter table only public.entity_media add constraint entity_media_mobile_focus_x_check CHECK (mobile_focus_x IS NULL OR mobile_focus_x >= 0::numeric AND mobile_focus_x <= 100::numeric);

alter table only public.entity_media add constraint entity_media_mobile_focus_y_check CHECK (mobile_focus_y IS NULL OR mobile_focus_y >= 0::numeric AND mobile_focus_y <= 100::numeric);

alter table only public.entity_media add constraint entity_media_fit_mode_check CHECK (fit_mode = ANY (ARRAY['auto'::text, 'cover'::text, 'contain'::text]));

alter table only public.brotherhood_section_authority add constraint brotherhood_section_authority_section_key_check CHECK (section_key = ANY (ARRAY['identidad'::text, 'colores'::text, 'historia'::text, 'enlaces'::text, 'titulares'::text, 'pasos'::text, 'salidas'::text, 'cultos'::text, 'patrimonio'::text, 'estrenos'::text, 'acontecimientos'::text, 'acompanamiento'::text, 'jornada'::text, 'fuentes'::text]));

alter table only public.brotherhood_section_authority add constraint brotherhood_section_authority_source_check CHECK (source = ANY (ARRAY['panel'::text, 'migration'::text]));

alter table only public.brotherhood_section_authority add constraint brotherhood_section_authority_pkey PRIMARY KEY (brotherhood_entity_id, section_key);

alter table only public.brotherhood_section_authority add constraint brotherhood_section_authority_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.outing_music_assignments add constraint outing_music_assignments_band_required CHECK (band_entity_id IS NOT NULL OR NULLIF(btrim(band_name_text), ''::text) IS NOT NULL);

alter table only public.image_authorships add constraint image_authorships_agent_presence_check CHECK (authorship_type = 'anonymous'::text AND agent_entity_id IS NULL AND certainty = 'unknown'::text OR authorship_type <> 'anonymous'::text AND agent_entity_id IS NOT NULL);

alter table only public.outing_media add constraint outing_media_role_check CHECK (role = ANY (ARRAY['poster'::text, 'gallery'::text]));

alter table only public.outing_media add constraint outing_media_pkey PRIMARY KEY (id);

alter table only public.outing_media add constraint outing_media_outing_id_media_asset_id_role_key UNIQUE (outing_id, media_asset_id, role);

alter table only public.outing_media add constraint outing_media_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES outings(id) ON DELETE CASCADE;

alter table only public.outing_media add constraint outing_media_media_asset_id_fkey FOREIGN KEY (media_asset_id) REFERENCES media_assets(id) ON DELETE CASCADE;

alter table only public.bulk_imports add constraint bulk_imports_status_check CHECK (status = ANY (ARRAY['staging'::text, 'ready'::text, 'processing'::text, 'completed'::text, 'completed_with_errors'::text, 'cancelled'::text]));

alter table only public.bulk_imports add constraint bulk_imports_expected_items_check CHECK (expected_items >= 0);

alter table only public.bulk_imports add constraint bulk_imports_staged_items_check CHECK (staged_items >= 0);

alter table only public.bulk_imports add constraint bulk_imports_valid_items_check CHECK (valid_items >= 0);

alter table only public.bulk_imports add constraint bulk_imports_invalid_items_check CHECK (invalid_items >= 0);

alter table only public.bulk_imports add constraint bulk_imports_applied_items_check CHECK (applied_items >= 0);

alter table only public.bulk_imports add constraint bulk_imports_failed_items_check CHECK (failed_items >= 0);

alter table only public.bulk_imports add constraint bulk_imports_pkey PRIMARY KEY (id);

alter table only public.bulk_import_items add constraint bulk_import_items_position_check CHECK ("position" >= 0);

alter table only public.bulk_import_items add constraint bulk_import_items_operation_check CHECK (operation = ANY (ARRAY['insert'::text, 'upsert'::text]));

alter table only public.bulk_import_items add constraint bulk_import_items_status_check CHECK (status = ANY (ARRAY['valid'::text, 'invalid'::text, 'applied'::text, 'failed'::text]));

alter table only public.bulk_import_items add constraint bulk_import_items_pkey PRIMARY KEY (id);

alter table only public.bulk_import_items add constraint bulk_import_items_import_id_position_key UNIQUE (import_id, "position");

alter table only public.bulk_import_items add constraint bulk_import_items_import_id_fkey FOREIGN KEY (import_id) REFERENCES bulk_imports(id) ON DELETE CASCADE;

alter table only public.brotherhood_habits add constraint brotherhood_habits_image_path_internal_reference CHECK (image_path IS NULL OR image_path !~* '^https?://[^/]+/storage/v1/object/public/hilo-media/'::text);

alter table only public.media_assets add constraint media_assets_open_provenance_check CHECK (open_media_provenance_is_valid(storage_path, rights_status, license, author_name, rights_holder, source_name, source_url, alt_text, permission_notes));

alter table only public.entity_names add constraint entity_names_name_type_check CHECK (name_type = ANY (ARRAY['official'::text, 'popular'::text, 'alternative'::text, 'historical'::text, 'liturgical'::text, 'short'::text]));

alter table only public.entity_names add constraint entity_names_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.entity_names add constraint entity_names_pkey PRIMARY KEY (id);

alter table only public.entity_names add constraint entity_names_unique UNIQUE (entity_id, name, name_type);

alter table only public.entity_names add constraint entity_names_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;

alter table only public.marches add constraint marches_work_type_check CHECK (work_type = ANY (ARRAY['Marcha procesional'::text, 'Himno'::text, 'Copla'::text, 'Adaptación'::text]));

alter table only public.cult_media add constraint cult_media_role_check CHECK (role = ANY (ARRAY['cover'::text, 'gallery'::text]));

alter table only public.cult_media add constraint cult_media_fit_mode_check CHECK (fit_mode = ANY (ARRAY['auto'::text, 'cover'::text, 'contain'::text]));

alter table only public.cult_media add constraint cult_media_focus_x_check CHECK (focus_x >= 0::numeric AND focus_x <= 100::numeric);

alter table only public.cult_media add constraint cult_media_focus_y_check CHECK (focus_y >= 0::numeric AND focus_y <= 100::numeric);

alter table only public.cult_media add constraint cult_media_mobile_focus_x_check CHECK (mobile_focus_x IS NULL OR mobile_focus_x >= 0::numeric AND mobile_focus_x <= 100::numeric);

alter table only public.cult_media add constraint cult_media_mobile_focus_y_check CHECK (mobile_focus_y IS NULL OR mobile_focus_y >= 0::numeric AND mobile_focus_y <= 100::numeric);

alter table only public.cult_media add constraint cult_media_cover_role_check CHECK (NOT is_cover OR role = 'cover'::text);

alter table only public.cult_media add constraint cult_media_pkey PRIMARY KEY (id);

alter table only public.cult_media add constraint cult_media_cult_asset_role_key UNIQUE (cult_id, media_asset_id, role);

alter table only public.cult_media add constraint cult_media_cult_id_fkey FOREIGN KEY (cult_id) REFERENCES cults(id) ON DELETE CASCADE;

alter table only public.cult_media add constraint cult_media_media_asset_id_fkey FOREIGN KEY (media_asset_id) REFERENCES media_assets(id) ON DELETE CASCADE;

alter table only public.legal_drafts add constraint legal_drafts_document_key_check CHECK (document_key = ANY (ARRAY['direction_sheet'::text, 'legal_notice'::text, 'privacy_policy'::text, 'storage_policy'::text]));

alter table only public.legal_drafts add constraint legal_drafts_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'ready'::text]));

alter table only public.legal_drafts add constraint legal_drafts_pkey PRIMARY KEY (id);

alter table only public.legal_drafts add constraint legal_drafts_document_key_key UNIQUE (document_key);

alter table only public.legal_drafts add constraint legal_drafts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table only public.events add constraint events_brotherhood_entity_id_fkey FOREIGN KEY (brotherhood_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.events add constraint events_municipality_id_fkey FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

alter table only public.events add constraint events_category_check CHECK (event_category = ANY (ARRAY['historical'::text, 'crew_call'::text]));

alter table only public.events add constraint events_status_check CHECK (event_status = ANY (ARRAY['announced'::text, 'postponed'::text, 'cancelled'::text, 'held'::text]));

alter table only public.events add constraint events_time_order_check CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time);

alter table only public.events add constraint crew_event_required_fields_check CHECK (event_category <> 'crew_call'::text OR event_date IS NOT NULL AND brotherhood_entity_id IS NOT NULL AND (event_type = ANY (ARRAY['iguala'::text, 'ensayo'::text, 'muda'::text, 'retranqueo'::text, 'desarma'::text, 'reunion_cuadrilla'::text, 'acto_costalero'::text])));

alter table only public.crew_event_steps add constraint crew_event_steps_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.crew_event_steps add constraint crew_event_steps_pkey PRIMARY KEY (id);

alter table only public.crew_event_steps add constraint crew_event_steps_event_entity_id_fkey FOREIGN KEY (event_entity_id) REFERENCES events(entity_id) ON DELETE CASCADE;

alter table only public.crew_event_steps add constraint crew_event_steps_step_entity_id_fkey FOREIGN KEY (step_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

alter table only public.crew_event_agents add constraint crew_event_agents_status_check CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text]));

alter table only public.crew_event_agents add constraint crew_event_agents_role_present CHECK (btrim(role_name) <> ''::text);

alter table only public.crew_event_agents add constraint crew_event_agents_pkey PRIMARY KEY (id);

alter table only public.crew_event_agents add constraint crew_event_agents_event_entity_id_fkey FOREIGN KEY (event_entity_id) REFERENCES events(entity_id) ON DELETE CASCADE;

alter table only public.crew_event_agents add constraint crew_event_agents_agent_entity_id_fkey FOREIGN KEY (agent_entity_id) REFERENCES entities(id) ON DELETE RESTRICT;

create view public.daily_editorial_candidates with (security_invoker=true) as
 SELECT id,
    content_type,
    title,
    summary,
    daily_priority,
    publish_date
   FROM editorial_content ec
  WHERE status = 'published'::text AND eligible_for_daily = true AND (content_type = ANY (ARRAY['fact'::text, 'curiosity'::text]));;

create view public.today_ephemeris_candidates with (security_invoker=true) as
 SELECT e.entity_id,
    en.name AS title,
    e.event_type,
    e.event_date,
    e.event_date_text,
    e.description
   FROM events e
     JOIN entities en ON en.id = e.entity_id
  WHERE en.status = 'published'::text AND e.event_date IS NOT NULL AND EXTRACT(month FROM e.event_date) = EXTRACT(month FROM (now() AT TIME ZONE 'Europe/Madrid'::text)::date) AND EXTRACT(day FROM e.event_date) = EXTRACT(day FROM (now() AT TIME ZONE 'Europe/Madrid'::text)::date);;

create view public.daily_march_candidates with (security_invoker=true) as
 WITH eligible AS (
         SELECT entity.id AS entity_id,
            entity.name,
            march.composition_year,
            march.composition_date_text,
            march.youtube_video_id,
            COALESCE(march.daily_priority::integer, 0)::smallint AS editorial_priority,
            row_number() OVER (ORDER BY entity.id) AS rotation_position,
            count(*) OVER () AS rotation_count
           FROM marches march
             JOIN entities entity ON entity.id = march.entity_id
          WHERE entity.status = 'published'::text AND march.eligible_for_daily = true AND (EXISTS ( SELECT 1
                   FROM march_authors author
                     JOIN entities composer ON composer.id = author.agent_entity_id AND composer.status = 'published'::text
                  WHERE author.march_entity_id = march.entity_id AND author.author_role = 'composer'::text)) AND (NULLIF(TRIM(BOTH FROM march.youtube_video_id), ''::text) IS NOT NULL OR (EXISTS ( SELECT 1
                   FROM march_recordings recording
                  WHERE recording.march_entity_id = march.entity_id AND recording.status = 'published'::text AND (NULLIF(TRIM(BOTH FROM recording.youtube_video_id), ''::text) IS NOT NULL OR NULLIF(TRIM(BOTH FROM recording.external_url), ''::text) IS NOT NULL))) OR (EXISTS ( SELECT 1
                   FROM band_release_tracks track
                     JOIN band_releases release ON release.id = track.release_id
                  WHERE track.march_entity_id = march.entity_id AND release.status = 'published'::text AND NULLIF(TRIM(BOTH FROM track.spotify_url), ''::text) IS NOT NULL)))
        )
 SELECT entity_id,
    name,
    composition_year,
    composition_date_text,
    youtube_video_id,
        CASE
            WHEN rotation_count > 0 AND rotation_position = (1 + mod(((now() AT TIME ZONE 'Europe/Madrid'::text)::date - '1970-01-01'::date)::bigint, rotation_count)) THEN 32767::smallint
            ELSE LEAST(editorial_priority::integer, 32766)::smallint
        END AS daily_priority
   FROM eligible;;

create view public.brotherhood_completeness_signals with (security_invoker=true) as
 SELECT entity_id,
    popular_name IS NOT NULL AND official_name IS NOT NULL AND foundation_text IS NOT NULL AS identity,
    crest_path IS NOT NULL AS crest,
    canonical_see_place_id IS NOT NULL AS canonical_see,
    current_procession_day IS NOT NULL AS procession_day,
    (EXISTS ( SELECT 1
           FROM brotherhood_images bi
          WHERE bi.brotherhood_entity_id = b.entity_id AND bi.status = 'published'::text)) AS images,
    (EXISTS ( SELECT 1
           FROM brotherhood_steps bs
          WHERE bs.brotherhood_entity_id = b.entity_id AND bs.status = 'published'::text)) AS steps,
    (EXISTS ( SELECT 1
           FROM cults c
          WHERE c.brotherhood_entity_id = b.entity_id AND c.status = 'published'::text)) AS cults,
    (EXISTS ( SELECT 1
           FROM outings o
          WHERE o.brotherhood_entity_id = b.entity_id AND o.status = 'published'::text)) AS outings,
    (EXISTS ( SELECT 1
           FROM outings o
             JOIN accompaniments a ON a.outing_id = o.id
          WHERE o.brotherhood_entity_id = b.entity_id AND o.status = 'published'::text AND a.status = 'published'::text)) AS music,
    (EXISTS ( SELECT 1
           FROM source_links sl
          WHERE sl.entity_id = b.entity_id)) AS sources
   FROM brotherhoods b;;

create view public.brotherhood_completeness with (security_invoker=true) as
 SELECT entity_id,
    round(100.0 * (
        CASE
            WHEN identity THEN 2
            ELSE 0
        END +
        CASE
            WHEN crest THEN 1
            ELSE 0
        END +
        CASE
            WHEN canonical_see THEN 1
            ELSE 0
        END +
        CASE
            WHEN procession_day THEN 1
            ELSE 0
        END +
        CASE
            WHEN images THEN 2
            ELSE 0
        END +
        CASE
            WHEN steps THEN 2
            ELSE 0
        END +
        CASE
            WHEN cults THEN 1
            ELSE 0
        END +
        CASE
            WHEN outings THEN 1
            ELSE 0
        END +
        CASE
            WHEN music THEN 1
            ELSE 0
        END +
        CASE
            WHEN sources THEN 2
            ELSE 0
        END)::numeric / 14.0)::integer AS completion_percentage,
    identity,
    crest,
    canonical_see,
    procession_day,
    images,
    steps,
    cults,
    outings,
    music,
    sources
   FROM brotherhood_completeness_signals s;;

create view public.current_music_accompaniments with (security_invoker=true) as
 SELECT id,
    brotherhood_entity_id,
    band_entity_id,
    step_entity_id,
    "position",
    outing_type,
    year_from,
    date_from_text,
    notes
   FROM music_accompaniment_periods map
  WHERE status = 'published'::text AND is_current = true;;

create view public.marches_with_dedications with (security_invoker=true) as
 SELECT me.id AS march_entity_id,
    me.name AS march_name,
    m.composition_year,
    m.youtube_video_id,
    md.dedicatee_entity_id,
    de.name AS dedicatee_name,
    de.entity_type AS dedicatee_type,
    md.dedication_type,
    md.dedication_text
   FROM entities me
     JOIN marches m ON m.entity_id = me.id
     LEFT JOIN march_dedications md ON md.march_entity_id = me.id AND md.status = 'published'::text
     LEFT JOIN entities de ON de.id = md.dedicatee_entity_id
  WHERE me.status = 'published'::text;;

create view public.advocation_images with (security_invoker=true) as
 SELECT a.entity_id AS advocation_entity_id,
    ae.name AS advocation_name,
    i.entity_id AS image_entity_id,
    ie.name AS image_name,
    i.execution_date,
    i.execution_date_text,
    i.current_condition
   FROM advocations a
     JOIN entities ae ON ae.id = a.entity_id
     JOIN images i ON i.advocation_entity_id = a.entity_id
     JOIN entities ie ON ie.id = i.entity_id
  WHERE ae.status = 'published'::text AND ie.status = 'published'::text;;

create view public.image_brotherhood_history with (security_invoker=true) as
 SELECT bi.id AS relation_id,
    bi.image_entity_id,
    ie.name AS image_name,
    bi.brotherhood_entity_id,
    be.name AS brotherhood_name,
    bi.relation_type,
    bi.date_from,
    bi.date_from_text,
    bi.date_to,
    bi.date_to_text,
    bi.date_to IS NULL AND bi.date_to_text IS NULL AS is_current,
    bi.notes
   FROM brotherhood_images bi
     JOIN entities ie ON ie.id = bi.image_entity_id
     JOIN entities be ON be.id = bi.brotherhood_entity_id
  WHERE bi.status = 'published'::text;;

create view public.current_image_locations with (security_invoker=true) as
 SELECT el.id AS location_relation_id,
    el.entity_id AS image_entity_id,
    ie.name AS image_name,
    el.place_id,
    p.name AS place_name,
    el.municipality_id,
    m.name AS municipality_name,
    el.custodian_entity_id,
    ce.name AS custodian_name,
    el.location_type,
    el.notes
   FROM entity_locations el
     JOIN entities ie ON ie.id = el.entity_id AND ie.entity_type = 'image'::text
     LEFT JOIN places p ON p.id = el.place_id
     LEFT JOIN municipalities m ON m.id = el.municipality_id
     LEFT JOIN entities ce ON ce.id = el.custodian_entity_id
  WHERE el.status = 'published'::text AND el.is_current = true;;

create view public.image_restorations with (security_invoker=true) as
 SELECT hu.id,
    hu.target_entity_id AS image_entity_id,
    ie.name AS image_name,
    hu.title,
    hu.update_date,
    hu.year,
    hu.discipline,
    hu.description
   FROM heritage_updates hu
     JOIN entities ie ON ie.id = hu.target_entity_id
  WHERE hu.status = 'published'::text AND hu.update_type = 'restauracion'::text AND ie.entity_type = 'image'::text;;

create view public.image_authorship_details with (security_invoker=true) as
 SELECT ia.id,
    ia.image_entity_id,
    ie.name AS image_name,
    ia.agent_entity_id,
    ae.name AS agent_name,
    ia.authorship_type,
    ia.role_name,
    ia.certainty,
    ia.date_from,
    ia.date_from_text,
    ia.notes
   FROM image_authorships ia
     JOIN entities ie ON ie.id = ia.image_entity_id
     JOIN entities ae ON ae.id = ia.agent_entity_id
  WHERE ia.status = 'published'::text;;

create view public.step_brotherhood_history with (security_invoker=true) as
 SELECT bs.id AS relation_id,
    bs.step_entity_id,
    se.name AS step_name,
    bs.brotherhood_entity_id,
    be.name AS brotherhood_name,
    bs.relation_type,
    bs.date_from,
    bs.date_from_text,
    bs.date_to,
    bs.date_to_text,
    bs.date_to IS NULL AND bs.date_to_text IS NULL AS is_current,
    bs.notes
   FROM brotherhood_steps bs
     JOIN entities se ON se.id = bs.step_entity_id
     JOIN entities be ON be.id = bs.brotherhood_entity_id
  WHERE bs.status = 'published'::text;;

create view public.step_image_history with (security_invoker=true) as
 SELECT isr.id AS relation_id,
    isr.step_entity_id,
    se.name AS step_name,
    isr.image_entity_id,
    ie.name AS image_name,
    isr.relation_type,
    isr.date_from,
    isr.date_from_text,
    isr.date_to,
    isr.date_to_text,
    isr.date_to IS NULL AND isr.date_to_text IS NULL AS is_current,
    isr.notes
   FROM image_steps isr
     JOIN entities se ON se.id = isr.step_entity_id
     JOIN entities ie ON ie.id = isr.image_entity_id
  WHERE isr.status = 'published'::text;;

create view public.current_step_elements with (security_invoker=true) as
 SELECT ha.entity_id AS element_entity_id,
    ee.name AS element_name,
    ha.parent_entity_id AS step_entity_id,
    se.name AS step_name,
    ha.asset_type,
    ha.description,
    ha.current_condition,
    ha.date_from,
    ha.date_from_text,
    ha.origin_notes
   FROM heritage_assets ha
     JOIN entities ee ON ee.id = ha.entity_id
     JOIN entities se ON se.id = ha.parent_entity_id AND se.entity_type = 'step'::text
  WHERE ha.is_current = true AND ee.status = 'published'::text AND se.status = 'published'::text;;

create view public.current_step_personnel with (security_invoker=true) as
 SELECT spp.id,
    spp.step_entity_id,
    se.name AS step_name,
    spp.agent_entity_id,
    ae.name AS agent_name,
    spp.role_name,
    spp.year_from,
    spp.date_from_text,
    spp.notes
   FROM step_personnel_periods spp
     JOIN entities se ON se.id = spp.step_entity_id
     JOIN entities ae ON ae.id = spp.agent_entity_id
  WHERE spp.status = 'published'::text AND spp.is_current = true;;

create view public.step_phase_details with (security_invoker=true) as
 SELECT sp.id AS step_phase_id,
    sp.step_entity_id,
    se.name AS step_name,
    sp.phase_name,
    sp.phase_type,
    sp.date_from,
    sp.date_from_text,
    sp.date_to,
    sp.date_to_text,
    spa.agent_entity_id,
    ae.name AS agent_name,
    spa.discipline,
    spa.role_name,
    spa.element_entity_id,
    ee.name AS element_name,
    sp.description
   FROM step_phases sp
     JOIN entities se ON se.id = sp.step_entity_id
     LEFT JOIN step_phase_agents spa ON spa.step_phase_id = sp.id
     LEFT JOIN entities ae ON ae.id = spa.agent_entity_id
     LEFT JOIN entities ee ON ee.id = spa.element_entity_id
  WHERE sp.status = 'published'::text;;

create view public.agent_activity with (security_invoker=true) as
 SELECT ia.agent_entity_id,
    'image'::text AS activity_type,
    ia.image_entity_id AS related_entity_id,
    ie.name AS related_entity_name,
    ia.role_name,
    ia.date_from AS activity_date,
    ia.date_from_text AS activity_date_text,
    ia.notes
   FROM image_authorships ia
     JOIN entities ie ON ie.id = ia.image_entity_id
  WHERE ia.status = 'published'::text
UNION ALL
 SELECT spa.agent_entity_id,
    'step'::text AS activity_type,
    sp.step_entity_id AS related_entity_id,
    se.name AS related_entity_name,
    COALESCE(spa.role_name, spa.discipline) AS role_name,
    sp.date_from AS activity_date,
    sp.date_from_text AS activity_date_text,
    spa.notes
   FROM step_phase_agents spa
     JOIN step_phases sp ON sp.id = spa.step_phase_id
     JOIN entities se ON se.id = sp.step_entity_id
  WHERE sp.status = 'published'::text
UNION ALL
 SELECT hi.agent_entity_id,
    'intervention'::text AS activity_type,
    hi.target_entity_id AS related_entity_id,
    te.name AS related_entity_name,
    COALESCE(hi.intervention_type, hi.discipline) AS role_name,
    hi.date_from AS activity_date,
    hi.date_from_text AS activity_date_text,
    hi.description AS notes
   FROM heritage_interventions hi
     JOIN entities te ON te.id = hi.target_entity_id
  WHERE hi.status = 'published'::text
UNION ALL
 SELECT ma.agent_entity_id,
    'march'::text AS activity_type,
    ma.march_entity_id AS related_entity_id,
    me.name AS related_entity_name,
    ma.author_role AS role_name,
    NULL::date AS activity_date,
    NULL::text AS activity_date_text,
    ma.notes
   FROM march_authors ma
     JOIN entities me ON me.id = ma.march_entity_id;;

create view public.agent_profile_summary with (security_invoker=true) as
 SELECT a.entity_id,
    e.name,
    a.agent_kind,
    m.name AS municipality_name,
    a.foundation_or_birth_text,
    a.death_or_end_text,
    array_remove(array_agg(DISTINCT ad.discipline), NULL::text) AS disciplines
   FROM agents a
     JOIN entities e ON e.id = a.entity_id
     LEFT JOIN municipalities m ON m.id = a.municipality_id
     LEFT JOIN agent_disciplines ad ON ad.agent_entity_id = a.entity_id
  WHERE e.status = 'published'::text
  GROUP BY a.entity_id, e.name, a.agent_kind, m.name, a.foundation_or_birth_text, a.death_or_end_text;;

create view public.calendar_cult_days with (security_invoker=true) as
 SELECT cod.id AS calendar_item_id,
    'cult'::text AS item_type,
    c.brotherhood_entity_id,
    be.name AS brotherhood_name,
    COALESCE(co.title_override, c.title) AS title,
    c.cult_type AS subtype,
    cod.celebration_date AS item_date,
    cod.start_time AS item_time,
    COALESCE(cod.place_id, co.place_id, c.place_id) AS place_id,
    p.name AS place_name,
    cod.day_number,
    cod.day_label,
    co.event_status,
    co.id AS occurrence_id
   FROM cult_occurrence_days cod
     JOIN cult_occurrences co ON co.id = cod.cult_occurrence_id
     JOIN cults c ON c.id = co.cult_id
     JOIN entities be ON be.id = c.brotherhood_entity_id
     LEFT JOIN places p ON p.id = COALESCE(cod.place_id, co.place_id, c.place_id)
  WHERE co.status = 'published'::text AND c.status = 'published'::text;;

create view public.calendar_outings with (security_invoker=true) as
 SELECT o.id AS calendar_item_id,
    'outing'::text AS item_type,
    o.brotherhood_entity_id,
    COALESCE(be.name, o.organizer_name) AS brotherhood_name,
    COALESCE(o.title, o.outing_type) AS title,
    o.outing_type AS subtype,
    o."character",
    o.outing_date AS item_date,
    o.departure_time AS item_time,
    o.origin_place_id AS place_id,
    p.name AS place_name,
    o.event_status,
    o.reason
   FROM outings o
     LEFT JOIN entities be ON be.id = o.brotherhood_entity_id
     LEFT JOIN places p ON p.id = o.origin_place_id
  WHERE o.status = 'published'::text;;

create view public.calendar_items with (security_invoker=true) as
 SELECT ccd.calendar_item_id,
    ccd.item_type,
    ccd.brotherhood_entity_id,
    ccd.brotherhood_name,
    ccd.title,
    ccd.subtype,
    NULL::text AS "character",
    ccd.item_date,
    ccd.item_time,
    ccd.place_id,
    ccd.place_name,
    ccd.event_status
   FROM calendar_cult_days ccd
UNION ALL
 SELECT co.calendar_item_id,
    co.item_type,
    co.brotherhood_entity_id,
    co.brotherhood_name,
    co.title,
    co.subtype,
    co."character",
    co.item_date,
    co.item_time,
    co.place_id,
    co.place_name,
    co.event_status
   FROM calendar_outings co;;

create view public.today_calendar_items with (security_invoker=true) as
 SELECT calendar_item_id,
    item_type,
    brotherhood_entity_id,
    brotherhood_name,
    title,
    subtype,
    "character",
    item_date,
    item_time,
    place_id,
    place_name,
    event_status
   FROM calendar_items
  WHERE item_date = CURRENT_DATE AND event_status <> 'cancelled'::text
  ORDER BY item_time, title;;

create view public.upcoming_calendar_items with (security_invoker=true) as
 SELECT calendar_item_id,
    item_type,
    brotherhood_entity_id,
    brotherhood_name,
    title,
    subtype,
    "character",
    item_date,
    item_time,
    place_id,
    place_name,
    event_status
   FROM calendar_items
  WHERE item_date >= CURRENT_DATE AND event_status = 'announced'::text
  ORDER BY item_date, item_time, title;;

create view public.outing_music_details with (security_invoker=true) as
 SELECT omp.id AS music_position_id,
    omp.outing_id,
    omp.sequence_no AS position_order,
    omp.position_code,
    omp.position_label,
    omp.step_entity_id,
    se.name AS step_name,
    oma.id AS music_assignment_id,
    oma.sequence_no AS band_order,
    oma.band_entity_id,
    COALESCE(be.name, oma.band_name_text) AS band_name,
    oma.participation_mode,
    oma.segment_start_label,
    oma.segment_end_label,
    oma.notes
   FROM outing_music_positions omp
     LEFT JOIN entities se ON se.id = omp.step_entity_id
     JOIN outing_music_assignments oma ON oma.music_position_id = omp.id
     LEFT JOIN entities be ON be.id = oma.band_entity_id
  WHERE omp.status = 'published'::text AND oma.status = 'published'::text
  ORDER BY omp.outing_id, omp.sequence_no, oma.sequence_no;;

create view public.published_brotherhood_colors with (security_invoker=true) as
 SELECT bc.id,
    bc.brotherhood_entity_id,
    e.name AS brotherhood_name,
    bc.color_name,
    bc.hex_value,
    bc.color_role,
    bc.sort_order,
    bc.notes
   FROM brotherhood_colors bc
     JOIN entities e ON e.id = bc.brotherhood_entity_id
  WHERE bc.status = 'published'::text AND e.status = 'published'::text;;

create view public.published_band_colors with (security_invoker=true) as
 SELECT bc.id,
    bc.band_entity_id,
    e.name AS band_name,
    bc.color_name,
    bc.hex_value,
    bc.color_role,
    bc.sort_order,
    bc.notes
   FROM band_colors bc
     JOIN entities e ON e.id = bc.band_entity_id
  WHERE bc.status = 'published'::text AND e.status = 'published'::text;;

create view public.home_knowledge_threads with (security_invoker=true) as
 WITH published_entities AS (
         SELECT entities.id,
            entities.entity_type,
            entities.name,
            entities.slug,
            entities.created_at,
            entities.updated_at
           FROM entities
          WHERE entities.status = 'published'::text
        ), titular_pairs AS (
         SELECT bi.brotherhood_entity_id AS root_entity_id,
            bi.image_entity_id AS related_entity_id,
            bi.created_at AS activity_at
           FROM brotherhood_images bi
             JOIN published_entities b_1 ON b_1.id = bi.brotherhood_entity_id AND b_1.entity_type = 'brotherhood'::text
             JOIN published_entities i ON i.id = bi.image_entity_id AND i.entity_type = 'image'::text
          WHERE bi.status = 'published'::text AND bi.relation_type = 'titular'::text
        UNION
         SELECT er.source_entity_id,
            er.target_entity_id,
            er.created_at
           FROM entity_relations er
             JOIN published_entities b_1 ON b_1.id = er.source_entity_id AND b_1.entity_type = 'brotherhood'::text
             JOIN published_entities t ON t.id = er.target_entity_id
          WHERE er.status = 'published'::text AND er.relation_type = 'has_titular'::text
        ), musical_parts AS (
         SELECT md.dedicatee_entity_id AS root_entity_id,
            count(DISTINCT md.march_entity_id)::integer AS relation_count,
            0 AS secondary_count,
            max(md.created_at) AS latest_at
           FROM march_dedications md
             JOIN published_entities b_1 ON b_1.id = md.dedicatee_entity_id AND b_1.entity_type = 'brotherhood'::text
             JOIN published_entities m ON m.id = md.march_entity_id AND m.entity_type = 'march'::text
          WHERE md.status = 'published'::text
          GROUP BY md.dedicatee_entity_id
        UNION ALL
         SELECT ha.parent_entity_id,
            0 AS int4,
            count(DISTINCT ha.entity_id)::integer AS count,
            max(GREATEST(a.created_at, a.updated_at)) AS max
           FROM heritage_assets ha
             JOIN published_entities a ON a.id = ha.entity_id AND a.entity_type = 'heritage_asset'::text
             JOIN published_entities p ON p.id = ha.parent_entity_id AND p.entity_type = 'brotherhood'::text
          WHERE lower(COALESCE(ha.asset_type, ''::text)) ~~ ANY (ARRAY['%música%'::text, '%musica%'::text, '%copla%'::text, '%himno%'::text, '%motete%'::text, '%plegaria%'::text, '%canto%'::text])
          GROUP BY ha.parent_entity_id
        ), musical_threads AS (
         SELECT musical_parts.root_entity_id,
            'musical_heritage'::text AS activity_kind,
            sum(musical_parts.relation_count)::integer AS relation_count,
            sum(musical_parts.secondary_count)::integer AS secondary_count,
            max(musical_parts.latest_at) AS latest_at,
            100 AS priority
           FROM musical_parts
          GROUP BY musical_parts.root_entity_id
        ), poster_threads AS (
         SELECT ha.parent_entity_id AS root_entity_id,
            'posters'::text AS activity_kind,
            count(DISTINCT ha.entity_id)::integer AS relation_count,
            0 AS secondary_count,
            max(GREATEST(a.created_at, a.updated_at)) AS latest_at,
            95 AS priority
           FROM heritage_assets ha
             JOIN published_entities a ON a.id = ha.entity_id AND a.entity_type = 'heritage_asset'::text
             JOIN published_entities p ON p.id = ha.parent_entity_id AND p.entity_type = 'brotherhood'::text
          WHERE lower(COALESCE(ha.asset_type, ''::text)) ~~ '%cartel%'::text
          GROUP BY ha.parent_entity_id
        ), titular_threads AS (
         SELECT titular_pairs.root_entity_id,
            'titularity'::text AS activity_kind,
            count(DISTINCT titular_pairs.related_entity_id)::integer AS relation_count,
            0 AS secondary_count,
            max(titular_pairs.activity_at) AS latest_at,
            90 AS priority
           FROM titular_pairs
          GROUP BY titular_pairs.root_entity_id
        ), brotherhood_step_threads AS (
         SELECT bs.brotherhood_entity_id AS root_entity_id,
            'brotherhood_steps'::text AS activity_kind,
            count(DISTINCT bs.step_entity_id)::integer AS relation_count,
            0 AS secondary_count,
            max(bs.created_at) AS latest_at,
            88 AS priority
           FROM brotherhood_steps bs
             JOIN published_entities b_1 ON b_1.id = bs.brotherhood_entity_id AND b_1.entity_type = 'brotherhood'::text
             JOIN published_entities s ON s.id = bs.step_entity_id AND s.entity_type = 'step'::text
          WHERE bs.status = 'published'::text
          GROUP BY bs.brotherhood_entity_id
        ), step_personnel_threads AS (
         SELECT bs.brotherhood_entity_id AS root_entity_id,
            'step_personnel'::text AS activity_kind,
            count(DISTINCT spp.step_entity_id)::integer AS relation_count,
            count(DISTINCT spp.agent_entity_id)::integer AS secondary_count,
            max(GREATEST(spp.created_at, spp.updated_at)) AS latest_at,
            92 AS priority
           FROM step_personnel_periods spp
             JOIN brotherhood_steps bs ON bs.step_entity_id = spp.step_entity_id AND bs.status = 'published'::text AND bs.date_to IS NULL AND bs.date_to_text IS NULL
             JOIN published_entities b_1 ON b_1.id = bs.brotherhood_entity_id AND b_1.entity_type = 'brotherhood'::text
             JOIN published_entities s ON s.id = spp.step_entity_id AND s.entity_type = 'step'::text
             JOIN published_entities a ON a.id = spp.agent_entity_id AND a.entity_type = 'agent'::text
          WHERE spp.status = 'published'::text AND spp.is_current = true AND lower(spp.role_name) = 'capataz'::text
          GROUP BY bs.brotherhood_entity_id
        ), band_relation_threads AS (
         SELECT er.source_entity_id AS root_entity_id,
            'band_brotherhoods'::text AS activity_kind,
            count(DISTINCT er.target_entity_id)::integer AS relation_count,
            0 AS secondary_count,
            max(er.created_at) AS latest_at,
            91 AS priority
           FROM entity_relations er
             JOIN published_entities b_1 ON b_1.id = er.source_entity_id AND b_1.entity_type = 'band'::text
             JOIN published_entities h ON h.id = er.target_entity_id AND h.entity_type = 'brotherhood'::text
          WHERE er.status = 'published'::text AND (er.relation_type = ANY (ARRAY['associated_with_brotherhood'::text, 'belongs_to_brotherhood'::text]))
          GROUP BY er.source_entity_id
        ), release_counts AS (
         SELECT br.band_entity_id AS root_entity_id,
            count(DISTINCT br.id)::integer AS relation_count,
            max(GREATEST(br.created_at, br.updated_at)) AS latest_at
           FROM band_releases br
             JOIN published_entities b_1 ON b_1.id = br.band_entity_id AND b_1.entity_type = 'band'::text
          WHERE br.status = 'published'::text
          GROUP BY br.band_entity_id
        ), track_counts AS (
         SELECT br.band_entity_id AS root_entity_id,
            count(DISTINCT t.id)::integer AS secondary_count,
            max(t.created_at) AS latest_at
           FROM band_release_tracks t
             JOIN band_releases br ON br.id = t.release_id AND br.status = 'published'::text
             JOIN published_entities b_1 ON b_1.id = br.band_entity_id AND b_1.entity_type = 'band'::text
          GROUP BY br.band_entity_id
        ), discography_threads AS (
         SELECT r.root_entity_id,
            'discography'::text AS activity_kind,
            r.relation_count,
            COALESCE(t.secondary_count, 0) AS secondary_count,
            GREATEST(r.latest_at, COALESCE(t.latest_at, r.latest_at)) AS latest_at,
            80 AS priority
           FROM release_counts r
             LEFT JOIN track_counts t USING (root_entity_id)
        ), image_authorship_threads AS (
         SELECT ia.image_entity_id AS root_entity_id,
            'image_authorship'::text AS activity_kind,
            count(DISTINCT ia.agent_entity_id)::integer AS relation_count,
            0 AS secondary_count,
            max(ia.created_at) AS latest_at,
            86 AS priority
           FROM image_authorships ia
             JOIN published_entities i ON i.id = ia.image_entity_id AND i.entity_type = 'image'::text
             JOIN published_entities a ON a.id = ia.agent_entity_id AND a.entity_type = 'agent'::text
          WHERE ia.status = 'published'::text
          GROUP BY ia.image_entity_id
        ), step_phase_threads AS (
         SELECT sp.step_entity_id AS root_entity_id,
            'step_phases'::text AS activity_kind,
            count(DISTINCT sp.id)::integer AS relation_count,
            0 AS secondary_count,
            max(GREATEST(sp.created_at, sp.updated_at)) AS latest_at,
            84 AS priority
           FROM step_phases sp
             JOIN published_entities s ON s.id = sp.step_entity_id AND s.entity_type = 'step'::text
          WHERE sp.status = 'published'::text
          GROUP BY sp.step_entity_id
        ), heritage_intervention_threads AS (
         SELECT COALESCE(parent.id, target.id) AS root_entity_id,
            'heritage_interventions'::text AS activity_kind,
            count(DISTINCT hi.id)::integer AS relation_count,
            count(DISTINCT hi.agent_entity_id)::integer AS secondary_count,
            max(GREATEST(hi.created_at, hi.updated_at)) AS latest_at,
            78 AS priority
           FROM heritage_interventions hi
             JOIN published_entities target ON target.id = hi.target_entity_id
             LEFT JOIN heritage_assets ha ON ha.entity_id = target.id
             LEFT JOIN published_entities parent ON parent.id = ha.parent_entity_id AND (parent.entity_type = ANY (ARRAY['brotherhood'::text, 'image'::text, 'step'::text])) AND parent.slug IS NOT NULL
          WHERE hi.status = 'published'::text AND ((target.entity_type = ANY (ARRAY['brotherhood'::text, 'image'::text, 'step'::text])) OR parent.id IS NOT NULL)
          GROUP BY (COALESCE(parent.id, target.id))
        ), heritage_update_threads AS (
         SELECT hu.target_entity_id AS root_entity_id,
            'heritage_updates'::text AS activity_kind,
            count(DISTINCT hu.id)::integer AS relation_count,
            0 AS secondary_count,
            max(GREATEST(hu.created_at, hu.updated_at)) AS latest_at,
            76 AS priority
           FROM heritage_updates hu
             JOIN published_entities t ON t.id = hu.target_entity_id AND (t.entity_type = ANY (ARRAY['brotherhood'::text, 'image'::text, 'step'::text])) AND t.slug IS NOT NULL
          WHERE hu.status = 'published'::text
          GROUP BY hu.target_entity_id
        ), entity_threads AS (
         SELECT e_1.id AS root_entity_id,
            'entity_new'::text AS activity_kind,
            1 AS relation_count,
            0 AS secondary_count,
            e_1.created_at AS latest_at,
            30 AS priority
           FROM published_entities e_1
          WHERE (e_1.entity_type = ANY (ARRAY['brotherhood'::text, 'image'::text, 'step'::text, 'band'::text])) AND e_1.slug IS NOT NULL
        ), raw_threads AS (
         SELECT musical_threads.root_entity_id,
            musical_threads.activity_kind,
            musical_threads.relation_count,
            musical_threads.secondary_count,
            musical_threads.latest_at,
            musical_threads.priority
           FROM musical_threads
        UNION ALL
         SELECT poster_threads.root_entity_id,
            poster_threads.activity_kind,
            poster_threads.relation_count,
            poster_threads.secondary_count,
            poster_threads.latest_at,
            poster_threads.priority
           FROM poster_threads
        UNION ALL
         SELECT titular_threads.root_entity_id,
            titular_threads.activity_kind,
            titular_threads.relation_count,
            titular_threads.secondary_count,
            titular_threads.latest_at,
            titular_threads.priority
           FROM titular_threads
        UNION ALL
         SELECT brotherhood_step_threads.root_entity_id,
            brotherhood_step_threads.activity_kind,
            brotherhood_step_threads.relation_count,
            brotherhood_step_threads.secondary_count,
            brotherhood_step_threads.latest_at,
            brotherhood_step_threads.priority
           FROM brotherhood_step_threads
        UNION ALL
         SELECT step_personnel_threads.root_entity_id,
            step_personnel_threads.activity_kind,
            step_personnel_threads.relation_count,
            step_personnel_threads.secondary_count,
            step_personnel_threads.latest_at,
            step_personnel_threads.priority
           FROM step_personnel_threads
        UNION ALL
         SELECT band_relation_threads.root_entity_id,
            band_relation_threads.activity_kind,
            band_relation_threads.relation_count,
            band_relation_threads.secondary_count,
            band_relation_threads.latest_at,
            band_relation_threads.priority
           FROM band_relation_threads
        UNION ALL
         SELECT discography_threads.root_entity_id,
            discography_threads.activity_kind,
            discography_threads.relation_count,
            discography_threads.secondary_count,
            discography_threads.latest_at,
            discography_threads.priority
           FROM discography_threads
        UNION ALL
         SELECT image_authorship_threads.root_entity_id,
            image_authorship_threads.activity_kind,
            image_authorship_threads.relation_count,
            image_authorship_threads.secondary_count,
            image_authorship_threads.latest_at,
            image_authorship_threads.priority
           FROM image_authorship_threads
        UNION ALL
         SELECT step_phase_threads.root_entity_id,
            step_phase_threads.activity_kind,
            step_phase_threads.relation_count,
            step_phase_threads.secondary_count,
            step_phase_threads.latest_at,
            step_phase_threads.priority
           FROM step_phase_threads
        UNION ALL
         SELECT heritage_intervention_threads.root_entity_id,
            heritage_intervention_threads.activity_kind,
            heritage_intervention_threads.relation_count,
            heritage_intervention_threads.secondary_count,
            heritage_intervention_threads.latest_at,
            heritage_intervention_threads.priority
           FROM heritage_intervention_threads
        UNION ALL
         SELECT heritage_update_threads.root_entity_id,
            heritage_update_threads.activity_kind,
            heritage_update_threads.relation_count,
            heritage_update_threads.secondary_count,
            heritage_update_threads.latest_at,
            heritage_update_threads.priority
           FROM heritage_update_threads
        UNION ALL
         SELECT entity_threads.root_entity_id,
            entity_threads.activity_kind,
            entity_threads.relation_count,
            entity_threads.secondary_count,
            entity_threads.latest_at,
            entity_threads.priority
           FROM entity_threads
        )
 SELECT (rt.root_entity_id::text || ':'::text) || rt.activity_kind AS thread_key,
    rt.root_entity_id,
    e.entity_type AS root_type,
    COALESCE(NULLIF(TRIM(BOTH FROM b.popular_name), ''::text), e.name) AS root_name,
    e.slug AS root_slug,
    e.created_at AS root_created_at,
    rt.activity_kind,
    rt.relation_count,
    rt.secondary_count,
    rt.latest_at,
    rt.priority
   FROM raw_threads rt
     JOIN published_entities e ON e.id = rt.root_entity_id AND e.slug IS NOT NULL
     LEFT JOIN brotherhoods b ON b.entity_id = e.id AND e.entity_type = 'brotherhood'::text
  WHERE rt.latest_at IS NOT NULL;;

create view public.extraordinary_outings_directory with (security_invoker=true) as
 SELECT o.id,
    o.slug,
    o.brotherhood_entity_id,
    COALESCE(be.name, o.organizer_name) AS brotherhood_name,
    o.organizer_name,
    o.title,
    o.outing_type,
    o.outing_date,
    o.year,
    o.departure_time,
    o.return_date,
    o.return_time,
    o.reason,
    o.description,
    o.public_notes,
    o.event_status,
    o.municipality_id,
    m.name AS municipality_name,
    m.province,
    o.origin_place_id,
    COALESCE(op.name, o.origin_text) AS origin_place_name,
    o.destination_place_id,
    COALESCE(dp.name, o.destination_text) AS destination_place_name,
    o.route_summary,
    o.hero_image_path,
    o.hero_image_alt,
    o.hero_image_credit,
    o.reference_code
   FROM outings o
     LEFT JOIN entities be ON be.id = o.brotherhood_entity_id
     LEFT JOIN municipalities m ON m.id = o.municipality_id
     LEFT JOIN places op ON op.id = o.origin_place_id
     LEFT JOIN places dp ON dp.id = o.destination_place_id
  WHERE o.status = 'published'::text AND o."character" = 'extraordinary'::text;;

create view public.upcoming_extraordinary_outings with (security_invoker=true) as
 SELECT o.id,
    o.brotherhood_entity_id,
    COALESCE(be.name, o.organizer_name) AS brotherhood_name,
    o.organizer_name,
    o.title,
    o.outing_type,
    o.outing_date,
    o.departure_time,
    o.return_date,
    o.return_time,
    o.reason,
    o.municipality_id,
    m.name AS municipality_name,
    o.origin_place_id,
    COALESCE(op.name, o.origin_text) AS origin_place_name,
    o.destination_place_id,
    COALESCE(dp.name, o.destination_text) AS destination_place_name,
    o.route_summary,
    o.hero_image_path,
    o.hero_image_alt,
    o.hero_image_credit,
    o.slug,
    m.province,
    o.reference_code
   FROM outings o
     LEFT JOIN entities be ON be.id = o.brotherhood_entity_id
     LEFT JOIN municipalities m ON m.id = o.municipality_id
     LEFT JOIN places op ON op.id = o.origin_place_id
     LEFT JOIN places dp ON dp.id = o.destination_place_id
  WHERE o.status = 'published'::text AND o.event_status = 'announced'::text AND o."character" = 'extraordinary'::text AND o.outing_date >= (now() AT TIME ZONE 'Europe/Madrid'::text)::date AND m.province = 'Sevilla'::text
  ORDER BY o.outing_date, o.departure_time;;

CREATE INDEX entities_type_idx ON public.entities USING btree (entity_type);

CREATE INDEX entities_status_idx ON public.entities USING btree (status);

CREATE INDEX brotherhood_images_brotherhood_idx ON public.brotherhood_images USING btree (brotherhood_entity_id);

CREATE INDEX brotherhood_images_image_idx ON public.brotherhood_images USING btree (image_entity_id);

CREATE INDEX entity_relations_source_idx ON public.entity_relations USING btree (source_entity_id);

CREATE INDEX entity_relations_target_idx ON public.entity_relations USING btree (target_entity_id);

CREATE INDEX entity_relations_type_idx ON public.entity_relations USING btree (relation_type);

CREATE INDEX entity_locations_entity_idx ON public.entity_locations USING btree (entity_id);

CREATE INDEX entity_locations_current_idx ON public.entity_locations USING btree (entity_id, is_current);

CREATE INDEX heritage_interventions_target_idx ON public.heritage_interventions USING btree (target_entity_id);

CREATE INDEX heritage_interventions_agent_idx ON public.heritage_interventions USING btree (agent_entity_id);

CREATE INDEX outings_date_idx ON public.outings USING btree (outing_date);

CREATE INDEX outings_extraordinary_idx ON public.outings USING btree ("character", outing_date);

CREATE INDEX daily_content_date_idx ON public.daily_overrides USING btree (publish_date, status);

CREATE INDEX heritage_updates_brotherhood_idx ON public.heritage_updates USING btree (brotherhood_entity_id, year DESC);

CREATE INDEX heritage_updates_target_idx ON public.heritage_updates USING btree (target_entity_id);

CREATE INDEX heritage_updates_type_idx ON public.heritage_updates USING btree (update_type, year DESC);

CREATE INDEX heritage_update_agents_update_idx ON public.heritage_update_agents USING btree (heritage_update_id);

CREATE INDEX heritage_update_agents_agent_idx ON public.heritage_update_agents USING btree (agent_entity_id);

CREATE INDEX editorial_content_type_idx ON public.editorial_content USING btree (content_type, status);

CREATE INDEX editorial_content_publish_date_idx ON public.editorial_content USING btree (publish_date DESC);

CREATE INDEX editorial_content_daily_idx ON public.editorial_content USING btree (eligible_for_daily, content_type, daily_priority DESC) WHERE (status = 'published'::text);

CREATE INDEX editorial_content_links_content_idx ON public.editorial_content_links USING btree (editorial_content_id);

CREATE INDEX editorial_content_links_entity_idx ON public.editorial_content_links USING btree (entity_id);

CREATE INDEX daily_overrides_editorial_idx ON public.daily_overrides USING btree (editorial_content_id);

CREATE INDEX daily_overrides_march_idx ON public.daily_overrides USING btree (march_entity_id);

CREATE INDEX daily_overrides_event_idx ON public.daily_overrides USING btree (event_entity_id);

CREATE INDEX entity_media_entity_idx ON public.entity_media USING btree (entity_id, sort_order);

CREATE INDEX entity_media_asset_idx ON public.entity_media USING btree (media_asset_id);

CREATE INDEX audit_log_entity_idx ON public.audit_log USING btree (entity_id, created_at DESC);

CREATE INDEX audit_log_object_idx ON public.audit_log USING btree (object_type, object_id, created_at DESC);

CREATE INDEX audit_log_date_idx ON public.audit_log USING btree (created_at DESC);

CREATE INDEX band_names_band_idx ON public.band_names USING btree (band_entity_id, is_current);

CREATE INDEX band_agents_band_idx ON public.band_agents USING btree (band_entity_id, is_current);

CREATE INDEX band_agents_agent_idx ON public.band_agents USING btree (agent_entity_id);

CREATE INDEX music_periods_brotherhood_idx ON public.music_accompaniment_periods USING btree (brotherhood_entity_id, year_from DESC);

CREATE INDEX music_periods_band_idx ON public.music_accompaniment_periods USING btree (band_entity_id, year_from DESC);

CREATE INDEX music_periods_step_idx ON public.music_accompaniment_periods USING btree (step_entity_id, year_from DESC);

CREATE INDEX music_periods_current_idx ON public.music_accompaniment_periods USING btree (brotherhood_entity_id, is_current);

CREATE INDEX march_dedications_march_idx ON public.march_dedications USING btree (march_entity_id);

CREATE INDEX march_dedications_dedicatee_idx ON public.march_dedications USING btree (dedicatee_entity_id);

CREATE INDEX march_recordings_march_idx ON public.march_recordings USING btree (march_entity_id, is_featured DESC);

CREATE INDEX march_recordings_band_idx ON public.march_recordings USING btree (band_entity_id);

CREATE INDEX image_authorships_image_idx ON public.image_authorships USING btree (image_entity_id);

CREATE INDEX image_authorships_agent_idx ON public.image_authorships USING btree (agent_entity_id);

CREATE INDEX image_names_image_idx ON public.image_names USING btree (image_entity_id, is_current);

CREATE INDEX step_phases_step_idx ON public.step_phases USING btree (step_entity_id, date_from);

CREATE INDEX step_phase_agents_phase_idx ON public.step_phase_agents USING btree (step_phase_id);

CREATE INDEX step_phase_agents_agent_idx ON public.step_phase_agents USING btree (agent_entity_id);

CREATE INDEX step_personnel_step_idx ON public.step_personnel_periods USING btree (step_entity_id, year_from DESC);

CREATE INDEX step_personnel_agent_idx ON public.step_personnel_periods USING btree (agent_entity_id, year_from DESC);

CREATE INDEX step_personnel_current_idx ON public.step_personnel_periods USING btree (step_entity_id, is_current);

CREATE INDEX agent_names_agent_idx ON public.agent_names USING btree (agent_entity_id, is_current);

CREATE INDEX agent_disciplines_agent_idx ON public.agent_disciplines USING btree (agent_entity_id);

CREATE INDEX agent_disciplines_name_idx ON public.agent_disciplines USING btree (discipline);

CREATE INDEX cult_entities_cult_idx ON public.cult_entities USING btree (cult_id);

CREATE INDEX cult_entities_entity_idx ON public.cult_entities USING btree (entity_id);

CREATE INDEX cult_occurrences_cult_idx ON public.cult_occurrences USING btree (cult_id, year DESC);

CREATE INDEX cult_occurrences_dates_idx ON public.cult_occurrences USING btree (start_date, end_date);

CREATE INDEX cult_occurrence_days_date_idx ON public.cult_occurrence_days USING btree (celebration_date, start_time);

CREATE INDEX cult_occurrence_days_occurrence_idx ON public.cult_occurrence_days USING btree (cult_occurrence_id, day_number);

CREATE INDEX outing_route_points_outing_idx ON public.outing_route_points USING btree (outing_id, sequence_no);

CREATE INDEX outing_schedule_items_outing_idx ON public.outing_schedule_items USING btree (outing_id, sequence_no);

CREATE INDEX outing_music_positions_outing_idx ON public.outing_music_positions USING btree (outing_id, sequence_no);

CREATE INDEX outing_music_positions_step_idx ON public.outing_music_positions USING btree (step_entity_id);

CREATE INDEX outing_music_assignments_position_idx ON public.outing_music_assignments USING btree (music_position_id, sequence_no);

CREATE INDEX outing_music_assignments_band_idx ON public.outing_music_assignments USING btree (band_entity_id);

CREATE INDEX brotherhood_colors_brotherhood_idx ON public.brotherhood_colors USING btree (brotherhood_entity_id, sort_order);

CREATE INDEX outing_series_brotherhood_idx ON public.outing_series USING btree (brotherhood_entity_id, display_order);

CREATE INDEX outing_series_movements_series_idx ON public.outing_series_movements USING btree (outing_series_id, sequence_no);

CREATE INDEX outings_series_idx ON public.outings USING btree (outing_series_id, outing_date DESC);

CREATE INDEX heritage_assets_parent_order_idx ON public.heritage_assets USING btree (parent_entity_id, display_order, date_from);

CREATE INDEX entity_social_links_entity_idx ON public.entity_social_links USING btree (entity_id, display_order, platform);

CREATE INDEX band_premieres_band_idx ON public.band_premieres USING btree (band_entity_id, premiere_year DESC, display_order, title);

CREATE UNIQUE INDEX bands_banderin_entity_unique_idx ON public.bands USING btree (banderin_entity_id) WHERE (banderin_entity_id IS NOT NULL);

CREATE INDEX band_releases_band_idx ON public.band_releases USING btree (band_entity_id, release_year DESC);

CREATE INDEX band_release_tracks_release_idx ON public.band_release_tracks USING btree (release_id, sequence_no);

CREATE INDEX band_release_tracks_march_idx ON public.band_release_tracks USING btree (march_entity_id);

CREATE INDEX document_imports_status_idx ON public.document_imports USING btree (status, created_at DESC);

CREATE INDEX document_imports_target_idx ON public.document_imports USING btree (target_entity_id, created_at DESC);

CREATE INDEX band_colors_band_idx ON public.band_colors USING btree (band_entity_id, sort_order);

CREATE INDEX band_colors_status_idx ON public.band_colors USING btree (status);

CREATE INDEX brotherhood_habits_brotherhood_idx ON public.brotherhood_habits USING btree (brotherhood_entity_id, sort_order);

CREATE INDEX source_links_brotherhood_habit_idx ON public.source_links USING btree (brotherhood_habit_id);

CREATE INDEX brotherhood_procession_stats_source_id_idx ON public.brotherhood_procession_stats USING btree (source_id);

CREATE INDEX brotherhood_procession_stats_published_lookup_idx ON public.brotherhood_procession_stats USING btree (brotherhood_entity_id, year DESC) WHERE (status = 'published'::text);

CREATE UNIQUE INDEX entity_media_one_cover_per_entity_idx ON public.entity_media USING btree (entity_id) WHERE (is_cover = true);

CREATE UNIQUE INDEX outings_slug_unique_idx ON public.outings USING btree (slug) WHERE (slug IS NOT NULL);

CREATE UNIQUE INDEX outings_reference_code_uidx ON public.outings USING btree (reference_code);

CREATE UNIQUE INDEX image_authorships_one_anonymous_role_idx ON public.image_authorships USING btree (image_entity_id, authorship_type, role_name) WHERE (agent_entity_id IS NULL);

CREATE UNIQUE INDEX outing_media_one_poster_idx ON public.outing_media USING btree (outing_id) WHERE (role = 'poster'::text);

CREATE INDEX bulk_imports_status_created_idx ON public.bulk_imports USING btree (status, created_at DESC);

CREATE INDEX bulk_import_items_queue_idx ON public.bulk_import_items USING btree (import_id, status, priority, "position");

CREATE UNIQUE INDEX brotherhood_steps_one_current_processional_owner_idx ON public.brotherhood_steps USING btree (step_entity_id) WHERE ((relation_type = 'processional_step'::text) AND (status <> 'archived'::text) AND (date_to IS NULL));

CREATE INDEX entity_names_entity_idx ON public.entity_names USING btree (entity_id, status);

CREATE INDEX marches_work_type_year_idx ON public.marches USING btree (work_type, composition_year, entity_id);

CREATE INDEX cult_media_cult_id_idx ON public.cult_media USING btree (cult_id, sort_order);

CREATE UNIQUE INDEX cult_media_single_cover_idx ON public.cult_media USING btree (cult_id) WHERE is_cover;

CREATE INDEX source_links_outing_idx ON public.source_links USING btree (outing_id, source_id) WHERE (outing_id IS NOT NULL);

CREATE INDEX legal_drafts_updated_by_idx ON public.legal_drafts USING btree (updated_by);

CREATE INDEX events_category_date_idx ON public.events USING btree (event_category, event_date, start_time);

CREATE INDEX events_crew_brotherhood_date_idx ON public.events USING btree (brotherhood_entity_id, event_date) WHERE (event_category = 'crew_call'::text);

CREATE INDEX crew_event_steps_event_idx ON public.crew_event_steps USING btree (event_entity_id, sort_order);

CREATE INDEX crew_event_steps_step_idx ON public.crew_event_steps USING btree (step_entity_id, event_entity_id);

CREATE UNIQUE INDEX crew_event_steps_active_key ON public.crew_event_steps USING btree (event_entity_id, step_entity_id) WHERE (status <> 'archived'::text);

CREATE INDEX crew_event_agents_event_idx ON public.crew_event_agents USING btree (event_entity_id, sort_order);

CREATE INDEX crew_event_agents_agent_idx ON public.crew_event_agents USING btree (agent_entity_id, event_entity_id);

CREATE UNIQUE INDEX crew_event_agents_active_key ON public.crew_event_agents USING btree (event_entity_id, agent_entity_id, lower(role_name)) WHERE (status <> 'archived'::text);

CREATE TRIGGER places_set_updated_at BEFORE UPDATE ON places FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER entities_set_updated_at BEFORE UPDATE ON entities FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER heritage_interventions_set_updated_at BEFORE UPDATE ON heritage_interventions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER outings_set_updated_at BEFORE UPDATE ON outings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER daily_content_set_updated_at BEFORE UPDATE ON daily_overrides FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER contributions_set_updated_at BEFORE UPDATE ON contributions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER heritage_updates_set_updated_at BEFORE UPDATE ON heritage_updates FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER editorial_content_set_updated_at BEFORE UPDATE ON editorial_content FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER media_assets_set_updated_at BEFORE UPDATE ON media_assets FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER music_accompaniment_periods_set_updated_at BEFORE UPDATE ON music_accompaniment_periods FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER step_phases_set_updated_at BEFORE UPDATE ON step_phases FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER step_personnel_periods_set_updated_at BEFORE UPDATE ON step_personnel_periods FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER cult_occurrences_set_updated_at BEFORE UPDATE ON cult_occurrences FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER outing_music_positions_set_updated_at BEFORE UPDATE ON outing_music_positions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER brotherhood_colors_set_updated_at BEFORE UPDATE ON brotherhood_colors FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER outing_series_set_updated_at BEFORE UPDATE ON outing_series FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER panel_users_set_updated_at BEFORE UPDATE ON panel_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER entity_social_links_set_updated_at BEFORE UPDATE ON entity_social_links FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER band_premieres_set_updated_at BEFORE UPDATE ON band_premieres FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER entity_relations_guard_publication BEFORE INSERT OR UPDATE OF source_entity_id, target_entity_id, status ON entity_relations FOR EACH ROW EXECUTE FUNCTION guard_entity_relation_publication();

CREATE TRIGGER band_releases_set_updated_at BEFORE UPDATE ON band_releases FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER document_imports_set_updated_at BEFORE UPDATE ON document_imports FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER band_colors_set_updated_at BEFORE UPDATE ON band_colors FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER brotherhood_habits_set_updated_at BEFORE UPDATE ON brotherhood_habits FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER brotherhood_procession_stats_set_updated_at BEFORE UPDATE ON brotherhood_procession_stats FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER sync_music_accompaniment_public_location BEFORE INSERT OR UPDATE OF brotherhood_entity_id ON music_accompaniment_periods FOR EACH ROW EXECUTE FUNCTION sync_music_accompaniment_public_location();

CREATE TRIGGER trg_hc_brotherhood_authority_from_audit AFTER INSERT ON audit_log FOR EACH ROW EXECUTE FUNCTION hc_mark_brotherhood_authority_from_audit();

CREATE TRIGGER bands_guard_identity_collision BEFORE INSERT OR UPDATE OF entity_id, municipality_id ON bands FOR EACH ROW EXECUTE FUNCTION guard_band_identity_collision();

CREATE TRIGGER band_names_guard_alias_collision BEFORE INSERT OR UPDATE OF band_entity_id, name, short_name, is_current ON band_names FOR EACH ROW EXECUTE FUNCTION guard_band_name_alias_collision();

CREATE TRIGGER brotherhood_images_guard_publication BEFORE INSERT OR UPDATE ON brotherhood_images FOR EACH ROW EXECUTE FUNCTION guard_core_relation_publication('brotherhood_entity_id', 'image_entity_id', 'brotherhood', 'image');

CREATE TRIGGER brotherhood_steps_guard_publication BEFORE INSERT OR UPDATE ON brotherhood_steps FOR EACH ROW EXECUTE FUNCTION guard_core_relation_publication('brotherhood_entity_id', 'step_entity_id', 'brotherhood', 'step');

CREATE TRIGGER image_steps_guard_publication BEFORE INSERT OR UPDATE ON image_steps FOR EACH ROW EXECUTE FUNCTION guard_core_relation_publication('image_entity_id', 'step_entity_id', 'image', 'step');

CREATE TRIGGER entities_demote_invalid_core_relations AFTER UPDATE OF status, entity_type ON entities FOR EACH ROW WHEN (old.status IS DISTINCT FROM new.status OR old.entity_type IS DISTINCT FROM new.entity_type) EXECUTE FUNCTION demote_invalid_core_relations_after_entity_change();

CREATE TRIGGER set_cult_media_updated_at BEFORE UPDATE ON cult_media FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER legal_drafts_set_updated_at BEFORE UPDATE ON legal_drafts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER events_set_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER crew_event_steps_set_updated_at BEFORE UPDATE ON crew_event_steps FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER crew_event_agents_set_updated_at BEFORE UPDATE ON crew_event_agents FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER guard_crew_event_record BEFORE INSERT OR UPDATE ON events FOR EACH ROW EXECUTE FUNCTION guard_crew_event_record();

CREATE TRIGGER guard_published_crew_event_entity BEFORE INSERT OR UPDATE OF status, entity_type ON entities FOR EACH ROW EXECUTE FUNCTION guard_published_crew_event_entity();

CREATE TRIGGER guard_crew_event_step BEFORE INSERT OR UPDATE ON crew_event_steps FOR EACH ROW EXECUTE FUNCTION guard_crew_event_link('step');

CREATE TRIGGER guard_crew_event_agent BEFORE INSERT OR UPDATE ON crew_event_agents FOR EACH ROW EXECUTE FUNCTION guard_crew_event_link('agent');

alter table public.municipalities enable row level security;

alter table public.places enable row level security;

alter table public.entities enable row level security;

alter table public.brotherhoods enable row level security;

alter table public.advocations enable row level security;

alter table public.images enable row level security;

alter table public.brotherhood_images enable row level security;

alter table public.agents enable row level security;

alter table public.agent_roles enable row level security;

alter table public.steps enable row level security;

alter table public.brotherhood_steps enable row level security;

alter table public.image_steps enable row level security;

alter table public.entity_relations enable row level security;

alter table public.entity_locations enable row level security;

alter table public.heritage_assets enable row level security;

alter table public.heritage_interventions enable row level security;

alter table public.bands enable row level security;

alter table public.marches enable row level security;

alter table public.march_authors enable row level security;

alter table public.outings enable row level security;

alter table public.outing_entities enable row level security;

alter table public.accompaniments enable row level security;

alter table public.cults enable row level security;

alter table public.events enable row level security;

alter table public.sources enable row level security;

alter table public.source_links enable row level security;

alter table public.daily_overrides enable row level security;

alter table public.contributions enable row level security;

alter table public.heritage_updates enable row level security;

alter table public.heritage_update_agents enable row level security;

alter table public.editorial_content enable row level security;

alter table public.editorial_content_links enable row level security;

alter table public.media_assets enable row level security;

alter table public.entity_media enable row level security;

alter table public.audit_log enable row level security;

alter table public.completeness_rules enable row level security;

alter table public.band_names enable row level security;

alter table public.band_agents enable row level security;

alter table public.music_accompaniment_periods enable row level security;

alter table public.march_dedications enable row level security;

alter table public.march_recordings enable row level security;

alter table public.image_authorships enable row level security;

alter table public.image_names enable row level security;

alter table public.step_phases enable row level security;

alter table public.step_phase_agents enable row level security;

alter table public.step_personnel_periods enable row level security;

alter table public.agent_names enable row level security;

alter table public.agent_disciplines enable row level security;

alter table public.cult_entities enable row level security;

alter table public.cult_occurrences enable row level security;

alter table public.cult_occurrence_days enable row level security;

alter table public.outing_route_points enable row level security;

alter table public.outing_schedule_items enable row level security;

alter table public.outing_music_positions enable row level security;

alter table public.outing_music_assignments enable row level security;

alter table public.brotherhood_colors enable row level security;

alter table public.outing_series enable row level security;

alter table public.outing_series_movements enable row level security;

alter table public.panel_users enable row level security;

alter table public.entity_social_links enable row level security;

alter table public.band_premieres enable row level security;

alter table public.band_releases enable row level security;

alter table public.band_release_tracks enable row level security;

alter table public.band_release_sources enable row level security;

alter table public.document_imports enable row level security;

alter table public.band_colors enable row level security;

alter table public.brotherhood_habits enable row level security;

alter table public.brotherhood_procession_stats enable row level security;

alter table public.brotherhood_section_authority enable row level security;

alter table public.outing_media enable row level security;

alter table public.bulk_imports enable row level security;

alter table public.bulk_import_items enable row level security;

alter table public.entity_names enable row level security;

alter table public.cult_media enable row level security;

alter table public.legal_drafts enable row level security;

alter table public.crew_event_steps enable row level security;

alter table public.crew_event_agents enable row level security;

create policy "Public municipalities" on public.municipalities as permissive for select to public using (true);

create policy "Public places" on public.places as permissive for select to public using (true);

create policy "Published entities" on public.entities as permissive for select to public using ((status = 'published'::text));

create policy "Published brotherhoods" on public.brotherhoods as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = brotherhoods.entity_id) AND (e.status = 'published'::text)))));

create policy "Published advocations" on public.advocations as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = advocations.entity_id) AND (e.status = 'published'::text)))));

create policy "Published images" on public.images as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = images.entity_id) AND (e.status = 'published'::text)))));

create policy "Published agents" on public.agents as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = agents.entity_id) AND (e.status = 'published'::text)))));

create policy "Published steps" on public.steps as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = steps.entity_id) AND (e.status = 'published'::text)))));

create policy "Published assets" on public.heritage_assets as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = heritage_assets.entity_id) AND (e.status = 'published'::text)))));

create policy "Published bands" on public.bands as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = bands.entity_id) AND (e.status = 'published'::text)))));

create policy "Published marches" on public.marches as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = marches.entity_id) AND (e.status = 'published'::text)))));

create policy "Published entity locations" on public.entity_locations as permissive for select to public using ((status = 'published'::text));

create policy "Published outings" on public.outings as permissive for select to public using ((status = 'published'::text));

create policy "Public outing entities" on public.outing_entities as permissive for select to public using (true);

create policy "Published accompaniments" on public.accompaniments as permissive for select to public using ((status = 'published'::text));

create policy "Published cults" on public.cults as permissive for select to public using ((status = 'published'::text));

create policy "Public sources" on public.sources as permissive for select to public using (true);

create policy "Published daily content" on public.daily_overrides as permissive for select to public using (((status = 'published'::text) AND (publish_date <= CURRENT_DATE)));

create policy "Published heritage updates" on public.heritage_updates as permissive for select to public using ((status = 'published'::text));

create policy "Published editorial content" on public.editorial_content as permissive for select to public using (((status = 'published'::text) AND ((publish_date IS NULL) OR (publish_date <= CURRENT_DATE))));

create policy "Public editorial content links" on public.editorial_content_links as permissive for select to public using ((EXISTS ( SELECT 1
   FROM editorial_content ec
  WHERE ((ec.id = editorial_content_links.editorial_content_id) AND (ec.status = 'published'::text) AND ((ec.publish_date IS NULL) OR (ec.publish_date <= CURRENT_DATE))))));

create policy "Public entity media" on public.entity_media as permissive for select to public using (((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = entity_media.entity_id) AND (e.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM media_assets m
  WHERE ((m.id = entity_media.media_asset_id) AND (m.rights_status = ANY (ARRAY['owned'::text, 'authorized'::text, 'licensed'::text, 'public_domain'::text])))))));

create policy "Public band names" on public.band_names as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = band_names.band_entity_id) AND (e.status = 'published'::text)))));

create policy "Published music accompaniment periods" on public.music_accompaniment_periods as permissive for select to public using ((status = 'published'::text));

create policy "Published march dedications" on public.march_dedications as permissive for select to public using ((status = 'published'::text));

create policy "Published march recordings" on public.march_recordings as permissive for select to public using ((status = 'published'::text));

create policy "Public image names" on public.image_names as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = image_names.image_entity_id) AND (e.status = 'published'::text)))));

create policy "Published step phases" on public.step_phases as permissive for select to public using ((status = 'published'::text));

create policy "Public agent names" on public.agent_names as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = agent_names.agent_entity_id) AND (e.status = 'published'::text)))));

create policy "Public agent disciplines" on public.agent_disciplines as permissive for select to public using ((EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = agent_disciplines.agent_entity_id) AND (e.status = 'published'::text)))));

create policy "Public cult entities" on public.cult_entities as permissive for select to public using ((EXISTS ( SELECT 1
   FROM cults c
  WHERE ((c.id = cult_entities.cult_id) AND (c.status = 'published'::text)))));

create policy "Published cult occurrences" on public.cult_occurrences as permissive for select to public using ((status = 'published'::text));

create policy "Public cult occurrence days" on public.cult_occurrence_days as permissive for select to public using ((EXISTS ( SELECT 1
   FROM cult_occurrences co
  WHERE ((co.id = cult_occurrence_days.cult_occurrence_id) AND (co.status = 'published'::text)))));

create policy "Public outing route points" on public.outing_route_points as permissive for select to public using ((EXISTS ( SELECT 1
   FROM outings o
  WHERE ((o.id = outing_route_points.outing_id) AND (o.status = 'published'::text)))));

create policy "Public outing schedule items" on public.outing_schedule_items as permissive for select to public using ((EXISTS ( SELECT 1
   FROM outings o
  WHERE ((o.id = outing_schedule_items.outing_id) AND (o.status = 'published'::text)))));

create policy "Published outing music positions" on public.outing_music_positions as permissive for select to public using ((status = 'published'::text));

create policy "Published outing music assignments" on public.outing_music_assignments as permissive for select to public using ((status = 'published'::text));

create policy "Published brotherhood colors" on public.brotherhood_colors as permissive for select to public using ((status = 'published'::text));

create policy "Published outing series" on public.outing_series as permissive for select to public using ((status = 'published'::text));

create policy "Public outing series movements" on public.outing_series_movements as permissive for select to public using ((EXISTS ( SELECT 1
   FROM outing_series series
  WHERE ((series.id = outing_series_movements.outing_series_id) AND (series.status = 'published'::text)))));

create policy "Panel users can read their profile" on public.panel_users as permissive for select to authenticated using (((user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT can_admin_panel() AS can_admin_panel)));

create policy "Admins can add panel users" on public.panel_users as permissive for insert to authenticated with check (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Admins can update panel users" on public.panel_users as permissive for update to authenticated using (( SELECT can_admin_panel() AS can_admin_panel)) with check (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Admins can delete panel users" on public.panel_users as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read entities" on public.entities as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read brotherhoods" on public.brotherhoods as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read brotherhood_colors" on public.brotherhood_colors as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read images" on public.images as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read brotherhood_images" on public.brotherhood_images as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read steps" on public.steps as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read brotherhood_steps" on public.brotherhood_steps as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read agents" on public.agents as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read agent_roles" on public.agent_roles as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read bands" on public.bands as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read marches" on public.marches as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read march_authors" on public.march_authors as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read outings" on public.outings as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read outing_entities" on public.outing_entities as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read outing_route_points" on public.outing_route_points as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read outing_schedule_items" on public.outing_schedule_items as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read outing_series" on public.outing_series as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read outing_series_movements" on public.outing_series_movements as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read cults" on public.cults as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read cult_entities" on public.cult_entities as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read cult_occurrences" on public.cult_occurrences as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read cult_occurrence_days" on public.cult_occurrence_days as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read heritage_assets" on public.heritage_assets as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read heritage_interventions" on public.heritage_interventions as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read heritage_updates" on public.heritage_updates as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read heritage_update_agents" on public.heritage_update_agents as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read editorial_content" on public.editorial_content as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read editorial_content_links" on public.editorial_content_links as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read sources" on public.sources as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read source_links" on public.source_links as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read media_assets" on public.media_assets as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read entity_media" on public.entity_media as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read audit_log" on public.audit_log as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create entities" on public.entities as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update entities" on public.entities as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete entities" on public.entities as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create brotherhood_colors" on public.brotherhood_colors as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update brotherhood_colors" on public.brotherhood_colors as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete brotherhood_colors" on public.brotherhood_colors as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create brotherhood_images" on public.brotherhood_images as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update brotherhood_images" on public.brotherhood_images as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete brotherhood_images" on public.brotherhood_images as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create brotherhood_steps" on public.brotherhood_steps as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update brotherhood_steps" on public.brotherhood_steps as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete brotherhood_steps" on public.brotherhood_steps as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create outings" on public.outings as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update outings" on public.outings as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete outings" on public.outings as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create outing_series" on public.outing_series as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update outing_series" on public.outing_series as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete outing_series" on public.outing_series as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create cults" on public.cults as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update cults" on public.cults as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete cults" on public.cults as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create cult_occurrences" on public.cult_occurrences as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update cult_occurrences" on public.cult_occurrences as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete cult_occurrences" on public.cult_occurrences as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create heritage_interventions" on public.heritage_interventions as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update heritage_interventions" on public.heritage_interventions as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete heritage_interventions" on public.heritage_interventions as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create heritage_updates" on public.heritage_updates as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update heritage_updates" on public.heritage_updates as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete heritage_updates" on public.heritage_updates as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create editorial_content" on public.editorial_content as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update editorial_content" on public.editorial_content as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete editorial_content" on public.editorial_content as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create brotherhoods" on public.brotherhoods as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update brotherhoods" on public.brotherhoods as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete brotherhoods" on public.brotherhoods as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create images" on public.images as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update images" on public.images as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete images" on public.images as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create steps" on public.steps as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update steps" on public.steps as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete steps" on public.steps as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create agents" on public.agents as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update agents" on public.agents as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete agents" on public.agents as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create agent_roles" on public.agent_roles as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update agent_roles" on public.agent_roles as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete agent_roles" on public.agent_roles as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create bands" on public.bands as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update bands" on public.bands as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete bands" on public.bands as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create marches" on public.marches as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update marches" on public.marches as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete marches" on public.marches as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create march_authors" on public.march_authors as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update march_authors" on public.march_authors as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete march_authors" on public.march_authors as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create outing_entities" on public.outing_entities as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update outing_entities" on public.outing_entities as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete outing_entities" on public.outing_entities as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create outing_route_points" on public.outing_route_points as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update outing_route_points" on public.outing_route_points as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete outing_route_points" on public.outing_route_points as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create outing_schedule_items" on public.outing_schedule_items as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update outing_schedule_items" on public.outing_schedule_items as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete outing_schedule_items" on public.outing_schedule_items as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create outing_series_movements" on public.outing_series_movements as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update outing_series_movements" on public.outing_series_movements as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete outing_series_movements" on public.outing_series_movements as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create cult_entities" on public.cult_entities as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update cult_entities" on public.cult_entities as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete cult_entities" on public.cult_entities as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create cult_occurrence_days" on public.cult_occurrence_days as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update cult_occurrence_days" on public.cult_occurrence_days as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete cult_occurrence_days" on public.cult_occurrence_days as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create heritage_assets" on public.heritage_assets as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update heritage_assets" on public.heritage_assets as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete heritage_assets" on public.heritage_assets as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create heritage_update_agents" on public.heritage_update_agents as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update heritage_update_agents" on public.heritage_update_agents as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete heritage_update_agents" on public.heritage_update_agents as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create editorial_content_links" on public.editorial_content_links as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update editorial_content_links" on public.editorial_content_links as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete editorial_content_links" on public.editorial_content_links as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create sources" on public.sources as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update sources" on public.sources as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete sources" on public.sources as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create source_links" on public.source_links as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update source_links" on public.source_links as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete source_links" on public.source_links as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create media_assets" on public.media_assets as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update media_assets" on public.media_assets as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete media_assets" on public.media_assets as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create entity_media" on public.entity_media as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update entity_media" on public.entity_media as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Admins can delete entity_media" on public.entity_media as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can write audit log" on public.audit_log as permissive for insert to authenticated with check ((( SELECT is_panel_member() AS is_panel_member) AND ((actor_user_id IS NULL) OR (actor_user_id = ( SELECT auth.uid() AS uid)))));

create policy "Editors can delete media assets" on public.media_assets as permissive for delete to authenticated using (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can delete entity media" on public.entity_media as permissive for delete to authenticated using (( SELECT can_publish_panel() AS can_publish_panel));

drop policy if exists "Public can view Hilo media" on storage.objects;
create policy "Public can view Hilo media" on storage.objects as permissive for select to public using ((bucket_id = 'hilo-media'::text));

drop policy if exists "Editors can upload Hilo media" on storage.objects;
create policy "Editors can upload Hilo media" on storage.objects as permissive for insert to authenticated with check (((bucket_id = 'hilo-media'::text) AND ( SELECT can_publish_panel() AS can_publish_panel)));

drop policy if exists "Editors can update Hilo media" on storage.objects;
create policy "Editors can update Hilo media" on storage.objects as permissive for update to authenticated using (((bucket_id = 'hilo-media'::text) AND ( SELECT can_publish_panel() AS can_publish_panel))) with check (((bucket_id = 'hilo-media'::text) AND ( SELECT can_publish_panel() AS can_publish_panel)));

drop policy if exists "Editors can delete Hilo media" on storage.objects;
create policy "Editors can delete Hilo media" on storage.objects as permissive for delete to authenticated using (((bucket_id = 'hilo-media'::text) AND ( SELECT can_publish_panel() AS can_publish_panel)));

create policy "Public official entity links" on public.entity_social_links as permissive for select to public using (((is_public = true) AND (EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = entity_social_links.entity_id) AND (e.status = 'published'::text))))));

create policy "Panel members can read official entity links" on public.entity_social_links as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create official entity links" on public.entity_social_links as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update official entity links" on public.entity_social_links as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete official entity links" on public.entity_social_links as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Published band premieres" on public.band_premieres as permissive for select to public using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = band_premieres.band_entity_id) AND (e.status = 'published'::text))))));

create policy "Panel members can read band premieres" on public.band_premieres as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create band premieres" on public.band_premieres as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update band premieres" on public.band_premieres as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete band premieres" on public.band_premieres as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read band_names" on public.band_names as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create band_names" on public.band_names as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update band_names" on public.band_names as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete band_names" on public.band_names as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read band_agents" on public.band_agents as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create band_agents" on public.band_agents as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update band_agents" on public.band_agents as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete band_agents" on public.band_agents as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read music_accompaniment_periods" on public.music_accompaniment_periods as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create music_accompaniment_periods" on public.music_accompaniment_periods as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update music_accompaniment_periods" on public.music_accompaniment_periods as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete music_accompaniment_periods" on public.music_accompaniment_periods as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read outing_music_positions" on public.outing_music_positions as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create outing_music_positions" on public.outing_music_positions as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update outing_music_positions" on public.outing_music_positions as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete outing_music_positions" on public.outing_music_positions as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read outing_music_assignments" on public.outing_music_assignments as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create outing_music_assignments" on public.outing_music_assignments as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update outing_music_assignments" on public.outing_music_assignments as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete outing_music_assignments" on public.outing_music_assignments as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read entity relations" on public.entity_relations as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create entity relations" on public.entity_relations as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update entity relations" on public.entity_relations as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete entity relations" on public.entity_relations as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read image_steps" on public.image_steps as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create image_steps" on public.image_steps as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update image_steps" on public.image_steps as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete image_steps" on public.image_steps as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read image_authorships" on public.image_authorships as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create image_authorships" on public.image_authorships as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update image_authorships" on public.image_authorships as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete image_authorships" on public.image_authorships as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Panel members can read advocations" on public.advocations as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create advocations" on public.advocations as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update advocations" on public.advocations as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Panel members can read entity_relations" on public.entity_relations as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create entity_relations" on public.entity_relations as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update entity_relations" on public.entity_relations as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can create municipalities" on public.municipalities as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update municipalities" on public.municipalities as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can create places" on public.places as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update places" on public.places as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Published band releases" on public.band_releases as permissive for select to public using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = band_releases.band_entity_id) AND (e.status = 'published'::text))))));

create policy "Tracks of published band releases" on public.band_release_tracks as permissive for select to public using ((EXISTS ( SELECT 1
   FROM (band_releases release
     JOIN entities band ON ((band.id = release.band_entity_id)))
  WHERE ((release.id = band_release_tracks.release_id) AND (release.status = 'published'::text) AND (band.status = 'published'::text)))));

create policy "Sources of published band releases" on public.band_release_sources as permissive for select to public using ((EXISTS ( SELECT 1
   FROM (band_releases release
     JOIN entities band ON ((band.id = release.band_entity_id)))
  WHERE ((release.id = band_release_sources.release_id) AND (release.status = 'published'::text) AND (band.status = 'published'::text)))));

create policy "Panel members can read band releases" on public.band_releases as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read band release tracks" on public.band_release_tracks as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel members can read band release sources" on public.band_release_sources as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create band releases" on public.band_releases as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update band releases" on public.band_releases as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete band releases" on public.band_releases as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create band release tracks" on public.band_release_tracks as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update band release tracks" on public.band_release_tracks as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can delete band release tracks" on public.band_release_tracks as permissive for delete to authenticated using (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can link band release sources" on public.band_release_sources as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update band release sources" on public.band_release_sources as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can unlink band release sources" on public.band_release_sources as permissive for delete to authenticated using (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Panel members can read document imports" on public.document_imports as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create document imports" on public.document_imports as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((created_by IS NULL) OR (created_by = ( SELECT auth.uid() AS uid)))));

create policy "Editors can update document imports" on public.document_imports as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete document imports" on public.document_imports as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Published band colors" on public.band_colors as permissive for select to public using ((status = 'published'::text));

create policy "Panel members can read band_colors" on public.band_colors as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create band_colors" on public.band_colors as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update band_colors" on public.band_colors as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete band_colors" on public.band_colors as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Published brotherhood habits" on public.brotherhood_habits as permissive for select to anon, authenticated using ((status = 'published'::text));

create policy "Panel members can read brotherhood_habits" on public.brotherhood_habits as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create brotherhood_habits" on public.brotherhood_habits as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update brotherhood_habits" on public.brotherhood_habits as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete brotherhood_habits" on public.brotherhood_habits as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Published brotherhood procession stats" on public.brotherhood_procession_stats as permissive for select to anon, authenticated using ((status = 'published'::text));

create policy "Panel members can read brotherhood procession stats" on public.brotherhood_procession_stats as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create brotherhood procession stats" on public.brotherhood_procession_stats as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update brotherhood procession stats" on public.brotherhood_procession_stats as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete brotherhood procession stats" on public.brotherhood_procession_stats as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Editors can create brotherhood section authority" on public.brotherhood_section_authority as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update brotherhood section authority" on public.brotherhood_section_authority as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete brotherhood section authority" on public.brotherhood_section_authority as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Anon can read published brotherhood section authority" on public.brotherhood_section_authority as permissive for select to anon using ((EXISTS ( SELECT 1
   FROM entities entity
  WHERE ((entity.id = brotherhood_section_authority.brotherhood_entity_id) AND (entity.entity_type = 'brotherhood'::text) AND (entity.status = 'published'::text)))));

create policy "Authenticated can read brotherhood section authority" on public.brotherhood_section_authority as permissive for select to authenticated using ((( SELECT is_panel_member() AS is_panel_member) OR (EXISTS ( SELECT 1
   FROM entities entity
  WHERE ((entity.id = brotherhood_section_authority.brotherhood_entity_id) AND (entity.entity_type = 'brotherhood'::text) AND (entity.status = 'published'::text))))));

create policy "Public outing media" on public.outing_media as permissive for select to public using (((EXISTS ( SELECT 1
   FROM outings o
  WHERE ((o.id = outing_media.outing_id) AND (o.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM media_assets m
  WHERE ((m.id = outing_media.media_asset_id) AND (m.rights_status = ANY (ARRAY['owned'::text, 'authorized'::text, 'licensed'::text, 'public_domain'::text])))))));

create policy "Panel members can read outing media" on public.outing_media as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create outing media" on public.outing_media as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update outing media" on public.outing_media as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can delete outing media" on public.outing_media as permissive for delete to authenticated using (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Panel members can read bulk imports" on public.bulk_imports as permissive for select to authenticated using (is_panel_member());

create policy "Editors can create bulk imports" on public.bulk_imports as permissive for insert to authenticated with check ((can_edit_panel() AND ((created_by IS NULL) OR (created_by = ( SELECT auth.uid() AS uid)))));

create policy "Editors can update bulk imports" on public.bulk_imports as permissive for update to authenticated using (can_edit_panel()) with check (can_edit_panel());

create policy "Admins can delete bulk imports" on public.bulk_imports as permissive for delete to authenticated using (can_admin_panel());

create policy "Panel members can read bulk import items" on public.bulk_import_items as permissive for select to authenticated using (is_panel_member());

create policy "Editors can create bulk import items" on public.bulk_import_items as permissive for insert to authenticated with check ((can_edit_panel() AND (EXISTS ( SELECT 1
   FROM bulk_imports bi
  WHERE (bi.id = bulk_import_items.import_id)))));

create policy "Editors can update bulk import items" on public.bulk_import_items as permissive for update to authenticated using (can_edit_panel()) with check (can_edit_panel());

create policy "Admins can delete bulk import items" on public.bulk_import_items as permissive for delete to authenticated using (can_admin_panel());

create policy "Public agent roles" on public.agent_roles as permissive for select to anon, authenticated using ((EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = agent_roles.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text)))));

create policy "Published image authorships" on public.image_authorships as permissive for select to anon, authenticated using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities image
  WHERE ((image.id = image_authorships.image_entity_id) AND (image.entity_type = 'image'::text) AND (image.status = 'published'::text)))) AND ((agent_entity_id IS NULL) OR (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = image_authorships.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text)))))));

create policy "Published march authors" on public.march_authors as permissive for select to anon, authenticated using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities march
  WHERE ((march.id = march_authors.march_entity_id) AND (march.entity_type = 'march'::text) AND (march.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = march_authors.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text))))));

create policy "Published step personnel periods" on public.step_personnel_periods as permissive for select to anon, authenticated using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities step
  WHERE ((step.id = step_personnel_periods.step_entity_id) AND (step.entity_type = 'step'::text) AND (step.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = step_personnel_periods.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text))))));

create policy "Public step phase agents" on public.step_phase_agents as permissive for select to anon, authenticated using (((EXISTS ( SELECT 1
   FROM (step_phases phase
     JOIN entities step ON ((step.id = phase.step_entity_id)))
  WHERE ((phase.id = step_phase_agents.step_phase_id) AND (phase.status = 'published'::text) AND (step.entity_type = 'step'::text) AND (step.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = step_phase_agents.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text)))) AND ((element_entity_id IS NULL) OR (EXISTS ( SELECT 1
   FROM entities element
  WHERE ((element.id = step_phase_agents.element_entity_id) AND (element.status = 'published'::text)))))));

create policy "Published heritage interventions" on public.heritage_interventions as permissive for select to anon, authenticated using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities target
  WHERE ((target.id = heritage_interventions.target_entity_id) AND (target.status = 'published'::text)))) AND ((agent_entity_id IS NULL) OR (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = heritage_interventions.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text)))))));

create policy "Public heritage update agents" on public.heritage_update_agents as permissive for select to anon, authenticated using (((EXISTS ( SELECT 1
   FROM (heritage_updates heritage_update
     JOIN entities brotherhood ON ((brotherhood.id = heritage_update.brotherhood_entity_id)))
  WHERE ((heritage_update.id = heritage_update_agents.heritage_update_id) AND (heritage_update.status = 'published'::text) AND (brotherhood.entity_type = 'brotherhood'::text) AND (brotherhood.status = 'published'::text) AND ((heritage_update.target_entity_id IS NULL) OR (EXISTS ( SELECT 1
           FROM entities target
          WHERE ((target.id = heritage_update.target_entity_id) AND (target.status = 'published'::text)))))))) AND (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = heritage_update_agents.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text))))));

create policy "Public band agents" on public.band_agents as permissive for select to anon, authenticated using ((is_public AND (EXISTS ( SELECT 1
   FROM entities band
  WHERE ((band.id = band_agents.band_entity_id) AND (band.entity_type = 'band'::text) AND (band.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = band_agents.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text))))));

create policy "Published entity relations" on public.entity_relations as permissive for select to anon, authenticated using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities source
  WHERE ((source.id = entity_relations.source_entity_id) AND (source.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities target
  WHERE ((target.id = entity_relations.target_entity_id) AND (target.status = 'published'::text))))));

create policy "Published brotherhood image relations" on public.brotherhood_images as permissive for select to public using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities brotherhood
  WHERE ((brotherhood.id = brotherhood_images.brotherhood_entity_id) AND (brotherhood.entity_type = 'brotherhood'::text) AND (brotherhood.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities image
  WHERE ((image.id = brotherhood_images.image_entity_id) AND (image.entity_type = 'image'::text) AND (image.status = 'published'::text))))));

create policy "Published brotherhood step relations" on public.brotherhood_steps as permissive for select to public using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities brotherhood
  WHERE ((brotherhood.id = brotherhood_steps.brotherhood_entity_id) AND (brotherhood.entity_type = 'brotherhood'::text) AND (brotherhood.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities step
  WHERE ((step.id = brotherhood_steps.step_entity_id) AND (step.entity_type = 'step'::text) AND (step.status = 'published'::text))))));

create policy "Published image step relations" on public.image_steps as permissive for select to public using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities image
  WHERE ((image.id = image_steps.image_entity_id) AND (image.entity_type = 'image'::text) AND (image.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities step
  WHERE ((step.id = image_steps.step_entity_id) AND (step.entity_type = 'step'::text) AND (step.status = 'published'::text))))));

create policy "Public source links" on public.source_links as permissive for select to anon, authenticated using (((num_nonnulls(entity_id, outing_id, cult_id, intervention_id, heritage_update_id, editorial_content_id, music_accompaniment_period_id, march_dedication_id, march_recording_id, image_authorship_id, brotherhood_image_id, entity_location_id, entity_relation_id, step_phase_id, step_personnel_period_id, brotherhood_step_id, image_step_id, agent_name_id, agent_role_id, cult_occurrence_id, outing_music_position_id, outing_music_assignment_id, outing_series_id, band_premiere_id, brotherhood_habit_id) = 1) AND
CASE
    WHEN (entity_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM entities target
      WHERE (target.id = source_links.entity_id)))
    WHEN (outing_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM outings target
      WHERE (target.id = source_links.outing_id)))
    WHEN (cult_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM cults target
      WHERE (target.id = source_links.cult_id)))
    WHEN (intervention_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM heritage_interventions target
      WHERE (target.id = source_links.intervention_id)))
    WHEN (heritage_update_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM heritage_updates target
      WHERE (target.id = source_links.heritage_update_id)))
    WHEN (editorial_content_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM editorial_content target
      WHERE (target.id = source_links.editorial_content_id)))
    WHEN (music_accompaniment_period_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM music_accompaniment_periods target
      WHERE (target.id = source_links.music_accompaniment_period_id)))
    WHEN (march_dedication_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM march_dedications target
      WHERE (target.id = source_links.march_dedication_id)))
    WHEN (march_recording_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM march_recordings target
      WHERE (target.id = source_links.march_recording_id)))
    WHEN (image_authorship_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM image_authorships target
      WHERE (target.id = source_links.image_authorship_id)))
    WHEN (brotherhood_image_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM brotherhood_images target
      WHERE (target.id = source_links.brotherhood_image_id)))
    WHEN (entity_location_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM entity_locations target
      WHERE (target.id = source_links.entity_location_id)))
    WHEN (entity_relation_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM entity_relations target
      WHERE (target.id = source_links.entity_relation_id)))
    WHEN (step_phase_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM step_phases target
      WHERE (target.id = source_links.step_phase_id)))
    WHEN (step_personnel_period_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM step_personnel_periods target
      WHERE (target.id = source_links.step_personnel_period_id)))
    WHEN (brotherhood_step_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM brotherhood_steps target
      WHERE (target.id = source_links.brotherhood_step_id)))
    WHEN (image_step_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM image_steps target
      WHERE (target.id = source_links.image_step_id)))
    WHEN (agent_name_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM agent_names target
      WHERE (target.id = source_links.agent_name_id)))
    WHEN (agent_role_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM agent_roles target
      WHERE (target.id = source_links.agent_role_id)))
    WHEN (cult_occurrence_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM cult_occurrences target
      WHERE (target.id = source_links.cult_occurrence_id)))
    WHEN (outing_music_position_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM outing_music_positions target
      WHERE (target.id = source_links.outing_music_position_id)))
    WHEN (outing_music_assignment_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM outing_music_assignments target
      WHERE (target.id = source_links.outing_music_assignment_id)))
    WHEN (outing_series_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM outing_series target
      WHERE (target.id = source_links.outing_series_id)))
    WHEN (band_premiere_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM band_premieres target
      WHERE (target.id = source_links.band_premiere_id)))
    WHEN (brotherhood_habit_id IS NOT NULL) THEN (EXISTS ( SELECT 1
       FROM brotherhood_habits target
      WHERE (target.id = source_links.brotherhood_habit_id)))
    ELSE false
END));

create policy "Publishable media assets" on public.media_assets as permissive for select to public using (((rights_status = ANY (ARRAY['owned'::text, 'authorized'::text])) OR ((rights_status = ANY (ARRAY['licensed'::text, 'public_domain'::text])) AND open_media_provenance_is_valid(storage_path, rights_status, license, author_name, rights_holder, source_name, source_url, alt_text, permission_notes))));

create policy "Published entity names" on public.entity_names as permissive for select to public using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM entities e
  WHERE ((e.id = entity_names.entity_id) AND (e.status = 'published'::text))))));

create policy "Panel members can read entity names" on public.entity_names as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create entity names" on public.entity_names as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update entity names" on public.entity_names as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete entity names" on public.entity_names as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Public cult media" on public.cult_media as permissive for select to public using (((EXISTS ( SELECT 1
   FROM cults c
  WHERE ((c.id = cult_media.cult_id) AND (c.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM media_assets m
  WHERE ((m.id = cult_media.media_asset_id) AND (m.rights_status = ANY (ARRAY['owned'::text, 'authorized'::text, 'licensed'::text, 'public_domain'::text])))))));

create policy "Panel members can read cult media" on public.cult_media as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create cult media" on public.cult_media as permissive for insert to authenticated with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can update cult media" on public.cult_media as permissive for update to authenticated using (( SELECT can_publish_panel() AS can_publish_panel)) with check (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Editors can delete cult media" on public.cult_media as permissive for delete to authenticated using (( SELECT can_publish_panel() AS can_publish_panel));

create policy "Panel members can read legal drafts" on public.legal_drafts as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Panel editors can add legal drafts" on public.legal_drafts as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Panel editors can update legal drafts" on public.legal_drafts as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Public can read ready legal documents" on public.legal_drafts as permissive for select to anon using (((status = 'ready'::text) AND (document_key = ANY (ARRAY['legal_notice'::text, 'privacy_policy'::text, 'storage_policy'::text]))));

create policy "Published events" on public.events as permissive for select to anon, authenticated using (((EXISTS ( SELECT 1
   FROM entities event_entity
  WHERE ((event_entity.id = events.entity_id) AND (event_entity.entity_type = 'event'::text) AND (event_entity.status = 'published'::text)))) AND ((event_category <> 'crew_call'::text) OR (EXISTS ( SELECT 1
   FROM entities brotherhood
  WHERE ((brotherhood.id = events.brotherhood_entity_id) AND (brotherhood.entity_type = 'brotherhood'::text) AND (brotherhood.status = 'published'::text)))))));

create policy "Panel members can read events" on public.events as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create events" on public.events as permissive for insert to authenticated with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Editors can update events" on public.events as permissive for update to authenticated using (( SELECT can_edit_panel() AS can_edit_panel)) with check (( SELECT can_edit_panel() AS can_edit_panel));

create policy "Admins can delete events" on public.events as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Published crew event steps" on public.crew_event_steps as permissive for select to anon, authenticated using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM (events event
     JOIN entities event_entity ON ((event_entity.id = event.entity_id)))
  WHERE ((event.entity_id = crew_event_steps.event_entity_id) AND (event.event_category = 'crew_call'::text) AND (event_entity.entity_type = 'event'::text) AND (event_entity.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities step
  WHERE ((step.id = crew_event_steps.step_entity_id) AND (step.entity_type = 'step'::text) AND (step.status = 'published'::text))))));

create policy "Panel members can read crew event steps" on public.crew_event_steps as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create crew event steps" on public.crew_event_steps as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update crew event steps" on public.crew_event_steps as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete crew event steps" on public.crew_event_steps as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

create policy "Published crew event agents" on public.crew_event_agents as permissive for select to anon, authenticated using (((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM (events event
     JOIN entities event_entity ON ((event_entity.id = event.entity_id)))
  WHERE ((event.entity_id = crew_event_agents.event_entity_id) AND (event.event_category = 'crew_call'::text) AND (event_entity.entity_type = 'event'::text) AND (event_entity.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM entities agent
  WHERE ((agent.id = crew_event_agents.agent_entity_id) AND (agent.entity_type = 'agent'::text) AND (agent.status = 'published'::text))))));

create policy "Panel members can read crew event agents" on public.crew_event_agents as permissive for select to authenticated using (( SELECT is_panel_member() AS is_panel_member));

create policy "Editors can create crew event agents" on public.crew_event_agents as permissive for insert to authenticated with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Editors can update crew event agents" on public.crew_event_agents as permissive for update to authenticated using ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel)))) with check ((( SELECT can_edit_panel() AS can_edit_panel) AND ((status <> 'published'::text) OR ( SELECT can_publish_panel() AS can_publish_panel))));

create policy "Admins can delete crew event agents" on public.crew_event_agents as permissive for delete to authenticated using (( SELECT can_admin_panel() AS can_admin_panel));

revoke all on all tables in schema public from public, anon, authenticated, service_role;
revoke all on all sequences in schema public from public, anon, authenticated, service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.accompaniments to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.accompaniments to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.accompaniments to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.advocation_images to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.advocation_images to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.advocation_images to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.advocations to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.advocations to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.advocations to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_activity to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_activity to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_activity to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_disciplines to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_disciplines to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_disciplines to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_names to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_names to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_names to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_profile_summary to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_profile_summary to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_profile_summary to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_roles to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_roles to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agent_roles to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agents to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agents to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.agents to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.audit_log to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.audit_log to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.audit_log to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_agents to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_agents to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_agents to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_colors to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_colors to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_colors to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_names to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_names to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_names to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_premieres to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_premieres to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_premieres to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_release_sources to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_release_sources to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_release_sources to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_release_tracks to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_release_tracks to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_release_tracks to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_releases to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_releases to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.band_releases to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.bands to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.bands to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.bands to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_colors to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_colors to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_colors to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_completeness to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_completeness to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_completeness to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_completeness_signals to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_completeness_signals to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_completeness_signals to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_habits to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_habits to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_habits to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_images to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_images to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_images to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_procession_stats to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_procession_stats to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_procession_stats to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_section_authority to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_section_authority to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_section_authority to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_steps to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_steps to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhood_steps to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhoods to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhoods to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.brotherhoods to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.bulk_import_items to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.bulk_import_items to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.bulk_imports to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.bulk_imports to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_cult_days to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_cult_days to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_cult_days to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_items to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_items to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_items to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_outings to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_outings to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.calendar_outings to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.completeness_rules to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.completeness_rules to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.completeness_rules to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.contributions to service_role;

grant SELECT on table public.crew_event_agents to anon;

grant DELETE, INSERT, SELECT, UPDATE on table public.crew_event_agents to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.crew_event_agents to service_role;

grant SELECT on table public.crew_event_steps to anon;

grant DELETE, INSERT, SELECT, UPDATE on table public.crew_event_steps to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.crew_event_steps to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_entities to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_entities to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_entities to service_role;

grant SELECT on table public.cult_media to anon;

grant DELETE, INSERT, SELECT, UPDATE on table public.cult_media to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_media to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_occurrence_days to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_occurrence_days to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_occurrence_days to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_occurrences to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_occurrences to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cult_occurrences to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cults to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cults to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.cults to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_image_locations to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_image_locations to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_image_locations to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_music_accompaniments to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_music_accompaniments to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_music_accompaniments to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_step_elements to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_step_elements to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_step_elements to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_step_personnel to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_step_personnel to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.current_step_personnel to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_editorial_candidates to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_editorial_candidates to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_editorial_candidates to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_march_candidates to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_march_candidates to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_march_candidates to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_overrides to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_overrides to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.daily_overrides to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.document_imports to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.document_imports to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.document_imports to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.editorial_content to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.editorial_content to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.editorial_content to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.editorial_content_links to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.editorial_content_links to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.editorial_content_links to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entities to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entities to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entities to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_locations to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_locations to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_locations to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_media to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_media to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_media to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_names to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_names to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_names to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_relations to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_relations to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_relations to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_social_links to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_social_links to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.entity_social_links to service_role;

grant SELECT on table public.events to anon;

grant DELETE, INSERT, SELECT, UPDATE on table public.events to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.events to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.extraordinary_outings_directory to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.extraordinary_outings_directory to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.extraordinary_outings_directory to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_assets to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_assets to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_assets to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_interventions to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_interventions to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_interventions to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_update_agents to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_update_agents to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_update_agents to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_updates to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_updates to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.heritage_updates to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.home_knowledge_threads to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.home_knowledge_threads to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.home_knowledge_threads to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_authorship_details to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_authorship_details to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_authorship_details to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_authorships to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_authorships to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_authorships to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_brotherhood_history to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_brotherhood_history to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_brotherhood_history to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_names to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_names to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_names to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_restorations to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_restorations to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_restorations to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_steps to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_steps to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.image_steps to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.images to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.images to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.images to service_role;

grant INSERT, SELECT, UPDATE on table public.legal_drafts to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.legal_drafts to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_authors to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_authors to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_authors to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_dedications to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_dedications to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_dedications to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_recordings to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_recordings to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.march_recordings to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.marches to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.marches to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.marches to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.marches_with_dedications to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.marches_with_dedications to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.marches_with_dedications to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.media_assets to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.media_assets to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.media_assets to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.municipalities to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.municipalities to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.municipalities to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.music_accompaniment_periods to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.music_accompaniment_periods to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.music_accompaniment_periods to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_entities to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_entities to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_entities to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_media to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_media to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_media to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_assignments to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_assignments to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_assignments to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_details to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_details to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_details to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_positions to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_positions to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_music_positions to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_route_points to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_route_points to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_route_points to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_schedule_items to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_schedule_items to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_schedule_items to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_series to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_series to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_series to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_series_movements to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_series_movements to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outing_series_movements to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outings to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outings to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.outings to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.panel_users to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.panel_users to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.panel_users to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.places to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.places to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.places to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.published_band_colors to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.published_band_colors to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.published_band_colors to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.published_brotherhood_colors to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.published_brotherhood_colors to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.published_brotherhood_colors to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.source_links to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.source_links to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.source_links to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.sources to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.sources to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.sources to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_brotherhood_history to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_brotherhood_history to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_brotherhood_history to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_image_history to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_image_history to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_image_history to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_personnel_periods to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_personnel_periods to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_personnel_periods to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phase_agents to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phase_agents to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phase_agents to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phase_details to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phase_details to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phase_details to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phases to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phases to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.step_phases to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.steps to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.steps to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.steps to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.today_calendar_items to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.today_calendar_items to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.today_calendar_items to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.today_ephemeris_candidates to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.today_ephemeris_candidates to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.today_ephemeris_candidates to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.upcoming_calendar_items to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.upcoming_calendar_items to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.upcoming_calendar_items to service_role;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.upcoming_extraordinary_outings to anon;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.upcoming_extraordinary_outings to authenticated;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.upcoming_extraordinary_outings to service_role;

revoke all on function set_updated_at() from public, anon, authenticated, service_role;

revoke all on function current_panel_role() from public, anon, authenticated, service_role;

revoke all on function is_panel_member() from public, anon, authenticated, service_role;

revoke all on function can_edit_panel() from public, anon, authenticated, service_role;

revoke all on function can_publish_panel() from public, anon, authenticated, service_role;

revoke all on function can_admin_panel() from public, anon, authenticated, service_role;

revoke all on function guard_entity_relation_publication() from public, anon, authenticated, service_role;

revoke all on function apply_document_import_core(uuid,jsonb,integer[]) from public, anon, authenticated, service_role;

revoke all on function apply_document_import_music_core(uuid,jsonb,integer[]) from public, anon, authenticated, service_role;

revoke all on function apply_document_import(uuid,jsonb,integer[]) from public, anon, authenticated, service_role;

revoke all on function sync_music_accompaniment_public_location() from public, anon, authenticated, service_role;

revoke all on function hc_set_brotherhood_section_authority(uuid,text) from public, anon, authenticated, service_role;

revoke all on function hc_authority_for_event_target(uuid) from public, anon, authenticated, service_role;

revoke all on function hc_mark_brotherhood_authority_from_audit() from public, anon, authenticated, service_role;

revoke all on function guard_band_identity_collision() from public, anon, authenticated, service_role;

revoke all on function guard_band_name_alias_collision() from public, anon, authenticated, service_role;

revoke all on function guard_core_relation_publication() from public, anon, authenticated, service_role;

revoke all on function demote_invalid_core_relations_after_entity_change() from public, anon, authenticated, service_role;

revoke all on function open_media_provenance_is_valid(text,text,text,text,text,text,text,text,text) from public, anon, authenticated, service_role;

revoke all on function guard_crew_event_record() from public, anon, authenticated, service_role;

revoke all on function guard_published_crew_event_entity() from public, anon, authenticated, service_role;

revoke all on function guard_crew_event_link() from public, anon, authenticated, service_role;

grant execute on function set_updated_at() to public;

grant execute on function set_updated_at() to anon;

grant execute on function set_updated_at() to authenticated;

grant execute on function set_updated_at() to service_role;

grant execute on function current_panel_role() to authenticated;

grant execute on function current_panel_role() to service_role;

grant execute on function is_panel_member() to authenticated;

grant execute on function is_panel_member() to service_role;

grant execute on function can_edit_panel() to authenticated;

grant execute on function can_edit_panel() to service_role;

grant execute on function can_publish_panel() to authenticated;

grant execute on function can_publish_panel() to service_role;

grant execute on function can_admin_panel() to authenticated;

grant execute on function can_admin_panel() to service_role;

grant execute on function guard_entity_relation_publication() to public;

grant execute on function guard_entity_relation_publication() to anon;

grant execute on function guard_entity_relation_publication() to authenticated;

grant execute on function guard_entity_relation_publication() to service_role;

grant execute on function apply_document_import_core(uuid,jsonb,integer[]) to service_role;

grant execute on function apply_document_import_music_core(uuid,jsonb,integer[]) to service_role;

grant execute on function apply_document_import(uuid,jsonb,integer[]) to authenticated;

grant execute on function apply_document_import(uuid,jsonb,integer[]) to service_role;

grant execute on function sync_music_accompaniment_public_location() to service_role;

grant execute on function hc_set_brotherhood_section_authority(uuid,text) to service_role;

grant execute on function hc_authority_for_event_target(uuid) to service_role;

grant execute on function hc_mark_brotherhood_authority_from_audit() to service_role;

grant execute on function guard_band_identity_collision() to public;

grant execute on function guard_band_identity_collision() to anon;

grant execute on function guard_band_identity_collision() to authenticated;

grant execute on function guard_band_identity_collision() to service_role;

grant execute on function guard_band_name_alias_collision() to public;

grant execute on function guard_band_name_alias_collision() to anon;

grant execute on function guard_band_name_alias_collision() to authenticated;

grant execute on function guard_band_name_alias_collision() to service_role;

grant execute on function guard_core_relation_publication() to service_role;

grant execute on function demote_invalid_core_relations_after_entity_change() to service_role;

grant execute on function open_media_provenance_is_valid(text,text,text,text,text,text,text,text,text) to public;

grant execute on function open_media_provenance_is_valid(text,text,text,text,text,text,text,text,text) to anon;

grant execute on function open_media_provenance_is_valid(text,text,text,text,text,text,text,text,text) to authenticated;

grant execute on function open_media_provenance_is_valid(text,text,text,text,text,text,text,text,text) to service_role;

grant execute on function guard_crew_event_record() to anon;

grant execute on function guard_crew_event_record() to authenticated;

grant execute on function guard_crew_event_record() to service_role;

grant execute on function guard_published_crew_event_entity() to anon;

grant execute on function guard_published_crew_event_entity() to authenticated;

grant execute on function guard_published_crew_event_entity() to service_role;

grant execute on function guard_crew_event_link() to anon;

grant execute on function guard_crew_event_link() to authenticated;

grant execute on function guard_crew_event_link() to service_role;

insert into storage.buckets(id,name,"public",file_size_limit,allowed_mime_types)
values ('hilo-media','hilo-media','t',10485760,'{image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml}'::text[])
on conflict(id) do update set name=excluded.name,"public"=excluded."public",file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
