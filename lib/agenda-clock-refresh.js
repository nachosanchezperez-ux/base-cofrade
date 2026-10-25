// Recalcula el servidor cada minuto visible, también tras volver a la pestaña.
// No recarga el documento ni añade entradas al historial.
export function subscribeAgendaClock(refresh, browser, document) {
  const update = () => { if (document.visibilityState === 'visible') refresh() }
  const timer = browser.setInterval(update, 60_000)
  document.addEventListener('visibilitychange', update)
  browser.addEventListener('pageshow', update)
  return () => {
    browser.clearInterval(timer)
    document.removeEventListener('visibilitychange', update)
    browser.removeEventListener('pageshow', update)
  }
}
