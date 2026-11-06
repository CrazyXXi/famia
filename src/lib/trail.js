// Traînée lumineuse douce qui suit le curseur (canvas 2D, aucune librairie).
export function startTrail(canvas) {
  const ctx = canvas.getContext('2d')
  let W = 0, H = 0
  const pts = []
  let stop = false
  const resize = () => {
    const dpr = Math.min(2, devicePixelRatio || 1)
    W = innerWidth; H = innerHeight
    canvas.width = W * dpr; canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  const onMove = (e) => {
    if (e.target.closest && e.target.closest('a,button')) return
    pts.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    if (pts.length > 60) pts.shift()
  }
  resize()
  addEventListener('resize', resize)
  addEventListener('pointermove', onMove)

  const LIFE = 900
  function frame(now) {
    if (stop) return
    requestAnimationFrame(frame)
    ctx.clearRect(0, 0, W, H)
    while (pts.length && now - pts[0].t > LIFE) pts.shift()
    if (pts.length < 2) return
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i]
      const k = 1 - (now - b.t) / LIFE // 1 = récent, 0 = ancien
      ctx.strokeStyle = `rgba(255,255,255,${0.8 * k})`
      ctx.lineWidth = 2 + 26 * k
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      ctx.strokeStyle = `rgba(240,110,160,${0.26 * k})`
      ctx.lineWidth = 6 + 46 * k
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
    }
  }
  requestAnimationFrame(frame)
  return {
    stop() {
      stop = true
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
    },
  }
}
