import { withDatabase } from './database';

export type MenuItem = {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

const menuUrl =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const imageUrl =
  'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseMenu(payload: unknown): MenuItem[] {
  if (!isRecord(payload) || !Array.isArray(payload.menu)) {
    throw new Error('The menu server returned an invalid response.');
  }

  return payload.menu.map((entry, index) => {
    if (
      !isRecord(entry) ||
      typeof entry.name !== 'string' ||
      typeof entry.price !== 'number' ||
      typeof entry.description !== 'string' ||
      typeof entry.image !== 'string' ||
      typeof entry.category !== 'string'
    ) {
      throw new Error(`The menu item at position ${index + 1} is invalid.`);
    }

    return {
      name: entry.name,
      price: entry.price,
      description: entry.description,
      image: `${imageUrl}${encodeURIComponent(entry.image)}?raw=true`,
      category: entry.category.toLowerCase(),
    };
  });
}

export async function fetchMenu(): Promise<MenuItem[]> {
  const response = await fetch(menuUrl);
  if (!response.ok) {
    throw new Error(`Unable to download the menu (HTTP ${response.status}).`);
  }

  return parseMenu(await response.json());
}

export async function getMenuItems(
  searchText = '',
  categories: string[] = [],
): Promise<MenuItem[]> {
  const conditions: string[] = [];
  const parameters: string[] = [];
  const search = searchText.trim();

  if (search) {
    const escapedSearch = search.replace(/[\\%_]/g, '\\$&');
    conditions.push("name LIKE ? ESCAPE '\\'");
    parameters.push(`%${escapedSearch}%`);
  }

  if (categories.length > 0) {
    conditions.push(`category IN (${categories.map(() => '?').join(', ')})`);
    parameters.push(...categories);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  return withDatabase((db) =>
    db.getAllAsync<MenuItem>(
      `SELECT name, price, description, image, category
       FROM menu
       ${whereClause}
       ORDER BY name COLLATE NOCASE`,
      ...parameters,
    ),
  );
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
  await withDatabase(async (db) => {
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM menu');

      for (const item of items) {
        await db.runAsync(
          `INSERT INTO menu (name, price, description, image, category)
           VALUES (?, ?, ?, ?, ?)`,
          item.name,
          item.price,
          item.description,
          item.image,
          item.category,
        );
      }
    });
  });
}
