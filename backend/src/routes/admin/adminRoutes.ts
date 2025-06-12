

import { Router } from 'express';
import csrf from 'csurf';

import { loginAdmin } from '../../controllers/admin/authController';
import { getAdminProfile } from '../../controllers/admin/profileController';
// import { getUserStats } from '../../controllers/admin/userController';
import { getAdminStats } from '../../controllers/admin/adminStatsController';
import { createAdmin } from '../../controllers/admin/adminManageController';
import userRoutes from './userRoutes';  // Импортируем роуты для пользователей
import { isAdminMiddleware } from '../../middleware/admin/isAdminMiddleware';
import { getAdminById, updateAdminEmail, updateAdminPassword } from '../../controllers/admin/adminManageController';
import { getUsers } from '../../controllers/admin/userController';
import { getAdmins } from '../../controllers/admin/adminController';
const router = Router();
const csrfProtection = csrf({ cookie: true });

// 🔓 Авторизация
router.post('/login', csrfProtection, loginAdmin);

// 🔒 Доступ только для админов
router.get('/me', isAdminMiddleware, getAdminProfile);
// router.get('/users', isAdminMiddleware, getUserStats);
router.get('/stats', isAdminMiddleware, getAdminStats);
router.post('/create', csrfProtection, isAdminMiddleware, createAdmin);

router.get('/users', getUsers);  // Получение всех пользователей
router.get('/admins', getAdmins);  // Получение всех администраторов
// Роуты для пользователей
router.use(userRoutes); // Добавляем роуты для пользователей
// Получение данных администратора по ID
router.get('/admins/:id', isAdminMiddleware, getAdminById);

// Обновление email администратора
router.put('/admins/:id/update-email', isAdminMiddleware, updateAdminEmail);

// Обновление пароля администратора
router.put('/admins/:id/update-password', isAdminMiddleware, updateAdminPassword);



export default router;
