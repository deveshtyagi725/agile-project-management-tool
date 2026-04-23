import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/db.js'
import { logger } from '../utils/logger.js'
import { validateLogin, validateRegister } from '../utils/validators.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const register = async (req, res) => {
  try {
    const { email, password, name } = validateRegister(req.body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${email}`)
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true }
    })

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    logger.info(`User registered successfully: ${email}`)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token }
    })
  } catch (error) {
    logger.error(`Registration error: ${error.message}`)
    res.status(error.status || 500).json({ success: false, message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = validateLogin(req.body)

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      logger.warn(`Login attempt with wrong password for email: ${email}`)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    logger.info(`User logged in successfully: ${email}`)
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token
      }
    })
  } catch (error) {
    logger.error(`Login error: ${error.message}`)
    res.status(error.status || 500).json({ success: false, message: error.message })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true }
    })

    res.json({ success: true, data: user })
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`)
    res.status(500).json({ success: false, message: error.message })
  }
}
