import { useEffect, useRef, useState } from 'react'

const pad4 = (n) => String(Math.max(0, Math.round(n))).padStart(4, '0').slice(-4)

/** Tracé du cadre : rectangle plein moins une « fenêtre » à encoches (haut et bas). */
function hudPath(W, H) {
  const h = W <= 820 ? W / 860 : Math.min(W / 2048, H / 1360)
  const cx = W / 2
  const L = 20 * h, T = 20 * h, R = W - 20 * h, B = H - 30 * h, r = 30 * h
  const win = [
    `M${L + r},${T}`, `H${cx - 220 * h}`, `L${cx - 188 * h},${T + 30 * h}`, `H${cx + 190 * h}`, `L${cx + 222 * h},${T}`,
    `H${R - r}`, `Q${R},${T} ${R},${T + r}`, `V${B - r}`, `Q${R},${B} ${R - r},${B}`,
    `H${cx + 232 * h}`, `L${cx + 190 * h},${B - 37 * h}`, `H${cx - 188 * h}`, `L${cx - 230 * h},${B}`,
    `H${L + r}`, `Q${L},${B} ${L},${B - r}`, `V${T + r}`, `Q${L},${T} ${L + r},${T}Z`,
  ].join(' ')
  return { d: `M0,0 H${W} V${H} H0Z ${win}`, h }
}

/**
 * Cadre HUD partagé par la landing et l'application.
 * label : texte de l'encoche du bas (sinon coordonnées du curseur).
 */
export default function Hud({ open, onMenu, label }) {
  const [geo, setGeo] = useState(() => ({ ...hudPath(1440, 810), W: 1440, H: 810 }))
  const coordRef = useRef(null)

  useEffect(() => {
    const onResize = () => setGeo({ ...hudPath(innerWidth, innerHeight), W: innerWidth, H: innerHeight })
    onResize()
    addEventListener('resize', onResize)
    const onMove = (e) => {
      if (coordRef.current) coordRef.current.textContent = `X.${pad4(e.clientX)}  //  Y.${pad4(e.clientY)}`
    }
    if (!label) addEventListener('pointermove', onMove)
    return () => {
      removeEventListener('resize', onResize)
      removeEventListener('pointermove', onMove)
    }
  }, [label])

  return (
    <div className="hud" style={{ '--h': `${geo.h}px` }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${geo.W} ${geo.H}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={geo.d} fill="#2a0a1c" fillRule="evenodd" />
      </svg>
      <span className="brand-tab">FAMIA</span>
      <span className="coords" ref={coordRef}>{label || 'X.0052  //  Y.0053'}</span>
      {onMenu && <button className="menu" onClick={onMenu} aria-expanded={open}>{open ? 'FERMER' : 'MENU'}</button>}
    </div>
  )
}
