<script lang="ts">
  import { onMount } from 'svelte';

  let { visType = $bindable('Table') } = $props();

  const VIS_TYPES = ['Table', 'Bar Chart', 'Word Cloud'];

  onMount(() => {
    visType = VIS_TYPES[0];
  });
</script>

<div class="flex flex-row space-x-4 border border-gray-300 p-4 rounded-lg">
  {#each VIS_TYPES as type}
    <button
      class="vis-type px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-200"
      style="background-color: {type === visType ? 'lightblue' : 'white'}"
      onclick={() => {
        visType = type;
      }}
    >
      {type}
    </button>
  {/each}
</div>
