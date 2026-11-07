import * as SQLite from 'expo-sqlite';

const databaseName = 'little_lemon.db';
let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;
let operationQueue: Promise<void> = Promise.resolve();

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(databaseName).then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (
          name TEXT PRIMARY KEY NOT NULL,
          price REAL NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          category TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS profile (
          id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL
        );
      `);
      return db;
    });
  }

  try {
    return await databasePromise;
  } catch (error) {
    databasePromise = undefined;
    throw error;
  }
}

export function withDatabase<T>(
  operation: (database: SQLite.SQLiteDatabase) => Promise<T>,
): Promise<T> {
  const result = operationQueue.then(async () => operation(await getDatabase()));
  operationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}
