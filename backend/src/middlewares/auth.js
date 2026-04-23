import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      logger.warn(`Attempt to access protected route without token: ${req.path}`)
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    req.email = decoded.email
    next()
  } catch (error) {
    logger.warn(`Invalid token: ${error.message}`)
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export default authMiddleware
