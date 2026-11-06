// Controlador del «modo aplicación» de la ficha por capítulos. DOM puro, sin
// React, para poder probarlo aislado. Recibe el contenedor renderizado en el
// servidor ([data-chapters-root]) con sus capítulos ([data-chapter]).
//
// - Móvil (media query): un capítulo por pantalla; enlaces internos y la barra
//   cambian de pantalla; «atrás» vuelve a la anterior; cada pantalla recuerda
//   su posición; los apartados plegados se abren al enlazarlos.
// - Ordenador: página continua; solo abre plegados y desplaza.
// - Sin JavaScript nada de esto se ejecuta y la ficha es una página completa.

export const CHAPTER_APP_QUERY = '(max-width: 899px)'

function chapterOf(element) {
  return element?.closest?.('[data-chapter]') || null
}

function openAncestors(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    if (node.tagName === 'DETAILS') node.open = true
  }
}

function targetFromHash(doc, hash) {
  const id = decodeURIComponent(String(hash || '').replace(/^#/, ''))
  return id ? doc.getElementById(id) : null
}

export function createChapterApp(root, { onChange = () => {}, onMode = () => {}, win = window } = {}) {
  if (!root) return { destroy() {}, show() {} }
  const doc = root.ownerDocument
  const sections = () => [...root.querySelectorAll('[data-chapter]')]
  const first = () => sections()[0]
  const memory = {}
  let appMode = false

  const activate = (section) => {
    sections().forEach((node) => {
      if (node === section) node.setAttribute('data-active', '')
      else node.removeAttribute('data-active')
    })
  }

  function show(section, { target = null, push = false, restore = false } = {}) {
    if (!section) return
    if (appMode) {
      const previous = root.querySelector('[data-chapter][data-active]')
      if (previous && previous !== section) memory[previous.id] = win.scrollY
      activate(section)
    }
    onChange(section.id)
    if (push) win.history.pushState(null, '', `#${(target || section).id}`)

    const destination = target || section
    openAncestors(destination)
    if (appMode && !target && restore && memory[section.id] != null) {
      win.scrollTo({ top: memory[section.id], behavior: 'instant' })
    } else if (appMode && !target && section === first()) {
      win.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      destination.scrollIntoView({ block: 'start', behavior: appMode ? 'instant' : 'smooth' })
    }
    if (appMode && !target) section.querySelector('[data-chapter-title]')?.focus({ preventScroll: true })
  }

  const query = typeof win.matchMedia === 'function' ? win.matchMedia(CHAPTER_APP_QUERY) : null
  const initialRestoration = win.history.scrollRestoration
  function applyMode() {
    appMode = Boolean(query?.matches)
    root.dataset.app = appMode ? 'on' : 'off'
    // Cada pantalla guarda su propia posición; el navegador no debe pisarla.
    if ('scrollRestoration' in win.history) win.history.scrollRestoration = appMode ? 'manual' : initialRestoration
    onMode(appMode)
    if (!appMode) {
      sections().forEach((node) => node.removeAttribute('data-active'))
      return
    }
    const target = targetFromHash(doc, win.location.hash)
    const section = chapterOf(target) || first()
    activate(section)
    onChange(section?.id)
    if (target) {
      openAncestors(target)
      win.requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }))
    }
  }

  // Enlaces a esta misma ficha («#cultos» o «/hermandades/x#cultos»). Se
  // atienden en fase de captura para adelantarse al enrutador de Next.js.
  function samePageTarget(link) {
    const raw = link.getAttribute('href') || ''
    if (raw.startsWith('#')) return targetFromHash(doc, raw)
    if (link.target && link.target !== '_self') return null
    try {
      const url = new URL(raw, win.location.href)
      if (url.origin !== win.location.origin || url.pathname !== win.location.pathname || !url.hash) return null
      return targetFromHash(doc, url.hash)
    } catch {
      return null
    }
  }

  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target.closest?.('a[href]')
    if (!link || !root.closest('main')?.contains(link)) return
    const target = samePageTarget(link)
    const section = chapterOf(target)
    if (!target || !section) return
    event.preventDefault()
    const isChapter = target === section
    show(section, { target: isChapter ? null : target, push: true, restore: isChapter })
  }

  function onPop() {
    const target = targetFromHash(doc, win.location.hash)
    const section = chapterOf(target)
    if (section) show(section, { target: target === section ? null : target, restore: target === section })
    else show(first(), { restore: true })
  }

  applyMode()
  query?.addEventListener('change', applyMode)
  doc.addEventListener('click', onClick, true)
  win.addEventListener('popstate', onPop)

  return {
    show: (id, options) => show(doc.getElementById(id), options),
    destroy() {
      query?.removeEventListener('change', applyMode)
      doc.removeEventListener('click', onClick, true)
      if ('scrollRestoration' in win.history) win.history.scrollRestoration = initialRestoration
      win.removeEventListener('popstate', onPop)
      delete root.dataset.app
      sections().forEach((node) => node.removeAttribute('data-active'))
    },
  }
}
