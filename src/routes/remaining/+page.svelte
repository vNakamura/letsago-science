<script lang="ts">
	import RemainingGameRow from '$lib/components/RemainingGameRow.svelte';
	import TableColumnHeader from '$lib/components/TableColumnHeader.svelte';
	import type { GameWikiData } from '$lib/types';

	type Row = {
		id: string;
		game: GameWikiData;
	};
	type SortKey = 'title' | 'publisher' | 'releaseDateNA';

	let { data } = $props();
	let sortKey = $state<SortKey>('title');
	let sortAsc = $state(true);

	function handleSort(key: SortKey) {
		if (sortKey === key) {
			sortAsc = !sortAsc;
		} else {
			sortKey = key;
			sortAsc = true;
		}
	}

	const comparators: Record<SortKey, (a: Row, b: Row) => number> = {
		title: (a, b) => a.game.title.localeCompare(b.game.title),
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
			<TableColumnHeader key="title" {sortKey} {sortAsc} onSort={handleSort}>Game</TableColumnHeader
			>
			<TableColumnHeader key="publisher" {sortKey} {sortAsc} onSort={handleSort}
				>Publisher</TableColumnHeader
			>
			<TableColumnHeader key="releaseDateNA" {sortKey} {sortAsc} onSort={handleSort}
				>Release Date</TableColumnHeader
			>
		</tr>
	</thead>
	<tbody>
		{#each items as row (row.id)}
			<RemainingGameRow {...row} />
		{/each}
	</tbody>
</table>
