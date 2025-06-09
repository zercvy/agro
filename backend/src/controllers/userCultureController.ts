import { Request, Response } from 'express';
import db from '../models/db';

// добавить культуру в профиль
export const addCulture = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { cultureId } = req.body;
  if (!userId || !cultureId) return res.status(400).json({ error: 'Invalid data' });
  try {
    await db.execute(
      'INSERT IGNORE INTO user_cultures (user_id, culture_id) VALUES (?, ?)',
      [userId, cultureId]
    );
    res.status(201).json({ message: 'Культура добавлена в профиль' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении культуры' });
  }
};

// удалить культуру из профиля
export const deleteCulture = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const cultureId = parseInt(req.params.cultureId, 10);
  if (!userId || isNaN(cultureId)) return res.status(400).json({ error: 'Invalid data' });
  try {
    await db.execute(
      'DELETE FROM user_cultures WHERE user_id = ? AND culture_id = ?',
      [userId, cultureId]
    );
    res.json({ message: 'Культура удалена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении культуры' });
  }
};

// привязать уже добавленную культуру к полю или горшку
export const bindCulture = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { cultureId, targetType, targetId } = req.body as {
    cultureId: number;
    targetType: 'plot' | 'pot';
    targetId: number;
  };
  if (!userId || !cultureId || !targetType || !targetId) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  try {
    if (targetType === 'plot') {
      // вставляем в plot_cultures
      await db.execute(
        'INSERT IGNORE INTO plot_cultures (plot_id, culture_id) VALUES (?, ?)',
        [targetId, cultureId]
      );
    } else {
      // привязка к горшку: сохраняем название культуры в текстовое поле pots.culture
      await db.execute(
        `UPDATE pots p
           JOIN windowsills w ON p.windowsill_id = w.id
         SET p.culture = (SELECT name FROM cultures WHERE id = ?)
         WHERE p.id = ? AND w.user_id = ?`,
        [cultureId, targetId, userId]
      );
    }
    res.json({ message: 'Культура привязана' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при привязке культуры' });
  }
};

// получить список моих культур + где они используются
export const getCultures = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });
  try {
    // базовый список
    const [rows] = await db.execute(
      `SELECT c.id, c.name, c.description
         FROM cultures c
         JOIN user_cultures uc ON uc.culture_id = c.id
        WHERE uc.user_id = ?`,
      [userId]
    );
    const cultures = (rows as any[]).map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      usedIn: [] as string[]
    }));

    // для каждого культуры докидываем поля
    for (const c of cultures) {
      // поля
      const [plots] = await db.execute(
        `SELECT p.name
           FROM plots p
           JOIN plot_cultures pc ON pc.plot_id = p.id
          WHERE pc.culture_id = ? AND p.user_id = ?`,
        [c.id, userId]
      );
      c.usedIn.push(...(plots as any[]).map((x: any) => x.name));

      // горшки (раз такие, какие есть)
      const [pots] = await db.execute(
        `SELECT CONCAT('Горшок #', p.id) AS name
           FROM pots p
           JOIN windowsills w ON p.windowsill_id = w.id
          WHERE p.culture = (SELECT name FROM cultures WHERE id = ?)
            AND w.user_id = ?`,
        [c.id, userId]
      );
      c.usedIn.push(...(pots as any[]).map((x: any) => x.name));
    }

    res.json(cultures);
  } catch (err) {
    console.error('Ошибка в getUserCultures:', err);
    res.status(500).json({ error: 'Ошибка при получении культур' });
  }
};
