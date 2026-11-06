// Progression ludique, 100 % locale et anonyme (aucun compte, aucune donnée envoyée).
const KEY = 'famia.game'

export const LEVELS = [
  { min: 0, name: 'Curieux·se' },
  { min: 60, name: 'Éclairé·e' },
  { min: 150, name: 'Ambassadeur·rice' },
  { min: 260, name: 'Super-ambassadeur·rice' },
]

export const BADGES = [
  { id: 'first', name: 'Premier pas', desc: 'Tu as joué une première partie' },
  { id: 'rumeurs', name: 'Chasseur·se de rumeurs', desc: '5 bonnes réponses ou plus au vrai ou faux' },
  { id: 'expert', name: 'Tête bien faite', desc: '5 bonnes réponses ou plus au quiz' },
  { id: 'reflexe', name: 'Bons réflexes', desc: 'Tu as fait les bons choix dans les mises en situation' },
  { id: 'explorateur', name: 'Explorateur·rice', desc: 'Tu as cherché un centre de santé' },
  { id: 'pret', name: 'Prêt·e à agir', desc: 'Tu as pris un rendez-vous' },
]

export const EMPTY = { xp: 0, badges: [], progress: { asked: false, played: false, centres: false, rdv: false } }

/** Niveau, progression vers le suivant (0–100) et nom du prochain niveau. */
export function levelOf(xp) {
  let i = 0
  LEVELS.forEach((l, k) => { if (xp >= l.min) i = k })
  const cur = LEVELS[i]
  const next = LEVELS[i + 1] || null
  return {
    index: i,
    name: cur.name,
    next: next ? next.name : null,
    xpInLevel: xp - cur.min,
    xpNeeded: next ? next.min - cur.min : 0,
    pct: next ? Math.round(((xp - cur.min) / (next.min - cur.min)) * 100) : 100,
  }
}

export function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    return raw ? { ...EMPTY, ...raw, progress: { ...EMPTY.progress, ...(raw.progress || {}) } } : EMPTY
  } catch {
    return EMPTY
  }
}
export function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* stockage indisponible */ }
}

/** Ajoute des points et des badges (sans doublon). Retourne le nouvel état et ce qui vient d'être gagné. */
export function award(state, xp = 0, badgeIds = []) {
  const newBadges = badgeIds.filter((b) => !state.badges.includes(b))
  const before = levelOf(state.xp).index
  const next = { ...state, xp: state.xp + xp, badges: [...state.badges, ...newBadges] }
  const after = levelOf(next.xp).index
  return { state: next, gained: { xp, badges: newBadges, levelUp: after > before ? levelOf(next.xp).name : null } }
}
