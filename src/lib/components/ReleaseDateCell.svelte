<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import { formatDate } from '$lib/format';
	import { regionLabel } from '$lib/regions';

	let { game }: { game: GameWikiData } = $props();
</script>

<div class="flex flex-col items-end text-nowrap">
	<span>{formatDate(game.releaseDateNA)}</span>
	{#if game.otherReleaseDates}
		{#each Object.entries(game.otherReleaseDates) as [region, date] (region)}
			<span class="text-xs text-foreground/60"
				>{region === 'default' ? '' : `${regionLabel(region)}: `}{formatDate(date)}</span
			>
		{/each}
	{/if}
</div>
