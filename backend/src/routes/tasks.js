import express from 'express'
import * as taskController from '../controllers/taskController.js'

const router = express.Router()

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userStoryId, title]
 *             properties:
 *               userStoryId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Create wireframes"
 *               description:
 *                 type: string
 *                 example: "Design wireframes for the homepage"
 *               status:
 *                 type: string
 *                 enum: [Todo, In Progress, Done]
 *                 example: "Todo"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: "High"
 *               assignedTo:
 *                 type: string
 *                 example: "John Doe"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User story not found
 */
router.post('/', taskController.createTask)

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks by user story
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: storyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User Story ID
 *     responses:
 *       200:
 *         description: List of tasks for the user story
 *       404:
 *         description: User story not found
 */
router.get('/', taskController.getTasksByStory)

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update task
 *     tags: [Tasks]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Todo, In Progress, Done]
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               assignedTo:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.patch('/:id', taskController.updateTask)
router.put('/:id', taskController.updateTask)

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', taskController.deleteTask)

export default router
