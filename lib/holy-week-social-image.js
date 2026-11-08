import { renderSocialCard, SECTION_SOCIAL_IMAGE_SIZE } from '@/lib/section-social-image'
import { holyWeekSocialConfig } from '@/lib/holy-week-social-copy'
import { PROGRAMME_DAYS } from '@/lib/holy-week-programme'

export const HOLY_WEEK_SOCIAL_IMAGE_SIZE = SECTION_SOCIAL_IMAGE_SIZE

export function holyWeekDay(dayId = '') {
  return PROGRAMME_DAYS.find((day) => day.id === dayId) || null
}

export function renderHolyWeekSocialImage(dayId = '') {
  return renderSocialCard(holyWeekSocialConfig(holyWeekDay(dayId)))
}
