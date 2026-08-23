from pathlib import Path
import re

SOURCE_SUFFIXES = {'.js', '.jsx', '.ts', '.tsx'}


def source_files():
    for root in (Path('app'), Path('components')):
        for path in root.rglob('*'):
            if path.is_file() and path.suffix in SOURCE_SUFFIXES:
                yield path


# El layout raíz es el único propietario del landmark <main>.
main_repairs = []
for path in source_files():
    if path == Path('app/layout.js'):
        continue

    text = path.read_text(encoding='utf-8')
    opening = len(re.findall(r'<main(?=[\s>])', text))
    closing = text.count('</main>')
    if not opening and not closing:
        continue
    if opening != closing:
        raise RuntimeError(
            f'{path}: apertura/cierre de main desequilibrados ({opening}/{closing})'
        )

    text = re.sub(r'<main(?=[\s>])', '<div', text)
    text = text.replace('</main>', '</div>')
    path.write_text(text, encoding='utf-8')
    main_repairs.append(str(path))

if not main_repairs:
    raise RuntimeError('No se encontró ningún landmark main anidado que reparar')


# Unifica el contrato de ancla del componente OfficialLinks.
anchor_repairs = []
for path in source_files():
    text = path.read_text(encoding='utf-8')
    if '#enlaces-oficiales' not in text:
        continue

    path.write_text(
        text.replace('#enlaces-oficiales', '#enlaces-de-interes'),
        encoding='utf-8',
    )
    anchor_repairs.append(str(path))

if not anchor_repairs:
    raise RuntimeError('No se encontró la ancla heredada #enlaces-oficiales')


# Conserva únicamente el acompañamiento relacional moderno.
brotherhood_path = Path('app/hermandades/[slug]/page.js')
brotherhood = brotherhood_path.read_text(encoding='utf-8')
legacy_copy = """  const tiposHermandad = h.tipos || [];
  const esHermandadDePenitencia = tiposHermandad.includes('Penitencia');
  const acompanamientoMusicalCopy = esHermandadDePenitencia
    ? {
      eyebrow: 'Semana Santa',
      description: 'La configuración musical de la cofradía se organiza por Cruz de Guía, Paso de Misterio y Paso de Palio.',
    }
    : {
      eyebrow: 'Música procesional',
      description: 'El acompañamiento musical actual se documenta según las salidas y los actos de culto propios de la Hermandad.',
    };
"""
if legacy_copy not in brotherhood:
    raise RuntimeError('No se encontró el bloque de copy musical heredado')

brotherhood = brotherhood.replace(
    legacy_copy,
    "  const tiposHermandad = h.tipos || [];\n",
    1,
)

legacy_start = (
    '\n      {h.acompanamientoActual?.length > 0 && '
    '<section className="section brotherhood-soft" id="acompanamiento-musical">'
)
next_section = '\n\n      {musicalHeritage.length > 0 ? ('
start_index = brotherhood.find(legacy_start)
end_index = brotherhood.find(next_section, start_index + 1)
if start_index < 0 or end_index < 0:
    raise RuntimeError('No se pudo delimitar la sección musical duplicada')

brotherhood = brotherhood[:start_index] + brotherhood[end_index:]
if 'acompanamientoMusicalCopy' in brotherhood or 'h.acompanamientoActual.map' in brotherhood:
    raise RuntimeError('Persisten restos de la sección musical heredada')

brotherhood_path.write_text(brotherhood, encoding='utf-8')


# Las fuentes sin URL son información documental, no enlaces falsos.
Path('components/SourcesBlock.js').write_text(
    """export default function SourcesBlock({
  sources = [],
  id = 'fuentes'
}) {
  if (!sources?.length) return null;

  return (
    <section className="section sources-section" id={id} data-hilo-section="sources">
      <div className="shell">
        <div className="sources-heading">
          <div>
            <span className="eyebrow">Documentación</span>
            <h2>Fuentes</h2>
          </div>
        </div>

        <div className="sources-list">
          {sources.map((fuente) => {
            const isExternal = Boolean(fuente.url);
            const Row = isExternal ? 'a' : 'div';
            const rowProps = isExternal
              ? {
                  href: fuente.url,
                  target: '_blank',
                  rel: 'noreferrer',
                  'data-hilo-event': 'source_open',
                  'data-hilo-scope': 'external',
                }
              : {
                  'data-hilo-scope': 'internal',
                  'data-source-static': 'true',
                };

            return (
              <Row
                className={`source-row${isExternal ? '' : ' source-row-static'}`}
                key={fuente.id}
                data-hilo-section="sources"
                {...rowProps}
              >
                <span className="source-capirote" aria-hidden="true" />
                <div className="source-copy">
                  <strong>{fuente.nombre}</strong>
                </div>
              </Row>
            );
          })}
        </div>
      </div>
    </section>
  );
}
""",
    encoding='utf-8',
)


globals_path = Path('app/globals.css')
globals_css = globals_path.read_text(encoding='utf-8')
static_rule = """

/* Las aportaciones documentales sin URL no simulan ser enlaces. */
.source-row-static{cursor:default}
.source-row-static:hover .source-copy strong{text-decoration:none}
"""
if '.source-row-static{cursor:default}' not in globals_css:
    globals_path.write_text(globals_css.rstrip() + static_rule + '\n', encoding='utf-8')


# Barrera transversal para no reabrir estas cuatro regresiones.
Path('test/public-semantic-smoke-boundary.test.mjs').write_text(
    """import assert from 'node:assert/strict'
import test from 'node:test'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx'])

async function source(path) {
  return readFile(join(ROOT, path), 'utf8')
}

async function walk(directory) {
  const absolute = join(ROOT, directory)
  const entries = await readdir(absolute, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(absolute, entry.name)
    if (entry.isDirectory()) files.push(...await walk(relative(ROOT, path)))
    else if (SOURCE_EXTENSIONS.has(extname(entry.name))) files.push(relative(ROOT, path))
  }

  return files
}

test('el layout raíz conserva el único landmark main de la aplicación', async () => {
  const layout = await source('app/layout.js')
  assert.equal((layout.match(/<main(?=[\\s>])/g) || []).length, 1)
  assert.equal((layout.match(/<\\/main>/g) || []).length, 1)

  const files = [...await walk('app'), ...await walk('components')]
    .filter((path) => path !== 'app/layout.js')
  const offenders = []

  for (const path of files) {
    const code = await source(path)
    if (/<main(?=[\\s>])|<\\/main>/.test(code)) offenders.push(path)
  }

  assert.deepEqual(offenders, [])
})

test('la ficha de Hermandad publica un solo acompañamiento musical', async () => {
  const page = await source('app/hermandades/[slug]/page.js')
  const relational = await source('components/BrotherhoodRelationalExtras.js')

  assert.doesNotMatch(page, /acompanamientoMusicalCopy/)
  assert.doesNotMatch(page, /h\\.acompanamientoActual\\.map/)
  assert.equal((page.match(/id="acompanamiento-musical"/g) || []).length, 0)
  assert.equal((relational.match(/id="acompanamiento-musical"/g) || []).length, 1)
  assert.match(page, /href:\\s*'#acompanamiento-musical'/)
})

test('Web y redes usa la misma ancla que OfficialLinks', async () => {
  const officialLinks = await source('components/OfficialLinks.js')
  const brotherhood = await source('app/hermandades/[slug]/page.js')
  const files = [...await walk('app'), ...await walk('components')]
  const legacyAnchors = []

  assert.match(officialLinks, /id="enlaces-de-interes"/)
  assert.match(brotherhood, /href:\\s*'#enlaces-de-interes'/)

  for (const path of files) {
    const code = await source(path)
    if (code.includes('#enlaces-oficiales')) legacyAnchors.push(path)
  }

  assert.deepEqual(legacyAnchors, [])
})

test('las fuentes sin URL se renderizan como filas no interactivas', async () => {
  const block = await source('components/SourcesBlock.js')
  const css = await source('app/globals.css')

  assert.match(block, /const isExternal = Boolean\\(fuente\\.url\\)/)
  assert.match(block, /const Row = isExternal \\? 'a' : 'div'/)
  assert.match(block, /data-source-static/)
  assert.match(block, /data-hilo-scope': 'internal'/)
  assert.match(css, /\\.source-row-static\\{cursor:default\\}/)
})
""",
    encoding='utf-8',
)


print('Landmarks reparados:')
for path in main_repairs:
    print(f'  - {path}')

print('Anclas reparadas:')
for path in anchor_repairs:
    print(f'  - {path}')
