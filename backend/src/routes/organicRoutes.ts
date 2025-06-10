import { Router } from 'express'
import { getOrganicTypes } from '../controllers/organicController'

const router = Router()
router.get('/', getOrganicTypes)
export default router
