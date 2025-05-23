import express from 'express'
import { createPotPlant } from '../controllers/potPlantController'
import { authMiddleware } from '../middleware/authMiddleware';
import csrfMiddleware from '../middleware/csrfMiddleware'
import { getPotsByWindowsill } from '../controllers/potPlantController'
const router = express.Router()

router.post('/', authMiddleware, csrfMiddleware, createPotPlant)
router.get('/', authMiddleware, csrfMiddleware, getPotsByWindowsill)
export default router
