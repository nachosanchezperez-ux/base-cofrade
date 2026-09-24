import { permanentRedirect } from 'next/navigation'

export default async function LegacyMarchAuthorPage({ params }) {
  const { slug } = await params
  permanentRedirect(`/autores/${slug}`)
}
