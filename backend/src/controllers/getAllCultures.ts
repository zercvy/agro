// controllers/cultureController.ts
import { Request, Response } from 'express';
import db from '../models/db';

export const getAllCultures = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT id, name FROM cultures ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('Ошибка при получении культур:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
