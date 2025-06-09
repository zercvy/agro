import { Request, Response } from 'express'
import db from '../models/db';
export const getWindowsills = async (req: Request, res: Response) => {
  const userId = req.user?.id
  const [rows] = await db.execute(
    'SELECT id, side, floor FROM windowsills WHERE user_id = ?',
    [userId]
  )
  res.json(rows)
}

export const createWindowsill = async (req: Request, res: Response) => {
  const { side, floor, hasLamp, barriers } = req.body
  const userId = req.user?.id

  try {
    const [result] = await db.execute(
      'INSERT INTO windowsills (user_id, side, floor, has_lamp) VALUES (?, ?, ?, ?)',
      [userId, side, floor, hasLamp]
    )

    const windowsillId = (result as any).insertId

    for (const barrier of barriers) {
      await db.execute(
        'INSERT INTO barriers (windowsill_id, type, height, distance, width) VALUES (?, ?, ?, ?, ?)',
        [windowsillId, barrier.type, barrier.height, barrier.distance, barrier.width || null]
      )
    }

    res.status(201).json({ id: windowsillId })
  } catch (error) {
    console.error('Ошибка при создании подоконника:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
