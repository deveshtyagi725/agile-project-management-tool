import React, { useState, useEffect } from 'react'
import { FormGroup, Input, TextArea, Select } from './FormElements'
import { Button, SecondaryButton } from './Button'

const formatDateInput = (value) => {
  if (!value) return ''
  return value.includes('T') ? value.split('T')[0] : value
}

export const TaskForm = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    assignedTo: '',
    dueDate: '',
    ...initialData,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        dueDate: formatDateInput(initialData.dueDate),
      }))
    }
  }, [initialData])

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Task title is required'
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
      onSubmit({
        ...formData,
        dueDate: formData.dueDate || null,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormGroup label="Task Title" error={errors.title} required>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          error={!!errors.title}
        />
      </FormGroup>

      <FormGroup label="Description" error={errors.description} required>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the task"
          rows="3"
          error={!!errors.description}
        />
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup label="Status" required>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'Todo', label: 'To Do' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Done', label: 'Done' },
            ]}
          />
        </FormGroup>

        <FormGroup label="Due Date">
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </FormGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup label="Priority" required>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
          />
        </FormGroup>

        <FormGroup label="Assigned To">
          <Input
            type="text"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            placeholder="Team member name"
          />
        </FormGroup>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <SecondaryButton onClick={onCancel} disabled={isLoading}>
          Cancel
        </SecondaryButton>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData?.id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
