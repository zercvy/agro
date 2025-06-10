// controllers/plot/getUserPlots.ts
/**
 * Возвращает список всех участков текущего пользователя
 */
import { Request, Response } from 'express';
import db from '../../models/db';

export const getUserPlots = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const [rows] = await db.query('SELECT * FROM plots WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Ошибка получения участков:', err);
    res.status(500).json({ message: 'Ошибка сервера при получении участков' });
  }
};
