import { dbGet } from '$lib/db/facade';
import { messagesTable } from '$lib/db/schema';
import { getDbFilter, getFilterFromURL } from '$lib/serverUtils.js';
import type { FilterInfo } from '$lib/types';
import { CalendarDate } from '@internationalized/date';
import { json } from '@sveltejs/kit';
import { and, gte, inArray, lte, sql } from 'drizzle-orm';

export async function GET({ url }) {
  const filter = getFilterFromURL(url);

  const db = dbGet();
  const messages = await db
    .select()
    .from(messagesTable)
    .where(getDbFilter(filter))
    .orderBy(sql`RANDOM()`)
    .limit(10);

  return json(messages);
}
