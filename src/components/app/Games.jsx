import { useMemo, useRef, useState } from 'react'
import { CARDS } from '../../data/cards'
import { QCM, SCENARIOS } from '../../data/game'
import { BADGES, levelOf } from '../../lib/game'
import { useGame } from '../../context/GameContext'

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

/** Écran de fin commun : points gagnés, badge éventuel, boutons. */
function Finish({ title, text, onAgain, onBack }) {
  return (
    <div className="game-end">
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="row">
        <button className="btn" onClick={onAgain}>Rejouer</button>
        <button className="btn ghosty" onClick={onBack}>Retour aux jeux</button>
      </div>
    </div>
  )
}
const Progress = ({ i, n }) => (
  <div className="gprog"><span style={{ width: `${(Math.min(i, n) / n) * 100}%` }} /></div>
)

/** Jeu 1 : vrai ou faux, cartes à glisser. +5 points par bonne réponse. */
export function VraiFaux({ onBack }) {
  const { award, mark } = useGame()
  const [seed, setSeed] = useState(0)
  const deck = useMemo(() => shuffle(CARDS).slice(0, 8), [seed]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(0)
  const [res, setRes] = useState(null)
  const [dx, setDx] = useState(0)
  const [fly, setFly] = useState(0)
  const start = useRef(null)
  const done = i >= deck.length

  const answer = (v) => {
    const [, truth, why] = deck[i]
    setFly(v ? 1 : -1)
    setTimeout(() => {
      const good = v === truth
      if (good) setOk((n) => n + 1)
      setRes({ good, truth, why })
      setFly(0); setDx(0)
    }, 220)
  }
  const next = () => {
    const last = i + 1 >= deck.length
    setRes(null); setI((n) => n + 1)
    if (last) {
      mark('played')
      award(ok * 5 + 5, ['first', ...(ok >= 5 ? ['rumeurs'] : [])])
    }
  }
  const down = (e) => { start.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId) }
  const move = (e) => { if (start.current !== null) setDx(e.clientX - start.current) }
  const up = () => { if (start.current === null) return; start.current = null; if (Math.abs(dx) > 80) answer(dx > 0); else setDx(0) }
  const tx = fly ? fly * 520 : dx
  const stamp = Math.min(1, Math.abs(dx) / 80)

  return (
    <div className="game">
      <button className="back" onClick={onBack}>← Retour aux jeux</button>
      <h2>Vrai ou faux</h2>
      <p className="lead">Fais glisser la carte vers la droite si c’est vrai, vers la gauche si c’est faux. Chaque bonne réponse te rapporte 5 points.</p>
      <Progress i={i} n={deck.length} />
      {done ? (
        <Finish title={`${ok} sur ${deck.length}`} text={ok >= 5 ? 'Bravo, tu démontes les rumeurs comme un·e pro !' : 'Pas mal ! Chaque rumeur démontée aide quelqu’un. Rejoue pour progresser.'}
          onAgain={() => { setSeed((s) => s + 1); setI(0); setOk(0); setRes(null) }} onBack={onBack} />
      ) : (
        <>
          <div className="deck-lg">
            {res ? (
              <div className={`qcard res ${res.good ? 'good' : 'bad'}`}><b>{res.good ? 'Bien vu' : 'Pas tout à fait'}</b><p><strong>{res.truth ? 'C’est vrai.' : 'C’est faux.'}</strong> {res.why}</p></div>
            ) : (
              <div className="qcard" onPointerDown={down} onPointerMove={move} onPointerUp={up}
                style={{ transform: `translateX(${tx}px) rotate(${tx / 26}deg)`, transition: start.current === null ? 'transform .22s ease' : 'none' }}>
                <span className="stamp v" style={{ opacity: dx > 0 ? stamp : 0 }}>Vrai</span>
                <span className="stamp f" style={{ opacity: dx < 0 ? stamp : 0 }}>Faux</span>
                <small>Carte {i + 1} sur {deck.length}</small>
                <p>{deck[i][0]}</p>
              </div>
            )}
          </div>
          <div className="row center">
            {res ? <button className="btn" onClick={next}>{i + 1 >= deck.length ? 'Voir mon score' : 'Carte suivante'}</button>
              : <><button className="btn ghosty" onClick={() => answer(false)}>← Faux</button><button className="btn ghosty" onClick={() => answer(true)}>Vrai →</button></>}
          </div>
        </>
      )}
    </div>
  )
}

/** Jeu 2 : quiz à choix. +8 points par bonne réponse. */
export function Qcm({ onBack }) {
  const { award, mark } = useGame()
  const [seed, setSeed] = useState(0)
  const qs = useMemo(() => shuffle(QCM).slice(0, 6), [seed]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(0)
  const [pick, setPick] = useState(null)
  const done = i >= qs.length
  const [q, opts, good, why] = qs[Math.min(i, qs.length - 1)]

  const choose = (k) => { if (pick === null) { setPick(k); if (k === good) setOk((n) => n + 1) } }
  const next = () => {
    const last = i + 1 >= qs.length
    setPick(null); setI((n) => n + 1)
    if (last) { mark('played'); award(ok * 8 + 5, ['first', ...(ok >= 5 ? ['expert'] : [])]) }
  }

  return (
    <div className="game">
      <button className="back" onClick={onBack}>← Retour aux jeux</button>
      <h2>Quiz éclair</h2>
      <p className="lead">6 questions, une seule bonne réponse. Chaque bonne réponse te rapporte 8 points.</p>
      <Progress i={i} n={qs.length} />
      {done ? (
        <Finish title={`${ok} sur ${qs.length}`} text={ok >= 5 ? 'Impressionnant, tu es incollable !' : 'Bien joué ! Rejoue pour décrocher le badge.'}
          onAgain={() => { setSeed((s) => s + 1); setI(0); setOk(0); setPick(null) }} onBack={onBack} />
      ) : (
        <div className="qa">
          <p className="q">{q}</p>
          <div className="opts">
            {opts.map((o, k) => (
              <button key={o} onClick={() => choose(k)} disabled={pick !== null && pick !== k && k !== good}
                className={`opt${pick !== null ? (k === good ? ' right' : k === pick ? ' wrong' : '') : ''}`}>{o}</button>
            ))}
          </div>
          {pick !== null && (
            <div className={`why ${pick === good ? 'good' : 'bad'}`}>
              <b>{pick === good ? 'Bonne réponse' : 'Pas tout à fait'}</b>
              <p>{why}</p>
              <button className="btn" onClick={next}>{i + 1 >= qs.length ? 'Voir mon score' : 'Question suivante'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Jeu 3 : « Le bon choix », mises en situation. Jusqu'à 10 points par situation. */
export function Scenarios({ onBack }) {
  const { award, mark } = useGame()
  const [seed, setSeed] = useState(0)
  const list = useMemo(() => shuffle(SCENARIOS).slice(0, 4), [seed]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [pts, setPts] = useState(0)
  const [pick, setPick] = useState(null)
  const done = i >= list.length
  const [sit, choices] = list[Math.min(i, list.length - 1)]

  const choose = (k) => { if (pick === null) { setPick(k); setPts((p) => p + choices[k][1]) } }
  const next = () => {
    const last = i + 1 >= list.length
    setPick(null); setI((n) => n + 1)
    if (last) { mark('played'); award(pts * 5 + 5, ['first', ...(pts >= 7 ? ['reflexe'] : [])]) }
  }

  return (
    <div className="game">
      <button className="back" onClick={onBack}>← Retour aux jeux</button>
      <h2>Le bon choix</h2>
      <p className="lead">Des situations de la vie de tous les jours. Il n’y a pas de piège : choisis ce que tu ferais, on t’explique ensuite.</p>
      <Progress i={i} n={list.length} />
      {done ? (
        <Finish title={pts >= 7 ? 'Bons réflexes !' : 'Bien joué !'} text={`Tu as marqué ${pts} sur ${list.length * 2}. ${pts >= 7 ? 'Tu sais comment réagir.' : 'Rejoue pour découvrir les autres réactions.'}`}
          onAgain={() => { setSeed((s) => s + 1); setI(0); setPts(0); setPick(null) }} onBack={onBack} />
      ) : (
        <div className="qa">
          <p className="q sit">{sit}</p>
          <div className="opts">
            {choices.map(([label, p], k) => (
              <button key={label} onClick={() => choose(k)} disabled={pick !== null && pick !== k}
                className={`opt${pick === k ? (p === 2 ? ' right' : p === 1 ? ' mid' : ' wrong') : ''}`}>{label}</button>
            ))}
          </div>
          {pick !== null && (
            <div className={`why ${choices[pick][1] === 2 ? 'good' : 'bad'}`}>
              <b>{choices[pick][1] === 2 ? 'Excellent choix' : choices[pick][1] === 1 ? 'Pas mal' : 'À revoir'}</b>
              <p>{choices[pick][2]}</p>
              <button className="btn" onClick={next}>{i + 1 >= list.length ? 'Voir mon résultat' : 'Situation suivante'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Niveau, barre de points et badges. */
export function LevelCard() {
  const { xp, badges } = useGame()
  const lv = levelOf(xp)
  return (
    <div className="levelcard">
      <div className="lv-top"><span className="lv-name">{lv.name}</span><span className="lv-xp">{xp} points</span></div>
      <div className="gprog big"><span style={{ width: `${lv.pct}%` }} /></div>
      <p className="lv-next">{lv.next ? `Encore ${lv.xpNeeded - lv.xpInLevel} points pour devenir ${lv.next}` : 'Niveau maximum atteint, bravo !'}</p>
      <ul className="badges">
        {BADGES.map((b) => <li key={b.id} className={badges.includes(b.id) ? 'got' : ''} title={b.desc}><b>{b.name}</b><small>{b.desc}</small></li>)}
      </ul>
    </div>
  )
}

/** Page « Jouer » : choix du jeu, niveau et badges. */
export default function JouerPage() {
  const [game, setGame] = useState(null)
  if (game === 'vf') return <VraiFaux onBack={() => setGame(null)} />
  if (game === 'qcm') return <Qcm onBack={() => setGame(null)} />
  if (game === 'sc') return <Scenarios onBack={() => setGame(null)} />
  return (
    <div className="game">
      <p className="eyebrow">Jouer</p>
      <h2>Apprendre en s’amusant</h2>
      <p className="lead">Trois jeux pour tester ce que tu sais, démonter les rumeurs et savoir comment réagir. Tout est anonyme : tes points restent sur cet appareil.</p>
      <div className="games">
        <button className="gcard" onClick={() => setGame('vf')}><i>01</i><b>Vrai ou faux</b><p>Fais glisser des cartes pour démonter les rumeurs.</p><small>8 cartes · 5 points chacune</small></button>
        <button className="gcard" onClick={() => setGame('qcm')}><i>02</i><b>Quiz éclair</b><p>6 questions pour tester tes connaissances.</p><small>6 questions · 8 points chacune</small></button>
        <button className="gcard" onClick={() => setGame('sc')}><i>03</i><b>Le bon choix</b><p>Que ferais-tu ? Des situations de la vie de tous les jours.</p><small>4 situations · jusqu’à 10 points</small></button>
      </div>
      <h3 className="h3">Ton niveau</h3>
      <LevelCard />
    </div>
  )
}
