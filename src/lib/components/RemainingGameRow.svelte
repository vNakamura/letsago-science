<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import GameCell from './GameCell.svelte';
	import PublisherCell from './PublisherCell.svelte';
	import ReleaseDateCell from './ReleaseDateCell.svelte';

	let { game, onZoom }: { game: GameWikiData; onZoom?: (game: GameWikiData) => void } = $props();
</script>

<tr>
	<td>
		<GameCell {game} {onZoom} />
	</td>
	<td class="max-md:hidden">
		<PublisherCell {game} />
	</td>
	<td class="max-md:hidden">
		<ReleaseDateCell {game} />
	</td>
</tr>
