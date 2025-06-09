import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { getUserObjects } from '../controllers/userObjectController'

const router = Router()

// GET /api/user/objects
router.get('/', authMiddleware, getUserObjects)

export default router
