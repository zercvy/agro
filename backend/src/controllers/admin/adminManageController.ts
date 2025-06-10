// controllers/admin/adminManageController.ts
import { Request, Response } from 'express';
import db from '../../models/db';
import bcrypt from 'bcrypt';

export const createAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [existingAdmins] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
    if ((existingAdmins as any[]).length > 0) {
      return res.status(400).json({ message: 'Админ с таким email уже существует' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashed]);

    res.json({ message: 'Админ создан' });
  } catch (err) {
    console.error('Ошибка при создании админа:', err);
    res.status(500).json({ message: 'Ошибка при создании админа' });
  }
};
