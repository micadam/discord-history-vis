<script lang="ts">
  import type { FilterInfo } from '$lib/types';
  import cloud from 'd3-cloud';
  import { onMount } from 'svelte';

  let { filter }: { filter: FilterInfo } = $props();

  interface Word {
    text: string;
    count: number;
  }

  const MAX_SIZE = 100;

  let data: Word[] = $state([]);
  let cloudWords: cloud.Word[] = $state([]);
  let wc: ReturnType<typeof cloud> | undefined = $state(undefined);

  async function fetchWordCloud() {
    const query = new URLSearchParams();
    query.set('filter', JSON.stringify(filter));
    data = await fetch(`/wordCloud?${query}`).then((r) => r.json());
    cloudWords = [];

    const maxCount = Math.max(...data.map((d) => d.count));

    if (wc) {
      wc.stop();
    }

    wc = cloud()
      .size([1000, 600])
      .words(data.map((d) => ({ text: d.text, size: d.count / maxCount })))
      .padding(5)
      .padding(2)
      .rotate(() => (Math.random() - 0.5) * 90)
      .font('Helvetica')
      .fontSize((d) => Math.sqrt(d.size) * MAX_SIZE)
      .on('word', (word: cloud.Word) => {
        cloudWords.push(word);
      })
      .start();
  }
  onMount(() => {
    fetchWordCloud();
  });
  $effect(() => {
    fetchWordCloud();
  });

  function getRandomColorFromPalette() {
    const palette = ['#70D6FF', '#FF70A6', '#FF9770', '#FFD670', '#E9FF70'];
    const randomIndex = Math.floor(Math.random() * palette.length);
    return palette[randomIndex];
  }
</script>

{#if data.length > 0 && wc}
  <svg class="m-auto" width={wc.size()[0]} height={wc.size()[1]} text-anchor="middle">
    <g transform={`translate(${wc.size()[0] / 2},${wc.size()[1] / 2})`}>
      {#each cloudWords as word}
        <text
          font-size={word.size}
          font-family={word.font}
          font-weight={word.weight}
          fill={getRandomColorFromPalette()}
          transform={`translate(${word.x},${word.y}), rotate(${word.rotate})`}
        >
          {word.text}
        </text>
      {/each}
    </g>
  </svg>
{:else}
  <p>Loading...</p>
{/if}
