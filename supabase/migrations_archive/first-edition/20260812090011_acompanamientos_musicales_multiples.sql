-- Hilo Cofrade · Acompañamientos musicales múltiples
-- Migración 011
--
-- Permite representar en una misma salida:
-- - una banda abriendo el cortejo
-- - otra detrás de un paso
-- - dos o más bandas alternándose en la misma posición
-- - acompañamientos por tramos solo cuando estén documentados
--
-- Principio editorial: los tramos son opcionales. No se exige precisión que
-- no esté documentada.

-- -----------------------------------------------------------------------------
-- BLOQUES DE POSICIÓN MUSICAL DENTRO DE UNA SALIDA
-- -----------------------------------------------------------------------------

create table public.outing_music_positions (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings(id) on delete cascade,
  step_entity_id uuid references public.entities(id) on delete set null,
  position_code text not null,
  position_label text,
  sequence_no integer not null default 1,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (outing_id, sequence_no)
);

create index outing_music_positions_outing_idx
  on public.outing_music_positions(outing_id, sequence_no);
create index outing_music_positions_step_idx
  on public.outing_music_positions(step_entity_id);

create trigger outing_music_positions_set_updated_at
before update on public.outing_music_positions
for each row execute function public.set_updated_at();

-- position_code admite valores editoriales como:
-- opening_cortege, cross_guide, before_step, behind_step, other.
-- position_label permite escribir una etiqueta más precisa cuando sea necesario.

-- -----------------------------------------------------------------------------
-- BANDAS DENTRO DE CADA POSICIÓN
-- -----------------------------------------------------------------------------

create table public.outing_music_assignments (
  id uuid primary key default gen_random_uuid(),
  music_position_id uuid not null references public.outing_music_positions(id) on delete cascade,
  band_entity_id uuid not null references public.entities(id) on delete restrict,
  participation_mode text not null default 'full_route' check (
    participation_mode in ('full_route','segment','alternating','unspecified')
  ),
  sequence_no integer not null default 1,
  segment_start_label text,
  segment_end_label text,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  unique (music_position_id, band_entity_id, sequence_no)
);

create index outing_music_assignments_position_idx
  on public.outing_music_assignments(music_position_id, sequence_no);
create index outing_music_assignments_band_idx
  on public.outing_music_assignments(band_entity_id);

-- participation_mode:
-- full_route  = acompaña toda la salida en esa posición
-- segment     = solo una parte del itinerario; inicio/fin opcionales pero normalmente conocidos
-- alternating = alterna con otra(s) banda(s) en la misma posición; los tramos pueden ser desconocidos
-- unspecified = sabemos que participa en esa posición, sin más precisión documentada

-- No hay restricción que obligue a rellenar segment_start_label/segment_end_label.
-- Esto permite documentar alternancia sin inventar puntos de relevo.

-- -----------------------------------------------------------------------------
-- COMPATIBILIDAD CON ACCOMPANIMENTS
-- -----------------------------------------------------------------------------

-- La tabla public.accompaniments se mantiene para no romper datos existentes.
-- Los nuevos registros deberían usar outing_music_positions + outing_music_assignments.
-- Más adelante podremos migrar acompañamientos antiguos de forma progresiva.

-- -----------------------------------------------------------------------------
-- FUENTES ESPECÍFICAS
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column if not exists outing_music_position_id uuid references public.outing_music_positions(id) on delete cascade,
  add column if not exists outing_music_assignment_id uuid references public.outing_music_assignments(id) on delete cascade;

alter table public.source_links
  drop constraint if exists source_links_one_target;

alter table public.source_links
  add constraint source_links_one_target check (
    num_nonnulls(
      entity_id,
      outing_id,
      cult_id,
      intervention_id,
      heritage_update_id,
      editorial_content_id,
      music_accompaniment_period_id,
      march_dedication_id,
      march_recording_id,
      image_authorship_id,
      brotherhood_image_id,
      entity_location_id,
      entity_relation_id,
      step_phase_id,
      step_personnel_period_id,
      brotherhood_step_id,
      image_step_id,
      agent_name_id,
      agent_role_id,
      cult_occurrence_id,
      outing_music_position_id,
      outing_music_assignment_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.outing_music_positions enable row level security;
alter table public.outing_music_assignments enable row level security;

create policy "Published outing music positions"
on public.outing_music_positions for select
using (status = 'published');

create policy "Published outing music assignments"
on public.outing_music_assignments for select
using (status = 'published');

-- -----------------------------------------------------------------------------
-- VISTA PRÁCTICA PARA FICHA PÚBLICA / ADMIN
-- -----------------------------------------------------------------------------

create or replace view public.outing_music_details as
select
  omp.id as music_position_id,
  omp.outing_id,
  omp.sequence_no as position_order,
  omp.position_code,
  omp.position_label,
  omp.step_entity_id,
  se.name as step_name,
  oma.id as music_assignment_id,
  oma.sequence_no as band_order,
  oma.band_entity_id,
  be.name as band_name,
  oma.participation_mode,
  oma.segment_start_label,
  oma.segment_end_label,
  oma.notes
from public.outing_music_positions omp
left join public.entities se on se.id = omp.step_entity_id
join public.outing_music_assignments oma on oma.music_position_id = omp.id
join public.entities be on be.id = oma.band_entity_id
where omp.status = 'published'
  and oma.status = 'published'
order by omp.outing_id, omp.sequence_no, oma.sequence_no;

-- Ejemplos válidos:
-- 1) Apertura del cortejo → Banda A → full_route
-- 2) Tras el paso → Banda B + Banda C → alternating, sin tramos
-- 3) Tras el paso → Banda B (Salida-Plaza) + Banda C (Plaza-Entrada) → segment
