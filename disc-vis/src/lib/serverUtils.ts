import { CalendarDate } from '@internationalized/date';
import type { FilterInfo } from './types';
import { and, gte, inArray, lte } from 'drizzle-orm';
import { messagesTable } from './db/schema';

function calendarDateFromJson(json: CalendarDate): CalendarDate {
  return new CalendarDate(json.year, json.month, json.day);
}

export function getFilterFromURL(url: URL): FilterInfo {
  const query = new URLSearchParams(url.searchParams);
  const filter = JSON.parse(query.get('filter')) as FilterInfo;

  filter.dateRange.start = calendarDateFromJson(filter.dateRange.start);
  filter.dateRange.end = calendarDateFromJson(filter.dateRange.end);
  return filter;
}

export function getDbFilter(filter: FilterInfo) {
  return and(
    inArray(messagesTable.author, filter.authors),
    inArray(messagesTable.channel, filter.channels),
    gte(messagesTable.timestamp, filter.dateRange.start.toString()),
    lte(messagesTable.timestamp, filter.dateRange.end.add({ days: 1 }).toString())
  );
}
