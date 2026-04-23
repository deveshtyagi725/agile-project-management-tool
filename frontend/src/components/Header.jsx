import React, { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Bell, Search, ChevronDown, User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { clearAuthSession } from '../services/api'

export const Header = () => {
  const { darkMode, toggleDarkMode } = useApp()
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="ml-64 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm fixed top-0 right-0 left-64 z-40"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-600 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search projects, tasks, team members..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>

          {/* Profile Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Profile Dropdown */}
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-200 dark:border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
