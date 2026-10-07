import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Revisión del directorio', robots: { index: false, follow: false } }

// Temporary review surface, removed before integration.
export default async function DirectoryReviewPage({ searchParams }) {
  if (process.env.VERCEL_ENV === 'production') notFound()
  const params = await searchParams
  const widths = [320, 390, 430, 768, 1024]
  const requested = Number(params.width)
  const width = widths.includes(requested) ? requested : 390

  return (
    <div style={{ padding: '20px', overflowX: 'auto' }}>
      <form style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <label htmlFor="review-width">Anchura de revisión</label>
        <select id="review-width" name="width" defaultValue={width} style={{ padding: '10px', fontSize: '16px' }}>
          {widths.map((value) => <option key={value} value={value}>{value} px</option>)}
        </select>
        <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>Aplicar anchura</button>
      </form>
      <iframe title="Directorio en prueba" src="/hermandades" style={{ width, height: '1100px', border: '1px solid #cad6df', display: 'block' }} />
    </div>
  )
}
