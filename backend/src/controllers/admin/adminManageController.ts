// controllers/admin/adminManageController.ts
import { Request, Response } from 'express';
import db from '../../models/db';
import bcrypt from 'bcrypt';

export const createAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [existingAdmins] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
    if ((existingAdmins as any[]).length > 0) {
      return res.status(400).json({ message: 'Админ с таким email уже существует' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashed]);

    res.json({ message: 'Админ создан' });
  } catch (err) {
    console.error('Ошибка при создании админа:', err);
    res.status(500).json({ message: 'Ошибка при создании админа' });
  }
};

// Получение данных администратора
export const getAdminById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [admins] = await db.query('SELECT id, email, created_at FROM admins WHERE id = ?', [id]);
    const admin = (admins as any[])[0];

    if (!admin) {
      return res.status(404).json({ message: 'Администратор не найден' });
    }

    res.json({
      id: admin.id,
      email: admin.email,
      created_at: admin.created_at,
    });
  } catch (err) {
    console.error('Ошибка при получении данных администратора:', err);
    res.status(500).json({ message: 'Ошибка при получении данных администратора' });
  }
};

// Обновление email администратора
export const updateAdminEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    // Проверка на существование администратора с таким email
    const [existingAdmins] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
    if ((existingAdmins as any[]).length > 0) {
      return res.status(400).json({ message: 'Администратор с таким email уже существует' });
    }

    // Обновляем email администратора
    await db.query('UPDATE admins SET email = ? WHERE id = ?', [email, id]);

    res.json({ message: 'Email администратора успешно обновлен' });
  } catch (err) {
    console.error('Ошибка при обновлении email:', err);
    res.status(500).json({ message: 'Ошибка при обновлении email' });
  }
};

// Обновление пароля администратора
export const updateAdminPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Обновляем пароль администратора
    await db.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ message: 'Пароль администратора успешно обновлен' });
  } catch (err) {
    console.error('Ошибка при обновлении пароля:', err);
    res.status(500).json({ message: 'Ошибка при обновлении пароля' });
  }
};