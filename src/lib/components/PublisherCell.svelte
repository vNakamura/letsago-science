<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import { formatOtherRegions } from '$lib/regions';

	let { game }: { game: GameWikiData } = $props();
</script>

<div class="flex flex-col gap-1">
	<span>{game.publisher ?? '—'}</span>
	{#if game.otherPublishers}
		<span class="text-xs text-foreground/60">{formatOtherRegions(game.otherPublishers)}</span>
	{/if}
</div>
