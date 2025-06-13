// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies[process.env.COOKIE_NAME!];
//   if (!token) return res.status(401).json({ message: 'Нет токена' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Неверный токен' });
//   }
// };
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = req.cookies[process.env.COOKIE_NAME!];
  const authHeader = req.headers.authorization;

  // Пытаемся взять токен либо из куки, либо из заголовка
  const token =
    cookieToken ||
    (authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Нет токена' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
  console.error('Ошибка JWT:', err);
  return res.status(403).json({ message: 'Неверный токен' });
}
};
