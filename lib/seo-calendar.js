export function madridYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
  }).format(date))
}

export function agendaSeoCopy(year = madridYear()) {
  return {
    title: `Agenda cofrade de Sevilla y provincia ${year}`,
    description: 'Consulta los próximos actos cofrades de Sevilla y su provincia: procesiones, romerías, traslados, rosarios públicos, besamanos, besapiés y conciertos de bandas.',
  }
}

export function extraordinarySeoCopy(year = madridYear()) {
  return {
    title: `Extraordinarias Sevilla ${year}: calendario`,
    description: `Procesiones y salidas extraordinarias de Sevilla en ${year}: fechas, horarios, recorridos, acompañamientos musicales y motivos, en capital y provincia.`,
  }
}
