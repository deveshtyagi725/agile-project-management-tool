import prisma from '../utils/db.js'
import { AppError } from '../middlewares/errorHandler.js'
import {
  validateId,
  validateListQuery,
  validateUserStory,
  validateUserStoryUpdate,
} from '../utils/validators.js'

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
})

/**
 * Create a new user story
 * POST /user-stories
 */
export const createUserStory = async (req, res, next) => {
  try {
    const validatedData = validateUserStory(req.body)

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
    })

    if (!project) {
      throw new AppError('Project not found', 404)
    }

    const story = await prisma.userStory.create({
      data: validatedData,
      include: { tasks: true },
    })

    res.status(201).json({
      success: true,
      message: 'User story created successfully',
      data: story,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get user stories by project
 * GET /user-stories?projectId=:projectId
 */
export const getUserStoriesByProject = async (req, res, next) => {
  try {
    const projectId = req.query.projectId
      ? validateId(parseInt(req.query.projectId))
      : null
    const { page, limit, status, priority, sortBy, sortOrder } = validateListQuery(req.query, {
      allowStatus: true,
      allowPriority: true,
    })
    const skip = (page - 1) * limit

    if (!projectId) {
      throw new AppError('projectId query parameter is required', 400)
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      throw new AppError('Project not found', 404)
    }

    const where = {
      projectId,
      ...(status && { status }),
      ...(priority && { priority }),
    }

    const [stories, total] = await Promise.all([
      prisma.userStory.findMany({
        where,
        skip,
        take: limit,
        include: { tasks: true },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.userStory.count({ where }),
    ])

    res.status(200).json({
      success: true,
      data: stories,
      pagination: buildPagination(page, limit, total),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get tasks for a user story
 * GET /stories/:id/tasks
 */
export const getStoryTasks = async (req, res, next) => {
  try {
    const userStoryId = validateId(parseInt(req.params.id))
    const { page, limit, status, priority, sortBy, sortOrder } = validateListQuery(req.query, {
      allowStatus: true,
      allowPriority: true,
    })
    const skip = (page - 1) * limit

    const story = await prisma.userStory.findUnique({
      where: { id: userStoryId },
      select: { id: true },
    })

    if (!story) {
      throw new AppError('User story not found', 404)
    }

    const where = {
      userStoryId,
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
 * Update user story
 * PATCH /user-stories/:id
 */
export const updateUserStory = async (req, res, next) => {
  try {
    const id = validateId(parseInt(req.params.id))
    const updateData = validateUserStoryUpdate(req.body)

    const story = await prisma.userStory.update({
      where: { id },
      data: updateData,
      include: { tasks: true },
    })

    res.status(200).json({
      success: true,
      message: 'User story updated successfully',
      data: story,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete user story
 * DELETE /user-stories/:id
 */
export const deleteUserStory = async (req, res, next) => {
  try {
    const id = validateId(parseInt(req.params.id))

    await prisma.userStory.delete({
      where: { id },
    })

    res.status(200).json({
      success: true,
      message: 'User story deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
