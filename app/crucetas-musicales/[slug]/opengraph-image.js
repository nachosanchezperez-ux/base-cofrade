import { REPERTOIRE_SOCIAL_IMAGE_SIZE, renderRepertoireSocialImage } from '@/lib/repertoire-social-image'

export const alt = 'Hilo Cofrade · cruceta musical'
export const size = REPERTOIRE_SOCIAL_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { slug } = await params
  return renderRepertoireSocialImage(slug)
}
