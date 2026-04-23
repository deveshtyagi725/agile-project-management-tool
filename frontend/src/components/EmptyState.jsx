import React from 'react'
import { motion } from 'framer-motion'
import { 
  Inbox, 
  FolderOpen, 
  ListTodo, 
  Archive, 
  Search,
  Plus,
  Lightbulb
} from 'lucide-react'

const iconMap = {
  projects: Inbox,
  stories: ListTodo,
  tasks: FolderOpen,
  search: Search,
  archived: Archive,
  default: Lightbulb,
}

export const EmptyState = ({ 
  icon = 'default',
  title = 'No data',
  description = 'Start by creating something new',
  action,
  actionLabel = 'Create new',
  size = 'md'
}) => {
  const Icon = iconMap[icon] || iconMap.default
  const sizeClasses = {
    sm: 'p-8',
    md: 'p-12',
    lg: 'p-16',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50`}
    >
      {/* Icon */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-4"
      >
        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </motion.div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export const EmptyGrid = ({ 
  icon = 'projects',
  title = 'No projects yet',
  description = 'Create your first project to get started',
  action,
  actionLabel = 'Create Project'
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center"
        >
          <div className={`w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-3 ${i === 2 ? 'ring-2 ring-blue-500' : ''}`}>
            {i === 2 && <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          </div>
          {i !== 2 && <p className="text-sm text-gray-500 dark:text-gray-400">{icon}</p>}
        </motion.div>
      ))}
    </div>
  )
}
