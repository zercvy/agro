import { Request, Response } from 'express';
import db from '../../models/db';
import bcrypt from 'bcrypt';

// Получение данных пользователя
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Получаем данные о пользователе
    const [rows] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
    const user = (rows as any[])[0];

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Получаем информацию о связанных участках и горшках
    const [plots] = await db.query('SELECT id, name FROM plots WHERE user_id = ?', [id]);
    const [pots] = await db.query('SELECT id, culture_id FROM pots WHERE windowsill_id IN (SELECT id FROM windowsills WHERE user_id = ?)', [id]);


    res.json({
      ...user,
      plots,
      pots,
    });
  } catch (err) {
    console.error('Ошибка при получении данных пользователя:', err);
    res.status(500).json({ message: 'Ошибка при получении данных пользователя' });
  }
};

// Обновление имени пользователя
// Обновление имени пользователя
export const updateUserName = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Обновляем имя пользователя
    await db.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Имя успешно обновлено' });
  } catch (err) {
    console.error('Ошибка при обновлении имени:', err);
    res.status(500).json({ message: 'Ошибка при обновлении имени' });
  }
};

// Обновление почты пользователя
export const updateUserEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    // Проверка на существование пользователя с таким email
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if ((existingUsers as any[]).length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Обновляем email
    await db.query('UPDATE users SET email = ? WHERE id = ?', [email, id]);

    res.json({ message: 'Email успешно обновлен' });
  } catch (err) {
    console.error('Ошибка при обновлении email:', err);
    res.status(500).json({ message: 'Ошибка при обновлении email' });
  }
};

// Обновление пароля пользователя
export const updateUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Обновляем пароль
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ message: 'Пароль успешно обновлен' });
  } catch (err) {
    console.error('Ошибка при обновлении пароля:', err);
    res.status(500).json({ message: 'Ошибка при обновлении пароля' });
  }
};
