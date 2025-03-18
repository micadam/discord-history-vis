import { dbGet } from '$lib/db/facade';
import { messagesTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';

export async function GET() {
  const db = dbGet();
  const channels = (
    await db
      .select({
        channel: messagesTable.channel
      })
      .from(messagesTable)
      .groupBy(messagesTable.channel)
      .orderBy(messagesTable.channel)
  ).map((row) => row.channel);
  return json(channels);
}
