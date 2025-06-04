import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Не авторизован' });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Нет прав администратора' });

    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Недействительный токен' });
  }
};
