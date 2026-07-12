<script lang="ts">
	import SortIndicator from '$lib/components/SortIndicator.svelte';
	let { key, sortKey, sortAsc, onSort, children } = $props();

	let direction: 'asc' | 'desc' | null = $derived.by(() => {
		if (sortKey !== key) return null;
		return sortAsc ? 'asc' : 'desc';
	});
</script>

<th class="group cursor-pointer select-none" onclick={onSort.bind(null, key)}>
	<span class="inline-flex items-center gap-1"
		>{@render children()} <SortIndicator {direction} /></span
	>
</th>
