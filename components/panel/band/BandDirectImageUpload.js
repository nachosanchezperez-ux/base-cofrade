'use client'

import DirectImageUpload from '@/components/panel/DirectImageUpload'
import {
  prepareBandMediaUploadAction,
  saveBandMediaUploadAction,
} from '@/app/panel/(protected)/bandas/[id]/multimedia/actions'

export default function BandDirectImageUpload({
  bandId,
  assetId = '',
  kind,
  title,
  description,
  currentSrc = '',
  currentAlt = '',
  currentCredit = '',
  syncFields = null,
}) {
  return (
    <DirectImageUpload
      title={title}
      description={description}
      currentSrc={currentSrc}
      currentAlt={currentAlt}
      currentCredit={currentCredit}
      prepareAction={prepareBandMediaUploadAction}
      saveAction={saveBandMediaUploadAction}
      metadata={{ band_id: bandId, asset_entity_id: assetId, media_kind: kind }}
      showTextFields={kind !== 'logo'}
      syncFields={syncFields}
      successMessage={`${title} actualizado correctamente.`}
    />
  )
}
