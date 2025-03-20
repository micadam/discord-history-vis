import { dbGet } from '$lib/db/facade';
import { messagesTable } from '$lib/db/schema';
import { getDbFilter, getFilterFromURL } from '$lib/serverUtils';
import type { GroupBy } from '$lib/types';
import { json } from '@sveltejs/kit';
import * as d3 from 'd3';
import { and, count, gte, inArray, lte, sql } from 'drizzle-orm';

export async function GET({ url }) {
  const filter = getFilterFromURL(url);
  const groupBy = url.searchParams.get('groupBy') as GroupBy;

  const groupByValue = (() => {
    if (groupBy === 'author') {
      return messagesTable.author;
    } else if (groupBy === 'channel') {
      return messagesTable.channel;
    } else if (groupBy === 'year') {
      return sql`strftime('%Y', ${messagesTable.timestamp})`;
    } else if (groupBy === 'dayOfWeek') {
      return sql`strftime('%w', ${messagesTable.timestamp})`;
    } else if (groupBy === 'hour') {
      return sql`strftime('%H', ${messagesTable.timestamp})`;
    } else {
      return messagesTable.author;
    }
  })();

  const data = await dbGet()
    .select({
      count: count(messagesTable.id),
      groupBy: groupByValue
    })
    .from(messagesTable)
    .where(getDbFilter(filter))
    .groupBy(groupByValue);

  return json(data);
}
