// controllers/plot/createPlot.ts
/**
 * Создаёт новый участок с координатами, типом и почвой
 */
import { Request, Response } from 'express';
import db from '../../models/db';

export const createPlot = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, type, coordinates, area, perimeter, soil_type } = req.body;

  if (!name || !coordinates) {
    return res.status(400).json({ message: 'Название и координаты обязательны' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO plots (user_id, name, type, coordinates, area, perimeter, soil_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, type, JSON.stringify(coordinates), area, perimeter, soil_type]
    );

    res.status(201).json({ id: (result as any).insertId });
  } catch (err) {
    console.error('Ошибка создания участка:', err);
    res.status(500).json({ message: 'Ошибка сервера при создании участка' });
  }
};
