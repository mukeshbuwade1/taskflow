import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard summary data for the logged-in user
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard data including task stats and task lists
 */
router.get('/', getDashboard);

export default router;
