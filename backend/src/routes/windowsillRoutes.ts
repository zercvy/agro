import express from 'express'
import { createWindowsill } from '../controllers/windowsillController'
import { authMiddleware } from '../middleware/authMiddleware';
import csrfMiddleware from '../middleware/csrfMiddleware'
import { getWindowsills } from '../controllers/windowsillController'
const router = express.Router()

router.post('/', authMiddleware, csrfMiddleware, createWindowsill)
router.get('/', authMiddleware, csrfMiddleware, getWindowsills)
export default router
