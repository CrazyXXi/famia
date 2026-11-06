// HealthyGuard — moteur de sécurité local (aucun appel réseau).

export const norm = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’]/g, "'")

/** Masque numéros, e-mails, noms et lieux. Retourne { text, count }. */
export function anonymize(input) {
  let count = 0
  const hit = (label) => () => (count++, label)
  const text = input
    .replace(/(\+?\d[\d\s().-]{7,}\d)/g, hit('[numéro masqué]'))
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, hit('[e-mail masqué]'))
    .replace(
      /(je m['’]?appelle|moi c['’]?est|mon nom est|my name is)\s+[\p{L}'-]+(\s+[\p{L}'-]+)?/giu,
      (_, lead) => (count++, `${lead} [nom masqué]`),
    )
    .replace(
      /(j['’]?habite (?:à|a|au|en)|je vis (?:à|a|au|en))\s+[\p{L}'-]+/giu,
      (_, lead) => (count++, `${lead} [lieu masqué]`),
    )
  return { text, count }
}

/** Détecte une demande de recette / méthode dangereuse (ex. avortement artisanal). */
export function isDangerousRequest(q) {
  const t = norm(q)
  return (
    (/(provoquer|faire passer|expulser|declencher|arreter).{0,25}(grossesse|bebe)/.test(t) &&
      /(plante|tisane|herbe|produit|melange|boire|comprime|medicament|recette|javel|alcool)/.test(t)) ||
    /(recette|dose|dosage|combien de comprimes).{0,30}(avort|grossesse|pilule)/.test(t) ||
    /(avorter|avortement).{0,20}(moi meme|maison|seule)/.test(t) ||
    (/(induce|terminate|end|stop|get rid of).{0,25}(pregnancy|baby)/.test(t) && /(herb|tea|plant|mix|bleach|pills|tablet|medicine|recipe|drink|home)/.test(t)) ||
    /(recipe|dose|dosage|how many (pills|tablets)).{0,30}(abort|pregnan)/.test(t) ||
    /(abort|abortion).{0,20}(myself|at home|by myself)/.test(t)
  )
}

const FORBIDDEN_OUTPUT =
  /\b(boire|avaler|ingérer|injecter)\b.{0,40}\b(javel|alcool|plante|mélange|tisane)\b|\b\d+\s?(mg|comprimés?|gouttes)\b/i

/** Vérifie une réponse avant affichage : jamais de recette ni de dosage. */
export function isSafeOutput(text) {
  return !FORBIDDEN_OUTPUT.test(text)
}
