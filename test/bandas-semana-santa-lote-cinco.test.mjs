import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations_archive/post-first-edition-editorial/20260908163610_incorpora_cinco_bandas_semana_santa_sevilla.sql",
  import.meta.url,
);

const sql = await readFile(migrationUrl, "utf8");

test("incorpora las cinco bandas solicitadas con perfiles publicados", () => {
  for (const slug of [
    "agrupacion-musical-la-sentencia-jerez",
    "agrupacion-musical-nazareno-la-algaba",
    "banda-musica-alcala-guadaira",
    "banda-musica-carmen-villalba-alcor",
    "banda-municipal-fernando-guerrero-los-palacios",
  ]) {
    assert.match(sql, new RegExp(`'${slug}'`));
  }

  assert.match(sql, /insert into public\.bands/i);
  assert.match(sql, /entity\.status = 'published'/i);
  assert.match(sql, /insert into public\.band_names/i);
});

test("documenta los seis acompañamientos sevillanos vigentes", () => {
  for (const relation of [
    ["torreblanca-jesus-cautivo", "Sábado de Pasión", "2019", "Desde 2019"],
    ["san-jeronimo-sevilla", "Sábado de Pasión", "null", "Vigente en 2026"],
    ["hermandad-de-los-estudiantes-sevilla", "Martes Santo", "null", "Vigente en 2026"],
    ["siete-palabras-sevilla", "Miércoles Santo", "2016", "Desde 2016"],
    ["quinta-angustia-sevilla", "Jueves Santo", "2022", "Desde 2022"],
    ["hermandad-del-sol", "Sábado Santo", "2025", "Desde 2025"],
  ]) {
    const [brotherhood, outing, year, dateText] = relation;
    assert.ok(
      sql.includes(`'${brotherhood}'`) &&
        sql.includes(`'${outing}'`) &&
        sql.includes(`, ${year}, '${dateText}'`),
      `Falta la relación ${brotherhood} / ${outing} / ${dateText}`,
    );
  }

  assert.match(sql, /if period_count <> 6/i);
});

test("mantiene Los Estudiantes como nodo relacional en borrador", () => {
  assert.match(
    sql,
    /'hermandad-de-los-estudiantes-sevilla'[\s\S]*?'Hermandad de los Estudiantes'[\s\S]*?'draft'/i,
  );
  assert.doesNotMatch(sql, /insert into public\.brotherhoods/i);
  assert.match(sql, /Los Estudiantes debe permanecer como nodo relacional en borrador/i);
});

test("enlaza fuentes por periodo y una comprobación transversal de 2026", () => {
  assert.match(sql, /musicofrades\.com\/acompanamientos-musicales-de-la-semana-santa-de-sevilla-2026/i);
  assert.match(sql, /music_accompaniment_period_id/i);
  assert.match(sql, /Evidencia del acompañamiento/i);
  assert.match(sql, /Comprobación transversal de 2026/i);
  assert.match(sql, /if sourced_period_count <> 6/i);
});

test("respeta la congelación de esquema de la primera edición", () => {
  assert.doesNotMatch(sql, /\b(create|alter|drop)\s+(table|type|policy|index|schema)\b/i);
  assert.doesNotMatch(sql, /\btruncate\b/i);
});
