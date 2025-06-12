import { Request, Response } from 'express'
import db from '../../models/db'

// 🌿 Основной контроллер рекомендаций культур
// export const recommendCrops = async (req: Request, res: Response) => {
//   try {
//     const { light, soil, wind, potSize, region } = req.body

//     console.log('🔍 Получено:', { light, soil, wind, potSize, region })

//     const query = `
//       SELECT DISTINCT c.name
//       FROM cultures c
//       JOIN culture_soils cs ON cs.culture_id = c.id
//       JOIN soil_types st ON st.id = cs.soil_type_id
//       WHERE st.name = ?
//         AND (c.min_pot_volume IS NULL OR c.min_pot_volume <= ?)
//         AND (c.wind_protection_required = 0 OR ? = 'да')
//         AND (c.climate_zone IS NULL OR c.climate_zone = ?)
//     `;

//     const [results] = await db.query(query, [
//       region || null, region || null,
//       potSize || null, potSize || null,
//       wind === 'да' ? 1 : wind === 'нет' ? 0 : null,
//       wind === 'да' ? 1 : wind === 'нет' ? 0 : null,
//       soil || null, soil || null,
//     ])
// console.log('🌿 Рекомендации:');
// console.log({ soil, potSize, wind, region });
// console.log('SQL Результат:', results);
//     res.json(results)
//   } catch (err) {
//     console.error('❌ Ошибка рекомендаций:', err)
//     res.status(500).json({ message: 'Ошибка получения рекомендаций' })
//   }
// }
export const recommendCrops = async (req: Request, res: Response) => {
  try {
    const { light, soil, wind, potSize, region } = req.body;

    console.log('🔍 Получено:', { light, soil, wind, potSize, region });

    const query = `
      SELECT DISTINCT c.name
      FROM cultures c
      JOIN culture_soils cs ON cs.culture_id = c.id
      JOIN soil_types st ON st.id = cs.soil_type_id
      WHERE st.name = ?
        AND (c.min_pot_volume IS NULL OR c.min_pot_volume <= ?)
        AND (c.wind_protection_required IS NULL OR c.wind_protection_required = ?)
        AND (c.climate_zone IS NULL OR c.climate_zone = ?)
    `;

    const [results] = await db.query(query, [
      soil,
      parseInt(potSize) || 0,
      wind === 'да' ? 1 : 0,
      region
    ]);

    console.log('🌿 SQL результат:', results);
    res.json(results);
  } catch (err) {
    console.error('❌ Ошибка рекомендаций:', err);
    res.status(500).json({ message: 'Ошибка получения рекомендаций' });
  }
};

// 🧱 Получить список всех почв из БД
export const getSoilTypes = async (_req: Request, res: Response) => {
  try {
    const [soils] = await db.query('SELECT id, name FROM soil_types')
    res.json(soils)
  } catch (err) {
    console.error('❌ Ошибка при получении почв:', err)
    res.status(500).json({ message: 'Ошибка загрузки почв' })
  }
}

// 🌱 Получить список всех культур
export const getCultures = async (_req: Request, res: Response) => {
  try {
    const [cultures] = await db.query('SELECT id, name FROM cultures')
    res.json(cultures)
  } catch (err) {
    console.error('❌ Ошибка при получении культур:', err)
    res.status(500).json({ message: 'Ошибка загрузки культур' })
  }
}
