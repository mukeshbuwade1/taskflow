import { Router } from 'express';
import { body } from 'express-validator';
import { getTasks, createTask, getTask, updateTask, toggleTask, deleteTask } from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [all, pending, completed] } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: sortBy, schema: { type: string, enum: [createdAt, updatedAt, dueDate, priority, title] } }
 *       - { in: query, name: order, schema: { type: string, enum: [asc, desc] } }
 *     responses:
 *       200: { description: List of tasks with pagination }
 */
router.get('/', getTasks);

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
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [low, medium, high] }
 *               dueDate: { type: string, format: date }
 *     responses:
 *       201: { description: Task created }
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title max 100 chars'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Task data }
 *       404: { description: Task not found }
 */
router.get('/:id', getTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [pending, completed] }
 *               priority: { type: string, enum: [low, medium, high] }
 *               dueDate: { type: string, format: date }
 *     responses:
 *       200: { description: Task updated }
 *       404: { description: Task not found }
 */
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  updateTask
);

/**
 * @swagger
 * /tasks/{id}/toggle:
 *   patch:
 *     summary: Toggle task status
 *     tags: [Tasks]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Task status toggled }
 *       404: { description: Task not found }
 */
router.patch('/:id/toggle', toggleTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Task deleted }
 *       404: { description: Task not found }
 */
router.delete('/:id', deleteTask);

export default router;
