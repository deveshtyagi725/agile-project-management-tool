import prisma from '../utils/db.js'
import { AppError } from '../middlewares/errorHandler.js'
import {
  validateId,
  validateListQuery,
  validateTask,
  validateTaskUpdate,
} from '../utils/validators.js'

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
})

/**
 * Create a new task
 * POST /tasks
 */
export const createTask = async (req, res, next) => {
  try {
    const validatedData = validateTask(req.body)

    // Verify user story exists
    const story = await prisma.userStory.findUnique({
      where: { id: validatedData.userStoryId },
    })

    if (!story) {
      throw new AppError('User story not found', 404)
    }

    const task = await prisma.task.create({
      data: validatedData,
    })

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get tasks by user story
 * GET /tasks?storyId=:storyId
 */
export const getTasksByStory = async (req, res, next) => {
  try {
    const storyId = req.query.storyId
      ? validateId(parseInt(req.query.storyId))
      : null
    const { page, limit, status, priority, sortBy, sortOrder } = validateListQuery(req.query, {
      allowStatus: true,
      allowPriority: true,
    })
    const skip = (page - 1) * limit

    if (!storyId) {
      throw new AppError('storyId query parameter is required', 400)
    }

    // Verify user story exists
    const story = await prisma.userStory.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      throw new AppError('User story not found', 404)
    }

    const where = {
      userStoryId: storyId,
      ...(status && { status }),
      ...(priority && { priority }),
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.task.count({ where }),
    ])

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: buildPagination(page, limit, total),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update task
 * PATCH /tasks/:id
 */
export const updateTask = async (req, res, next) => {
  try {
    const id = validateId(parseInt(req.params.id))
    const updateData = validateTaskUpdate(req.body)

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    })

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete task
 * DELETE /tasks/:id
 */
export const deleteTask = async (req, res, next) => {
  try {
    const id = validateId(parseInt(req.params.id))

    await prisma.task.delete({
      where: { id },
    })

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
