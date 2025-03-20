<script lang="ts">
  import type { FilterInfo, GroupBy } from '$lib/types';
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import GroupByPicker from '../pickers/GroupByPicker.svelte';
  import { slide } from 'svelte/transition';

  interface Bar {
    groupBy: string;
    count: number;
  }

  // The chart dimensions and margins as optional props.
  const width = 1200;
  const height = 500;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 50;
  const marginLeft = 100;

  let {
    filter
  }: {
    filter: FilterInfo;
  } = $props();

  let groupBy: GroupBy = $state('author');

  let data: Bar[] = $state([]);

  let xScale: d3.ScaleBand<string> | undefined = $state(undefined);
  let yScale: d3.ScaleLinear<number, number> | undefined = $state(undefined);

  async function fetchBarChart() {
    const query = new URLSearchParams();
    query.set('filter', JSON.stringify(filter));
    query.set('groupBy', groupBy);
    data = await fetch(`/barChart?${query}`).then((r) => r.json());

    // Create the x (horizontal position) scale.
    xScale = d3
      .scaleBand()
      .domain(
        // Sort the data in descending frequency
        d3.groupSort(
          data,
          ([d]) => d.groupBy,
          (d) => d.groupBy
        )
      )
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    // Create the y (vertical position) scale.
    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)!])
      .range([height - marginBottom, marginTop]);
  }

  $effect(() => {
    fetchBarChart();
  });

  onMount(() => {
    fetchBarChart();
  });
</script>

<GroupByPicker bind:groupBy />

{#if data.length === 0 || !xScale || !yScale}
  <p>Loading...</p>
{:else}
  <svg {width} {height} viewBox="0 0 {width} {height}" style:max-width="100%" class="m-auto">
    <!-- Add a rect for each bar. -->
    <g fill="steelblue">
      {#each data as d}
        <rect
          x={xScale(d.groupBy)}
          y={yScale(d.count)}
          height={yScale(0) - yScale(d.count)}
          width={xScale.bandwidth()}
          transition:slide
        />
      {/each}
    </g>

    <!-- X-Axis -->
    <g transform="translate(0,{height - marginBottom})">
      <line stroke="currentColor" x1={marginLeft - 6} x2={width} />

      {#each data as d}
        <!-- X-Axis Ticks -->
        <line
          stroke="currentColor"
          x1={xScale(d.groupBy) + xScale.bandwidth() / 2}
          x2={xScale(d.groupBy) + xScale.bandwidth() / 2}
          y1={0}
          y2={6}
        />

        <!-- X-Axis Tick Labels -->
        <text
          fill="currentColor"
          text-anchor="middle"
          x={xScale(d.groupBy) + xScale.bandwidth() / 2}
          y={22}
        >
          {d.groupBy}
        </text>
      {/each}
    </g>

    <!-- Y-Axis -->
    <g transform="translate({marginLeft},0)">
      {#each yScale.ticks() as tick}
        <!-- 
        Y-Axis Ticks. 
        Note: First tick is skipped since the x-axis already acts as a tick. 
      -->
        {#if tick !== 0}
          <line stroke="currentColor" x1={0} x2={-6} y1={yScale(tick)} y2={yScale(tick)} />
        {/if}

        <!-- Y-Axis Tick Labels -->
        <text
          fill="currentColor"
          text-anchor="end"
          dominant-baseline="middle"
          x={-9}
          y={yScale(tick)}
        >
          {Math.trunc(tick * 100)}
        </text>
      {/each}
      <text fill="currentColor" text-anchor="start" x={-marginLeft} y={15}> Messages </text>
    </g>
  </svg>
{/if}
