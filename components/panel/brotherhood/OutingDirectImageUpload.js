'use client'

import DirectImageUpload from '@/components/panel/DirectImageUpload'
import {
  prepareOutingHeroImageUploadAction,
  saveOutingHeroImageUploadAction,
} from '@/app/panel/(protected)/hermandades/[id]/salidas/hero-image-actions'

export default function OutingDirectImageUpload({
  brotherhoodId,
  outingId,
  title,
  currentSrc = '',
  currentAlt = '',
  currentCredit = '',
}) {
  return (
    <DirectImageUpload
      title="Imagen principal"
      description="Actualiza la portada utilizada por la ficha, Extraordinarias o Glorias cuando corresponda."
      currentSrc={currentSrc}
      currentAlt={currentAlt || title}
      currentCredit={currentCredit}
      prepareAction={prepareOutingHeroImageUploadAction}
      saveAction={saveOutingHeroImageUploadAction}
      metadata={{ brotherhood_id: brotherhoodId, outing_id: outingId }}
      requireAlt
      syncFields={{ path: 'hero_image_path', alt: 'hero_image_alt', credit: 'hero_image_credit' }}
      successMessage="Imagen principal de la salida actualizada correctamente."
    />
  )
}
