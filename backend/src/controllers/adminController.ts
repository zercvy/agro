import { Request, Response } from 'express';
import { db } from '../models/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
  const admin = (admins as any[])[0];
  if (!admin) return res.status(401).json({ message: 'Неверный email или пароль' });
  console.log("Admin from DB:", admin); // ✅ внутрь функции
  const valid = await bcrypt.compare(password, admin.password);
  console.log("Match:", valid); // ✅ внутрь функции
  if (!valid) return res.status(401).json({ message: 'Неверный email или пароль' });

  const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false // true — в проде
  }).json({ message: 'Успешный вход администратора' });
};

export const getAdminProfile = async (req: Request, res: Response) => {
  res.json(req.admin);
};
