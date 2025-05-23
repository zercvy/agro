
import { Router } from 'express';
import {
  createPlot,
  getUserPlots,
  getPlotById,
  updatePlot,
  deletePlot
} from '../controllers/plotController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/plots', authMiddleware, createPlot);
router.get('/plots', authMiddleware, getUserPlots);
router.get('/plots/:id', authMiddleware, getPlotById);
router.put('/plots/:id', authMiddleware, updatePlot); 
router.delete('/plots/:id', authMiddleware, deletePlot);

export default router;
