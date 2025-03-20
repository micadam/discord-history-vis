import { dbGet } from '$lib/db/facade';
import { mainAuthorsTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';

export async function GET() {
  const mainAuthors = (
    await dbGet().select({ name: mainAuthorsTable.name }).from(mainAuthorsTable)
  ).map((row) => row.name);

  return json(mainAuthors);
}
