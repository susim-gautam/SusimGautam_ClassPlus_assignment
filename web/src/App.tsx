import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppProvider'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { HomePage } from './pages/HomePage'

export default function App() {
  const { bootstrapping } = useApp()

  if (bootstrapping) {
    return (
      <div className="page">
        <p className="page__lead">Loading session…</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
