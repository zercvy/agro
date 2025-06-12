import { Router } from 'express'
import { getNutrientNorms, getNormsByCulture } from '../controllers/normsController'

const router = Router()
router.get('/', getNutrientNorms)
router.get('/by-culture/:cultureId', getNormsByCulture)
export default router
