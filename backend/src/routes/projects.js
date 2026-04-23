import express from 'express'
import * as projectController from '../controllers/projectController.js'

const router = express.Router()

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mobile App Redesign"
 *               description:
 *                 type: string
 *                 example: "Redesign the mobile app for better UX"
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', projectController.createProject)

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 */
router.get('/', projectController.getAllProjects)

/**
 * @swagger
 * /projects/{id}/stories:
 *   get:
 *     summary: Get user stories for a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in-progress, done]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *     responses:
 *       200:
 *         description: User stories for the project
 */
router.get('/:id/stories', projectController.getProjectStories)

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID with its user stories and tasks
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details with nested data
 *       404:
 *         description: Project not found
 */
router.get('/:id', projectController.getProjectById)

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 */
router.patch('/:id', projectController.updateProject)
router.put('/:id', projectController.updateProject)

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete('/:id', projectController.deleteProject)

export default router
