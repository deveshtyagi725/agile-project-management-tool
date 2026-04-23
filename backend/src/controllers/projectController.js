import prisma from '../utils/db.js'
import { AppError } from '../middlewares/errorHandler.js'
import {
  validateId,
  validateListQuery,
  validateProject,
  validateProjectUpdate,
} from '../utils/validators.js'

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
})

// A project is "completed" when it has at least one story and every story is Done.
const deriveIsCompleted = (userStories) => {
  if (!userStories || userStories.length === 0) return false
  return userStories.every(s => s.status === 'Done')
}

/**
 * Create a new project
 * POST /projects
 */
export const createProject = async (req, res, next) => {
  try {
    const validatedData = validateProject(req.body)
    const project = await prisma.project.create({ data: validatedData })
    res.status(201).json({ success: true, message: 'Project created successfully', data: project })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all projects
 * GET /projects
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = validateListQuery(req.query)
    const skip = (page - 1) * limit

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: limit,
        include: {
          userStories: {
            include: { tasks: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.project.count(),
    ])

    const data = projects.map(project => ({
      ...project,
      userStoriesCount: project.userStories.length,
      tasksCount: project.userStories.reduce((sum, story) => sum + story.tasks.length, 0),
      // Derived completion flag — true when all stories are Done
      isCompleted: deriveIsCompleted(project.userStories),
    }))

    res.status(200).json({
      success: true,
      data,
      pagination: buildPagination(page, limit, total),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get user stories for a project
 * GET /projects/:id/stories
 */
export const getProjectStories = async (req, res, next) => {
  try {
    const projectId = validateId(parseInt(req.params.id))
    const { page, limit, status, priority, sortBy, sortOrder } = validateListQuery(req.query, {
      allowStatus: true,
      allowPriority: true,
    })
    const skip = (page - 1) * limit

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) throw new AppError('Project not found', 404)

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
 * Get project by ID with user stories and tasks
 * GET /projects/:id
 */
export const getProjectById = async (req, res, next) => {
  try {
    const id = validateId(parseInt(req.params.id))

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        userStories: {
          include: { tasks: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!project) throw new AppError('Project not found', 404)

    res.status(200).json({
      success: true,
      data: {
        ...project,
        isCompleted: deriveIsCompleted(project.userStories),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update project
 * PATCH /projects/:id
 */
export const updateProject = async (req, res, next) => {
  try {
    const id = validateId(parseInt(req.params.id))
    const validatedData = validateProjectUpdate(req.body)

    const project = await prisma.project.update({
      where: { id },
      data: validatedData,
    })

    res.status(200).json({ success: true, message: 'Project updated successfully', data: project })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete project
 * DELETE /projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    const id = validateId(parseInt(req.params.id))
    await prisma.project.delete({ where: { id } })
    res.status(200).json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    next(error)
  }
}
