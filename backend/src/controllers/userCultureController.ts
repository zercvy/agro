import { Request, Response } from 'express';
import db from '../models/db';

// ✅ Добавить культуру в профиль
export const addCulture = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { cultureId } = req.body;

  if (!userId || !cultureId) {
    return res.status(400).json({ error: 'Invalid data' });
  }

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

// ✅ Удалить культуру из профиля
export const deleteCulture = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const cultureId = parseInt(req.params.cultureId, 10);

  if (!userId || isNaN(cultureId)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

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

// ✅ Привязать культуру к участку или горшку
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
      await db.execute(
        'INSERT IGNORE INTO plot_cultures (plot_id, culture_id) VALUES (?, ?)',
        [targetId, cultureId]
      );
    } else {
      await db.execute(
        `UPDATE pots p
         JOIN windowsills w ON p.windowsill_id = w.id
         SET p.culture_id = ?
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

// // ✅ Получить список всех культур пользователя с их использованием
// export const getUserCultures = async (req: Request, res: Response) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ error: 'Не авторизован' });

//   try {
//     // Получаем культуры, добавленные пользователем
//     const [userCultureRows] = await db.execute(
//       `SELECT cultures.id, cultures.name, cultures.description
//        FROM user_cultures
//        JOIN cultures ON user_cultures.culture_id = cultures.id
//        WHERE user_cultures.user_id = ?`,
//       [userId]
//     );

//     const cultureMap: Record<number, { id: number; name: string; description?: string; usedIn: string[] }> = {};
//     for (const row of userCultureRows as any[]) {
//       cultureMap[row.id] = {
//         id: row.id,
//         name: row.name,
//         description: row.description,
//         usedIn: [],
//       };
//     }

//     // Привязки к участкам
//     const [plotRows] = await db.execute(
//       `SELECT plots.name AS object_name, cultures.id AS culture_id
//        FROM plots
//        JOIN plot_cultures ON plot_cultures.plot_id = plots.id
//        JOIN cultures ON plot_cultures.culture_id = cultures.id
//        WHERE plots.user_id = ?`,
//       [userId]
//     );

//     for (const row of plotRows as any[]) {
//       if (!cultureMap[row.culture_id]) continue;
//       cultureMap[row.culture_id].usedIn.push(`${row.object_name} (участок)`);
//     }

//     // Привязки к горшкам
//     const [potRows] = await db.execute(
//       `SELECT pots.name AS object_name, cultures.id AS culture_id
//        FROM pots
//        JOIN cultures ON pots.culture_id = cultures.id
//        JOIN windowsills ON pots.windowsill_id = windowsills.id
//        WHERE windowsills.user_id = ?`,
//       [userId]
//     );

//     for (const row of potRows as any[]) {
//       if (!cultureMap[row.culture_id]) continue;
//       cultureMap[row.culture_id].usedIn.push(`${row.object_name} (горшок)`);
//     }

//     res.json(Object.values(cultureMap));
//   } catch (err) {
//     console.error('Ошибка при получении культур пользователя:', err);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }

export const getUserCultures = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });

  try {
    // Получаем все культуры, связанные с пользователем (user_cultures, участки, горшки)
    const [rawRows] = await db.execute(
      `
      SELECT DISTINCT c.id, c.name, c.description
      FROM cultures c
      LEFT JOIN user_cultures uc ON uc.culture_id = c.id AND uc.user_id = ?
      LEFT JOIN plot_cultures pc ON pc.culture_id = c.id
      LEFT JOIN plots p ON p.id = pc.plot_id AND p.user_id = ?
      LEFT JOIN pots pt ON pt.culture_id = c.id
      LEFT JOIN windowsills w ON w.id = pt.windowsill_id AND w.user_id = ?
      WHERE uc.user_id IS NOT NULL OR p.user_id IS NOT NULL OR w.user_id IS NOT NULL
      `,
      [userId, userId, userId]
    );

    // Формируем базовую карту культур
    const cultureMap: Record<number, { id: number; name: string; description?: string; usedIn: string[] }> = {};
    for (const row of rawRows as any[]) {
      cultureMap[row.id] = {
        id: row.id,
        name: row.name,
        description: row.description,
        usedIn: [],
      };
    }

    // Привязки к участкам
    const [plotLinks] = await db.execute(
      `SELECT plots.name AS plot_name, cultures.id AS culture_id
       FROM plots
       JOIN plot_cultures ON plot_cultures.plot_id = plots.id
       JOIN cultures ON plot_cultures.culture_id = cultures.id
       WHERE plots.user_id = ?`,
      [userId]
    );

    for (const row of plotLinks as any[]) {
      cultureMap[row.culture_id]?.usedIn.push(`${row.plot_name} (участок)`);
    }

    // Привязки к горшкам
    const [potLinks] = await db.execute(
      `SELECT pots.name AS pot_name, cultures.id AS culture_id
       FROM pots
       JOIN cultures ON pots.culture_id = cultures.id
       JOIN windowsills ON windowsills.id = pots.windowsill_id
       WHERE windowsills.user_id = ?`,
      [userId]
    );

    for (const row of potLinks as any[]) {
      cultureMap[row.culture_id]?.usedIn.push(`${row.pot_name} (горшок)`);
    }

    res.json(Object.values(cultureMap));
  } catch (err) {
    console.error('Ошибка при получении культур пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
