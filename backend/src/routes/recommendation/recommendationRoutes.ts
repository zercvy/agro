import express from 'express'
import {
  recommendCrops,
  getSoilTypes,
  getCultures
} from '../../controllers/recommendations/recommendationController'

const router = express.Router()

// POST /api/recommendations/
router.post('/', recommendCrops)

// GET /api/recommendations/soils
router.get('/soils', getSoilTypes)

// GET /api/recommendations/cultures
router.get('/cultures', getCultures)

export default router
