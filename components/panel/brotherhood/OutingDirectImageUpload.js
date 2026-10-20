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
  currentFit = 'cover',
}) {
  return (
    <DirectImageUpload
      title="Fotografía o cartel de esta salida"
      description="Sube una fotografía o el cartel de esta salida concreta. Se utilizará en la ficha de la Hermandad y, cuando corresponda, en Agenda, Glorias o Extraordinarias."
      currentSrc={currentSrc}
      currentAlt={currentAlt || title}
      currentCredit={currentCredit}
      prepareAction={prepareOutingHeroImageUploadAction}
      saveAction={saveOutingHeroImageUploadAction}
      metadata={{ brotherhood_id: brotherhoodId, outing_id: outingId }}
      requireAlt
      syncFields={{ path: 'hero_image_path', alt: 'hero_image_alt', credit: 'hero_image_credit', fit: 'hero_image_fit' }}
      presentationChoice
      currentPresentation={currentFit}
      successMessage="Fotografía de la salida actualizada correctamente."
    />
  )
}
