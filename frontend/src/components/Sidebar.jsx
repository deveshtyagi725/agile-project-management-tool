import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { clearAuthSession } from '../services/api'

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  const getUserInitials = () => {
    if (!user.name) return 'U'
    return user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 lg:hidden p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col shadow-lg dark:shadow-2xl z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform lg:transition-none`}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 border-b border-gray-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
        >
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-md"
            >
              <Briefcase className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Agile Pro
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Project Manager</p>
            </div>
          </NavLink>
        </motion.div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <NavLink
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                      : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>

        {/* User */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50"
        >
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md"
            >
              {getUserInitials()}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || ''}</p>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </>
  )
}
