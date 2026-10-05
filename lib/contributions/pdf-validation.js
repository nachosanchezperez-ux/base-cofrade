import { createRequire } from 'node:module'
import { Worker } from 'node:worker_threads'
// Static import ensures standalone/deployment tracing includes the parser.
import 'pdf-lib'
import { ContributionValidationError } from './validation.js'

const nativeRequire = createRequire(import.meta.url)
// Keep native path resolution opaque to the bundler. A bundled numeric module
// ID is not a filesystem path and cannot be required inside a native worker.
const PDF_PACKAGE = ['pdf', 'lib'].join('-')
const PDF_ERROR = 'El PDF no tiene una estructura válida o incluye contenido activo, formularios, archivos incrustados o cifrado no admitido.'

// Runs in a memory-limited worker. Do not add closures or execute PDF content.
async function inspectPdf(pdf, bytes) {
  const { PDFDocument, PDFDict, PDFArray, PDFName, PDFStream, PDFRef, PDFInvalidObject } = pdf
  const blocked = new Set(['javascript', 'js', 'aa', 'openaction', 'launch', 'embeddedfile',
    'embeddedfiles', 'richmedia', 'xfa', 'acroform', 'encrypt', 'submitform', 'importdata',
    'gotor', 'gotoe', 'rendition', 'movie', 'sound'])
  const doc = await PDFDocument.load(bytes, {
    ignoreEncryption: false, throwOnInvalidObject: true, updateMetadata: false, parseSpeed: 100,
  })
  if (doc.isEncrypted) throw new Error('Encrypted')
  const objects = doc.context.enumerateIndirectObjects()
  if (objects.length > 25_000) throw new Error('Too many objects')
  const seen = new Set()
  let nodes = 0
  function visit(object, depth = 0) {
    if (depth > 64 || ++nodes > 100_000) throw new Error('Complexity limit')
    if (object instanceof PDFName) {
      if (blocked.has(object.decodeText().toLowerCase())) throw new Error('Active feature')
      return
    }
    if (object instanceof PDFInvalidObject) throw new Error('Invalid object')
    if (object instanceof PDFRef) {
      const resolved = doc.context.lookup(object)
      if (!resolved) throw new Error('Unresolved reference')
      return visit(resolved, depth + 1)
    }
    if (!object || seen.has(object)) return
    seen.add(object)
    if (object instanceof PDFStream) visit(object.dict, depth + 1)
    else if (object instanceof PDFDict) {
      for (const [key, value] of object.entries()) {
        visit(key, depth + 1)
        visit(value, depth + 1)
      }
    } else if (object instanceof PDFArray) {
      for (let i = 0; i < object.size(); i += 1) visit(object.get(i), depth + 1)
    }
  }
  for (const [, object] of objects) visit(object)
  visit(doc.context.trailerInfo.Encrypt)
  // Graph inspection precedes page-tree traversal, with cycle/size bounds.
  const pages = doc.getPages()
  if (!pages.length || pages.length > 1000) throw new Error('Page limit')
  for (const page of pages) {
    const { width, height } = page.getSize()
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) throw new Error('Invalid page')
  }
  return true
}

export async function validatePdfStructure(buffer) {
  const header = buffer.subarray(0, 16).toString('latin1')
  const tail = buffer.subarray(Math.max(0, buffer.length - 4096)).toString('latin1')
  const trailer = /startxref\s+(\d+)\s+%%EOF[\x00\x09\x0a\x0c\x0d\x20]*$/.exec(tail)
  const offset = trailer ? Number(trailer[1]) : -1
  if (!/^%PDF-(?:1\.[0-7]|2\.0)(?:\r\n|\r|\n)/.test(header) || !Number.isSafeInteger(offset)
    || offset < 1 || offset >= buffer.length
    || !/^(?:xref\b|\d+\s+\d+\s+obj\b)/.test(buffer.subarray(offset, offset + 64).toString('latin1'))) {
    throw new ContributionValidationError('Un PDF no contiene una estructura reconocible y válida.')
  }

  // Fixed trusted code only. File bytes are data; not interpolated into code.
  const code = `const { parentPort, workerData } = require('node:worker_threads');
    (${inspectPdf.toString()})(require(workerData.modulePath), new Uint8Array(workerData.bytes))
      .then(() => parentPort.postMessage(true), () => parentPort.postMessage(false));`
  try {
    const valid = await new Promise((resolve) => {
      const worker = new Worker(code, {
        eval: true,
        workerData: { modulePath: Reflect.get(nativeRequire, 'resolve')(PDF_PACKAGE), bytes: new Uint8Array(buffer) },
        resourceLimits: { maxOldGenerationSizeMb: 96, maxYoungGenerationSizeMb: 16, stackSizeMb: 2 },
      })
      let settled = false
      function finish(result) {
        if (settled) return
        settled = true
        clearTimeout(timer)
        void worker.terminate()
        resolve(result)
      }
      const timer = setTimeout(() => finish(false), 6000)
      worker.once('message', (result) => finish(result === true))
      worker.once('error', () => finish(false))
      worker.once('exit', () => finish(false))
    })
    if (!valid) throw new ContributionValidationError(PDF_ERROR)
  } catch (error) {
    if (error instanceof ContributionValidationError) throw error
    throw new ContributionValidationError(PDF_ERROR)
  }
}
