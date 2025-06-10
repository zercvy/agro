// controllers/admin/userController.ts
import { Request, Response } from 'express';
import db from '../../models/db';

export const getUserStats = async (_req: Request, res: Response) => {
  const [users] = await db.query('SELECT id, name, email, created_at FROM users');
  res.json({
    count: (users as any[]).length,
    users,
  });
};
