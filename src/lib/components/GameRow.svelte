<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import GameCell from './GameCell.svelte';
	import PublisherCell from './PublisherCell.svelte';
	import ReleaseDateCell from './ReleaseDateCell.svelte';

	let {
		rank,
		game,
		ep,
		ytid,
		seconds
	}: {
		rank: number;
		game: GameWikiData;
		ep: number;
		ytid: string;
		seconds: number;
	} = $props();

	function formatTimestamp(seconds: number): string {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = Math.floor(seconds % 60);
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}
</script>

<tr>
	<td class="text-center text-lg font-bold">
		{#if rank < 4}
			<img src={`/rank${rank}.png`} alt={`Rank ${rank}`} class="inline-block rounded-lg" />
		{:else}
			{rank}
		{/if}
	</td>
	<td>
		<GameCell {game} />
	</td>
	<td>
		<PublisherCell {game} />
	</td>
	<td>
		<ReleaseDateCell {game} />
	</td>
	<td>
		<div class="flex items-center justify-center gap-2">
			<a href={`https://youtu.be/${ytid}`} class="flex items-center gap-2 text-lg">
				<span aria-hidden="true">{ep.toString().padStart(2, '0')}</span>
				<img
					src={`https://wsrv.nl/?url=i.ytimg.com/vi/${ytid}/default.jpg`}
					alt={`Episode ${ep}`}
					loading="lazy"
					class="aspect-video h-10 rounded-sm object-cover object-center"
				/>
			</a>
		</div>
	</td>
	<td class="text-center"
		><a href={`https://youtu.be/${ytid}?t=${seconds}`}>{formatTimestamp(seconds)}</a></td
	>
</tr>
