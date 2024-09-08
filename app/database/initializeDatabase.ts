import { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      modelo TEXT NOT NULL,
      marca TEXT NOT NULL,
      placa TEXT NOT NULL,
      carroceria TEXT NOT NULL,
      eletrico INTEGER NOT NULL
    );
  `);
}