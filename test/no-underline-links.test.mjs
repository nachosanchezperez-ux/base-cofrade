import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

// Criterio del propietario: en la web pública los enlaces no se subrayan, ni en
// reposo ni al pasar el ratón. El foco del teclado se marca con contorno.
const root = new URL('..', import.meta.url).pathname

function cssFiles(dir) {
  const found = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      if (!path.includes('/panel')) found.push(...cssFiles(path))
    } else if (path.endsWith('.css')) {
      found.push(path)
    }
  }
  return found
}

test('ninguna hoja de estilo pública subraya enlaces', () => {
  const offenders = []
  for (const dir of ['app', 'components']) {
    for (const file of cssFiles(join(root, dir))) {
      const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
      if (/text-decoration(-line)?\s*:\s*[^;}]*underline/i.test(css)) offenders.push(file.replace(root, ''))
    }
  }
  assert.deepEqual(offenders, [])
})

test('la regla base de los enlaces sigue sin subrayado', () => {
  const globals = readFileSync(join(root, 'app/globals.css'), 'utf8')
  assert.match(globals, /a \{ color: inherit; text-decoration: none; \}/)
})
