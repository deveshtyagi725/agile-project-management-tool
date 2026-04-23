import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, User, Calendar, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { PriorityBadge } from './Badges'
import { format } from 'date-fns'

// Cycles: Todo → In Progress → Done
const nextStatus = {
  'Todo': 'In Progress',
  'In Progress': 'Done',
  'Done': 'Done',
}

const statusIcon = {
  'Todo': Circle,
  'In Progress': Loader2,
  'Done': CheckCircle2,
}

const statusIconColor = {
  'Todo': 'text-gray-400 hover:text-blue-500',
  'In Progress': 'text-blue-500 hover:text-green-500',
  'Done': 'text-green-500 cursor-default',
}

export const KanbanTask = ({ task, isDragging = false, onTaskStatusChange }) => {
  const [advancing, setAdvancing] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const handleAdvanceStatus = async (e) => {
    e.stopPropagation()
    if (task.status === 'Done' || advancing || !onTaskStatusChange) return
    setAdvancing(true)
    try {
      await onTaskStatusChange(task.id, nextStatus[task.status])
    } finally {
      setAdvancing(false)
    }
  }

  const StatusIcon = advancing ? Loader2 : (statusIcon[task.status] || Circle)
  const iconColor = advancing ? 'text-blue-400' : (statusIconColor[task.status] || statusIconColor['Todo'])

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-slate-700 ${
        isDragging ? 'shadow-lg' : 'hover:shadow-md'
      } transition-shadow group`}
    >
      <div className="flex items-start gap-2">
        {/* Quick status advance button */}
        <button
          onClick={handleAdvanceStatus}
          disabled={task.status === 'Done' || advancing}
          className={`flex-shrink-0 mt-0.5 transition-colors ${iconColor}`}
          title={task.status === 'Done' ? 'Completed' : `Mark as ${nextStatus[task.status]}`}
        >
          <StatusIcon className={`w-4 h-4 ${advancing ? 'animate-spin' : ''}`} />
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium line-clamp-2 mb-2 ${
            task.status === 'Done'
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title || 'Untitled Task'}
          </h4>

          {task.priority && (
            <div className="mb-2">
              <PriorityBadge priority={task.priority} />
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate">{task.assignedTo}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-0.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  )
}
