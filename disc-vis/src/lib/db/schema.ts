import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const messagesTable = sqliteTable('messages', {
  id: text().primaryKey(), // Using text() instead of int() because the numeric id is too large for SQLite to handle
  author: text().notNull(),
  content: text().notNull(),
  channel: text().notNull(),
  timestamp: text().notNull()
});

export const mainAuthorsTable = sqliteTable('main_authors', {
  id: text().primaryKey(),
  name: text().notNull()
});
