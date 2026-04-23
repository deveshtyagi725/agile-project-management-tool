import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormGroup, Input } from '../components/FormElements'
import { Button } from '../components/Button'
import { authAPI, saveAuthSession } from '../services/api'

export const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })

      saveAuthSession(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Sign Up
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Name" required>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </FormGroup>

          <FormGroup label="Email" required>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup label="Password" required>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </FormGroup>

          <FormGroup label="Confirm Password" required>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold dark:text-indigo-400"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
