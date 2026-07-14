<script lang="ts">
	import SortIndicator from '$lib/components/SortIndicator.svelte';
	import type { Snippet } from 'svelte';
	import type { SortKey } from '$lib/types';
	let {
		key,
		sortKey,
		sortAsc,
		onSort,
		children,
		twClasses = ''
	}: {
		key: SortKey;
		sortKey: SortKey;
		sortAsc: boolean;
		onSort: (key: SortKey) => void;
		children: Snippet;
		twClasses?: string;
	} = $props();

	let direction: 'asc' | 'desc' | null = $derived.by(() => {
		if (sortKey !== key) return null;
		return sortAsc ? 'asc' : 'desc';
	});
</script>

<th class={`group cursor-pointer select-none ${twClasses}`} onclick={onSort.bind(null, key)}>
	<span class="inline-flex items-center gap-1"
		>{@render children()} <SortIndicator {direction} /></span
	>
</th>
