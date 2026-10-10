import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

const MIGRATIONS_DIRECTORY = new URL("../supabase/migrations/", import.meta.url);
const VERSION_PATTERN = /^(\d{14})_[a-z0-9_]+\.sql$/;
const EXECUTABLE_SCHEMA_MIGRATIONS = [
  "20260831070000_first_edition_baseline.sql",
  "20260831071000_secure_public_contributions_reconciled.sql",
  "20260831072000_add_band_logo_background_color.sql",
  "20260908083000_add_brotherhood_membership_stats.sql",
  "20260910181542_crucetas_musicales.sql",
  "20260910202000_reconcilia_seguridad_crucetas.sql",
  "20260915215828_add_brotherhood_habit_gloves.sql",
  "20260916062208_allow_concert_event_category.sql",
  "20260916062216_create_concert_event_bands.sql",
  "20260916062223_secure_concert_event_bands.sql",
  "20260916205306_source_links_public_lookup_indexes.sql",
  "20260916220756_add_source_links_source_id_index.sql",
  "20260921234430_add_entity_editorial_freshness.sql",
  "20260922044145_add_editorial_priority_view.sql",
  "20260922045453_fix_editorial_priority_content_date.sql",
  "20260925051118_home_knowledge_threads_cache.sql",
  "20260925051336_home_knowledge_threads_cache_private.sql",
  "20261002144739_music_accompaniment_public_band_snapshots.sql",
  "20261008064500_add_musical_repertoire_theme.sql",
  "20261009123758_concert_programs.sql",
  "20261009183652_add_fk_indexes_source_links_and_agenda_paths.sql",
  "20261009184302_add_outings_outing_subtype.sql",
  "20261009192755_outing_municipality_backup_20261009.sql",
  "20261010073542_outing_type_reapply_procesion_20261010.sql",
  "20261010100000_home_knowledge_threads_cache_every_15_minutes.sql",
  "20261010100100_normalize_outing_type_trigger.sql",
];

test("Supabase migration versions are unique and well formed", async () => {
  const files = (await readdir(MIGRATIONS_DIRECTORY))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  const versions = new Map();

  for (const file of files) {
    const match = VERSION_PATTERN.exec(file);
    assert.ok(match, `Invalid migration filename: ${file}`);

    const [, version] = match;
    const previous = versions.get(version);
    assert.equal(
      previous,
      undefined,
      `Duplicate migration version ${version}: ${previous} and ${file}`,
    );
    versions.set(version, file);
  }

  assert.deepEqual(
    files,
    EXECUTABLE_SCHEMA_MIGRATIONS,
    "The executable chain is schema-only; intentional DDL must update this reviewed list",
  );
});
