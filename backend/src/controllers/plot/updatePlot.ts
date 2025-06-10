// controllers/plot/updatePlot.ts
/**
 * Обновляет данные участка (тип, почва, координаты, преграды и т.д.)
 */
import { Request, Response } from 'express';
import db from '../../models/db';

export const updatePlot = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  const {
    name,
    type,
    soil_type,
    coordinates,
    area,
    perimeter,
    lightBarrier,
    windBarrier
  } = req.body;

  try {
    const [rows] = await db.query('SELECT id FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    if ((rows as any[]).length === 0) {
      return res.status(403).json({ message: 'Нет доступа к этому участку' });
    }

    await db.query(
      `UPDATE plots
       SET name = ?, type = ?, soil_type = ?, coordinates = ?, area = ?, perimeter = ?, lightBarrier = ?, windBarrier = ?
       WHERE id = ? AND user_id = ?`,
      [
        name,
        type,
        soil_type,
        JSON.stringify(coordinates),
        area,
        perimeter,
        JSON.stringify(lightBarrier),
        JSON.stringify(windBarrier),
        plotId,
        userId
      ]
    );

    res.json({ message: 'Участок обновлён' });
  } catch (err) {
    console.error('Ошибка обновления участка:', err);
    res.status(500).json({ message: 'Ошибка при обновлении участка' });
  }
};
