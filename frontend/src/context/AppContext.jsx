import React, { createContext, useState, useCallback, useEffect } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [userStories, setUserStories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [warning, setWarning] = useState(null)
  const [info, setInfo] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
    setWarning(null)
    setInfo(null)
  }, [])

  const showError = useCallback((message) => {
    setError(message)
    setTimeout(() => setError(null), 4000)
  }, [])

  const showSuccess = useCallback((message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 4000)
  }, [])

  const showWarning = useCallback((message) => {
    setWarning(message)
    setTimeout(() => setWarning(null), 4000)
  }, [])

  const showInfo = useCallback((message) => {
    setInfo(message)
    setTimeout(() => setInfo(null), 4000)
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev)
  }, [])

  const value = {
    // Projects
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    
    // User Stories
    userStories,
    setUserStories,
    
    // Tasks
    tasks,
    setTasks,
    
    // UI States
    loading,
    setLoading,
    error,
    showError,
    success,
    showSuccess,
    warning,
    showWarning,
    info,
    showInfo,
    clearMessages,
    
    // Dark Mode
    darkMode,
    toggleDarkMode,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
