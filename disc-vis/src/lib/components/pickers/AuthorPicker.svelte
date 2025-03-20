<script lang="ts">
  import MultiSelect from '../MultiSelect.svelte';

  let { authors, selectedAuthors = $bindable() } = $props();
</script>

<MultiSelect options={authors} bind:selectedOptions={selectedAuthors} />
