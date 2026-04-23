import React from 'react'
import { motion } from 'framer-motion'

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        {/* Title skeleton */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"
        />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"
          />
        </div>

        {/* Stats skeleton */}
        <div className="flex gap-4 pt-4">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="h-4 bg-gray-200 dark:bg-slate-700 rounded flex-1"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export const TaskCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
      <div className="space-y-3">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-4/5"
        />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
          className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full"
        />
        <div className="flex gap-2 pt-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-6 bg-gray-200 dark:bg-slate-700 rounded px-2 w-1/4"
          />
        </div>
      </div>
    </div>
  )
}

export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export const KanbanSkeleton = () => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {['Todo', 'In Progress', 'Done'].map((column, idx) => (
        <div key={column} className="flex-shrink-0 w-80">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
            className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"
          />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
