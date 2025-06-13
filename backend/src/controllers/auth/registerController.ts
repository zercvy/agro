// // Контроллер регистрации нового пользователя

// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import db from '../../models/db';
// import validator from 'validator';
// import { verifyRecaptcha } from './commonAuthController';

// export const register = async (req: Request, res: Response) => {
//   let { name, email, password, captchaToken } = req.body;

//   // Очистка и базовая валидация входных данных
//   name = validator.escape(name.trim());
//   email = validator.normalizeEmail(email);
//   password = password.trim();

//   if (!validator.isEmail(email || '')) {
//     return res.status(400).json({ message: 'Некорректный email' });
//   }

//   if (!validator.isLength(password, { min: 6 })) {
//     return res.status(400).json({ message: 'Пароль должен содержать не менее 6 символов' });
//   }

//   // Проверка reCAPTCHA
//   if (!captchaToken || !(await verifyRecaptcha(captchaToken))) {
//     return res.status(403).json({ message: 'Проверка капчи не пройдена' });
//   }

//   // Проверка на существующего пользователя
//   const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
//   if ((users as any[]).length > 0) {
//     return res.status(400).json({ message: 'Email уже используется' });
//   }

//   // Хеширование пароля и создание нового пользователя
//   const hashedPassword = await bcrypt.hash(password, 10);
//   await db.query(
//     'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//     [name, email, hashedPassword]
//   );

//   res.status(201).json({ message: 'Пользователь зарегистрирован' });
// };
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../../models/db';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { verifyRecaptcha } from './commonAuthController';
import { sendEmail } from '../../utils/mailer';

const EMAIL_CONFIRM_SECRET = process.env.EMAIL_CONFIRM_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export const register = async (req: Request, res: Response) => {
  let { name, email, password, captchaToken } = req.body;

  // Очистка и валидация
  name = validator.escape(name.trim());
  email = validator.normalizeEmail(email || '') || '';
  password = password.trim();

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Некорректный email' });
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });
  }

  if (!captchaToken || !(await verifyRecaptcha(captchaToken))) {
    return res.status(403).json({ message: 'Проверка капчи не пройдена' });
  }

  // Проверка: email уже подтверждён?
  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if ((existing as any[]).length > 0) {
    return res.status(400).json({ message: 'Email уже используется' });
  }

  // Проверка: есть ли уже такая неподтверждённая регистрация
  const [pending] = await db.query('SELECT id FROM pending_users WHERE email = ?', [email]);
  if ((pending as any[]).length > 0) {
    return res.status(400).json({ message: 'Письмо с подтверждением уже отправлено' });
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Генерируем токен с данными (на 1 час)
  const token = jwt.sign({ name, email, password: hashedPassword }, EMAIL_CONFIRM_SECRET, {
    expiresIn: '1h',
  });

  // Сохраняем в pending_users
  await db.query(
    'INSERT INTO pending_users (name, email, password, token) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, token]
  );

  // Формируем ссылку подтверждения
  const confirmLink = `${FRONTEND_URL}/verify?token=${token}`;

  // Отправляем письмо
  await sendEmail(
    email,
    'Подтверждение регистрации',
    `
      <h2>Здравствуйте, ${name}!</h2>
      <p>Спасибо за регистрацию. Чтобы подтвердить email, перейдите по ссылке ниже:</p>
      <a href="${confirmLink}">${confirmLink}</a>
      <p>Ссылка действительна 1 час.</p>
    `
  );

  return res.status(200).json({ message: 'Письмо с подтверждением отправлено на почту' });
};
