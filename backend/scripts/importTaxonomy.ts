import * as fs from 'fs'
import * as path from 'path'
// @ts-ignore
import { parser } from 'stream-json'
// @ts-ignore
import { streamArray } from 'stream-json/streamers/StreamArray'

import * as mysql from 'mysql2/promise'

const importTaxonomy = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'agro_user',
    password: 'agro_pass',
    database: 'agro_db',
  })

  const filePath = path.join(__dirname, '../data/plant_list_2023-12.json')
  const fileStream = fs.createReadStream(filePath)

  const pipeline = fileStream
    .pipe(parser())
    .pipe(streamArray())

  let insertedCount = 0

  for await (const { value: item } of pipeline) {
    // Фильтруем только виды
    if (item.rank_s !== 'species') continue

    // Пропускаем пустые имена
    const scientificName = item.full_name_string_plain_s?.trim()
    if (!scientificName || scientificName === '?') continue

    const wfoID = item.id
    const genus = item.genus_string_s || null
    const rank = item.rank_s || null
    const family = item.family || null

    try {
      await connection.execute(
        'INSERT INTO taxonomy (wfo_id, scientific_name, genus, taxon_rank, family) VALUES (?, ?, ?, ?, ?)',
        [wfoID, scientificName, genus, rank, family]
      )
      insertedCount++
    } catch (err) {
      console.error('❌ Ошибка при вставке:', err)
    }
  }

  await connection.end()
  console.log(`✅ Импорт завершён. Всего вставлено: ${insertedCount} записей.`)
}

importTaxonomy().catch((err) => {
  console.error('Ошибка импорта:', err)
})
