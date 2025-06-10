// controllers/plot/deletePlot.ts
/**
 * Удаляет участок, если он принадлежит пользователю
 */
import { Request, Response } from 'express';
import db from '../../models/db';

export const deletePlot = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  try {
    await db.query('DELETE FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    res.json({ message: 'Участок удалён' });
  } catch (err) {
    console.error('Ошибка удаления:', err);
    res.status(500).json({ message: 'Ошибка сервера при удалении' });
  }
};
