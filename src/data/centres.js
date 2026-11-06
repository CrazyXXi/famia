import raw from './centres-bj.json'

// Centres de santé du Bénin — source : OpenStreetMap (© contributeurs OpenStreetMap, ODbL).
// Régénérer avec : node scripts/fetch-centres.mjs
export const CENTRES = raw

export const CITIES = [
  { name: 'Cotonou', lat: 6.3703, lon: 2.3912 },
  { name: 'Abomey-Calavi', lat: 6.4489, lon: 2.3556 },
  { name: 'Porto-Novo', lat: 6.4969, lon: 2.6289 },
  { name: 'Bohicon', lat: 7.1783, lon: 2.0667 },
  { name: 'Parakou', lat: 9.3372, lon: 2.6303 },
  { name: 'Djougou', lat: 9.7085, lon: 1.666 },
  { name: 'Natitingou', lat: 10.3042, lon: 1.3796 },
]

export const MOTIFS = [
  'Information sur la contraception',
  'Choisir une méthode',
  'Test de grossesse',
  'Dépistage IST / VIH',
  'Suivi de grossesse',
  'Consultation de couple',
  'Autre question',
]

export const centreById = (id) => CENTRES.find((c) => c.id === id)
