import React from 'react'
import { Trash2, Edit2 } from 'lucide-react'

export const Card = ({ children, className = '', hoverable = false }) => {
  const hoverClass = hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${hoverClass} ${className}`}>
      {children}
    </div>
  )
}

export const CardHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}

export const CardBody = ({ children }) => {
  return <div className="px-6 py-4">{children}</div>
}

export const ActionButtons = ({ onEdit, onDelete, editLabel = "Edit", deleteLabel = "Delete" }) => {
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title={editLabel}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title={deleteLabel}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
