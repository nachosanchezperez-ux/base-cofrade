import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const migration = read('supabase/migrations/20260830232314_close_public_contribution_endpoint.sql')
const secureMigration = read('supabase/migrations/20260830235652_secure_public_contributions_reconciled.sql')
const publicPage = read('app/colabora/page.js')
const publicForm = read('app/colabora/ContributionForm.js')
const publicAction = read('app/colabora/actions.js')

test('el canal heredado de aportaciones no conserva acceso directo público', () => {
  assert.match(migration, /drop policy if exists "Anyone can submit contributions"/i)
  assert.match(
    migration,
    /revoke all privileges on table public\.contributions\s+from public, anon, authenticated;/i,
  )
  assert.match(migration, /grant all privileges on table public\.contributions\s+to service_role;/i)
  assert.match(migration, /has_table_privilege\('anon',[\s\S]*'insert'\)/i)
  assert.match(migration, /has_table_privilege\('authenticated',[\s\S]*'insert'\)/i)
})

test('la apertura conserva anon sin acceso y escribe solo mediante el servidor', () => {
  assert.match(secureMigration, /revoke all privileges on table public\.contributions\s+from public, anon, authenticated/i)
  assert.match(secureMigration, /grant all privileges on table public\.contributions to service_role/i)
  assert.match(secureMigration, /grant select, update on table public\.contributions to authenticated/i)
  assert.doesNotMatch(secureMigration, /grant insert[^;]*contributions[^;]*authenticated/i)
  assert.match(secureMigration, /consume_contribution_rate_limit/i)
  assert.match(secureMigration, /public = false/i)
  assert.match(secureMigration, /hilo-contributions-quarantine/i)
})

test('/colabora no publica el formulario hasta completar su configuración', () => {
  assert.match(publicPage, /contributionReadiness/)
  assert.match(publicPage, /if \(!readiness\.enabled\) return <ClosedContributionsPage \/>/)
  assert.match(publicPage, /No estamos recogiendo información ni datos personales/)
  assert.match(publicPage, /enabled=\{readiness\.enabled\}/)
  assert.match(publicForm, /name="contribution_type"/)
  assert.match(publicForm, /name="privacy_consent"/)
  assert.match(publicForm, /cf-turnstile/)
  assert.match(publicForm, /disabled=\{!enabled \|\| pending\}/)
  assert.doesNotMatch(publicForm, /createBrowserClient|SUPABASE_SERVICE_ROLE|SUPABASE_SECRET/)
})

test('la acción valida seguridad antes de insertar y nunca publica automáticamente', () => {
  assert.ok(
    publicAction.indexOf('if (!contributionReadiness().enabled)')
      < publicAction.indexOf('if (hasHoneypotValue(formData))'),
    'el cierre por flag debe evaluarse antes incluso que el honeypot',
  )
  for (const guard of [
    'hasTrustedContributionOrigin',
    'verifyContributionFormTicket',
    'consume_contribution_rate_limit',
    'verifyTurnstile',
    'validateContributionPhoto',
  ]) {
    assert.match(publicAction, new RegExp(guard))
  }
  assert.match(publicAction, /status: 'pending'/)
  assert.doesNotMatch(publicAction, /from\(['"]entities['"]\)\.insert|status: ['"]published['"]/)
})
