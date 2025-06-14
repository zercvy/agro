// import { Request, Response } from 'express';
// import db  from '../models/db';
// import { createPotPlant } from '../controllers/potPlantController'


// // controllers/potPlantController.ts
// export const createPotPlant = async (req: Request, res: Response) => {
//   const { windowsillId, volume, cultureId } = req.body;

//   try {
//   await db.execute(
//     'INSERT INTO pots (windowsill_id, volume, culture_id, name) VALUES (?, ?, ?, ?)',
//     [windowsillId, volume, cultureId, name]
//   );
//     res.status(201).json({ message: 'Горшок добавлен' });
//   } catch (error) {
//     console.error('Ошибка при добавлении горшка:', error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// };



// export const getPotsByWindowsill = async (req: Request, res: Response) => {
//   const { windowsillId } = req.query;

//   if (!windowsillId) {
//     return res.status(400).json({ message: 'Не указан ID подоконника' });
//   }

//   try {
//     const [rows] = await db.execute(
//       `SELECT p.id, c.name AS culture, p.volume
//        FROM pots p
//        JOIN cultures c ON p.culture_id = c.id
//        WHERE p.windowsill_id = ?`,
//       [windowsillId]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error('Ошибка при получении горшков:', error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// };

import { Request, Response } from 'express';
import db from '../models/db';

// Добавить новый горшок
export const createPotPlant = async (req: Request, res: Response) => {
  const { windowsillId, volume, cultureId, name } = req.body;

  if (!windowsillId || !volume || !cultureId || !name) {
    return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
  }

  try {
    await db.execute(
      'INSERT INTO pots (windowsill_id, volume, culture_id, name) VALUES (?, ?, ?, ?)',
      [windowsillId, volume, cultureId, name]
    );
    res.status(201).json({ message: 'Горшок добавлен' });
  } catch (error) {
    console.error('Ошибка при добавлении горшка:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить горшки по подоконнику
export const getPotsByWindowsill = async (req: Request, res: Response) => {
  const { windowsillId } = req.query;

  if (!windowsillId) {
    return res.status(400).json({ message: 'Не указан ID подоконника' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT p.id, p.name, c.name AS culture, p.volume
       FROM pots p
       JOIN cultures c ON p.culture_id = c.id
       WHERE p.windowsill_id = ?`,
      [windowsillId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении горшков:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
