import { Request, Response } from 'express'
import db from '../models/db'

export const getOrganicTypes = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, n_percent, p2o5_percent, k2o_percent, description FROM organic_types'
    )
    res.json(rows)
  } catch (err) {
    console.error('Ошибка при получении organic_types:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
