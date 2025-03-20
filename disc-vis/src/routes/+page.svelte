<script lang="ts">
  import { onMount } from 'svelte';
  import DateRangePicker from '$lib/components/pickers/dateRangePicker.svelte';
  import VisTypePicker from '$lib/components/pickers/VisTypePicker.svelte';
  import AuthorPicker from '$lib/components/pickers/AuthorPicker.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import MessageTable from '$lib/components/visers/MessageTable.svelte';
  import type { FilterInfo } from '$lib/types';
  import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date';
  import BarChart from '$lib/components/visers/BarChart.svelte';
  import WordCloud from '$lib/components/visers/WordCloud.svelte';

  // State received from the server
  let authors: string[] = $state([]);
  let channels: string[] = $state([]);
  let dateRangeLimits: [CalendarDate, CalendarDate] = $state([
    today(getLocalTimeZone()),
    today(getLocalTimeZone())
  ]);

  // State managed by the components
  let visType: string = $state('');
  let filter: FilterInfo = $state({
    authors: [],
    channels: [],
    dateRange: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone())
    }
  });

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
    fetch('/mainAuthors').then((a) => {
      filter = { ...filter, authors: a };
    });
    fetch('/channels').then((c) => {
      channels = c;
      filter = { ...filter, channels: c };
    });
    fetch('/timestampLimits').then(({ minTimestamp, maxTimestamp }: Record<string, string>) => {
      const [min, max] = [
        parseDate(minTimestamp.slice(0, 10)),
        parseDate(maxTimestamp.slice(0, 10))
      ];
      dateRangeLimits = [min, max];
      filter = { ...filter, dateRange: { start: min, end: max } };
    });
  });
</script>

<h1 class="text-4xl text-center">FFF Visualization</h1>

<div id="page" class="flex flex-col space-y-4">
  <div class="flex flex-row space-y-4 mx-auto items-center justify-center flex-wrap">
    <VisTypePicker bind:visType />
    <AuthorPicker {authors} bind:selectedAuthors={filter.authors} />
    <ChannelPicker {channels} bind:selectedChannels={filter.channels} />
    <DateRangePicker {dateRangeLimits} bind:selectedDateRange={filter.dateRange} />
  </div>

  {#if visType === 'Table'}
    <MessageTable {filter} />
  {:else if visType === 'Bar Chart'}
    <BarChart {filter} />
  {:else if visType === 'Word Cloud'}
    <WordCloud {filter} />
  {:else}
    <p>Not yet implemented</p>
  {/if}
</div>
