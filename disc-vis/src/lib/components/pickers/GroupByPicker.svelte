<script lang="ts">
  import type { GroupBy } from '$lib/types';

  let { groupBy = $bindable() }: { groupBy: GroupBy } = $props();

  const OPTIONS = ['author', 'channel', 'year', 'dayOfWeek', 'hour'];
</script>

<div class="flex items-center space-x-2">
  <label for="groupBy">Group by:</label>
  <select id="groupBy" bind:value={groupBy}>
    {#each OPTIONS as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
</div>
