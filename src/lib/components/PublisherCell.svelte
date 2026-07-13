<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import { regionLabel } from '$lib/regions';

	let { game }: { game: GameWikiData } = $props();
</script>

<div class="flex flex-col">
	<span>{game.publisher ?? '—'}</span>
	{#if game.otherPublishers}
		{#each Object.entries(game.otherPublishers) as [region, publisher] (region)}
			<span class="text-xs text-foreground/60"
				>{region === 'default' ? '' : `${regionLabel(region)}: `}{publisher}</span
			>
		{/each}
	{/if}
</div>
