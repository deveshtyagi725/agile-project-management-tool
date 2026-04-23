import React from 'react'

const StatusBadge = ({ status }) => {
  const normalizedStatus = {
    Todo: 'todo',
    'In Progress': 'in-progress',
    Done: 'done',
  }[status] || status

  const statusConfig = {
    'todo': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'To Do' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    'done': { bg: 'bg-green-100', text: 'text-green-800', label: 'Done' },
  }

  const config = statusConfig[normalizedStatus] || statusConfig['todo']

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

const PriorityBadge = ({ priority }) => {
  const normalizedPriority = priority?.toLowerCase()

  const priorityConfig = {
    'low': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'high': { bg: 'bg-red-100', text: 'text-red-800' },
  }

  const config = priorityConfig[normalizedPriority] || priorityConfig['medium']

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {priority}
    </span>
  )
}

export { StatusBadge, PriorityBadge }
