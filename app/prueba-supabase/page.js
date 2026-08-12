import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function PruebaSupabasePage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, status')
    .order('entity_type')
    .order('name')

  if (error) {
    return (
      <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <h1>Error conectando con Supabase</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Hilo Cofrade · Supabase conectado</h1>
      <p>{data.length} entidades recibidas desde la base real</p>

      <ul>
        {data.map((entity) => (
          <li key={entity.id} style={{ marginBottom: '10px' }}>
            <strong>{entity.name}</strong>
            {' · '}
            {entity.entity_type}
          </li>
        ))}
      </ul>
    </main>
  )
}
