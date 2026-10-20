import {
  renderSectionSocialImage,
  sectionSocialImageAlt,
  SECTION_SOCIAL_IMAGE_SIZE,
} from '@/lib/section-social-image'

export const alt = sectionSocialImageAlt('home')
export const size = SECTION_SOCIAL_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderSectionSocialImage('home')
}
