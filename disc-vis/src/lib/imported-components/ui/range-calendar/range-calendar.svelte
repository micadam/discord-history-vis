<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
  import * as RangeCalendar from './index.js';
  import * as Select from '$lib/imported-components/ui/select/index.js';
  import { cn } from '$lib/imported-utils.js';

  type $$Props = RangeCalendarPrimitive.Props;
  type $$Events = RangeCalendarPrimitive.Events;

  export let value: $$Props['value'] = undefined;
  export let placeholder: $$Props['placeholder'] = undefined;
  export let weekdayFormat: $$Props['weekdayFormat'] = 'short';
  export let startValue: $$Props['startValue'] = undefined;

  const monthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ].map((month, i) => ({ value: i + 1, label: month }));

  const yearOptions = Array.from({ length: 15 }, (_, i) => ({
    label: String(new Date().getFullYear() - i),
    value: new Date().getFullYear() - i
  }));

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Root
  on:keydown
  bind:value
  bind:placeholder
  bind:startValue
  {weekdayFormat}
  class={cn('p-3', className)}
  {...$$restProps}
  let:months
  let:weekdays
>
  <RangeCalendar.Header>
    <RangeCalendar.PrevButton />
    <RangeCalendar.Heading class="flex w-full items-center justify-between gap-2">
      <Select.Root
        items={monthOptions}
        onSelectedChange={(v) => {
          if (!v || !placeholder) return;
          if (v.value === placeholder?.month) return;
          placeholder = placeholder.set({ month: v.value });
        }}
      >
        <Select.Trigger aria-label="Select month" class="w-[60%]">
          <Select.Value placeholder="Month" />
        </Select.Trigger>
        <Select.Content class="max-h-[200px] overflow-y-auto">
          {#each monthOptions as { value, label }}
            <Select.Item {value} {label}>
              {label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <Select.Root
        items={yearOptions}
        onSelectedChange={(v) => {
          if (!v || !placeholder) return;
          if (v.value === placeholder?.year) return;
          placeholder = placeholder.set({ year: v.value });
        }}
      >
        <Select.Trigger aria-label="Year" class="w-[40%]">
          <Select.Value placeholder="Year" />
        </Select.Trigger>
        <Select.Content class="max-h-[200px] overflow-y-auto">
          {#each yearOptions as { value, label }}
            <Select.Item {value} {label}>
              {label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </RangeCalendar.Heading>
    <RangeCalendar.NextButton />
  </RangeCalendar.Header>
  <RangeCalendar.Months>
    {#each months as month}
      <RangeCalendar.Grid>
        <RangeCalendar.GridHead>
          <RangeCalendar.GridRow class="flex">
            {#each weekdays as weekday}
              <RangeCalendar.HeadCell>
                {weekday.slice(0, 2)}
              </RangeCalendar.HeadCell>
            {/each}
          </RangeCalendar.GridRow>
        </RangeCalendar.GridHead>
        <RangeCalendar.GridBody>
          {#each month.weeks as weekDates}
            <RangeCalendar.GridRow class="mt-2 w-full">
              {#each weekDates as date}
                <RangeCalendar.Cell {date}>
                  <RangeCalendar.Day {date} month={month.value} />
                </RangeCalendar.Cell>
              {/each}
            </RangeCalendar.GridRow>
          {/each}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    {/each}
  </RangeCalendar.Months>
</RangeCalendarPrimitive.Root>
