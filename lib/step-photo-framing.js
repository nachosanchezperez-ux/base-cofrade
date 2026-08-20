const STEP_PHOTO_FRAMING = {
  'paso-misterio-sagrada-cena-sevilla': {
    card: '50% 44%',
    hero: '50% 40%',
  },
  'paso-cristo-humildad-y-paciencia-la-cena': {
    card: '50% 32%',
    hero: '50% 28%',
  },
};

export function getStepPhotoFraming(slug) {
  return STEP_PHOTO_FRAMING[slug] || {};
}
