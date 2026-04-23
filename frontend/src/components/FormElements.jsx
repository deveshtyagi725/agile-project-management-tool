import React from 'react'
import { AlertCircle } from 'lucide-react'

export const FormGroup = ({ label, error, children, required = false, hint }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hint}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 mt-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export const Input = ({ error, className = '', disabled = false, ...props }) => {
  return (
    <input
      disabled={disabled}
      {...props}
      className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all ${
        error 
          ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
          : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
    />
  )
}

export const TextArea = ({ error, className = '', disabled = false, ...props }) => {
  return (
    <textarea
      disabled={disabled}
      {...props}
      className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-vertical ${
        error 
          ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
          : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
    />
  )
}

export const Select = ({ error, options = [], className = '', disabled = false, ...props }) => {
  return (
    <select
      disabled={disabled}
      {...props}
      className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all appearance-none ${
        error 
          ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
          : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} text-gray-900 dark:text-white cursor-pointer ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export const Checkbox = ({ label, error, className = '', disabled = false, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        disabled={disabled}
        {...props}
        className={`w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      />
      {label && (
        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}

export const RadioGroup = ({ options = [], value, onChange, className = '', disabled = false, ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            {...props}
            className={`w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
