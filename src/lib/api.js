/** Appelle le serveur FamIA (qui appelle Claude). Lève une erreur si indisponible. */
export async function askAI(messages, lang, signal) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, lang }),
    signal,
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() // { reply, source: 'ai'|'local'|'guard', logs }
}
