import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const inlineMedia = read('components/panel/BrotherhoodInlineMedia.js')
const inlineStyles = read('components/panel/BrotherhoodInlineMedia.module.css')
const uploadForm = read('app/panel/(protected)/hermandades/[id]/multimedia/QuickMediaUploadForm.js')
const uploadActions = read('app/panel/(protected)/hermandades/[id]/multimedia/actions.js')
const cults = read('app/panel/(protected)/hermandades/[id]/cultos/page.js')
const heritage = read('app/panel/(protected)/hermandades/[id]/patrimonio/page.js')
const steps = read('components/panel/BrotherhoodStepsEditor.js')
const images = read('components/panel/BrotherhoodImagesEditor.js')

test('el Panel permite cargar la fotografía sin abandonar el elemento que se está editando', () => {
  assert.match(inlineMedia, /Fotografía principal/)
  assert.match(inlineMedia, /sin salir de esta sección/)
  assert.match(inlineMedia, /Añadir \/ cambiar/)
  assert.match(inlineMedia, /QuickMediaUploadForm/)
  assert.match(inlineStyles, /min-height: 64px/)
  assert.match(inlineStyles, /@media \(max-width: 620px\)/)
})

test('Titulares, Pasos, Cultos y Patrimonio reutilizan el mismo bloque multimedia', () => {
  assert.match(images, /BrotherhoodInlineMedia/)
  assert.match(images, /returnSection="titulares"/)
  assert.match(steps, /BrotherhoodInlineMedia/)
  assert.match(steps, /returnSection="pasos"/)
  assert.match(cults, /BrotherhoodInlineMedia/)
  assert.match(cults, /targetKind="cult"/)
  assert.match(cults, /returnSection="cultos"/)
  assert.match(heritage, /BrotherhoodInlineMedia/)
  assert.match(heritage, /returnSection="patrimonio"/)
})

test('la subida firmada conserva la seguridad y vuelve solo a secciones permitidas', () => {
  assert.match(uploadForm, /name="return_section"/)
  assert.match(uploadForm, /returnSection = 'multimedia'/)
  assert.match(uploadForm, /uploadToSignedUrl/)
  assert.match(uploadActions, /RETURN_SECTIONS = new Set/)
  assert.match(uploadActions, /'multimedia', 'cultos', 'pasos', 'titulares', 'patrimonio'/)
  assert.match(uploadActions, /La sección de retorno de la imagen no es válida/)
  assert.match(uploadActions, /return_section: context\.returnSection/)
  assert.match(uploadActions, /media-\$\{context\.targetId\}/)
  assert.match(uploadActions, /redirect\(destination\)/)
})
