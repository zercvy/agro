import express from 'express'
import { createWindowsill } from '../controllers/windowsill/windowsillController'
import { authMiddleware } from '../middleware/authMiddleware';
import csrfMiddleware from '../middleware/csrfMiddleware'
import { getWindowsills } from '../controllers/windowsill/windowsillController'
const router = express.Router()

router.post('/', authMiddleware, csrfMiddleware, createWindowsill)
router.get('/', authMiddleware, csrfMiddleware, getWindowsills)
export default router
