// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import db from '../../models/db';

// const EMAIL_CONFIRM_SECRET = process.env.EMAIL_CONFIRM_SECRET!;
// const COOKIE_NAME = process.env.COOKIE_NAME!;

// export const confirmEmail = async (req: Request, res: Response) => {
//   const token = req.query.token;

//   if (!token || typeof token !== 'string') {
//     return res.status(400).send('Неверная ссылка подтверждения');
//   }

//   try {
//     const payload = jwt.verify(token, EMAIL_CONFIRM_SECRET) as {
//       name: string;
//       email: string;
//       password: string;
//     };

//     const { name, email, password } = payload;

//     // Проверка, не зарегистрирован ли уже этот email
//     const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
//     if ((existing as any[]).length > 0) {
//       return res.status(400).send('Аккаунт уже подтверждён');
//     }

//     // Создание пользователя
//     const result = await db.query(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email, password]
//     );

//     // Удаление из pending_users
//     await db.query('DELETE FROM pending_users WHERE email = ?', [email]);

//     // Авторизация — создаём JWT
//     const userId = (result as any).insertId;
//     const authToken = jwt.sign({ id: userId, name, email }, process.env.JWT_SECRET!, {
//       expiresIn: process.env.JWT_EXPIRES_IN || '1d',
//     });

//     // Ставим куку и редиректим
//     // res.cookie(COOKIE_NAME, authToken, {
//     //   httpOnly: true,
//     //   sameSite: 'strict',
//     //   secure: false, // true — если https
//     // });

//     // return res.redirect(`${process.env.FRONTEND_URL}/cabinet`);


// res.status(200).json({
//   token: authToken,
//   message: 'Email подтверждён',
// });

    
//   } catch (err) {
//     console.error('Ошибка подтверждения email:', err);
//     return res.status(400).send('Ссылка недействительна или устарела');
//   }
// };

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../models/db';

const EMAIL_CONFIRM_SECRET = process.env.EMAIL_CONFIRM_SECRET!;
const COOKIE_NAME = process.env.COOKIE_NAME!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export const confirmEmail = async (req: Request, res: Response) => {
  const token = req.query.token;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('Неверная ссылка подтверждения');
  }

  try {
    const payload = jwt.verify(token, EMAIL_CONFIRM_SECRET) as {
      name: string;
      email: string;
      password: string;
    };

    const { name, email, password } = payload;

    // Проверка: уже подтверждён?
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return res.status(400).send('Аккаунт уже подтверждён');
    }

    // Создание нового пользователя
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    const userId = (result as any).insertId;

    // Удаляем из pending_users
    await db.query('DELETE FROM pending_users WHERE email = ?', [email]);

    // Генерация JWT
    const authToken = jwt.sign(
      { id: userId, name, email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Установка cookie
    res.cookie(COOKIE_NAME, authToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // Поставь true при HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 день
    });

    // Редирект на фронт
    return res.redirect(`${FRONTEND_URL}/dashboard`);

  } catch (err) {
    console.error('Ошибка подтверждения email:', err);
    return res.status(400).send('Ссылка недействительна или устарела');
  }
};
