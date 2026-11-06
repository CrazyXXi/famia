import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { award as awardPure, EMPTY, load, save } from '../lib/game'

const GameContext = createContext(null)

/** Progression partagée par tout le parcours : points, niveau, badges, étapes franchies. */
export function GameProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)
  const ref = useRef(state)
  ref.current = state

  const commit = (next) => { ref.current = next; save(next); setState(next) }

  const award = useCallback((xp = 0, badges = []) => {
    const r = awardPure(ref.current, xp, badges)
    commit(r.state)
    if (r.gained.xp || r.gained.badges.length) {
      const t = Date.now()
      setToast({ ...r.gained, t })
      setTimeout(() => setToast((cur) => (cur && cur.t === t ? null : cur)), 3800)
    }
    return r.gained
  }, [])

  const mark = useCallback((flag) => {
    if (ref.current.progress[flag]) return
    commit({ ...ref.current, progress: { ...ref.current.progress, [flag]: true } })
  }, [])

  const reset = useCallback(() => commit(EMPTY), [])

  const value = useMemo(() => ({ ...state, award, mark, reset, toast }), [state, award, mark, reset, toast])
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = () => useContext(GameContext)
