import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CENTRES, centreById } from '../../data/centres'
import { FACTS } from '../../data/game'
import { QUICK_QUESTIONS } from '../../data/features'
import { levelOf } from '../../lib/game'
import { useGame } from '../../context/GameContext'
import { BookingWidget, CentresWidget, MineWidget } from './Widgets'

/** Accueil : ton parcours, ton niveau, un fait du jour et les questions fréquentes. */
export function HomePage() {
  const { progress, xp } = useGame()
  const lv = levelOf(xp)
  const fact = useMemo(() => FACTS[Math.floor(Date.now() / 86400000) % FACTS.length], [])
  const steps = [
    { to: '/app/discuter', n: '01', t: 'Discuter', d: 'Poser une question', done: progress.asked },
    { to: '/app/jouer', n: '02', t: 'Jouer', d: 'Tester mes connaissances', done: progress.played },
    { to: '/app/centres', n: '03', t: 'Les centres', d: 'Trouver un centre près de moi', done: progress.centres },
    { to: '/app/rendez-vous', n: '04', t: 'Rendez-vous', d: 'Réserver, sans mon nom', done: progress.rdv },
  ]
  const doneCount = steps.filter((s) => s.done).length
  return (
    <div className="page-in">
      <p className="eyebrow">Bienvenue</p>
      <h1 className="hero-t">Bonjour, de quoi as-tu <em>besoin</em> ?</h1>
      <p className="lead">Ici, personne ne te juge et personne ne saura qui tu es. Avance à ton rythme : tout est lié.</p>

      <section className="block">
        <div className="block-h"><h3 className="h3">Ton parcours</h3><span className="muted">{doneCount} sur 4</span></div>
        <div className="steps4">
          {steps.map((s) => (
            <Link key={s.to} to={s.to} className={`stepcard${s.done ? ' done' : ''}`}>
              <i>{s.n}</i>
              <b>{s.t}</b>
              <p>{s.d}</p>
              <span className="tick">{s.done ? 'Fait' : 'À faire'}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="block two">
        <Link to="/app/jouer" className="panelcard level">
          <p className="eyebrow">Ton niveau</p>
          <h3>{lv.name}</h3>
          <div className="gprog big"><span style={{ width: `${lv.pct}%` }} /></div>
          <p className="muted">{xp} points{lv.next ? ` · encore ${lv.xpNeeded - lv.xpInLevel} pour devenir ${lv.next}` : ''}</p>
        </Link>
        <div className="panelcard fact">
          <p className="eyebrow">Le saviez-vous ?</p>
          <p className="fact-t">{fact}</p>
          <Link to="/app/jouer" className="link-a">Tester mes connaissances →</Link>
        </div>
      </section>

      <section className="block">
        <h3 className="h3">Questions fréquentes</h3>
        <div className="quickq">
          {QUICK_QUESTIONS.map((q) => <Link key={q} to={`/app/discuter?q=${encodeURIComponent(q)}`}>{q}</Link>)}
        </div>
      </section>
    </div>
  )
}

/** Carte des centres de santé. */
export function CentresPage() {
  const nav = useNavigate()
  return (
    <div className="page-in">
      <p className="eyebrow">Les centres</p>
      <h2 className="page-t">Un centre <em>près de toi</em></h2>
      <p className="lead">{CENTRES.length} centres de santé au Bénin. Personne ne verra ce que tu cherches. Quand tu as choisi, tu peux prendre rendez-vous en un clic.</p>
      <CentresWidget onBook={(c) => nav(`/app/rendez-vous?c=${c.id}`)} />
    </div>
  )
}

/** Rendez-vous confidentiel + rendez-vous gardés. */
export function RdvPage() {
  const [params] = useSearchParams()
  const preset = centreById(params.get('c'))
  const [bump, setBump] = useState(0)
  return (
    <div className="page-in">
      <p className="eyebrow">Rendez-vous</p>
      <h2 className="page-t">Réserve, <em>sans ton nom</em></h2>
      <p className="lead">Choisis un centre, un motif et un créneau. Tu reçois un code à présenter à l’accueil, personne n’a besoin de savoir qui tu es.</p>
      <BookingWidget key={preset?.id || 'new'} centre={preset} onSaved={() => setBump((b) => b + 1)} />
      <h3 className="h3 spaced">Mes rendez-vous</h3>
      <MineWidget key={bump} />
    </div>
  )
}
