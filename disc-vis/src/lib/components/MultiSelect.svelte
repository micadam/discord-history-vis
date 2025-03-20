<script lang="ts">
  import * as Select from '$lib/imported-components/ui/select/index';
  import type { Selected } from 'bits-ui';
  import Delete from 'lucide-svelte/icons/delete';

  let { options, selectedOptions = $bindable() }: { options: string[]; selectedOptions: string[] } =
    $props();

  function handleSelectChange(selected: Selected<string>[] | undefined) {
    selectedOptions = selected ? selected.map((option) => option.value) : [];
  }
</script>

<Select.Root
  multiple
  onSelectedChange={handleSelectChange}
  selected={selectedOptions.map((option) => ({ value: option, label: option }))}
>
  <Select.Trigger class="w-[180px]">
    <Select.Value placeholder="Select" />
  </Select.Trigger>
  <Delete class="h-4 w-4" onclick={() => (selectedOptions = [])} />
  <Select.Content class="overflow-scroll h-[200px]">
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      {#each options as option}
        <Select.Item value={option} label={option}>{option}</Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name="favoriteFruit" />
</Select.Root>
