import { useCallback, useEffect, useRef, useState } from 'react'

// `voice` : code BCP-47 pour la voix du navigateur. Fon n'a pas de voix : l'IA l'écrit, mais personne ne le lit.
export const LANGS = [
  { code: 'fr-FR', label: 'Français', name: 'français' },
  { code: 'en-US', label: 'English', name: 'English' },
  { code: 'yo-NG', label: 'Yorùbá', name: 'yoruba' },
  { code: 'fon', label: 'Fɔ̀ngbè (fon)', name: 'fon', voice: null },
  { code: 'sw-KE', label: 'Kiswahili', name: 'kiswahili' },
  { code: 'ar-SA', label: 'العربية', name: 'arabe' },
]
export const langName = (code) => LANGS.find((l) => l.code === code)?.name || 'français'
const voiceCode = (code) => {
  const l = LANGS.find((x) => x.code === code)
  return l && 'voice' in l ? l.voice : code
}

/** Reconnaissance et synthèse vocales via le navigateur, dans la langue choisie. */
export function useSpeech(lang) {
  const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null
  const [listening, setListening] = useState(false)
  const [voices, setVoices] = useState([])
  const recRef = useRef(null)

  useEffect(() => {
    const s = typeof window !== 'undefined' ? window.speechSynthesis : null
    if (!s) return undefined
    const load = () => setVoices(s.getVoices())
    load()
    s.addEventListener?.('voiceschanged', load)
    return () => s.removeEventListener?.('voiceschanged', load)
  }, [])

  /** Voix installée pour cette langue (ex. « sw » pour sw-KE), ou null. */
  const voiceFor = useCallback(
    (code) => {
      const vc = voiceCode(code)
      if (!vc) return null
      const base = vc.slice(0, 2).toLowerCase()
      return voices.find((v) => v.lang.toLowerCase() === vc.toLowerCase()) || voices.find((v) => v.lang.toLowerCase().startsWith(base)) || null
    },
    [voices],
  )

  const listen = useCallback(
    (onText) => {
      const vc = voiceCode(lang)
      if (!SR || !vc) return false
      const r = new SR()
      r.lang = vc
      r.interimResults = false
      r.onresult = (e) => onText(e.results[0][0].transcript)
      r.onend = r.onerror = () => setListening(false)
      recRef.current = r
      try {
        r.start()
        setListening(true)
      } catch {
        setListening(false)
      }
      return true
    },
    [SR, lang],
  )

  /** Lit `text` dans `textLang`. Retourne false si aucune voix n'existe pour cette langue. */
  const speak = useCallback(
    (text, textLang = lang) => {
      try {
        if (!window.speechSynthesis) return false
        const v = voiceFor(textLang)
        if (!v) return false
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.voice = v
        u.lang = v.lang
        window.speechSynthesis.speak(u)
        return true
      } catch {
        return false
      }
    },
    [lang, voiceFor],
  )

  const stop = useCallback(() => {
    try {
      window.speechSynthesis?.cancel()
      recRef.current?.abort()
    } catch {
      /* noop */
    }
  }, [])

  return { supported: !!SR, listening, listen, speak, stop, hasVoice: (code) => !!voiceFor(code) }
}
