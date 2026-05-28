import { Router } from 'express';
import { body } from 'express-validator';
import { getUsers, toggleUserStatus, adminUpdatePassword } from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import validate from '../middleware/validate.middleware';

const router = Router();

router.use(protect, authorize('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users with task stats (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: page,   schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit,  schema: { type: integer, default: 10 } }
 *     responses:
 *       200: { description: Users list with per-user task stats and system-wide summary }
 *       403: { description: Access denied }
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Toggle user active/inactive (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: User status toggled }
 *       400: { description: Cannot deactivate self or admin }
 *       404: { description: User not found }
 */
router.patch('/users/:id/status', toggleUserStatus);

/**
 * @swagger
 * /admin/users/{id}/password:
 *   put:
 *     summary: Update any user's password (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword, confirmPassword]
 *             properties:
 *               newPassword:     { type: string, minLength: 6 }
 *               confirmPassword: { type: string }
 *     responses:
 *       200: { description: Password updated }
 *       404: { description: User not found }
 */
router.put(
  '/users/:id/password',
  [
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((val, { req }) => {
      if (val !== (req.body as { newPassword: string }).newPassword) throw new Error('Passwords do not match');
      return true;
    }),
  ],
  validate,
  adminUpdatePassword
);

export default router;
