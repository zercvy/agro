// controllers/plot/getBarriers.ts
/**
 * Получает преграды (ветровые/световые) участка, проверяя владельца
 */
import { Request, Response } from 'express';
import db from '../../models/db';

export const getBarriersByPlot = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  try {
    const [rows] = await db.query('SELECT id FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    if ((rows as any[]).length === 0) {
      return res.status(403).json({ message: 'Нет доступа к этому участку' });
    }

    const [barriers] = await db.query('SELECT * FROM barriers WHERE plot_id = ?', [plotId]);

    const parsedBarriers = (barriers as any[]).map((barrier) => ({
      ...barrier,
      geometry: JSON.parse(barrier.geometry),
    }));

    res.json(parsedBarriers);
  } catch (err) {
    console.error('Ошибка получения преград:', err);
    res.status(500).json({ message: 'Ошибка при получении преград' });
  }
};
