import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { PDFDocument } from 'pdf-lib'

// Exercise the actual minified PDF module without starting a server or enabling
// contributions. This narrow harness supports only its synchronous dependencies.
const require = createRequire(import.meta.url)
const directory = resolve('.next/server/chunks/ssr')
const factories = new Map()
let target
for (const filename of await readdir(directory)) {
  if (!filename.endsWith('.js')) continue
  const path = resolve(directory, filename)
  if (!(await readFile(path, 'utf8')).startsWith('module.exports=[')) continue
  const entries = require(path)
  for (let index = 0; index < entries.length; index += 1) {
    if (typeof entries[index] === 'number' && typeof entries[index + 1] === 'function') {
      factories.set(entries[index], entries[++index])
    }
  }
}
target = [...factories].find(([, factory]) => factory.toString().includes('"validatePdfStructure"'))?.[0]
assert.notEqual(target, undefined, 'Compiled PDF module must exist')
const modules = new Map()
function load(id) {
  if (modules.has(id)) return modules.get(id)
  const factory = factories.get(id)
  assert.ok(factory, `Missing compiled dependency ${id}`)
  const exports = {}
  modules.set(id, exports)
  const module = { exports }
  factory({
    i: load,
    F: (path) => pathToFileURL(resolve(path)).href,
    x: (name) => require(name.startsWith('pdf-lib-') ? 'pdf-lib' : name),
    s: (entries) => {
      for (let index = 0; index < entries.length; index += 3) {
        assert.equal(entries[index + 1], 0, 'Unsupported build export contract')
        exports[entries[index]] = entries[index + 2]
      }
    },
  }, module, exports)
  modules.set(id, module.exports)
  return module.exports
}
const { validatePdfStructure } = load(target)
const valid = await PDFDocument.create()
valid.addPage()
await validatePdfStructure(Buffer.from(await valid.save()))
const active = await PDFDocument.create()
active.addPage()
active.addJavaScript('test', 'app.alert("test")')
const activeBytes = Buffer.from(await active.save())
await assert.rejects(() => validatePdfStructure(activeBytes), /contenido activo/i)
const trace = JSON.parse(await readFile('.next/server/app/colabora/page.js.nft.json', 'utf8'))
assert.ok(trace.files.some((path) => path.includes('pdf-lib/')), 'Deployment trace must include pdf-lib')
console.log('Compiled PDF worker: valid PDF accepted, active PDF rejected, parser traced — PASS')
