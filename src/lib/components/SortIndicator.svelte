<script lang="ts">
	type Direction = 'asc' | 'desc' | null;

	let { direction }: { direction: Direction } = $props();
</script>

<span class="inline-flex flex-col text-[0.5em] leading-none">
	<span
		class={direction === 'desc'
			? 'text-foreground'
			: 'text-foreground/50 group-hover:text-foreground/75'}>▲</span
	>
	<span
		class={direction === 'asc'
			? 'text-foreground'
			: 'text-foreground/50 group-hover:text-foreground/75'}>▼</span
	>
</span>
