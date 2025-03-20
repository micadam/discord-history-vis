<script lang="ts">
  import MultiSelect from '../MultiSelect.svelte';

  let { channels, selectedChannels = $bindable() } = $props();
</script>

<MultiSelect options={channels} bind:selectedOptions={selectedChannels} />
