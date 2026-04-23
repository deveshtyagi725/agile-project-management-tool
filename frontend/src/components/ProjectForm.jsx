import React, { useState, useEffect } from 'react'
import { FormGroup, Input, TextArea } from './FormElements'
import { Button, SecondaryButton } from './Button'

export const ProjectForm = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ...initialData,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Project name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormGroup label="Project Name" error={errors.name} required>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          error={!!errors.name}
        />
      </FormGroup>

      <FormGroup label="Description" error={errors.description} required>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your project"
          rows="4"
          error={!!errors.description}
        />
      </FormGroup>

      <div className="flex gap-3 justify-end pt-4">
        <SecondaryButton onClick={onCancel} disabled={isLoading}>
          Cancel
        </SecondaryButton>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData?.id ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
