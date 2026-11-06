import { Navigate, Route, Routes } from 'react-router-dom'
import CabinetLanding from './components/landing/CabinetLanding'
import AppShell from './components/app/AppShell'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CabinetLanding />} />
      <Route path="/app" element={<Navigate to="/app/accueil" replace />} />
      <Route path="/app/:section" element={<AppShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
