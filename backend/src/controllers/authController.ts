import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/db';
import axios from 'axios';
import validator from 'validator';

const COOKIE_NAME = process.env.COOKIE_NAME!;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const register = async (req: Request, res: Response) => {
  let { name, email, password, captchaToken } = req.body;

  // Очистка и валидация
  name = validator.escape(name.trim());
  email = validator.normalizeEmail(email);
  password = password.trim();

  if (!validator.isEmail(email || '')) {
    return res.status(400).json({ message: 'Некорректный email' });
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: 'Пароль должен содержать не менее 6 символов' });
  }

  if (!captchaToken || !(await verifyRecaptcha(captchaToken))) {
    return res.status(403).json({ message: 'Проверка капчи не пройдена' });
  }

  const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if ((users as any[]).length > 0)
    return res.status(400).json({ message: 'Email уже используется' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  res.status(201).json({ message: 'Пользователь зарегистрирован' });
};

export const login = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  email = validator.normalizeEmail(email);
  password = password.trim();

  if (!validator.isEmail(email || '')) {
    return res.status(400).json({ message: 'Некорректный email' });
  }

  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = (users as any[])[0];
  if (!user) return res.status(400).json({ message: 'Неверный email или пароль' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Неверный email или пароль' });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN || '1d' }
  );

  res
    .cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false // true на проде
    })
    .json({ message: 'Успешный вход' });
};




export const logout = async (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME).json({ message: 'Выход выполнен' });
};

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Не авторизован' });
  res.json(req.user);
};


async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET!,
          response: token,
        },
      }
    );
    return response.data.success && response.data.score > 0.5;
  } catch (error) {
    console.error('Ошибка проверки reCAPTCHA:', error);
    return false;
  }
}
