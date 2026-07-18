<script lang="ts">
	import TableColumnHeader from '$lib/components/TableColumnHeader.svelte';
	import GameRow from '$lib/components/GameRow.svelte';
	import ImageZoomModal from '$lib/components/ImageZoomModal.svelte';
	import type { GameWikiData, RankedSortKey } from '$lib/types';

	type Row = {
		rank: number;
		game: GameWikiData;
		ep: number;
		ytid: string;
		seconds: number;
	};

	let { data } = $props();
	let sortKey = $state<RankedSortKey>('rank');
	let sortAsc = $state(true);
	let zoomGame = $state<GameWikiData | null>(null);

	function handleSort(key: RankedSortKey) {
		if (sortKey === key) {
			sortAsc = !sortAsc;
		} else {
			sortKey = key;
			sortAsc = true;
		}
	}

	const comparators: Record<RankedSortKey, (a: Row, b: Row) => number> = {
		rank: (a, b) => a.rank - b.rank,
		game: (a, b) => a.game.title.localeCompare(b.game.title),
		ep: (a, b) => a.ep - b.ep || a.rank - b.rank,
		seconds: (a, b) => a.ep - b.ep || a.seconds - b.seconds,
		publisher: (a, b) =>
			(a.game.publisher ?? '').localeCompare(b.game.publisher ?? '') || a.rank - b.rank,
		releaseDateNA: (a, b) =>
			(a.game.releaseDateNA ?? '').localeCompare(b.game.releaseDateNA ?? '') || a.rank - b.rank
	};

	let items = $derived.by(() => {
		if (!sortKey) return data.list as Row[];
		const compare = comparators[sortKey];
		const sorted = [...(data.list as Row[])].sort(compare);
		return sortAsc ? sorted : sorted.reverse();
	});
</script>

<table>
	<thead>
		<tr class="sticky -top-1 z-10">
			<TableColumnHeader key="rank" {sortKey} {sortAsc} onSort={handleSort}>
				<span class="max-md:hidden">Rank</span>
				<span class="md:hidden">#</span>
			</TableColumnHeader>
			<TableColumnHeader key="game" {sortKey} {sortAsc} onSort={handleSort} twClasses="text-left"
				>Game</TableColumnHeader
			>
			<TableColumnHeader
				key="publisher"
				{sortKey}
				{sortAsc}
				onSort={handleSort}
				twClasses="text-left max-lg:hidden">Publisher</TableColumnHeader
			>
			<TableColumnHeader
				key="releaseDateNA"
				{sortKey}
				{sortAsc}
				onSort={handleSort}
				twClasses="text-right max-md:hidden"
				>Release<span class="max-lg:hidden"> Date</span></TableColumnHeader
			>
			<TableColumnHeader key="ep" {sortKey} {sortAsc} onSort={handleSort} twClasses="text-right"
				>Episode</TableColumnHeader
			>
			<TableColumnHeader
				key="seconds"
				{sortKey}
				{sortAsc}
				onSort={handleSort}
				twClasses="text-right max-md:hidden">Timestamp</TableColumnHeader
			>
		</tr>
	</thead>
	<tbody>
		{#each items as row (row.rank)}
			<GameRow {...row} onZoom={(game) => (zoomGame = game)} />
		{/each}
	</tbody>
</table>

<ImageZoomModal game={zoomGame} onClose={() => (zoomGame = null)} />
