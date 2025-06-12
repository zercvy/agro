// controllers/admin/adminController.ts
import { Request, Response } from 'express';
import db from '../../models/db';

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const [admins] = await db.query('SELECT id, email, created_at FROM admins');
    res.json({
      admins,
    });
  } catch (err) {
    console.error('Ошибка при получении администраторов:', err);
    res.status(500).json({ message: 'Ошибка при получении администраторов' });
  }
};