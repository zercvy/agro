import { Request, Response } from 'express'
import db from '../models/db'

export const getUserObjects = async (req: Request, res: Response) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Не авторизован' })

  try {
    // Участки
    const [plots] = await db.execute(
      'SELECT id, name FROM plots WHERE user_id = ?',
      [userId]
    )
    // Горшки: у них нет name, но есть поле `culture` — пусть это название
    const [pots] = await db.execute(
      `SELECT p.id, p.culture AS name
       FROM pots p
       JOIN windowsills w ON p.windowsill_id = w.id
       WHERE w.user_id = ?`,
      [userId]
    )

    res.json({ plots, pots })
  } catch (err) {
    console.error('Ошибка при получении объектов пользователя:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}
