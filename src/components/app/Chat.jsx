import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { matchTopic, respond } from '../../lib/engine'
import { anonymize } from '../../lib/guard'
import { askAI } from '../../lib/api'
import { SUGGESTIONS } from '../../data/features'
import { LANGS, langName, useSpeech } from '../../lib/useSpeech'
import { useGuard } from '../../context/GuardContext'
import { useGame } from '../../context/GameContext'

const FOOT = {
  ai: 'Réponse de l’IA · infos générales, pas un avis médical',
  local: 'Base locale (IA indisponible) · pas un avis médical',
  guard: 'Réponse sécurisée · jamais de méthode dangereuse',
}
const FOOT_EN = {
  ai: 'AI answer · general information, not medical advice',
  local: 'Local answer (AI unavailable) · not medical advice',
  guard: 'Safe answer · I never give dangerous methods',
}
const FOLLOW = {
  contra: ['Quels effets secondaires ?', 'Comment choisir une méthode ?'],
  urgence: ['Où l’obtenir près de chez moi ?', 'Est-ce dangereux ?'],
  pregnancy: ['Quand faire un test de grossesse ?', 'Comment suivre ma grossesse ?'],
  espace: ['Quelle méthode après une naissance ?', 'Et pendant l’allaitement ?'],
  ist: ['Comment me protéger ?', 'Le dépistage est-il confidentiel ?'],
  body: ['Comment calculer mon cycle ?', 'Quand consulter pour mes règles ?'],
  myths: ['Peux-tu me donner d’autres rumeurs ?', 'La contraception rend-elle stérile ?'],
  garcons: ['Comment parler de contraception à mon partenaire ?', 'Quel est le rôle d’un garçon ?'],
}
const FOLLOW_DEFAULT = ['Où trouver un centre de santé ?', 'Comment en parler à mon partenaire ?']

export const Orb = ({ size = 72 }) => <span className="orb" style={{ width: size, height: size }} aria-hidden="true" />

/** Carte de suggestion qui s'incline vers le curseur. */
function Tilt({ n, label, q, onPick, disabled }) {
  const ref = useRef(null)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(1)}deg) rotateY(${(x * 9).toFixed(1)}deg) translateY(-3px)`
  }
  return (
    <button ref={ref} className="tilt" onMouseMove={move} onMouseLeave={() => { ref.current.style.transform = '' }} onClick={onPick} disabled={disabled}>
      <i>{n}</i><b>{label}</b><span>{q}</span>
    </button>
  )
}

/** Section « Discuter » : uniquement la conversation, claire et aérée. */
export default function Chat({ active }) {
  const { log, epoch } = useGuard()
  const { mark } = useGame()
  const [params, setParams] = useSearchParams()
  const [lang, setLang] = useState('fr-FR')
  const [readAloud, setReadAloud] = useState(false) // la voix ne parle JAMAIS sans demande explicite
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [voiceNote, setVoiceNote] = useState('')
  const endRef = useRef(null)
  const taRef = useRef(null)
  const orbRef = useRef(null)
  const abortRef = useRef(null)
  const uid = useRef(0)
  const speech = useSpeech(lang)
  const started = msgs.length > 0

  useEffect(() => {
    abortRef.current?.abort()
    setMsgs([]); setInput(''); setBusy(false); setVoiceNote(''); speech.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }) }, [msgs, busy])
  useEffect(() => { if (!active) speech.stop() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [active])
  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [input, active])
  useEffect(() => {
    const onMove = (e) => {
      if (!orbRef.current) return
      orbRef.current.style.setProperty('--ox', `${((e.clientX / innerWidth - 0.5) * 18).toFixed(1)}px`)
      orbRef.current.style.setProperty('--oy', `${((e.clientY / innerHeight - 0.5) * 12).toFixed(1)}px`)
    }
    addEventListener('pointermove', onMove)
    return () => removeEventListener('pointermove', onMove)
  }, [])

  // question venue de l'accueil : /app/discuter?q=...
  const asked = useRef(null)
  useEffect(() => {
    const q = params.get('q')
    if (active && q && asked.current !== q) {
      asked.current = q
      setParams({}, { replace: true })
      send(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, params])

  function say(text, textLang) {
    if (speech.speak(text, textLang)) return setVoiceNote('')
    setVoiceNote(`Aucune voix « ${langName(textLang)} » n’est installée sur cet appareil : la réponse reste écrite.`)
  }

  async function send(question) {
    const q = question.trim()
    if (!q || busy) return
    const { text: clean, count } = anonymize(q)
    log(count ? `identité : ${count} élément(s) masqué(s) avant envoi` : 'identité : rien à masquer')
    const topic = matchTopic(clean)?.id
    const next = [...msgs, { id: ++uid.current, who: 'u', text: clean }]
    setMsgs(next)
    setInput('')
    setBusy(true)
    mark('asked')
    const history = next.map((m) => ({ role: m.who === 'u' ? 'user' : 'assistant', content: m.text }))
    const ctrl = new AbortController()
    abortRef.current = ctrl
    let result
    try {
      result = await askAI(history, lang, ctrl.signal)
    } catch {
      if (ctrl.signal.aborted) return
      const r = respond(clean, lang)
      log('serveur IA injoignable : repli sur la base locale', ...r.logs.slice(1))
      result = { reply: r.reply, source: 'local', logs: [], lang: r.lang }
    }
    log(...(result.logs || []))
    // la base locale existe en français et en anglais ; pour les autres langues, seule l'IA peut répondre
    const textLang = result.source === 'ai' ? lang : result.lang || 'fr-FR'
    const unsupported = result.source !== 'ai' && textLang !== lang
    const foot = unsupported ? `${FOOT.local} · en français seulement : pour répondre en ${langName(lang)}, l’IA doit être activée` : (textLang.startsWith('en') ? FOOT_EN : FOOT)[result.source]
    setMsgs((m) => [...m, { id: ++uid.current, who: 'b', text: result.reply, lang: textLang, foot, follow: FOLLOW[topic] || FOLLOW_DEFAULT }])
    setBusy(false)
    if (readAloud) say(result.reply, textLang)
  }

  function onMic() {
    if (!speech.listen(send)) setVoiceNote(`La dictée vocale n’est pas disponible en ${langName(lang)} sur ce navigateur (essaie Chrome). Tu peux écrire ta question.`)
  }
  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }
  const lastBot = msgs.map((m) => m.who).lastIndexOf('b')

  return (
    <div className={`chatpane${started ? ' started' : ''}`}>
      <header className="chat-head">
        <span className="eyebrow">Discuter</span>
        <div className="tools">
          <label className="tool">
            <span>Langue</span>
            <select value={lang} onChange={(e) => { setLang(e.target.value); setVoiceNote(''); speech.stop() }} aria-label="Langue des réponses et de la voix">
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </label>
          <label className="tool check">
            <input type="checkbox" checked={readAloud} onChange={(e) => { setReadAloud(e.target.checked); if (!e.target.checked) speech.stop() }} />
            <span>Lire à voix haute</span>
          </label>
        </div>
      </header>

      <div className="thread" aria-live="polite">
        {!started && (
          <div className="welcome">
            <span ref={orbRef} className="orbwrap"><Orb size={96} /></span>
            <h1>Bonjour, je suis <em>FamIA</em></h1>
            <p>Pose-moi n’importe quelle question sur ton corps, la contraception ou la grossesse. Personne ne saura qui tu es.</p>
            <div className="suggest">
              {SUGGESTIONS.map((s, i) => <Tilt key={s.label} n={String(i + 1).padStart(2, '0')} label={s.label} q={s.q} disabled={busy} onPick={() => send(s.q)} />)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={m.id} className={`msg ${m.who}`}>
            {m.who === 'b' && <Orb size={30} />}
            <div className="body">
              <div className="bubble">{m.text}</div>
              {m.who === 'b' && (
                <div className="acts">
                  {m.foot && <small>{m.foot}</small>}
                  <div className="cardrow">
                    <button onClick={() => say(m.text, m.lang || lang)}>Écouter</button>
                    <Link to="/app/centres">Trouver un centre</Link>
                    <Link to="/app/rendez-vous">Prendre rendez-vous</Link>
                    <Link to="/app/jouer">Me tester</Link>
                  </div>
                  {i === lastBot && m.follow?.length > 0 && (
                    <div className="follow">{m.follow.map((f) => <button key={f} onClick={() => send(f)} disabled={busy}>{f}</button>)}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="msg b"><Orb size={30} /><div className="body"><div className="bubble dots" aria-label="FamIA écrit"><i /><i /><i /></div></div></div>}
        <div ref={endRef} className="end" />
      </div>

      {voiceNote && <p className="voicenote" role="status">{voiceNote}</p>}
      <div className="composer-wrap">
        <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input) }}>
          <textarea ref={taRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} placeholder="Écris ta question…" aria-label="Ta question" />
          <button type="button" className={`round mic${speech.listening ? ' rec' : ''}`} onClick={onMic} aria-label="Parler">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 18v3" /></svg>
          </button>
          <button className="round send" aria-label="Envoyer" disabled={busy || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        </form>
        <p className="fine">Anonyme · rien n’est conservé · informations générales, pas un avis médical</p>
      </div>
    </div>
  )
}
