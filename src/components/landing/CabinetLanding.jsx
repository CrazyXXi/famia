import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { startTrail } from '../../lib/trail'
import Hud from '../ui/Hud'
import Menu from '../ui/Menu'
import Chamf from '../ui/Chamf'
import '../../styles/landing.css'

// Icônes en traits fins : planification familiale et contraception. Un clic ouvre l'assistant avec la question.
const ICONS = [
  { id: 'cycle', label: 'Cycle', q: 'Comment fonctionne mon cycle menstruel ?', pos: ['14%', '22%'],
    d: <><rect x="5" y="7" width="22" height="20" rx="4" /><path d="M5 13h22M11 5v4M21 5v4" /><circle cx="16" cy="20" r="2.2" fill="currentColor" stroke="none" /></> },
  { id: 'pilule', label: 'Pilule', q: 'Comment fonctionne la pilule ?', pos: ['7%', '48%'],
    d: <><rect x="4" y="8" width="24" height="16" rx="5" /><circle cx="10" cy="16" r="2.4" /><circle cx="16" cy="16" r="2.4" /><circle cx="22" cy="16" r="2.4" fill="currentColor" stroke="none" /></> },
  { id: 'preservatif', label: 'Préservatif', q: 'Comment bien utiliser un préservatif ?', pos: ['14%', '74%'],
    d: <><path d="M6 11a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" /><circle cx="16" cy="16" r="4" /></> },
  { id: 'injection', label: 'Implant', q: "Comment fonctionnent l'implant et l'injection ?", pos: ['86%', '22%'],
    d: <><path d="M21 5l6 6M19 7l6 6-11 11-6-6zM13 17l-3 3M8 24l-4 4" /></> },
  { id: 'couple', label: 'En couple', q: 'Comment parler de contraception avec mon partenaire ?', pos: ['93%', '48%'],
    d: <><path d="M16 26S5 19 5 12a5.5 5.5 0 0 1 11-2 5.5 5.5 0 0 1 11 2c0 7-11 14-11 14z" /></> },
  { id: 'famille', label: 'Famille', q: 'Combien de temps attendre entre deux enfants ?', pos: ['86%', '74%'],
    d: <><circle cx="10" cy="10" r="3" /><circle cx="22" cy="10" r="3" /><circle cx="16" cy="17" r="2.2" /><path d="M5 27v-3a5 5 0 0 1 10 0v3M17 27v-3a5 5 0 0 1 10 0v3" /></> },
]

/** Landing minimaliste : « famia » au centre, entouré d'icônes de planification et de contraception. */
export default function CabinetLanding() {
  const canvasRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const api = reduced ? null : startTrail(canvasRef.current)
    return () => api?.stop()
  }, [])

  return (
    <div className="land">
      <h1 className="sr">FamIA — l'assistant qui répond aux questions secrètes, sans tabou</h1>

      <div className="stack">
        <div className="word" aria-hidden="true">famia</div>
        <p className="tag">L’app qui répond aux questions secrètes.<br />Anonyme, sans tabou, sans jugement.</p>
        <div className="cta"><Chamf to="/app/accueil" variant="lg">ESSAYER FAMIA</Chamf></div>
      </div>

      <nav className="orbit" aria-label="Sujets">
        {ICONS.map((ic, i) => (
          <Link key={ic.id} to={`/app/discuter?q=${encodeURIComponent(ic.q)}`} className="ico" style={{ '--x': ic.pos[0], '--y': ic.pos[1], '--d': `${i * 0.7}s` }} aria-label={ic.q}>
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ic.d}</svg>
            <span>{ic.label}</span>
          </Link>
        ))}
      </nav>

      <canvas ref={canvasRef} className="trail" aria-hidden="true" />
      {open && <Menu onClose={() => setOpen(false)} />}
      <Hud open={open} onMenu={() => setOpen((o) => !o)} />
    </div>
  )
}
