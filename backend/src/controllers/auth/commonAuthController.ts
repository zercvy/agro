// Общие контроллеры авторизации: выход, профиль, проверка капчи

import { Request, Response } from 'express';
import axios from 'axios';

const COOKIE_NAME = process.env.COOKIE_NAME!;

// Очистка куки (выход из аккаунта)
export const logout = async (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME).json({ message: 'Выход выполнен' });
};

// Получение данных авторизованного пользователя
export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Не авторизован' });
  res.json(req.user);
};

// Верификация Google reCAPTCHA v3
export async function verifyRecaptcha(token: string): Promise<boolean> {
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
