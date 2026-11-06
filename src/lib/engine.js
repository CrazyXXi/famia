import { KB, FALLBACK, WHERE, SAFE_REFUSAL } from '../data/kb'
import { KB_EN, FALLBACK_EN, WHERE_EN, SAFE_REFUSAL_EN } from '../data/kb.en'
import { anonymize, isDangerousRequest, isSafeOutput, norm } from './guard'

/** Trouve le thème le plus pertinent (score = longueur cumulée des mots-clés trouvés). */
export function matchTopic(q) {
  const t = norm(q)
  let best = null
  let score = 0
  for (const e of KB) {
    let s = 0
    for (const k of e.k) if (t.includes(norm(k))) s += k.length
    for (const k of KB_EN[e.id]?.k || []) if (t.includes(norm(k))) s += k.length
    if (s > score) {
      score = s
      best = e
    }
  }
  return best
}

/**
 * Pipeline complet : anonymisation → contrôle de la requête → réponse → contrôle de sortie.
 * Retourne { clean, reply, logs } — pure, sans effet de bord.
 */
export function respond(question, lang = 'fr-FR') {
  const en = lang.startsWith('en')
  const logs = []
  const { text: clean, count } = anonymize(question)
  logs.push(count ? `identité : ${count} élément(s) masqué(s) avant traitement` : 'identité : rien à masquer')

  if (isDangerousRequest(clean)) {
    logs.push('requête à risque : réponse sécurisée + orientation')
    return { clean, reply: en ? SAFE_REFUSAL_EN : SAFE_REFUSAL, logs, lang: en ? 'en-US' : 'fr-FR' }
  }

  const topic = matchTopic(clean)
  logs.push(topic ? `thème détecté : ${topic.id}` : 'thème : aucun (réponse neutre)')
  const draft = en ? (topic ? KB_EN[topic.id]?.a || topic.a : FALLBACK_EN) : topic ? topic.a : FALLBACK

  if (!isSafeOutput(draft)) {
    logs.push('sortie : BLOQUÉE')
    return { clean, reply: en ? `I'd rather not answer that myself. ${WHERE_EN}` : `Je préfère ne pas répondre à ça moi-même. ${WHERE}`, logs, lang: en ? 'en-US' : 'fr-FR' }
  }
  logs.push('sortie : vérifiée (aucune recette ni dosage)')
  return { clean, reply: draft, logs, lang: en && topic ? 'en-US' : en ? 'en-US' : 'fr-FR' }
}
