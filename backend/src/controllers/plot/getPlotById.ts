// controllers/plot/getPlotById.ts
/**
 * Возвращает конкретный участок по ID, если он принадлежит пользователю
 */
// import { Request, Response } from 'express';
// import db from '../../models/db';

// export const getPlotById = async (req: Request, res: Response) => {
//   const plotId = req.params.id;
//   const userId = req.user?.id;

//   try {
//     const [rows] = await db.query('SELECT * FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
//     const plot = (rows as any[])[0];

//     if (!plot) return res.status(404).json({ message: 'Участок не найден' });

//     res.json(plot);
//   } catch (err) {
//     res.status(500).json({ message: 'Ошибка получения участка' });
//   }
// };

import { Request, Response } from 'express';
import db from '../../models/db';

export const getPlotById = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  try {
    // Выполняем объединение таблиц `plots` и `soil_types`
    const [rows] = await db.query(
      `SELECT plots.*, soil_types.name AS soil_name
       FROM plots
       LEFT JOIN soil_types ON plots.soil_type = soil_types.id
       WHERE plots.id = ? AND plots.user_id = ?`,
      [plotId, userId]
    );

    const plot = (rows as any[])[0];

    if (!plot) return res.status(404).json({ message: 'Участок не найден' });

    // Возвращаем участок с полным названием типа почвы
    res.json({
      ...plot,
      soil_type: plot.soil_name,  // Заменяем ID на название типа почвы
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка получения участка' });
  }
};
