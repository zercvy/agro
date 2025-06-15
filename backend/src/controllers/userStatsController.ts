import { Request, Response } from 'express';
import db from '../models/db';

export const getUserStats = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });

  try {
    const [[{ plots }]] = await db.execute('SELECT COUNT(*) AS plots FROM plots WHERE user_id = ?', [userId]);
    const [[{ pots }]] = await db.execute(`
      SELECT COUNT(*) AS pots
      FROM pots
      JOIN windowsills ON pots.windowsill_id = windowsills.id
      WHERE windowsills.user_id = ?`,
      [userId]
    );
    const [[{ cultures }]] = await db.execute(`
      SELECT COUNT(DISTINCT c.id) AS cultures
      FROM cultures c
      LEFT JOIN user_cultures uc ON uc.culture_id = c.id AND uc.user_id = ?
      LEFT JOIN plot_cultures pc ON pc.culture_id = c.id
      LEFT JOIN plots p ON p.id = pc.plot_id AND p.user_id = ?
      LEFT JOIN pots pt ON pt.culture_id = c.id
      LEFT JOIN windowsills w ON w.id = pt.windowsill_id AND w.user_id = ?
      WHERE uc.user_id IS NOT NULL OR p.user_id IS NOT NULL OR w.user_id IS NOT NULL
    `, [userId, userId, userId]);

    res.json({ plots, pots, cultures });
  } catch (err) {
    console.error('Ошибка при получении статистики:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
