import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import {
  PROGRAMME_DAYS,
  PROGRAMME_PATH,
  dayPath,
  initialDayId,
} from '@/lib/holy-week-programme'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'
import { getHolyWeekProgramme } from '@/lib/supabase/holy-week-programme'
import ProgrammeShell from './ProgrammeShell'

export const revalidate = 900

const title = 'Semana Santa de Sevilla 2027: orden de paso y programa de mano'
const description = 'Programa de mano de la Semana Santa de Sevilla 2027, del 19 al 28 de marzo: orden de paso por la Carrera Oficial de cada jornada, vísperas, cortejo con sus bandas y recorridos.'

export const metadata = {
  title,
  description,
  alternates: { canonical: PROGRAMME_PATH },
  // images: null → la imagen propia de app/semana-santa-sevilla-2027/opengraph-image.js
  ...socialMetadata({ title: 'Semana Santa de Sevilla 2027 · Programa de mano', description, path: PROGRAMME_PATH, images: null }),
}

export default async function HolyWeekProgrammePage() {
  // Se renderiza en la petición, como el resto de páginas que leen Supabase:
  // el build (CI incluido) no necesita las claves públicas.
  await connection()
  const { days } = await getHolyWeekProgramme()
  const total = new Set(days.flatMap((day) => day.items.map((item) => item.slug))).size

  return <>
    <JsonLd data={breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Semana Santa de Sevilla 2027', path: PROGRAMME_PATH },
    ])} />
    {/* La portada del programa enlaza las once jornadas; los Event de cada
        salida viven en la página de su jornada, una sola vez. */}
    <JsonLd data={collectionPageJsonLd({
      path: PROGRAMME_PATH,
      name: title,
      description,
      items: PROGRAMME_DAYS.map((day) => ({ name: `${day.name} 2027`, path: dayPath(day.id) })),
    })} />
    <ProgrammeShell
      days={days}
      activeDayId={initialDayId(PROGRAMME_DAYS)}
      mode="hub"
      breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Semana Santa 2027' }]}
      eyebrow="Programa de mano"
      heading="Semana Santa de Sevilla 2027"
      lead={`Del 19 al 28 de marzo · ${total} hermandades`}
    />
  </>
}
