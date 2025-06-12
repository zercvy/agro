// // controllers/admin/userController.ts
// import { Request, Response } from 'express';
// import db from '../../models/db';

// // export const getUserStats = async (_req: Request, res: Response) => {
// //   const [users] = await db.query('SELECT id, name, email, created_at FROM users');
// //   res.json({
// //     count: (users as any[]).length,
// //     users,
// //   });
// // };

// controllers/admin/userController.ts
import { Request, Response } from 'express';
import db from '../../models/db';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const [users] = await db.query('SELECT id, name, email, created_at FROM users');
    res.json({
      users,
    });
  } catch (err) {
    console.error('Ошибка при получении пользователей:', err);
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
};