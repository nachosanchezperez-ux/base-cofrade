import 'server-only'

import { revalidatePath, revalidateTag } from 'next/cache'

// Las fotos de la Agenda (#agenda-fotos) salen de salidas, cultos, conciertos y
// titulares. Al cambiar cualquiera, se invalidan la Agenda completa, sus
// páginas de periodo (hoy, mañana, fin de semana…) y la portada.
export function revalidateAgendaPhotos() {
  revalidatePath('/agenda-cofrade', 'layout')
  revalidateTag('home-public', { expire: 0 })
}
