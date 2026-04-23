import React from 'react'
import { motion } from 'framer-motion'

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  icon: Icon,
  isLoading = false,
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed focus-ring'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-800',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button 
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </motion.button>
  )
}

export const PrimaryButton = (props) => <Button variant="primary" {...props} />
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />
export const DangerButton = (props) => <Button variant="danger" {...props} />
export const OutlineButton = (props) => <Button variant="outline" {...props} />
export const GhostButton = (props) => <Button variant="ghost" {...props} />

export const IconButton = ({ icon: Icon, variant = 'ghost', size = 'md', ...props }) => {
  const variantClasses = 
    variant === 'ghost' ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800' :
    variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
    'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600'
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-lg transition-all duration-200 ${variantClasses}`}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  )
}
