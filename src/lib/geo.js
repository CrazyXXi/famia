/** Distance en km entre deux points (formule de haversine). */
export function distanceKm(a, b) {
  const R = 6371
  const rad = (x) => (x * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Centres triés par distance croissante à `from`, avec un champ `km`. */
export function nearest(centres, from, { limit = 30, types } = {}) {
  return centres
    .filter((c) => !types || types.includes(c.type))
    .map((c) => ({ ...c, km: distanceKm(from, c) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
}

export const formatKm = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`)
