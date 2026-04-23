import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

// Import routes
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projects.js'
import userStoryRoutes from './routes/userStories.js'
import taskRoutes from './routes/tasks.js'

// Import middleware
import { errorHandler } from './middlewares/errorHandler.js'
import { authMiddleware } from './middlewares/auth.js'
import { requestLogger } from './utils/logger.js'
import rateLimiter from './middlewares/rateLimiter.js'
import sanitizeInput from './middlewares/sanitize.js'

// Import background jobs
import './jobs/dailyReport.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ==================== SWAGGER SETUP ====================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Agile Project Management API',
      version: '1.0.0',
      description: 'REST API for Agile Project Management Tool',
      contact: {
        name: 'Development Team',
        url: 'https://github.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
      {
        url: `http://localhost:5173`,
        description: 'Frontend development server',
      },
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserStory: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            projectId: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['Todo', 'In Progress', 'Done'] },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userStoryId: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['Todo', 'In Progress', 'Done'] },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            assignedTo: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// ==================== MIDDLEWARE ====================
app.use(helmet())
app.use(cors({
  origin: "*",
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(sanitizeInput)
app.use(morgan('combined'))
app.use(requestLogger)
app.use(rateLimiter)

// ==================== SWAGGER DOCUMENTATION ====================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Agile Project Management API',
}))

// ==================== ROUTES ====================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// Auth routes (no authentication required)
app.use('/auth', authRoutes)

// Protected routes (authentication required)
app.use('/projects', authMiddleware, projectRoutes)
app.use('/user-stories', authMiddleware, userStoryRoutes)
app.use('/stories', authMiddleware, userStoryRoutes)
app.use('/tasks', authMiddleware, taskRoutes)

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  })
})

app.use(errorHandler)

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n✨ Server running at http://localhost:${PORT}`)
  console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs\n`)
})

export default app
