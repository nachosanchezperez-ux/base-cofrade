function typeOf(entity) {
  return entity?.entityType || entity?.entity_type || ''
}

function orient(a, b, firstType, secondType) {
  if (typeOf(a) === firstType && typeOf(b) === secondType) return [a, b]
  if (typeOf(a) === secondType && typeOf(b) === firstType) return [b, a]
  return null
}

export function relationSupportCandidate(from, to, meta = '') {
  const pair = orient(from, to, 'brotherhood', 'step')
  if (pair) return {
    kind: 'brotherhood_step',
    sourceLinkColumn: 'brotherhood_step_id',
    values: { brotherhoodId: pair[0].id, stepId: pair[1].id },
  }

  const brotherhoodImage = orient(from, to, 'brotherhood', 'image')
  if (brotherhoodImage) return {
    kind: 'brotherhood_image',
    sourceLinkColumn: 'brotherhood_image_id',
    values: { brotherhoodId: brotherhoodImage[0].id, imageId: brotherhoodImage[1].id },
  }

  const imageStep = orient(from, to, 'image', 'step')
  if (imageStep) return {
    kind: 'image_step',
    sourceLinkColumn: 'image_step_id',
    values: { imageId: imageStep[0].id, stepId: imageStep[1].id },
  }

  const stepAgent = orient(from, to, 'step', 'agent')
  if (stepAgent) return {
    kind: 'step_personnel',
    sourceLinkColumn: 'step_personnel_period_id',
    values: { stepId: stepAgent[0].id, agentId: stepAgent[1].id },
  }

  const brotherhoodBand = orient(from, to, 'brotherhood', 'band')
  if (brotherhoodBand) return {
    kind: 'music_period_brotherhood',
    sourceLinkColumn: 'music_accompaniment_period_id',
    values: { brotherhoodId: brotherhoodBand[0].id, bandId: brotherhoodBand[1].id },
  }

  const stepBand = orient(from, to, 'step', 'band')
  if (stepBand) return {
    kind: 'music_period_step',
    sourceLinkColumn: 'music_accompaniment_period_id',
    values: { stepId: stepBand[0].id, bandId: stepBand[1].id },
  }

  const imageAgent = orient(from, to, 'image', 'agent')
  if (imageAgent) return {
    kind: 'image_authorship',
    sourceLinkColumn: 'image_authorship_id',
    values: { imageId: imageAgent[0].id, agentId: imageAgent[1].id },
  }

  const marchAgent = orient(from, to, 'march', 'agent')
  if (marchAgent && /dedicat/i.test(String(meta))) return {
    kind: 'march_dedication',
    sourceLinkColumn: 'march_dedication_id',
    values: { marchId: marchAgent[0].id, dedicateeId: marchAgent[1].id },
  }

  if (typeOf(from) === 'march' || typeOf(to) === 'march') {
    const march = typeOf(from) === 'march' ? from : to
    const dedicatee = march === from ? to : from
    if (typeOf(dedicatee) !== 'agent' || /dedicat/i.test(String(meta))) return {
      kind: 'march_dedication',
      sourceLinkColumn: 'march_dedication_id',
      values: { marchId: march.id, dedicateeId: dedicatee.id },
    }
  }

  return null
}

export function splitGraphEdgeLabel(label = '') {
  const parts = String(label).split(' → ')
  return parts.length === 2 ? { fromName: parts[0], toName: parts[1] } : null
}
