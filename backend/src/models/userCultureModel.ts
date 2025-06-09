import db from './db';

export interface UserCulture {
  id: number;
  name: string;
  description: string;
  usedIn: string[];
}

export const getUserCultures = async (userId: number): Promise<UserCulture[]> => {
  // 1) Сначала достаём базовый список культур из user_cultures
  const [cultRows] = await db.execute<{
    id: number;
    name: string;
    description: string;
  }[]>(
    `SELECT uc.culture_id AS id, c.name, c.description
     FROM user_cultures uc
     JOIN cultures c ON uc.culture_id = c.id
     WHERE uc.user_id = ?`,
    [userId]
  );

  // 2) Для каждой культуры собираем список plot-имён из plot_cultures
  //    и список pot-имён (из поля pots.culture)
  const result: UserCulture[] = [];
  for (const row of cultRows) {
    const culture: UserCulture = {
      id: row.id,
      name: row.name,
      description: row.description,
      usedIn: [],
    };

    // plots
    const [plots] = await db.execute<{ name: string }[]>(
      `SELECT p.name
       FROM plot_cultures pc
       JOIN plots p ON pc.plot_id = p.id
       WHERE pc.culture_id = ? AND p.user_id = ?`,
      [culture.id, userId]
    );
    const plotNames = plots.map(r => r.name);

    // pots
    const [pots] = await db.execute<{ name: string }[]>(
      `SELECT pt.culture AS name
       FROM pots pt
       JOIN windowsills w ON pt.windowsill_id = w.id
       WHERE pt.culture = ? AND w.user_id = ?`,
      [culture.name, userId]
    );
    const potNames = pots.map(r => r.name);

    culture.usedIn = [...plotNames, ...potNames];
    result.push(culture);
  }

  return result;
};
