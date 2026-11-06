import { SAFE_REFUSAL } from '../src/data/kb'
import { SAFE_REFUSAL_EN } from '../src/data/kb.en'
import { anonymize, isDangerousRequest, isSafeOutput } from '../src/lib/guard'
import { respond as localRespond } from '../src/lib/engine'
import { SYSTEM_PROMPT, languageInstruction } from './prompt'

export const MODEL = process.env.FAMIA_MODEL || 'claude-opus-5-5'
const MAX_TURNS = 12
const MAX_CHARS = 1000

/** Nettoie l'historique reçu : rôles valides, tailles bornées, anonymisation, 1er message = user. */
export function sanitizeHistory(messages) {
  if (!Array.isArray(messages)) throw new Error('messages must be an array')
  let masked = 0
  const out = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => {
      const content = m.content.trim().slice(0, MAX_CHARS)
      if (m.role === 'user') {
        const a = anonymize(content)
        masked += a.count
        return { role: 'user', content: a.text }
      }
      return { role: 'assistant', content }
    })
  while (out.length && out[0].role !== 'user') out.shift()
  if (!out.length || out[out.length - 1].role !== 'user') throw new Error('last message must be from the user')
  return { history: out, masked }
}

function localAnswer(question, logs, why, lang) {
  const r = localRespond(question, lang)
  logs.push(`repli sur la base locale (${why})`)
  return { reply: r.reply, source: 'local', logs, lang: r.lang }
}

/**
 * Pipeline HealthyGuard côté serveur autour du modèle.
 * `deps.client` : instance du SDK Anthropic (injectable pour les tests).
 * Ne journalise jamais le contenu des messages.
 */
export async function handleChat({ messages, lang }, deps) {
  const logs = []
  const { history, masked } = sanitizeHistory(messages)
  logs.push(masked ? `serveur : ${masked} élément(s) d'identité masqué(s)` : 'serveur : aucune identité détectée')
  const last = history[history.length - 1].content

  if (isDangerousRequest(last)) {
    logs.push('requête à risque : modèle non appelé, réponse sécurisée')
    return { reply: (lang || '').startsWith('en') ? SAFE_REFUSAL_EN : SAFE_REFUSAL, source: 'guard', logs }
  }

  let text = ''
  try {
    const params = {
      model: deps.model || MODEL,
      max_tokens: 4096, // la réflexion compte dans max_tokens
      system: `${SYSTEM_PROMPT}

${languageInstruction(lang)}`,
      output_config: { effort: 'low' },
      messages: history,
    }
    if (!process.env.FAMIA_DISABLE_FALLBACK) {
      params.betas = ['server-side-fallback-2026-07-01']
      params.fallbacks = 'default'
    }
    const res = await deps.client.beta.messages.create(params)
    if (res.stop_reason === 'refusal') return localAnswer(last, logs, 'refus du modèle', lang)
    text = res.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()
    logs.push(`modèle : ${res.model || params.model}`)
  } catch (e) {
    return localAnswer(last, logs, `modèle indisponible : ${e?.status || e?.name || 'erreur'}`, lang)
  }

  if (!text) return localAnswer(last, logs, 'réponse vide', lang)
  if (!isSafeOutput(text)) {
    logs.push('sortie : BLOQUÉE par HealthyGuard')
    return localAnswer(last, logs, 'sortie non conforme', lang)
  }
  logs.push('sortie : vérifiée (aucune recette ni dosage)')
  return { reply: text, source: 'ai', logs }
}
