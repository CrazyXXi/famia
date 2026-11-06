import { describe, it, expect, vi } from 'vitest'
import { handleChat, sanitizeHistory } from './chat'

const fakeClient = (impl) => ({ beta: { messages: { create: vi.fn(impl) } } })
const ok = (text) => async () => ({ stop_reason: 'end_turn', model: 'claude-opus-5-5', content: [{ type: 'text', text }] })
const user = (content) => ({ messages: [{ role: 'user', content }] })

describe('serveur : sanitizeHistory', () => {
  it("masque l'identité et garde un premier message user", () => {
    const { history, masked } = sanitizeHistory([
      { role: 'assistant', content: 'Bonjour' },
      { role: 'user', content: 'Appelle-moi au 0612345678' },
    ])
    expect(history[0].role).toBe('user')
    expect(history[0].content).not.toMatch(/0612345678/)
    expect(masked).toBe(1)
  })
  it('refuse un historique sans message utilisateur final', () => {
    expect(() => sanitizeHistory([{ role: 'assistant', content: 'x' }])).toThrow()
  })
})

describe('serveur : langue choisie', () => {
  it("demande à l'IA de répondre dans la langue sélectionnée", async () => {
    const client = fakeClient(ok('Eleyi ni ìdáhùn.'))
    await handleChat({ messages: [{ role: 'user', content: 'Quelles méthodes de contraception ?' }], lang: 'yo-NG' }, { client })
    const sys = client.beta.messages.create.mock.calls[0][0].system
    expect(sys).toMatch(/yoruba/)
    expect(sys).toMatch(/TOUJOURS dans cette langue/)
  })
  it('reste en français par défaut', async () => {
    const client = fakeClient(ok('Bonjour'))
    await handleChat({ messages: [{ role: 'user', content: 'Salut' }] }, { client })
    expect(client.beta.messages.create.mock.calls[0][0].system).toMatch(/Réponds en français/)
  })
})

describe('serveur : handleChat', () => {
  it('renvoie la réponse du modèle quand elle est sûre', async () => {
    const client = fakeClient(ok('Le préservatif protège aussi des IST.'))
    const r = await handleChat(user('Parle-moi du préservatif'), { client })
    expect(r.source).toBe('ai')
    expect(client.beta.messages.create).toHaveBeenCalledOnce()
    const params = client.beta.messages.create.mock.calls[0][0]
    expect(params.model).toBe('claude-opus-5-5')
    expect(params.system).toMatch(/HealthyGuard/)
  })
  it("n'envoie jamais le numéro de téléphone au modèle", async () => {
    const client = fakeClient(ok('ok'))
    await handleChat(user('mon numéro est +229 97 12 34 56, je suis enceinte ?'), { client })
    const sent = JSON.stringify(client.beta.messages.create.mock.calls[0][0].messages)
    expect(sent).not.toMatch(/97 12 34/)
  })
  it('bloque une recette abortive sans appeler le modèle', async () => {
    const client = fakeClient(ok('jamais'))
    const r = await handleChat(user('quelle plante boire pour faire passer la grossesse'), { client })
    expect(r.source).toBe('guard')
    expect(client.beta.messages.create).not.toHaveBeenCalled()
  })
  it('remplace une sortie contenant un dosage par la base locale', async () => {
    const client = fakeClient(ok('Prends 4 comprimés ce soir.'))
    const r = await handleChat(user('contraception ?'), { client })
    expect(r.source).toBe('local')
    expect(r.reply).not.toMatch(/4 comprimés/)
  })
  it("se rabat sur la base locale si l'API échoue", async () => {
    const client = fakeClient(async () => {
      throw Object.assign(new Error('boom'), { status: 529 })
    })
    const r = await handleChat(user('Quelles méthodes de contraception ?'), { client })
    expect(r.source).toBe('local')
    expect(r.reply).toMatch(/préservatif/)
  })
  it('se rabat sur la base locale en cas de refus du modèle', async () => {
    const client = fakeClient(async () => ({ stop_reason: 'refusal', content: [] }))
    const r = await handleChat(user('IST ?'), { client })
    expect(r.source).toBe('local')
  })
})
