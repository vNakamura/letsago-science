<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import { formatOtherRegions } from '$lib/regions';

	let { game }: { game: GameWikiData } = $props();
</script>

<div class="flex items-center gap-2">
	{#if game.screenshotUrl}
		<img src={game.screenshotUrl} alt="" loading="lazy" class="h-16 w-auto rounded-md" />
	{/if}
	<div class="flex flex-col">
		<span class="text-md font-bold">{game.title}</span>
		{#if game.otherTitles}
			<span class="text-xs text-foreground/60">{formatOtherRegions(game.otherTitles)}</span>
		{/if}
		{#if game.developers.length}
			<span class="text-xs text-foreground/60">{game.developers.join(', ')}</span>
		{/if}
		{#if game.wikiUrl}
			<a href={game.wikiUrl} rel="external" target="_blank" class="text-xs text-foreground/60"
				>Wikipedia <span class="icon-[gridicons--external]"></span></a
			>
		{/if}
	</div>
</div>
