import { notFound } from 'next/navigation'
import HermandadDetailPage, { generateMetadata as publicMetadata } from '@/app/hermandades/[slug]/page'

export const revalidate = 900
export const dynamic = 'force-static'

export function generateStaticParams() { return [] }

export async function generateMetadata(props) {
  return { ...await publicMetadata(props), robots: { index: false, follow: true } }
}

export default async function ReadingLaboratoryPage({ params }) {
  // A reusable preview surface; public routes and production remain unchanged.
  if (process.env.VERCEL_ENV === 'production') notFound()
  return HermandadDetailPage({ params, reading: true })
}
