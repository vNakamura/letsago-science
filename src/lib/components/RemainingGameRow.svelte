<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import GameCell from './GameCell.svelte';
	import PublisherCell from './PublisherCell.svelte';
	import ReleaseDateCell from './ReleaseDateCell.svelte';

	let { game }: { game: GameWikiData } = $props();
</script>

<tr>
	<td>
		<GameCell {game} />
	</td>
	<td>
		<PublisherCell {game} />
	</td>
	<td>
		<ReleaseDateCell {game} />
	</td>
</tr>
