<script lang="ts">
  import { onMount } from 'svelte';
  import { messagesTable } from '$lib/db/schema';
  import DateRangePicker from '$lib/dateRangePicker.svelte';

  let authors: string[] = [];
  let channels: string[] = [];
  let messages: (typeof messagesTable)[] = [];
  let minTimestamp: string = '';
  let maxTimestamp: string = '';

  function fetch(url: string) {
    return window
      .fetch(url)
      .then((r) => r.json())
      .catch((e) => console.error(e));
  }

  onMount(() => {
    fetch('/authors').then((a) => {
      authors = a;
    });
    fetch('/channels').then((c) => {
      channels = c;
    });
    fetch('/timestampLimits').then(({ minTimestamp: min, maxTimestamp: max }) => {
      minTimestamp = min;
      maxTimestamp = max;
    });
    fetch('/messages').then((m) => {
      messages = m;
    });
  });
</script>

<h1>Hello</h1>

{authors.join(', ')}
<br /><br />
{channels.join(', ')}
<br /><br />
{minTimestamp} - {maxTimestamp}
<br /><br />
{#each messages as message}
  <p>{message.timestamp} {message.author}: {message.content}</p>
{/each}

<DateRangePicker />
