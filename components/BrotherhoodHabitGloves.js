import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

const GLOVE_LABELS = {
  Blanco: 'Blancos',
  Negro: 'Negros',
}

export default async function BrotherhoodHabitGloves({ habitId }) {
  if (!habitId) return null

  try {
    const supabase = createPublicClient()
    const result = await supabase
      .from('brotherhood_habits')
      .select('gloves_color')
      .eq('id', habitId)
      .eq('status', 'published')
      .maybeSingle()

    if (result.error) throw result.error

    const label = GLOVE_LABELS[result.data?.gloves_color]
    if (!label) return null

    return (
      <div>
        <dt>Guantes</dt>
        <dd>{label}</dd>
      </div>
    )
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el color de los guantes del hábito', {
      habitId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
