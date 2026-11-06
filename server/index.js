// Serveur FamIA : proxy sécurisé entre l'application et Claude.
// La clé API reste ici, jamais dans le navigateur. Lancement : npm run server
import http from 'node:http'
import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'

// Mini-chargeur .env (sans dépendance)
try {
  for (const line of fs.readFileSync(new URL('../.env', import.meta.url), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  /* pas de .env : on utilise les variables d'environnement */
}

const { handleChat, MODEL } = await import('./chat.js')

const PORT = Number(process.env.PORT || 8787)
const client = new Anthropic() // ANTHROPIC_API_KEY, ou profil `ant auth login`

// Limitation simple par IP (en mémoire, rien n'est persisté)
const hits = new Map()
const LIMIT = 30 // requêtes / minute
function limited(ip) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > LIMIT
}
setInterval(() => hits.clear(), 10 * 60000).unref()

function readJson(req, max = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > max) {
        reject(new Error('payload too large'))
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch (e) {
        reject(e)
      }
    })
  })
}

const send = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

http
  .createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/api/health') return send(res, 200, { ok: true, model: MODEL })
    if (req.method === 'POST' && req.url === '/api/chat') {
      if (limited(req.socket.remoteAddress)) return send(res, 429, { error: 'Trop de demandes, réessaie dans une minute.' })
      try {
        const body = await readJson(req)
        const out = await handleChat(body, { client })
        return send(res, 200, out)
      } catch (e) {
        return send(res, 400, { error: 'Requête invalide.' })
      }
    }
    send(res, 404, { error: 'Not found' })
  })
  .listen(PORT, () => console.log(`FamIA API sur http://localhost:${PORT} (modèle : ${MODEL})`))
