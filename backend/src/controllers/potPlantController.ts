import { Request, Response } from 'express';
import db  from '../models/db';
import { createPotPlant } from '../controllers/potPlantController'

export const createPotPlant = async (req: Request, res: Response) => {
  const { windowsillId, volume, culture } = req.body

  try {
    await db.execute(
      'INSERT INTO pots (windowsill_id, volume, culture) VALUES (?, ?, ?)',
      [windowsillId, volume, culture]
    )
    res.status(201).json({ message: 'Горшок добавлен' })
  } catch (error) {
    console.error('Ошибка при добавлении горшка:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
export const getPotsByWindowsill = async (req: Request, res: Response) => {
  const { windowsillId } = req.query

  if (!windowsillId) {
    return res.status(400).json({ message: 'Не указан ID подоконника' })
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, culture, volume FROM pots WHERE windowsill_id = ?',
      [windowsillId]
    )
    res.json(rows)
  } catch (error) {
    console.error('Ошибка при получении горшков:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
