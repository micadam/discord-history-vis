import type { CalendarDate } from '@internationalized/date';

export interface FilterInfo {
  authors: string[];
  channels: string[];
  dateRange: { start: CalendarDate; end: CalendarDate };
}

export type GroupBy = 'author' | 'channel' | 'hour' | 'dayOfWeek' | 'year';
