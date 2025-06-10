// controllers/admin/adminStatsController.ts
import { Request, Response } from 'express';
import db from '../../models/db';

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const [[{ userCount }]] = await db.query('SELECT COUNT(*) AS userCount FROM users');
    const [[{ plotCount }]] = await db.query('SELECT COUNT(*) AS plotCount FROM plots');
    const [[{ adminCount }]] = await db.query('SELECT COUNT(*) AS adminCount FROM admins');

    res.json({
      users: userCount,
      plots: plotCount,
      admins: adminCount,
    });
  } catch (err) {
    console.error('Ошибка при получении статистики:', err);
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
};
