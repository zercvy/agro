// controllers/plot/getPlotById.ts
/**
 * Возвращает конкретный участок по ID, если он принадлежит пользователю
 */
import { Request, Response } from 'express';
import db from '../../models/db';

export const getPlotById = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  try {
    const [rows] = await db.query('SELECT * FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    const plot = (rows as any[])[0];

    if (!plot) return res.status(404).json({ message: 'Участок не найден' });

    res.json(plot);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения участка' });
  }
};
