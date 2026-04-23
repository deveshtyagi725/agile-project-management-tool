import { PrismaClient } from '@prisma/client'
import { logger } from './logger.js'

const prisma = new PrismaClient()

prisma.$connect()
  .then(() => logger.info('✅ Database connected'))
  .catch((err) => logger.error('❌ Database connection failed', err))

export default prisma
