import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const GuardContext = createContext(null)

/** Journal HealthyGuard partagé (en mémoire uniquement — rien n'est persisté). */
export function GuardProvider({ children }) {
  const [entries, setEntries] = useState(() => [{ t: new Date(), msg: 'moteur de sécurité démarré : traitement 100 % local' }])
  const [epoch, setEpoch] = useState(0) // incrémenté par « Tout effacer »

  const log = useCallback((...msgs) => {
    setEntries((e) => [...e, ...msgs.map((msg) => ({ t: new Date(), msg }))])
  }, [])

  const wipe = useCallback(() => {
    setEntries([{ t: new Date(), msg: 'Toutes les traces ont été effacées.' }])
    setEpoch((n) => n + 1)
  }, [])

  const value = useMemo(() => ({ entries, log, wipe, epoch }), [entries, log, wipe, epoch])
  return <GuardContext.Provider value={value}>{children}</GuardContext.Provider>
}

export const useGuard = () => useContext(GuardContext)
