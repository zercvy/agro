// Контроллер авторизации пользователя (вход)

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../models/db';
import validator from 'validator';

const COOKIE_NAME = process.env.COOKIE_NAME!;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const login = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  // Нормализация и базовая проверка
  email = validator.normalizeEmail(email);
  password = password.trim();

  if (!validator.isEmail(email || '')) {
    return res.status(400).json({ message: 'Некорректный email' });
  }

  // Поиск пользователя по email
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = (users as any[])[0];
  if (!user) return res.status(400).json({ message: 'Неверный email или пароль' });

  // Проверка пароля
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Неверный email или пароль' });

  // Создание и установка JWT токена
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN || '1d' }
  );

  res
    .cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false // ⚠️ На проде включить true
    })
    .json({ message: 'Успешный вход' });
};
