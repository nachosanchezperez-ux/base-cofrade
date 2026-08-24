'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from './MediaRightsGovernance.module.css'

const OPEN_RIGHTS = new Set(['licensed', 'public_domain'])
const LICENSES_BY_STATUS = {
  licensed: new Set([
    'CC BY 1.0',
    'CC BY 2.0',
    'CC BY 2.5',
    'CC BY 3.0',
    'CC BY 4.0',
    'CC BY-SA 1.0',
    'CC BY-SA 2.0',
    'CC BY-SA 2.5',
    'CC BY-SA 3.0',
    'CC BY-SA 4.0',
  ]),
  public_domain: new Set([
    'CC0 1.0',
    'Public Domain Mark 1.0',
    'PDM 1.0',
    'Public domain',
    'Dominio público',
  ]),
}
const REQUIRED_OPEN_FIELDS = [
  ['alt_text', 'Añade un texto alternativo que describa la imagen.'],
  ['author_name', 'Indica el autor o fotógrafo del recurso.'],
  ['rights_holder', 'Indica el titular de los derechos.'],
  ['license', 'Indica la licencia exacta y su versión.'],
  ['source_name', 'Identifica la Fuente documental.'],
  ['source_url', 'Enlaza la página original de procedencia.'],
  ['permission_notes', 'Explica la base de reutilización o el permiso.'],
]

function formField(form, name) {
  return form.elements.namedItem(name)
}

function fieldValue(form, name) {
  const field = formField(form, name)
  return field && 'value' in field ? String(field.value || '').trim() : ''
}

function clearFormValidity(form) {
  for (const [name] of REQUIRED_OPEN_FIELDS) {
    const field = formField(form, name)
    if (field && 'setCustomValidity' in field) field.setCustomValidity('')
  }
}

function isSearchResult(url) {
  const host = url.hostname.toLowerCase()
  return (
    (host.startsWith('google.') && url.pathname.startsWith('/search'))
    || (host === 'www.google.com' && url.pathname.startsWith('/search'))
    || ((host === 'bing.com' || host === 'www.bing.com') && url.pathname.startsWith('/search'))
    || (host === 'search.yahoo.com')
  )
}

function validateOpenMediaForm(form) {
  clearFormValidity(form)
  const rightsStatus = fieldValue(form, 'rights_status')
  if (!OPEN_RIGHTS.has(rightsStatus)) return null

  for (const [name, message] of REQUIRED_OPEN_FIELDS) {
    const field = formField(form, name)
    if (!field || !('setCustomValidity' in field)) continue
    if (!fieldValue(form, name)) {
      field.setCustomValidity(message)
      return field
    }
  }

  const licenseField = formField(form, 'license')
  const license = fieldValue(form, 'license')
  if (!LICENSES_BY_STATUS[rightsStatus]?.has(license)) {
    licenseField?.setCustomValidity(
      rightsStatus === 'licensed'
        ? 'Usa una licencia CC BY o CC BY-SA admitida e indica su versión exacta.'
        : 'Usa CC0 1.0, Public Domain Mark 1.0 o una declaración expresa de dominio público.'
    )
    return licenseField
  }

  const sourceField = formField(form, 'source_url')
  try {
    const sourceUrl = new URL(fieldValue(form, 'source_url'))
    if (sourceUrl.protocol !== 'https:' || isSearchResult(sourceUrl)) {
      sourceField?.setCustomValidity('La Fuente debe ser una página original HTTPS, no un resultado de búsqueda.')
      return sourceField
    }
  } catch {
    sourceField?.setCustomValidity('Introduce una URL HTTPS válida para la página original del recurso.')
    return sourceField
  }

  return null
}

export default function MediaRightsGovernance({ canEdit }) {
  const pathname = usePathname()
  const active = canEdit && pathname === '/panel/multimedia'

  useEffect(() => {
    if (!active) return undefined

    const licenseListId = 'open-media-license-options'
    for (const licenseField of document.querySelectorAll('input[name="license"]')) {
      licenseField.setAttribute('list', licenseListId)
      licenseField.setAttribute('autocomplete', 'off')
    }

    function clearCurrentField(event) {
      const field = event.target
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return
      if (field.name === 'rights_status' && field.form) clearFormValidity(field.form)
      field.setCustomValidity('')
    }

    function protectOpenMedia(event) {
      const form = event.target
      if (!(form instanceof HTMLFormElement) || !form.elements.namedItem('rights_status')) return
      const firstInvalidField = validateOpenMediaForm(form)
      if (!firstInvalidField) return

      event.preventDefault()
      event.stopPropagation()
      firstInvalidField.focus()
      firstInvalidField.reportValidity()
    }

    document.addEventListener('input', clearCurrentField, true)
    document.addEventListener('change', clearCurrentField, true)
    document.addEventListener('submit', protectOpenMedia, true)
    return () => {
      document.removeEventListener('input', clearCurrentField, true)
      document.removeEventListener('change', clearCurrentField, true)
      document.removeEventListener('submit', protectOpenMedia, true)
    }
  }, [active])

  if (!active) return null

  return (
    <aside className={styles.notice} aria-labelledby="media-rights-governance-title">
      <span className={styles.eyebrow}>Protocolo editorial</span>
      <strong id="media-rights-governance-title">Media abierta con procedencia verificable</strong>
      <p>
        «Con licencia» y «Dominio público» exigen autoría, titular, licencia exacta,
        Fuente original HTTPS, texto alternativo y nota de reutilización. En Wikimedia,
        enlaza la ficha <code>File:</code> o <code>Archivo:</code>, no solo la imagen directa.
      </p>
      <datalist id="open-media-license-options">
        {[...LICENSES_BY_STATUS.licensed, ...LICENSES_BY_STATUS.public_domain].map((license) => (
          <option value={license} key={license} />
        ))}
      </datalist>
    </aside>
  )
}
