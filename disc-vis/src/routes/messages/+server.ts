import { dbGet } from '$lib/db/facade';
import { messagesTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export async function GET() {
  const db = dbGet();
  const messages = await db
    .select()
    .from(messagesTable)
    .orderBy(sql`RANDOM()`)
    .limit(10);

  return json(messages);
}
