 // routes/admin/userRoutes.ts
import { Router } from 'express';
import { isAdminMiddleware } from '../../middleware/admin/isAdminMiddleware';
import { getUserById, updateUserName, updateUserEmail, updateUserPassword } from '../../controllers/admin/userManageController'; 

const router = Router();

// Получение данных о пользователе по ID
router.get('/users/:id', isAdminMiddleware, getUserById);  // Обратите внимание на правильный путь

// Обновление почты пользователя
router.put('/users/:id/update-email', isAdminMiddleware, updateUserEmail);

// Обновление пароля пользователя
router.put('/users/:id/update-password', isAdminMiddleware, updateUserPassword);
// Обновление имени пользователя

// Обновление имени пользователя
router.put('/users/:id/update-name', isAdminMiddleware, updateUserName);

export default router;
