import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import { KanbanTask } from './KanbanTask'

export const KanbanColumn = ({ column, tasks = [], onTaskStatusChange }) => {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div ref={setNodeRef} className={`${column.color} rounded-lg p-4 min-h-96 flex flex-col`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300">
            {column.count}
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto">
          <AnimatePresence>
            {tasks && tasks.length > 0 ? (
              tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <KanbanTask task={task} onTaskStatusChange={onTaskStatusChange} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="flex items-center justify-center h-40 text-center"
              >
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Drag tasks here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  )
}
