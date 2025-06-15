import { Request, Response } from 'express';
import db from '../models/db';

export const getActiveCrops = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });

  try {
    const [plotRows] = await db.execute(
      `SELECT c.name AS culture, p.name AS location
       FROM plot_cultures pc
       JOIN cultures c ON pc.culture_id = c.id
       JOIN plots p ON pc.plot_id = p.id
       WHERE p.user_id = ?`,
      [userId]
    );

    const [potRows] = await db.execute(
      `SELECT c.name AS culture, CONCAT('Подоконник — ', p.name) AS location
       FROM pots p
       JOIN cultures c ON p.culture_id = c.id
       JOIN windowsills w ON w.id = p.windowsill_id
       WHERE w.user_id = ?`,
      [userId]
    );

    const all = [...plotRows, ...potRows].map((row: any) => ({
      culture: row.culture,
      location: row.location,
      status: 'добавлено'
    }));

    res.json(all);
  } catch (err) {
    console.error('Ошибка при получении активных культур:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
