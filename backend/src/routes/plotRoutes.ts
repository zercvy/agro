import { Router } from 'express';
import { createPlot, getUserPlots } from '../controllers/plotController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/plots', authMiddleware, createPlot);
router.get('/plots', authMiddleware, getUserPlots);

export default router;
