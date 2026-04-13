import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/Dashboard'

function DebugPage() {
  return (
    <div style={{ 
      backgroundColor: '#0D1117', 
      color: '#F0F6FC', 
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <h1>Debug Info</h1>
      <p>App is loading...</p>
      <p>Checking authentication state...</p>
    </div>
  )
}

function App() {
  const { isAuthenticated, restoreSession } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('App mounted, restoring session...')
    restoreSession()
    setMounted(true)
  }, [])

  console.log('App render, mounted:', mounted, 'isAuthenticated:', isAuthenticated)

  if (!mounted) {
    return <DebugPage />
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
