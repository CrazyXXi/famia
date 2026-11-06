import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CENTRES, CITIES, MOTIFS } from '../../data/centres'
import { useGame } from '../../context/GameContext'
import { formatKm, nearest } from '../../lib/geo'

/* ============ Cartes interactives affichées DANS la conversation ============ */

const TYPES = ['hôpital', 'centre de santé', 'cabinet médical']
const pin = (active) => L.divIcon({ className: `pin${active ? ' on' : ''}`, html: '<i></i>', iconSize: [22, 22], iconAnchor: [11, 11] })

/** Carte des centres : carte OpenStreetMap + liste triée par distance. */
export function CentresWidget({ onBook }) {
  const { mark, award } = useGame()
  useEffect(() => { mark('centres'); award(0, ['explorateur']) /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [])
  const mapEl = useRef(null)
  const map = useRef(null)
  const layer = useRef(null)
  const you = useRef(null)
  const [city, setCity] = useState(CITIES[0].name)
  const [origin, setOrigin] = useState({ lat: CITIES[0].lat, lon: CITIES[0].lon, label: CITIES[0].name })
  const [types, setTypes] = useState(TYPES)
  const [selected, setSelected] = useState(null)
  const [msg, setMsg] = useState('')
  const list = useMemo(() => nearest(CENTRES, origin, { limit: 5, types }), [origin, types])

  useEffect(() => {
    const m = L.map(mapEl.current, { scrollWheelZoom: false }).setView([origin.lat, origin.lon], 13)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    m.on('click', () => m.scrollWheelZoom.enable())
    map.current = m
    const t = setTimeout(() => m.invalidateSize(), 80)
    return () => { clearTimeout(t); m.remove(); map.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map.current) return
    layer.current.clearLayers()
    list.forEach((c) => {
      L.marker([c.lat, c.lon], { icon: pin(c.id === selected) }).addTo(layer.current).on('click', () => setSelected(c.id)).bindTooltip(c.name)
    })
  }, [list, selected])

  useEffect(() => {
    map.current?.setView([origin.lat, origin.lon], 13)
    if (you.current) { you.current.remove(); you.current = null }
    if (origin.label === 'ta position' && map.current) {
      you.current = L.circleMarker([origin.lat, origin.lon], { radius: 8, color: '#fff', weight: 3, fillColor: '#2a0a1c', fillOpacity: 1 }).addTo(map.current)
    }
  }, [origin])

  function pickCity(name) {
    const c = CITIES.find((x) => x.name === name)
    setCity(name); setSelected(null); setMsg('')
    setOrigin({ lat: c.lat, lon: c.lon, label: c.name })
  }
  function locate() {
    if (!navigator.geolocation) return setMsg("La localisation n'est pas disponible sur cet appareil.")
    setMsg('Localisation…')
    navigator.geolocation.getCurrentPosition(
      (p) => { setMsg(''); setSelected(null); setOrigin({ lat: p.coords.latitude, lon: p.coords.longitude, label: 'ta position' }) },
      () => setMsg("Je n'ai pas pu te localiser. Choisis ta ville."),
      { timeout: 8000 },
    )
  }
  const toggle = (t) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))

  return (
    <div className="w">
      <div className="w-bar">
        <button className="chip solid" onClick={locate}>Autour de moi</button>
        <select value={origin.label === 'ta position' ? '' : city} onChange={(e) => pickCity(e.target.value)} aria-label="Ville">
          {origin.label === 'ta position' && <option value="">ta position</option>}
          {CITIES.map((c) => <option key={c.name}>{c.name}</option>)}
        </select>
        {TYPES.map((t) => <button key={t} className={`chip${types.includes(t) ? ' on' : ''}`} onClick={() => toggle(t)}>{t}</button>)}
      </div>
      {msg && <p className="w-note">{msg}</p>}
      <div className="wmap" ref={mapEl} role="application" aria-label="Carte des centres de santé" />
      <ul className="w-list">
        {list.map((c) => (
          <li key={c.id} className={c.id === selected ? 'on' : ''}>
            <button className="info" onClick={() => { setSelected(c.id); map.current?.setView([c.lat, c.lon], 16) }}>
              <b>{c.name}</b>
              <small>{c.type} · {formatKm(c.km)} de {origin.label}</small>
              {(c.addr || c.hours) && <small>{[c.addr, c.hours].filter(Boolean).join(' · ')}</small>}
            </button>
            <div className="acts">
              {c.phone && <a className="chip" href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}>Appeler</a>}
              <a className="chip" href={`https://www.openstreetmap.org/directions?to=${c.lat}%2C${c.lon}`} target="_blank" rel="noreferrer">Itinéraire</a>
              <button className="chip solid" onClick={() => onBook(c)}>Rendez-vous</button>
            </div>
          </li>
        ))}
        {!list.length && <li className="empty">Aucun centre avec ces filtres.</li>}
      </ul>
      <p className="w-credit">Données OpenStreetMap, parfois incomplètes : appelle le centre pour confirmer les horaires.</p>
    </div>
  )
}

/* ---------- Rendez-vous confidentiel ---------- */
const STORE = 'famia.rdv'
export const loadRdv = () => { try { return JSON.parse(localStorage.getItem(STORE) || '[]') } catch { return [] } }
const saveRdv = (v) => { try { localStorage.setItem(STORE, JSON.stringify(v)) } catch { /* stockage indisponible */ } }
const DAYS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
const SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00']
function nextDays(n = 10) {
  const out = []
  const d = new Date()
  while (out.length < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push({ iso: d.toISOString().slice(0, 10), label: `${DAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}` }) }
  return out
}
function makeCode() {
  const a = new Uint8Array(4)
  crypto.getRandomValues(a)
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return 'FAM-' + [...a].map((x) => chars[x % chars.length]).join('')
}

/** Réservation en 4 étapes, aucun nom demandé : le centre voit seulement un code. */
export function BookingWidget({ centre: preset, onSaved }) {
  const { mark, award } = useGame()
  const [centre, setCentre] = useState(preset || null)
  const [q, setQ] = useState('')
  const [motif, setMotif] = useState('')
  const [day, setDay] = useState('')
  const [slot, setSlot] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(null)
  const [saved, setSaved] = useState(false)
  const days = useMemo(() => nextDays(), [])
  const options = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? CENTRES.filter((c) => c.name.toLowerCase().includes(t)).slice(0, 6) : nearest(CENTRES, CITIES[0], { limit: 5 })
  }, [q])
  const step = !centre ? 1 : !motif ? 2 : !day || !slot ? 3 : 4

  function confirm() {
    const d = days.find((x) => x.iso === day)
    setDone({ code: makeCode(), centre, motif, when: `${d.label} à ${slot}` })
    mark('rdv'); award(10, ['pret'])
  }
  function keep() {
    saveRdv([{ code: done.code, motif: done.motif, when: done.when, centre: { id: done.centre.id, name: done.centre.name, lat: done.centre.lat, lon: done.centre.lon } }, ...loadRdv()])
    setSaved(true)
    onSaved?.()
  }

  if (done) {
    return (
      <div className="w">
        <div className="ticket">
          <small>TON CODE</small><b>{done.code}</b>
          <p>{done.centre.name}</p><p>{done.when}</p><p className="dim">{done.motif}</p>
        </div>
        <p className="w-note">Donne seulement ce code à l’accueil : ton nom n’est jamais demandé. Version de démonstration : le centre n’est pas encore relié, appelle-le pour confirmer.</p>
        <div className="w-bar">
          {!saved ? <button className="chip solid" onClick={keep}>Garder sur cet appareil</button> : <span className="chip on">Gardé sur cet appareil</span>}
          <a className="chip" href={`https://www.openstreetmap.org/directions?to=${done.centre.lat}%2C${done.centre.lon}`} target="_blank" rel="noreferrer">Itinéraire</a>
        </div>
      </div>
    )
  }
  return (
    <div className="w">
      <ol className="w-steps">
        {['Centre', 'Motif', 'Créneau', 'Confirmer'].map((s, i) => <li key={s} className={step === i + 1 ? 'on' : step > i + 1 ? 'past' : ''}><i>{i + 1}</i>{s}</li>)}
      </ol>
      {step === 1 && (
        <>
          <input className="w-field" placeholder="Chercher un centre par son nom…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Chercher un centre" />
          <ul className="w-choices">{options.map((c) => <li key={c.id}><button onClick={() => setCentre(c)}><b>{c.name}</b><small>{c.type}{c.addr ? ` · ${c.addr}` : ''}</small></button></li>)}</ul>
        </>
      )}
      {step === 2 && (
        <>
          <p className="w-picked">{centre.name} <button className="link" onClick={() => setCentre(null)}>changer</button></p>
          <ul className="w-choices">{MOTIFS.map((m) => <li key={m}><button onClick={() => setMotif(m)}><b>{m}</b></button></li>)}</ul>
        </>
      )}
      {step === 3 && (
        <>
          <p className="w-picked">{centre.name} · {motif} <button className="link" onClick={() => setMotif('')}>changer</button></p>
          <div className="w-bar">{days.map((d) => <button key={d.iso} className={`chip${day === d.iso ? ' on' : ''}`} onClick={() => setDay(d.iso)}>{d.label}</button>)}</div>
          {day && <div className="w-bar">{SLOTS.map((s) => <button key={s} className={`chip${slot === s ? ' on' : ''}`} onClick={() => setSlot(s)}>{s}</button>)}</div>}
        </>
      )}
      {step === 4 && (
        <>
          <div className="recap"><b>{centre.name}</b><span>{motif}</span><span>{days.find((x) => x.iso === day).label} à {slot}</span></div>
          <label className="w-lab" htmlFor="tel">Un numéro pour te rappeler (facultatif)</label>
          <input id="tel" className="w-field" inputMode="tel" placeholder="Laisse vide pour rester 100 % anonyme" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="w-bar"><button className="chip solid big" onClick={confirm}>Confirmer le rendez-vous</button><button className="chip" onClick={() => setSlot('')}>Changer le créneau</button></div>
        </>
      )}
    </div>
  )
}

/** Rendez-vous gardés sur cet appareil. */
export function MineWidget() {
  const [mine, setMine] = useState(loadRdv)
  const cancel = (code) => { const n = mine.filter((r) => r.code !== code); setMine(n); saveRdv(n) }
  if (!mine.length) return <div className="w"><p className="w-note">Aucun rendez-vous gardé sur cet appareil pour l’instant.</p></div>
  return (
    <div className="w">
      <ul className="w-list">
        {mine.map((r) => (
          <li key={r.code}>
            <div className="info"><b>{r.code} · {r.centre.name}</b><small>{r.when} · {r.motif}</small></div>
            <div className="acts"><button className="chip" onClick={() => cancel(r.code)}>Annuler</button></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
