// Récupère les centres de santé du Bénin depuis OpenStreetMap (Overpass) → src/data/centres-bj.json
import fs from 'node:fs'
const Q = `[out:json][timeout:120];area["ISO3166-1"="BJ"]->.a;(nwr["amenity"~"^(hospital|clinic|doctors)$"](area.a);nwr["healthcare"~"^(hospital|clinic|centre|doctor)$"](area.a););out center tags;`
const MIRRORS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter']
let data
for (let round = 0; round < 3 && !data; round++) for (const url of MIRRORS) {
  if (data) break
  try {
    const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(Q), headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'famia-app/1.0 (prototype planification familiale; contact: projet FamIA)', accept: 'application/json' }, signal: AbortSignal.timeout(150000) })
    if (!r.ok) throw new Error(r.status)
    data = await r.json()
    console.log('OK via', url, data.elements.length, 'éléments')
    break
  } catch (e) { console.log('échec', url, String(e)); await new Promise((r) => setTimeout(r, 8000)) }
}
if (!data) process.exit(1)
const typeOf = (t) => (t.amenity === 'hospital' || t.healthcare === 'hospital' ? 'hôpital' : t.amenity === 'doctors' || t.healthcare === 'doctor' ? 'cabinet médical' : 'centre de santé')
const out = []
for (const e of data.elements) {
  const t = e.tags || {}
  const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon
  if (lat == null || lon == null) continue
  const name = t.name || t['name:fr'] || t.official_name
  if (!name) continue
  out.push({
    id: `${e.type[0]}${e.id}`, name, type: typeOf(t), lat: +lat.toFixed(5), lon: +lon.toFixed(5),
    phone: t.phone || t['contact:phone'] || undefined,
    hours: t.opening_hours || undefined,
    addr: [t['addr:street'], t['addr:city'] || t['addr:suburb']].filter(Boolean).join(', ') || undefined,
  })
}
out.sort((a, b) => a.name.localeCompare(b.name))
fs.writeFileSync(new URL('../src/data/centres-bj.json', import.meta.url), JSON.stringify(out))
console.log('centres nommés enregistrés :', out.length)
