import { dbGet } from '$lib/db/facade';
import { messagesTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export async function GET() {
  const db = dbGet();
  const authors = (
    await db
      .select({
        author: messagesTable.author
      })
      .from(messagesTable)
      .groupBy(messagesTable.author)
      .orderBy(sql`lower(${messagesTable.author})`)
  ).map((row) => row.author);
  return json(authors);
}
