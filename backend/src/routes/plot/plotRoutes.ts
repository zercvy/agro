
// import { Router } from 'express';
// import {
//   createPlot,
//   getUserPlots,
//   getPlotById,
//   updatePlot,
//   deletePlot,
//   getBarriersByPlot
// } from '../controllers/plot/plotController';
// import { authMiddleware } from '../middleware/authMiddleware';
// const router = Router();

// router.post('/plots', authMiddleware, createPlot);
// router.get('/plots', authMiddleware, getUserPlots);
// router.get('/plots/:id', authMiddleware, getPlotById);
// router.put('/plots/:id', authMiddleware, updatePlot); 
// router.delete('/plots/:id', authMiddleware, deletePlot);
// router.get('/plots/:id/barriers', authMiddleware, getBarriersByPlot);

// export default router;

/**
 * Маршруты для управления участками (создание, просмотр, редактирование, удаление, преграды)
 */


import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';

import {
  createPlot,
  getUserPlots,
  getPlotById,
  updatePlot,
  deletePlot,
  getBarriersByPlot
} from '../../controllers/plot';

const router = Router();

// 🔐 Все маршруты защищены middleware авторизации

// ➕ Создание нового участка
router.post('/plots', authMiddleware, createPlot);

// 📄 Получение всех участков пользователя
router.get('/plots', authMiddleware, getUserPlots);

// 📄 Получение одного участка по ID
router.get('/plots/:id', authMiddleware, getPlotById);

// ✏️ Обновление участка
router.put('/plots/:id', authMiddleware, updatePlot);

// ❌ Удаление участка
router.delete('/plots/:id', authMiddleware, deletePlot);

// 📐 Получение преград участка
router.get('/plots/:id/barriers', authMiddleware, getBarriersByPlot);

export default router;