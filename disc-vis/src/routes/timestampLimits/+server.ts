import { dbGet } from '$lib/db/facade';
import { messagesTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { max, min } from 'drizzle-orm';

export async function GET() {
  const db = dbGet();
  const timestampLimits = await db
    .select({
      minTimestamp: min(messagesTable.timestamp),
      maxTimestamp: max(messagesTable.timestamp)
    })
    .from(messagesTable);

  return json(timestampLimits[0]);
}
