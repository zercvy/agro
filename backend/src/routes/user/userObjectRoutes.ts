import { Router } from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { getUserObjects } from '../../controllers/userObjectController'
import { getUserStats } from '../../controllers/userStatsController';
const router = Router()

// GET /api/user/objects
router.get('/', authMiddleware, getUserObjects)
router.get('/stats', authMiddleware, getUserStats);
export default router
