import { Request, Response } from 'express';
import db from '../models/db';

export const getUserRecentActivity = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });

  try {
const [[cultures], [windowsills], [pots]] = await Promise.all([
    db.execute(`
        SELECT c.name, uc.added_at AS createdAt
        FROM user_cultures uc
        JOIN cultures c ON uc.culture_id = c.id
        WHERE uc.user_id = ?
        ORDER BY uc.added_at DESC
        LIMIT 3
    `, [userId]),

    db.execute(`
        SELECT side, floor, created_at AS createdAt
        FROM windowsills
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 3
    `, [userId]),

    db.execute(`
        SELECT p.name, p.created_at AS createdAt
        FROM pots p
        JOIN windowsills w ON w.id = p.windowsill_id
        WHERE w.user_id = ?
        ORDER BY p.created_at DESC
        LIMIT 3
    `, [userId])
    ]);


    res.json({
      cultures: cultures as any[],
      windowsills: windowsills as any[],
      pots: pots as any[],
    });
  } catch (err) {
    console.error('Ошибка при получении недавней активности:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
