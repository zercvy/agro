// import { Router } from 'express';
// import {
//   loginAdmin,
//   getAdminProfile,
//   createAdmin,
//   getUserStats,
//   getAdminStats
// } from '../../controllers/admin/adminController';

// import { isAdminMiddleware } from '../../middleware/admin/isAdminMiddleware';
// import csrf from 'csurf';

// const router = Router();
// const csrfProtection = csrf({ cookie: true });

// // 🔓 Авторизация
// router.post('/login', csrfProtection, loginAdmin);

// // 🔒 Доступ только для админов
// router.get('/me', isAdminMiddleware, getAdminProfile);
// // router.post('/create', isAdminMiddleware, createAdmin);
// router.get('/users', isAdminMiddleware, getUserStats);
// router.get('/stats', isAdminMiddleware, getAdminStats);
// router.post('/create', csrfProtection, isAdminMiddleware, createAdmin);
// export default router;
// routes/admin/adminRouter.ts

import { Router } from 'express';
import csrf from 'csurf';

import { loginAdmin } from '../../controllers/admin/authController';
import { getAdminProfile } from '../../controllers/admin/profileController';
import { getUserStats } from '../../controllers/admin/userController';
import { getAdminStats } from '../../controllers/admin/adminStatsController';
import { createAdmin } from '../../controllers/admin/adminManageController';

import { isAdminMiddleware } from '../../middleware/admin/isAdminMiddleware';

const router = Router();
const csrfProtection = csrf({ cookie: true });

// 🔓 Авторизация
router.post('/login', csrfProtection, loginAdmin);

// 🔒 Доступ только для админов
router.get('/me', isAdminMiddleware, getAdminProfile);
router.get('/users', isAdminMiddleware, getUserStats);
router.get('/stats', isAdminMiddleware, getAdminStats);
router.post('/create', csrfProtection, isAdminMiddleware, createAdmin);

export default router;
