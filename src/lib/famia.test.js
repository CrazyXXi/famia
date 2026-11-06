import { describe, it, expect } from 'vitest'
import { anonymize, isDangerousRequest, isSafeOutput } from './guard'
import { respond } from './engine'
import { distanceKm, nearest } from './geo'
import { CENTRES, CITIES, centreById } from '../data/centres'
import { award, levelOf, EMPTY } from './game'

describe('HealthyGuard', () => {
  it('masque numéros, e-mails et noms', () => {
    const { text, count } = anonymize("Je m'appelle Awa Diallo, appelle-moi au +229 97 12 34 56 ou awa@mail.com")
    expect(text).not.toMatch(/Diallo|97 12|awa@/)
    expect(count).toBe(3)
  })
  it('bloque les recettes abortives', () => {
    expect(isDangerousRequest('quelle tisane pour faire passer la grossesse ?')).toBe(true)
    expect(isDangerousRequest('comment fonctionne le préservatif ?')).toBe(false)
  })
  it('refuse les sorties avec dosage', () => {
    expect(isSafeOutput('prends 4 comprimés')).toBe(false)
    expect(isSafeOutput('consulte un centre de santé')).toBe(true)
  })
})

describe('Chatbot en anglais', () => {
  it('répond en anglais quand la langue choisie est English', () => {
    const r = respond('What contraception methods exist?', 'en-US')
    expect(r.reply).toMatch(/condoms/)
    expect(r.lang).toBe('en-US')
  })
  it('détecte le thème avec des mots anglais', () => {
    expect(respond('Does contraception make you gain weight?', 'en-US').reply).toMatch(/weight/)
  })
  it('refuse aussi en anglais une recette dangereuse', () => {
    expect(respond('what herbs can I drink to end a pregnancy at home', 'en-US').reply).toMatch(/health centre/)
  })
  it('reste en français par défaut', () => {
    expect(respond('Quelles méthodes de contraception ?').reply).toMatch(/préservatif/)
  })
})

describe('Chatbot', () => {
  it('répond sur la contraception', () => {
    expect(respond('Quelles méthodes de contraception ?').reply).toMatch(/préservatif/)
  })
  it("n'expose jamais l'identité dans le texte nettoyé", () => {
    expect(respond('mon numéro est 0612345678').clean).toMatch(/masqué/)
  })
  it('refuse une recette dangereuse avec orientation', () => {
    expect(respond('quelle plante boire pour provoquer la grossesse a partir').reply).toMatch(/centre de santé/)
  })
})

describe('Centres de santé', () => {
  it('contient de vrais centres du Bénin', () => {
    expect(CENTRES.length).toBeGreaterThan(300)
    expect(centreById(CENTRES[0].id).name).toBe(CENTRES[0].name)
  })
  it('calcule des distances plausibles (Cotonou → Porto-Novo ≈ 30 km)', () => {
    const d = distanceKm(CITIES[0], CITIES[2])
    expect(d).toBeGreaterThan(25)
    expect(d).toBeLessThan(40)
  })
  it('trie les centres du plus proche au plus lointain', () => {
    const r = nearest(CENTRES, CITIES[0], { limit: 10 })
    expect(r).toHaveLength(10)
    for (let i = 1; i < r.length; i++) expect(r[i].km).toBeGreaterThanOrEqual(r[i - 1].km)
    expect(r[0].km).toBeLessThan(5)
  })
  it('filtre par type', () => {
    expect(nearest(CENTRES, CITIES[0], { limit: 20, types: ['hôpital'] }).every((c) => c.type === 'hôpital')).toBe(true)
  })
})

describe('Partie ludique', () => {
  it('calcule le niveau et la progression', () => {
    expect(levelOf(0).name).toBe('Curieux·se')
    expect(levelOf(60).name).toBe('Éclairé·e')
    expect(levelOf(30).pct).toBe(50)
    expect(levelOf(999).next).toBeNull()
  })
  it('donne points et badges sans doublon, et signale le changement de niveau', () => {
    let r = award(EMPTY, 40, ['first'])
    expect(r.state.xp).toBe(40)
    r = award(r.state, 30, ['first', 'rumeurs'])
    expect(r.state.badges).toEqual(['first', 'rumeurs'])
    expect(r.gained.badges).toEqual(['rumeurs'])
    expect(r.gained.levelUp).toBe('Éclairé·e')
  })
})
