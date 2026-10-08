import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as directory from '../lib/brotherhood-directory.js'
import * as publicIndex from '../lib/brotherhood-public-index.js'
import * as localityCalendar from '../lib/brotherhood-locality-calendar.js'
import { buildBrotherhoodDirectoryNavigation } from '../lib/brotherhood-directory-navigation.js'

const require = createRequire(import.meta.url)
const { loadBindings, transform } = require('next/dist/build/swc')

// Exercise the real JSX components and React SSR, without a DOM or effects.
// Only CSS is replaced: this is a server-rendering test, NOT visual/browser QA.
// The existing Next compiler is used; no application/test dependency is added.
async function compileComponent(path, dependencies) {
  const file = new URL(`../${path}`, import.meta.url)
  const source = await readFile(file, 'utf8')
  await loadBindings()
  const { code } = await transform(source, {
    filename: fileURLToPath(file),
    jsc: {
      target: 'es2022',
      parser: { syntax: 'ecmascript', jsx: true },
      transform: { react: { runtime: 'automatic' } },
    },
    module: { type: 'commonjs' },
  })
  const module = { exports: {} }
  const resolve = (name) => {
    if (Object.hasOwn(dependencies, name)) return dependencies[name]
    if (name.endsWith('.module.css')) return {}
    if (['react', 'react/jsx-runtime', 'next/link'].includes(name)) return require(name)
    throw new Error(`Unexpected dependency in directory SSR test: ${name}`)
  }
  // The input is trusted repository source, never user input or downloaded code.
  new Function('module', 'exports', 'require', code)(module, module.exports, resolve)
  return module.exports
}

let components
function getComponents() {
  components ??= (async () => {
    const dependencies = {
      '@/lib/brotherhood-directory': directory,
      '@/lib/brotherhood-public-index': publicIndex,
      '@/lib/brotherhood-locality-calendar': localityCalendar,
      '@/components/BrotherhoodDirectoryCrestImage': function UnexpectedCrest() {
        throw new Error('SSR fixtures do not exercise images; verify crests in browser QA')
      },
    }
    const index = await compileComponent('components/BrotherhoodPublicIndex.js', dependencies)
    return compileComponent('components/HermandadesDirectoryV4.js', {
      ...dependencies,
      '@/components/BrotherhoodPublicIndex': index,
    })
  })()
  return components
}

export async function renderBrotherhoodDirectory(brotherhoods, indexable = brotherhoods) {
  const { default: Directory } = await getComponents()
  const navigation = {
    ...buildBrotherhoodDirectoryNavigation(indexable),
    indexableIds: indexable.map((item) => item.id),
    localities: publicIndex.brotherhoodDirectoryLocalities(indexable),
  }
  return renderToStaticMarkup(createElement(Directory, {
    hermandades: brotherhoods,
    navigation,
  }))
}
