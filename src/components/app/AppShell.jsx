import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import { GuardProvider, useGuard } from '../../context/GuardContext'
import { GameProvider, useGame } from '../../context/GameContext'
import { FEATURES, HOME } from '../../data/features'
import { BADGES, levelOf } from '../../lib/game'
import Hud from '../ui/Hud'
import Chat, { Orb } from './Chat'
import JouerPage from './Games'
import { CentresPage, HomePage, RdvPage } from './Pages'
import '../../styles/app.css'
import '../../styles/sections.css'

const SECTIONS = [HOME, ...FEATURES]

function Shell() {
  const { section } = useParams()
  const nav = useNavigate()
  const { wipe } = useGuard()
  const { xp, toast } = useGame()
  const [drawer, setDrawer] = useState(false)
  useEffect(() => {
    setDrawer(false)
    document.querySelector('.content')?.scrollTo(0, 0)
  }, [section])

  const current = SECTIONS.find((s) => s.id === section)
  if (!current) return <Navigate to="/app/accueil" replace />
  const lv = levelOf(xp)
  const fresh = () => { wipe(); nav('/app/discuter') }

  return (
    <div className="chatui">
      <div className="shell">
        <aside className={`side${drawer ? ' open' : ''}`}>
          <Link to="/app/accueil" className="brand"><Orb size={26} /> famia</Link>
          <nav aria-label="Sections">
            {SECTIONS.map((s) => (
              <NavLink key={s.id} to={s.to} className={({ isActive }) => (isActive ? 'on' : '')}><i>{s.n}</i>{s.title}</NavLink>
            ))}
          </nav>
          <button className="new" onClick={fresh}>Nouvelle conversation</button>
          <Link to="/app/jouer" className="mini-level">
            <span>{lv.name}</span><small>{xp} points</small>
            <div className="gprog"><span style={{ width: `${lv.pct}%` }} /></div>
          </Link>
          <div className="foot">
            <p><b>Anonyme.</b> Pas de compte, rien n’est conservé quand tu fermes la page.</p>
            <Link to="/">← Retour au site</Link>
          </div>
        </aside>
        {drawer && <button className="scrim" aria-label="Fermer" onClick={() => setDrawer(false)} />}

        <main className="main">
          <header className="mobbar"><button onClick={() => setDrawer(true)}>Menu</button><span>famia</span><button onClick={fresh}>Nouveau</button></header>
          <div className="content">
            {/* la conversation reste montée pour ne pas être perdue en changeant d'espace */}
            <div className="chatwrap" hidden={section !== 'discuter'}><Chat active={section === 'discuter'} /></div>
            {section === 'accueil' && <div className="scroll"><HomePage /></div>}
            {section === 'jouer' && <div className="scroll"><JouerPage /></div>}
            {section === 'centres' && <div className="scroll"><CentresPage /></div>}
            {section === 'rendez-vous' && <div className="scroll"><RdvPage /></div>}
          </div>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast.xp > 0 && <b>+{toast.xp} points</b>}
          {toast.badges.map((id) => <span key={id}>Badge : {BADGES.find((b) => b.id === id)?.name}</span>)}
          {toast.levelUp && <span>Niveau : {toast.levelUp}</span>}
        </div>
      )}
      <Hud label={`${current.n} // ${current.title.toUpperCase()}`} />
    </div>
  )
}

export default function AppShell() {
  return (
    <GuardProvider>
      <GameProvider>
        <Shell />
      </GameProvider>
    </GuardProvider>
  )
}
