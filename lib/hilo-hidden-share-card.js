// Dibuja una tarjeta vertical (1080 × 1920) para Historias.
// No utiliza imágenes externas, logos de terceros ni revela las respuestas.
export const HILO_STORY_WIDTH = 1080
export const HILO_STORY_HEIGHT = 1920

function rounded(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawCenter(ctx, text, y, font, color) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.fillText(text, HILO_STORY_WIDTH / 2, y)
}

function drawThread(ctx) {
  ctx.strokeStyle = 'rgba(245,224,191,.21)'
  ctx.lineWidth = 2
  for (let i = 0; i < 4; i++) {
    const inset = 85 + (i * 38)
    ctx.beginPath()
    ctx.moveTo(-35, 380 + (i * 60))
    ctx.bezierCurveTo(280 + inset, 350 - (i * 15), 730 - inset, 660 + (i * 33), 1125, 415 + (i * 31))
    ctx.stroke()
  }
}

export function createHiddenStoryFile(result, filename) {
  if (!result || typeof document === 'undefined') throw new Error('No hay una partida para compartir')
  const canvas = document.createElement('canvas')
  canvas.width = HILO_STORY_WIDTH
  canvas.height = HILO_STORY_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Este navegador no puede dibujar la tarjeta')

  const background = ctx.createLinearGradient(0, 0, HILO_STORY_WIDTH, HILO_STORY_HEIGHT)
  background.addColorStop(0, '#172a40')
  background.addColorStop(.52, '#532339')
  background.addColorStop(1, '#251929')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, HILO_STORY_WIDTH, HILO_STORY_HEIGHT)

  drawThread(ctx)
  ctx.strokeStyle = 'rgba(247,224,193,.30)'
  ctx.lineWidth = 3
  rounded(ctx, 55, 55, 970, 1810, 38)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(247,224,193,.12)'
  rounded(ctx, 76, 76, 928, 1768, 29)
  ctx.stroke()

  ctx.fillStyle = '#e6b987'
  ctx.beginPath()
  ctx.arc(540, 270, 43, 0, Math.PI * 2)
  ctx.fill()
  drawCenter(ctx, '✦', 287, '700 50px Georgia, serif', '#39253a')
  drawCenter(ctx, 'H I L O   C O F R A D E', 161, '800 29px Arial, sans-serif', '#f3dabb')
  drawCenter(ctx, 'EL HILO', 453, '700 103px Georgia, serif', '#fff9f1')
  drawCenter(ctx, 'ESCONDIDO', 571, '700 110px Georgia, serif', '#fff9f1')
  drawCenter(ctx, 'TU RETO COFRADE', 648, '800 27px Arial, sans-serif', '#f1cc9e')

  ctx.fillStyle = 'rgba(255,250,244,.94)'
  rounded(ctx, 126, 748, 828, 746, 40)
  ctx.fill()
  drawCenter(ctx, result.mode.toLocaleUpperCase('es-ES'), 855, '800 28px Arial, sans-serif', '#76384e')
  drawCenter(ctx, result.date, 905, '600 26px Arial, sans-serif', '#6d6670')
  drawCenter(ctx, String(result.score), 1122, '800 195px Georgia, serif', '#58283f')
  drawCenter(ctx, 'DE ' + result.maxScore + ' PUNTOS', 1181, '800 29px Arial, sans-serif', '#88566a')
  drawCenter(ctx, result.marks, 1309, '700 84px Arial, sans-serif', '#7f435c')
  const summary = result.rounds === 1
    ? (result.winners ? 'PALABRA DESCUBIERTA' : 'PALABRA POR DESCUBRIR')
    : result.winners + ' DE ' + result.rounds + ' CABOS DESENREDADOS'
  drawCenter(ctx, summary, 1394, '800 27px Arial, sans-serif', '#544c59')

  drawCenter(ctx, '¿TÚ TAMBIÉN PUEDES?', 1604, '700 52px Georgia, serif', '#fff4e4')
  drawCenter(ctx, 'Una nueva palabra. Un reto cada día.', 1671, '500 29px Arial, sans-serif', '#e9d4ce')
  ctx.strokeStyle = 'rgba(245,220,179,.35)'
  ctx.beginPath()
  ctx.moveTo(183, 1731)
  ctx.lineTo(897, 1731)
  ctx.stroke()
  drawCenter(ctx, 'HILOCOFRADE.ES/JUEGOS/EL-HILO-ESCONDIDO', 1788, '800 22px Arial, sans-serif', '#efd4ad')

  const dataUrl = canvas.toDataURL('image/png')
  const b64 = dataUrl.split(',')[1]
  if (!b64) throw new Error('No se ha podido generar la imagen')
  const bytes = Uint8Array.from(atob(b64), (char) => char.charCodeAt(0))
  return new File([bytes], filename, { type: 'image/png' })
}

export function saveHiddenStoryFile(file) {
  if (typeof document === 'undefined') return
  const href = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = href
  link.download = file.name
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(href), 1000)
}
