import { Router } from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { getUserObjects } from '../../controllers/userObjectController'
import { getUserStats } from '../../controllers/userStatsController';
import { getUserRecentActivity } from '../../controllers/userRecentController';
import { getActiveCrops } from '../../controllers/userActiveCropsController';
const router = Router()

// GET /api/user/objects
router.get('/', authMiddleware, getUserObjects)
router.get('/stats', authMiddleware, getUserStats);
router.get('/recent', authMiddleware, getUserRecentActivity);
router.get('/active-crops', authMiddleware, getActiveCrops);
export default router
