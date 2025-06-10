// Контроллер регистрации нового пользователя

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../../models/db';
import validator from 'validator';
import { verifyRecaptcha } from './commonAuthController';

export const register = async (req: Request, res: Response) => {
  let { name, email, password, captchaToken } = req.body;

  // Очистка и базовая валидация входных данных
  name = validator.escape(name.trim());
  email = validator.normalizeEmail(email);
  password = password.trim();

  if (!validator.isEmail(email || '')) {
    return res.status(400).json({ message: 'Некорректный email' });
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: 'Пароль должен содержать не менее 6 символов' });
  }

  // Проверка reCAPTCHA
  if (!captchaToken || !(await verifyRecaptcha(captchaToken))) {
    return res.status(403).json({ message: 'Проверка капчи не пройдена' });
  }

  // Проверка на существующего пользователя
  const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if ((users as any[]).length > 0) {
    return res.status(400).json({ message: 'Email уже используется' });
  }

  // Хеширование пароля и создание нового пользователя
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  res.status(201).json({ message: 'Пользователь зарегистрирован' });
};
