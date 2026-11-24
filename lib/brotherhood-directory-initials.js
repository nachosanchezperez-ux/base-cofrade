// Separado del color para no llevar lib/holy-week-programme.js al navegador.
// Iniciales para la tarjeta sin escudo: «Esperanza de Triana» → «ET».
export function directoryInitials(name = '') {
  const words = String(name).replace(/[«»"()]/g, ' ').split(/\s+/)
    .filter((word) => word && !/^(de|del|la|las|el|los|y|e|en|nuestra|nuestro|señora|señor|hermandad|cofradía|real|ilustre)$/i.test(word))
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || String(name).trim().slice(0, 1).toUpperCase()
}
