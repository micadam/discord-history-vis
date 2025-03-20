<script lang="ts">
  import { onMount } from 'svelte';
  import { messagesTable } from '$lib/db/schema';
  import type { FilterInfo } from '$lib/types';
  import { browser } from '$app/environment';

  let { filter }: { filter: FilterInfo } = $props();

  let messages: (typeof messagesTable)[] = $state([]);

  $effect(() => {
    fetchMessages();
  });

  function fetchMessages() {
    const query = new URLSearchParams();
    query.set('filter', JSON.stringify(filter));
    fetch(`/messages?${query}`)
      .then((r) => r.json())
      .then((m) => {
        messages = m;
      });
  }

  onMount(() => {
    fetchMessages();
  });
</script>

<table class="table-auto m-4">
  <thead>
    <tr>
      <th>Timestamp</th>
      <th>Author</th>
      <th>Content</th>
      <th>Channel</th>
    </tr>
  </thead>
  <tbody>
    {#each messages as message}
      <tr>
        <td>{new Date(message.timestamp).toLocaleString()}</td>
        <td>{message.author}</td>
        <td>{message.content}</td>
        <td>{message.channel}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  th {
    border: 1px solid #999;
  }
  td {
    border: 1px solid #999;
    padding: 0.5rem;
  }
</style>
