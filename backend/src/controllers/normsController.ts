import { Request, Response } from 'express'
import db from '../models/db'

// все нормы сразу, с подгрузкой имён культур и элементов
export const getNutrientNorms = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      `SELECT nn.id,
              nn.culture_id,
              c.name AS culture,
              nn.nutrient_id,
              n.name AS nutrient,
              nn.amount_per_t
       FROM nutrient_norms nn
       JOIN cultures c ON nn.culture_id = c.id
       JOIN nutrients n ON nn.nutrient_id = n.id`
    )
    res.json(rows)
  } catch (err) {
    console.error('Ошибка при получении nutrient_norms:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// нормы только для конкретной культуры
export const getNormsByCulture = async (req: Request, res: Response) => {
  const cultureId = Number(req.params.cultureId)
  try {
    const [rows] = await db.execute(
      'SELECT nutrient_id, amount_per_t FROM nutrient_norms WHERE culture_id = ?',
      [cultureId]
    )
    res.json(rows)
  } catch (err) {
    console.error('Ошибка при получении норм по культуре:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
