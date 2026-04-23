import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Notification } from './components/Notification'
import { Dashboard } from './pages/Dashboard'
import { ProjectDetails } from './pages/ProjectDetails'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import './index.css'

// Layout for authenticated pages
function AppContent() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <main className="flex-1 mt-20 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <Notification />
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('token')))

    window.addEventListener('auth-change', syncAuth)
    window.addEventListener('storage', syncAuth)

    return () => {
      window.removeEventListener('auth-change', syncAuth)
      window.removeEventListener('storage', syncAuth)
    }
  }, [])

  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route
            path="/*"
            element={isAuthenticated ? <AppContent /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </AppProvider>
    </Router>
  )
}

export default App
