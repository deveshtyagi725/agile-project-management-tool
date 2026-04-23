import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  logger.error(`[${req.method} ${req.path}] ${status} - ${message}`, {
    stack: err.stack,
    body: req.body,
  })

  // Prisma validation errors
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
    })
  }

  // Prisma unique constraint errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field'
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}
