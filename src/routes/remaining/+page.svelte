<script lang="ts">
	import RemainingGameRow from '$lib/components/RemainingGameRow.svelte';
	import TableColumnHeader from '$lib/components/TableColumnHeader.svelte';
	import ImageZoomModal from '$lib/components/ImageZoomModal.svelte';
	import type { GameWikiData, RemainingSortKey } from '$lib/types';

	type Row = {
		id: string;
		game: GameWikiData;
	};

	let { data } = $props();
	let sortKey = $state<RemainingSortKey>('game');
	let sortAsc = $state(true);
	let zoomGame = $state<GameWikiData | null>(null);

	function handleSort(key: RemainingSortKey) {
		if (sortKey === key) {
			sortAsc = !sortAsc;
		} else {
			sortKey = key;
			sortAsc = true;
		}
	}

	const comparators: Record<RemainingSortKey, (a: Row, b: Row) => number> = {
		game: (a, b) => a.game.title.localeCompare(b.game.title),
		publisher: (a, b) => (a.game.publisher ?? '').localeCompare(b.game.publisher ?? ''),
		releaseDateNA: (a, b) => (a.game.releaseDateNA ?? '').localeCompare(b.game.releaseDateNA ?? '')
	};

	let items = $derived.by(() => {
		const compare = comparators[sortKey];
		const sorted = [...(data.list as Row[])].sort(compare);
		return sortAsc ? sorted : sorted.reverse();
	});
</script>

<h2 class="mb-6 text-xl text-foreground/60">{items.length} games remaining</h2>

<table>
	<thead>
		<tr>
			<TableColumnHeader key="game" {sortKey} {sortAsc} onSort={handleSort} twClasses="md:text-left"
				>Game</TableColumnHeader
			>
			<TableColumnHeader
				key="publisher"
				{sortKey}
				{sortAsc}
				onSort={handleSort}
				twClasses="text-left max-md:hidden">Publisher</TableColumnHeader
			>
			<TableColumnHeader
				key="releaseDateNA"
				{sortKey}
				{sortAsc}
				onSort={handleSort}
				twClasses="text-right max-md:hidden">Release Date</TableColumnHeader
			>
		</tr>
	</thead>
	<tbody>
		{#each items as row (row.id)}
			<RemainingGameRow {...row} onZoom={(game) => (zoomGame = game)} />
		{/each}
	</tbody>
</table>

<ImageZoomModal game={zoomGame} onClose={() => (zoomGame = null)} />
