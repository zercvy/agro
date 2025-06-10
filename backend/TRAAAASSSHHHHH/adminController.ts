// import { Request, Response } from 'express';
// import  db  from '../src/models/db';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';
// const JWT_SECRET = process.env.JWT_SECRET!;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// export const loginAdmin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
//   const admin = (admins as any[])[0];
//   if (!admin) return res.status(401).json({ message: 'Неверный email или пароль' });
//   console.log("Admin from DB:", admin); // ✅ внутрь функции
//   const valid = await bcrypt.compare(password, admin.password);
//   console.log("Match:", valid); // ✅ внутрь функции
//   if (!valid) return res.status(401).json({ message: 'Неверный email или пароль' });

//   const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, {
//     expiresIn: JWT_EXPIRES_IN
//   });

//   res.cookie(COOKIE_NAME, token, {
//     httpOnly: true,
//     sameSite: 'strict',
//     secure: false // true — в проде
//   }).json({ message: 'Успешный вход администратора' });
// };

// export const getAdminProfile = async (req: Request, res: Response) => {
//   res.json(req.admin);
// };

// // Получить всех пользователей
// export const getUserStats = async (req: Request, res: Response) => {
//   const [users] = await db.query('SELECT id, name, email, created_at FROM users');
//   res.json({
//     count: (users as any[]).length,
//     users,
//   });
// };

// // 📈 Статистика
// export const getAdminStats = async (_req: Request, res: Response) => {
//   try {
//     const [[{ userCount }]] = await db.query('SELECT COUNT(*) AS userCount FROM users');
//     const [[{ plotCount }]] = await db.query('SELECT COUNT(*) AS plotCount FROM plots');
//     const [[{ adminCount }]] = await db.query('SELECT COUNT(*) AS adminCount FROM admins');

//     res.json({
//       users: userCount,
//       plots: plotCount,
//       admins: adminCount
//     });
//   } catch (err) {
//     console.error('Ошибка при получении статистики:', err);
//     res.status(500).json({ message: 'Ошибка при получении статистики' });
//   }
// };

// // ➕ Создание нового админа
// export const createAdmin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const [existingAdmins] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
//     if ((existingAdmins as any[]).length > 0) {
//       return res.status(400).json({ message: 'Админ с таким email уже существует' });
//     }

//     const hashed = await bcrypt.hash(password, 10);
//     await db.query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashed]);

//     res.json({ message: 'Админ создан' });
//   } catch (err) {
//     console.error('Ошибка при создании админа:', err);
//     res.status(500).json({ message: 'Ошибка при создании админа' });
//   }
// };


