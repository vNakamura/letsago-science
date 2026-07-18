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
		seconds,
		onZoom
	}: {
		rank: number;
		game: GameWikiData;
		ep: number;
		ytid: string;
		seconds: number;
		onZoom?: (game: GameWikiData) => void;
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
		{#if rank <= 4}
			<img src={`/rank_${rank}.png`} alt={`Rank ${rank}`} class="hidden md:inline-block" />
			<span class="md:hidden">{rank}</span>
		{:else}
			{rank}
		{/if}
	</td>
	<td>
		<GameCell {game} {onZoom} />
	</td>
	<td class="max-lg:hidden">
		<PublisherCell {game} />
	</td>
	<td class="max-md:hidden">
		<ReleaseDateCell {game} />
	</td>
	<td>
		<div class="flex flex-col items-end gap-1">
			<div class="flex items-center justify-end gap-2">
				<a href={`https://youtu.be/${ytid}`} class="flex items-center gap-2 md:text-lg">
					<span aria-hidden="true">{ep.toString().padStart(2, '0')}</span>
					<img
						src={`https://wsrv.nl/?url=i.ytimg.com/vi/${ytid}/default.jpg`}
						alt={`Episode ${ep}`}
						loading="lazy"
						class="aspect-video h-5 rounded-sm object-cover object-center md:h-10"
					/>
				</a>
			</div>
			<span class="flex items-center gap-1 text-xs text-foreground/60 md:hidden">
				<span class="icon-[ion--stopwatch]"></span>
				<a href={`https://youtu.be/${ytid}?t=${seconds}`}>
					{formatTimestamp(seconds)}
				</a>
			</span>
		</div>
	</td>
	<td class="text-right max-md:hidden">
		<a href={`https://youtu.be/${ytid}?t=${seconds}`}>{formatTimestamp(seconds)}</a>
	</td>
</tr>
