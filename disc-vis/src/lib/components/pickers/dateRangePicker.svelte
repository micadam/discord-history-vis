<script lang="ts">
  import { Button } from '$lib/imported-components/ui/button/index.js';
  import * as Popover from '$lib/imported-components/ui/popover/index.js';
  import { RangeCalendar } from '$lib/imported-components/ui/range-calendar/index.js';
  import { cn } from '$lib/imported-utils.js';
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone
  } from '@internationalized/date';
  import type { DateRange } from 'bits-ui';
  import CalendarIcon from 'lucide-svelte/icons/calendar';

  const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
  });

  let { dateRangeLimits, selectedDateRange = $bindable() } = $props();
</script>

<div class="grid gap-2">
  <Popover.Root openFocus>
    <Popover.Trigger asChild let:builder>
      <Button
        variant="outline"
        class={cn(
          'w-[300px] justify-start text-left font-normal',
          !selectedDateRange && 'text-muted-foreground'
        )}
        builders={[builder]}
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {#if selectedDateRange && selectedDateRange.start}
          {#if selectedDateRange.end}
            {df.format(selectedDateRange.start.toDate(getLocalTimeZone()))} - {df.format(
              selectedDateRange.end.toDate(getLocalTimeZone())
            )}
          {:else}
            {df.format(selectedDateRange.start.toDate(getLocalTimeZone()))}
          {/if}
        {:else}
          Pick a date
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        bind:value={selectedDateRange}
        initialFocus
        numberOfMonths={1}
        placeholder={selectedDateRange?.start}
        minValue={dateRangeLimits[0]}
        maxValue={dateRangeLimits[1]}
      />
    </Popover.Content>
  </Popover.Root>
</div>
