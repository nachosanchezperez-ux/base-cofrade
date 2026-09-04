export function musicAccompanimentPeriodHasStarted(period = {}, referenceDate = new Date()) {
  const referenceDay = referenceDate.toISOString().slice(0, 10)
  const exactStart = String(period.date_from || '').trim()

  if (exactStart) return exactStart <= referenceDay

  const startYear = Number.parseInt(String(period.year_from || ''), 10)
  if (!Number.isFinite(startYear)) return true

  return startYear <= referenceDate.getUTCFullYear()
}

export function futureMusicAccompanimentPeriodIds(periods = [], referenceDate = new Date()) {
  return new Set(
    periods
      .filter((period) => !musicAccompanimentPeriodHasStarted(period, referenceDate))
      .map((period) => period.id)
      .filter(Boolean)
  )
}
