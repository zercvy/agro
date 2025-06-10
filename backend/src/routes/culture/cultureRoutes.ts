import { Router } from 'express'
import { getAllCultures, getCultureTree, getCultureTreeByCategories } from '../../controllers/cultureController'

const router = Router()

// GET  /api/cultures       — весь плоский список
router.get('/', getAllCultures)
// GET  /api/cultures/tree  — иерархия по parent_id
router.get('/tree', getCultureTree)
router.get('/tree-by-categories', getCultureTreeByCategories)
export default router
