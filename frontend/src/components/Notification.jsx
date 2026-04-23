import React from 'react'
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../hooks/useApp'

export const Notification = () => {
  const { error, success, clearMessages, warning, info } = useApp()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 shadow-lg pointer-events-auto max-w-md"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300">Error</p>
              <p className="text-sm text-red-800 dark:text-red-400 mt-0.5">{error}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearMessages}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3 shadow-lg pointer-events-auto max-w-md"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900 dark:text-green-300">Success</p>
              <p className="text-sm text-green-800 dark:text-green-400 mt-0.5">{success}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearMessages}
              className="text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3 shadow-lg pointer-events-auto max-w-md"
          >
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">Warning</p>
              <p className="text-sm text-yellow-800 dark:text-yellow-400 mt-0.5">{warning}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearMessages}
              className="text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {info && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3 shadow-lg pointer-events-auto max-w-md"
          >
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Info</p>
              <p className="text-sm text-blue-800 dark:text-blue-400 mt-0.5">{info}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearMessages}
              className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
