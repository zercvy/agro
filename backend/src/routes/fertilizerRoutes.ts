import { Router } from 'express'
import { getFertilizerTypes } from '../controllers/fertilizerController'

const router = Router()
router.get('/', getFertilizerTypes)
export default router
