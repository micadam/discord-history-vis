import type { Client } from '@libsql/client';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';

const db = drizzle(process.env.DATABASE_URL as string);

export function dbGet(): typeof db {
  // Maybe abstract it more in the future?
  return db;
}
