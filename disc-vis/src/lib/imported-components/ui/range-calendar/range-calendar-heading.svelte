<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
  import { cn } from '$lib/imported-utils.js';

  type $$Props = RangeCalendarPrimitive.HeadingProps;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Heading
  let:headingValue
  class={cn('text-sm font-medium', className)}
  {...$$restProps}
>
  <slot {headingValue}>
    {headingValue}
  </slot>
</RangeCalendarPrimitive.Heading>
