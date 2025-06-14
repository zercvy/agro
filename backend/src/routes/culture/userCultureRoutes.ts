import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  getUserCultures,
  addCulture,
  deleteCulture,
  bindCulture
} from '../../controllers/userCultureController';

const router = Router();

// все запросы защищаем
router.use(authMiddleware);

router.get('/',    getUserCultures);            // GET  /api/user/cultures
router.post('/',   addCulture);             // POST /api/user/cultures
router.delete('/:cultureId', deleteCulture);// DELETE /api/user/cultures/:cultureId
router.post('/bind', bindCulture);          // POST /api/user/cultures/bind

export default router;
