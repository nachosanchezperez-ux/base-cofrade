import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

const MIGRATIONS_DIRECTORY = new URL("../supabase/migrations/", import.meta.url);
const VERSION_PATTERN = /^(\d{14})_[a-z0-9_]+\.sql$/;

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

  assert.ok(files.length > 0, "No Supabase migrations found");
  assert.deepEqual(files.slice(0, 2), [
    "20260831070000_first_edition_baseline.sql",
    "20260831071000_secure_public_contributions_reconciled.sql",
  ]);
  assert.ok(
    files.slice(2).every((file) => file > "20260831071000_secure_public_contributions_reconciled.sql"),
    "Every post-baseline migration must follow the reconciled security migration",
  );
});
