import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import {
  PROGRAMME_DAYS,
  PROGRAMME_PATH,
  PROGRAMME_YEAR,
  dateLabel,
  dayPath,
  daySeo,
  programmeDay,
} from '@/lib/holy-week-programme'
import { programmeDayJsonLd } from '@/lib/holy-week-programme-jsonld'
import { breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { getHolyWeekProgramme } from '@/lib/supabase/holy-week-programme'
import ProgrammeShell from '../ProgrammeShell'

export const revalidate = 900
export const dynamicParams = false

export function generateStaticParams() {
  return PROGRAMME_DAYS.map((day) => ({ jornada: day.id }))
}

export async function generateMetadata({ params }) {
  const { jornada } = await params
  const day = programmeDay(jornada)
  if (!day) return { title: 'Jornada no encontrada', robots: { index: false, follow: false } }
  const { title, description } = daySeo(day)
  const path = dayPath(day.id)
  return {
    title,
    description,
    alternates: { canonical: path },
    // images: null → la imagen propia de la jornada ([jornada]/opengraph-image.js)
    ...socialMetadata({ title: `${day.name} · Semana Santa de Sevilla ${PROGRAMME_YEAR}`, description, path, images: null }),
  }
}

function capitalized(value = '') {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : ''
}

export default async function HolyWeekDayPage({ params }) {
  const { jornada } = await params
  const config = programmeDay(jornada)
  if (!config) notFound()
  await connection()
  const { days } = await getHolyWeekProgramme()
  const day = days.find((item) => item.id === config.id)
  if (!day) notFound()
  const path = dayPath(day.id)
  const when = capitalized(config.dateLabel || dateLabel(config.date))

  return <>
    <JsonLd data={breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Semana Santa de Sevilla 2027', path: PROGRAMME_PATH },
      { name: day.name, path },
    ])} />
    <JsonLd data={programmeDayJsonLd(day, day.items)} />
    <ProgrammeShell
      days={days}
      activeDayId={day.id}
      mode="day"
      breadcrumb={[
        { label: 'Inicio', href: '/' },
        { label: 'Semana Santa 2027', href: PROGRAMME_PATH },
        { label: day.name },
      ]}
      eyebrow={`Semana Santa de Sevilla ${PROGRAMME_YEAR} · Programa de mano`}
      heading={day.name}
      lead={`${when} · ${day.items.length} ${day.items.length === 1 ? 'hermandad' : 'hermandades'}`}
    />
  </>
}
