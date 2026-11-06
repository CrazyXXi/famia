import { Link } from 'react-router-dom'
import { FEATURES } from '../../data/features'

/** Menu plein écran : les 3 fonctions de FamIA. */
export default function Menu({ onClose, current }) {
  return (
    <nav className="menu-panel" aria-label="Menu">
      {FEATURES.map((f) => (
        <Link key={f.id} to={f.to} onClick={onClose} className={current === f.id ? 'on' : ''}>
          <b>{f.n}</b> {f.title}
          <small>{f.desc}</small>
        </Link>
      ))}
    </nav>
  )
}
