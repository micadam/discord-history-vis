import { dbGet } from '$lib/db/facade.js';
import { messagesTable } from '$lib/db/schema.js';
import { getDbFilter, getFilterFromURL } from '$lib/serverUtils';
import { json } from '@sveltejs/kit';
import { and, count, desc, inArray, ne, not, sql } from 'drizzle-orm';

const STOP_WORDS = [
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'it',
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
  'and',
  'but',
  'if',
  'or',
  'because',
  'as',
  'until',
  'while',
  'of',
  'at',
  'by',
  'for',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'in',
  'out',
  'on',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'can',
  'will',
  'just',
  'don',
  'should',
  'now',
  ''
];

export async function GET({ url }) {
  const filter = getFilterFromURL(url);

  const db = dbGet();
  const words = db.$with('words').as(
    db
      .select({
        word: sql<string>`lower(trim(value, '.,!?()[]{}"'))`.as('word')
      })
      .from(
        sql`messages, json_each('['||replace(json_quote(${messagesTable.content}),' ','","')||']')`
      )
      .where(getDbFilter(filter))
  );
  const data = await db
    .with(words)
    .select({
      text: words.word,
      count: count()
    })
    .from(words)
    .where(and(not(inArray(words.word, STOP_WORDS)), ne(words.word, '')))
    .groupBy(words.word)
    .orderBy(desc(count()))
    .limit(10_000);

  return json(data);
}
