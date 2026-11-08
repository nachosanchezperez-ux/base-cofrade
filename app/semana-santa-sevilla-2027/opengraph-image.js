import { HOLY_WEEK_SOCIAL_IMAGE_SIZE, renderHolyWeekSocialImage } from '@/lib/holy-week-social-image'
import { holyWeekSocialConfig } from '@/lib/holy-week-social-copy'

export const alt = holyWeekSocialConfig().alt
export const size = HOLY_WEEK_SOCIAL_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return renderHolyWeekSocialImage()
}
