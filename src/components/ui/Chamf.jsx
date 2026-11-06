import { Link } from 'react-router-dom'

/**
 * Bouton chanfreiné (style ORBE). `to` → lien, sinon <button>.
 * variant « sm » pour les boutons d'interface dans l'app.
 */
export default function Chamf({ to, onClick, children, variant, disabled, type = 'button', ...rest }) {
  const inner = (
    <>
      <svg viewBox="862 1127 330 102" aria-hidden="true" preserveAspectRatio="none">
        <path className="body" d="M884,1131 H1170 L1188,1149 V1207 L1170,1225 H884 L866,1207 V1149 Z" />
        <path className="edge" d="M871,1196 V1151 L886,1136 H1170 L1181,1147" />
        <path className="chip" d="M1110,1140 H1166 L1180,1154 V1196 L1166,1210 H1110 L1096,1196 V1154 Z" />
        <g className="chev"><path d="M1124,1167 l6,8 l-6,8" /><path d="M1134,1167 l6,8 l-6,8" /><path d="M1144,1167 l6,8 l-6,8" /></g>
      </svg>
      <span>{children}</span>
    </>
  )
  const cls = `chamf${variant ? ` ${variant}` : ''}`
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  return <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>{inner}</button>
}
