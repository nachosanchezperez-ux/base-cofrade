import {
  renderSectionSocialImage,
  sectionSocialImageAlt,
  SECTION_SOCIAL_IMAGE_SIZE,
} from '@/lib/section-social-image'

export const alt = sectionSocialImageAlt('agenda')
export const size = SECTION_SOCIAL_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return renderSectionSocialImage('agenda')
}
