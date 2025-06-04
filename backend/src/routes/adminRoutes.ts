import { Router } from 'express';
import { loginAdmin, getAdminProfile } from '../controllers/adminController';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import csrf from 'csurf';

const router = Router();
const csrfProtection = csrf({ cookie: true });

router.post('/login', csrfProtection, loginAdmin);
router.get('/me', isAdminMiddleware, getAdminProfile);

export default router;
