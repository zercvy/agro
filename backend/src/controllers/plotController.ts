import { Request, Response } from 'express';
import  db  from '../models/db';

export const createPlot = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, type, coordinates, area, perimeter, soil_type } = req.body;

  if (!name || !coordinates) {
    return res.status(400).json({ message: 'Название и координаты обязательны' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO plots (user_id, name, type, coordinates, area, perimeter, soil_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, type, JSON.stringify(coordinates), area, perimeter, soil_type]
    );

    const insertId = (result as any).insertId;
    res.status(201).json({ id: insertId });
    // res.status(201).json({ message: 'Участок успешно создан' });
  } catch (err) {
    console.error('Ошибка создания участка:', err);
    res.status(500).json({ message: 'Ошибка сервера при создании участка' });
  }
};

export const getUserPlots = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const [rows] = await db.query(`SELECT * FROM plots WHERE user_id = ?`, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Ошибка получения участков:', err);
    res.status(500).json({ message: 'Ошибка сервера при получении участков' });
  }
};

export const getPlotById = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  try {
    const [rows] = await db.query('SELECT * FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    const plot = (rows as any[])[0];

    if (!plot) return res.status(404).json({ message: 'Участок не найден' });

    res.json(plot);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения участка' });
  }
};

export const deletePlot = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  try {
    const [result] = await db.query('DELETE FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    res.json({ message: 'Участок удалён' });
  } catch (err) {
    console.error('Ошибка удаления:', err);
    res.status(500).json({ message: 'Ошибка сервера при удалении' });
  }
};

export const updatePlot = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  const {
    name,
    type,
    soil_type,
    coordinates,
    area,
    perimeter,
    lightBarrier,
    windBarrier
  } = req.body;

  try {
    const [rows] = await db.query('SELECT id FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    if ((rows as any[]).length === 0) {
      return res.status(403).json({ message: 'Нет доступа к этому участку' });
    }

    await db.query(
      `UPDATE plots
       SET name = ?, type = ?, soil_type = ?, coordinates = ?, area = ?, perimeter = ?, lightBarrier = ?, windBarrier = ?
       WHERE id = ? AND user_id = ?`,
      [
        name,
        type,
        soil_type,
        JSON.stringify(coordinates),
        area,
        perimeter,
        JSON.stringify(lightBarrier),
        JSON.stringify(windBarrier),
        plotId,
        userId
      ]
    );

    res.json({ message: 'Участок обновлён' });
  } catch (err) {
    console.error('Ошибка обновления участка:', err);
    res.status(500).json({ message: 'Ошибка при обновлении участка' });
  }
};
export const getBarriersByPlot = async (req: Request, res: Response) => {
  const plotId = req.params.id;
  const userId = req.user?.id;

  try {
    // Проверка: участок принадлежит пользователю
    const [rows] = await db.query('SELECT id FROM plots WHERE id = ? AND user_id = ?', [plotId, userId]);
    if ((rows as any[]).length === 0) {
      return res.status(403).json({ message: 'Нет доступа к этому участку' });
    }

    // Получаем преграды
    const [barriers] = await db.query('SELECT * FROM barriers WHERE plot_id = ?', [plotId]);

    // Парсим геометрию из строки
    const parsedBarriers = (barriers as any[]).map((barrier) => ({
      ...barrier,
      geometry: JSON.parse(barrier.geometry),
    }));

    res.json(parsedBarriers);
  } catch (err) {
    console.error('Ошибка получения преград:', err);
    res.status(500).json({ message: 'Ошибка при получении преград' });
  }
};
