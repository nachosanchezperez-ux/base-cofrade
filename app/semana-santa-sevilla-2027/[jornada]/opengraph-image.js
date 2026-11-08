import { HOLY_WEEK_SOCIAL_IMAGE_SIZE, renderHolyWeekSocialImage } from '@/lib/holy-week-social-image'
import { PROGRAMME_DAYS } from '@/lib/holy-week-programme'

export const alt = 'Hilo Cofrade · Semana Santa de Sevilla 2027 · Programa de mano'
export const size = HOLY_WEEK_SOCIAL_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return PROGRAMME_DAYS.map((day) => ({ jornada: day.id }))
}

export default async function Image({ params }) {
  const { jornada } = await params
  return renderHolyWeekSocialImage(jornada)
}
