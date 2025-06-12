import { Request, Response } from 'express'
import db from '../models/db'

export const getSoilTypes = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT id, name, ph_min, ph_max, description FROM soil_types')
    res.json(rows)
  } catch (err) {
    console.error('Ошибка при получении типов почвы:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
