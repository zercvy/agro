import { Request, Response } from 'express'
import db from '../models/db'

// Получить все культуры плоским списком
export const getAllCultures = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM cultures')
    res.json(rows)
  } catch (err) {
    console.error('Ошибка при получении всех культур:', err)
    res.status(500).json({ error: 'Ошибка при получении культур' })
  }
}

// Получить иерархию культур по parent_id (старый способ, без категорий)
export const getCultureTree = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute<({ id: number, name: string, parent_id: number | null })[]>(
      'SELECT id, name, parent_id FROM cultures'
    )
    const flat = rows as any[]

    // построение дерева
    const map = new Map<number, any>()
    const tree: any[] = []

    flat.forEach(item => {
      map.set(item.id, { id: item.id, name: item.name, children: [] })
    })
    flat.forEach(item => {
      const node = map.get(item.id)
      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id).children.push(node)
      } else {
        tree.push(node)
      }
    })

    res.json(tree)
  } catch (err) {
    console.error('Ошибка при получении иерархии культур:', err)
    res.status(500).json({ error: 'Ошибка при получении иерархии культур' })
  }
}

// Новый способ: культуры по категориям и с деревом внутри каждой категории
export const getCultureTreeByCategories = async (req: Request, res: Response) => {
  try {
    // Получаем культуры с категорией
    const [rows] = await db.execute<({ 
      id: number, 
      name: string, 
      parent_id: number | null,
      category_id: number | null,
      category: string
    })[]>(
      `SELECT c.id, c.name, c.parent_id, c.category_id, cc.name as category
       FROM cultures c
       LEFT JOIN culture_categories cc ON c.category_id = cc.id
       ORDER BY c.category_id, c.parent_id, c.id`
    )
    const flat = rows as any[]

    // Группировка по категориям
    const grouped: Record<string, any[]> = {}
    flat.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = []
      grouped[item.category].push(item)
    })

    // Рекурсивное построение дерева внутри категории
    function buildTree(arr: any[], parentId: number | null = null) {
      return arr
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          id: item.id,
          name: item.name,
          children: buildTree(arr, item.id)
        }))
    }

    // [{ category, items: [...] }]
    const result = Object.entries(grouped).map(([category, items]) => ({
      category,
      items: buildTree(items)
    }))

    res.json(result)
  } catch (err) {
    console.error('Ошибка при получении культур по категориям:', err)
    res.status(500).json({ error: 'Ошибка при получении культур по категориям' })
  }
}
