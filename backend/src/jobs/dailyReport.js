import cron from 'node-cron'
import prisma from '../utils/db.js'
import { logger } from '../utils/logger.js'

const MAX_RETRIES = 3
// Delay grows linearly: 1 s, 2 s, 3 s between attempts.
const RETRY_DELAY_MS = 1000

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Queries the DB and builds the report object.
// Throws on any DB error so the retry wrapper can catch it.
const generateDailyReport = async () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Tasks completed yesterday (for the daily delta).
  const completedYesterday = await prisma.task.findMany({
    where: { status: 'Done', updatedAt: { gte: yesterday, lt: today } },
    include: { userStory: { include: { project: true } } },
  })

  // Aggregate counts by status across all tasks.
  const statusStats = await prisma.task.groupBy({
    by: ['status'],
    _count: { id: true },
  })

  // Aggregate counts by priority for Done tasks only — no full-row fetch needed.
  const priorityStats = await prisma.task.groupBy({
    by: ['priority'],
    where: { status: 'Done' },
    _count: { id: true },
  })

  const priorityMap = Object.fromEntries(
    priorityStats.map(({ priority, _count }) => [priority.toLowerCase(), _count.id])
  )

  return {
    timestamp: new Date().toISOString(),
    completedTasksYesterday: completedYesterday.length,
    completedTasks: completedYesterday,
    tasksByPriority: {
      high: priorityMap.high ?? 0,
      medium: priorityMap.medium ?? 0,
      low: priorityMap.low ?? 0,
    },
    totalStats: statusStats,
    summary: {
      totalTasksCompletedYesterday: completedYesterday.length,
      totalDoneTasks: (priorityMap.high ?? 0) + (priorityMap.medium ?? 0) + (priorityMap.low ?? 0),
    },
  }
}

// Retry wrapper — no external queue, just a simple loop.
// On each failure it logs the attempt number and waits before the next try.
// If every attempt fails it re-throws the last error to the caller.
const runWithRetry = async (work) => {
  let lastError

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await work()
    } catch (err) {
      lastError = err
      logger.warn(`Daily report attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`)

      // Wait before retrying, but skip the delay after the final attempt.
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS * attempt)
      }
    }
  }

  throw lastError
}

// Scheduled job — runs at midnight every day.
// All retry failures are caught here so the API server is never crashed.
export const startDailyReportJob = () => {
  const job = cron.schedule('0 0 * * *', async () => {
    logger.info('Daily report job started')

    try {
      const report = await runWithRetry(generateDailyReport)
      logger.info('Daily report generated successfully', report)
    } catch (err) {
      // All MAX_RETRIES attempts exhausted — log and move on.
      logger.error(`Daily report job failed after ${MAX_RETRIES} attempts: ${err.message}`)
    }
  })

  logger.info('Daily report job scheduled (runs at 00:00 every day)')
  return job
}

startDailyReportJob()

export default startDailyReportJob
