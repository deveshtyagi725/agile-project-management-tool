import Joi from 'joi'
import { AppError } from '../middlewares/errorHandler.js'

export const STATUS_VALUES = ['Todo', 'In Progress', 'Done']
export const PRIORITY_VALUES = ['Low', 'Medium', 'High']

const STATUS_QUERY_VALUES = ['todo', 'in-progress', 'done']
const STATUS_QUERY_TO_DB = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
}

const validationOptions = {
  abortEarly: false,
  stripUnknown: true,
}

const formatValidationMessage = (error) => {
  return error.details.map(detail => detail.message).join('; ')
}

const validateWithSchema = (schema, data) => {
  const { error, value } = schema.validate(data, validationOptions)
  if (error) {
    throw new AppError(formatValidationMessage(error), 400)
  }
  return value
}

export const validateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().required().min(3).max(100),
    description: Joi.string().trim().allow('').optional().max(500),
  })

  return validateWithSchema(schema, data)
}

export const validateProjectUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().allow('').optional().max(500),
  }).min(1)

  return validateWithSchema(schema, data)
}

export const validateUserStory = (data) => {
  const schema = Joi.object({
    projectId: Joi.number().integer().required(),
    title: Joi.string().trim().required().min(3).max(100),
    description: Joi.string().trim().allow('').optional().max(500),
    status: Joi.string().valid(...STATUS_VALUES).optional(),
    priority: Joi.string().valid(...PRIORITY_VALUES).optional(),
  })

  return validateWithSchema(schema, data)
}

export const validateUserStoryUpdate = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().allow('').optional().max(500),
    status: Joi.string().valid(...STATUS_VALUES),
    priority: Joi.string().valid(...PRIORITY_VALUES),
  }).min(1)

  return validateWithSchema(schema, data)
}

export const validateTask = (data) => {
  const schema = Joi.object({
    userStoryId: Joi.number().integer().required(),
    title: Joi.string().trim().required().min(3).max(100),
    description: Joi.string().trim().allow('').optional().max(500),
    status: Joi.string().valid(...STATUS_VALUES).optional(),
    priority: Joi.string().valid(...PRIORITY_VALUES).optional(),
    assignedTo: Joi.string().trim().allow('').optional().max(100),
    dueDate: Joi.date().iso().allow(null).empty('').optional(),
  })

  return validateWithSchema(schema, data)
}

export const validateTaskUpdate = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().allow('').optional().max(500),
    status: Joi.string().valid(...STATUS_VALUES),
    priority: Joi.string().valid(...PRIORITY_VALUES),
    assignedTo: Joi.string().trim().allow('').optional().max(100),
    dueDate: Joi.date().iso().allow(null).empty('').optional(),
  }).min(1)

  return validateWithSchema(schema, data)
}

export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(6).max(128).required(),
  })

  return validateWithSchema(schema, data)
}

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  })

  return validateWithSchema(schema, data)
}

export const validateId = (id) => {
  const schema = Joi.number().integer().positive().required()
  const { error, value } = schema.validate(id)
  if (error) {
    throw new AppError('Invalid ID format', 400)
  }
  return value
}

export const validateListQuery = (query, options = {}) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    projectId: Joi.number().integer().positive().optional(),
    storyId: Joi.number().integer().positive().optional(),
    status: options.allowStatus ? Joi.string().lowercase().valid(...STATUS_QUERY_VALUES).optional() : Joi.forbidden(),
    priority: options.allowPriority ? Joi.string().valid(...PRIORITY_VALUES).optional() : Joi.forbidden(),
    sort: Joi.string().valid('createdAt', 'updatedAt').optional(),
    sortBy: Joi.string().valid('createdAt', 'updatedAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  })

  const value = validateWithSchema(schema, query)

  return {
    ...value,
    status: value.status ? STATUS_QUERY_TO_DB[value.status] : undefined,
    sortBy: value.sort || value.sortBy,
  }
}
