<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import { handleImageFallback } from '$lib/screenshots';

	let { game, onClose }: { game: GameWikiData | null; onClose: () => void } = $props();

	let dialogEl: HTMLDialogElement;

	$effect(() => {
		if (game) {
			dialogEl?.showModal();
		} else {
			dialogEl?.close();
		}
	});
</script>

<dialog
	bind:this={dialogEl}
	onclose={onClose}
	onclick={(e) => {
		if (e.target === dialogEl) dialogEl.close();
	}}
	class="m-auto max-h-[80vh] overscroll-contain rounded-t-md bg-background text-foreground backdrop:bg-black/90"
>
	{#if game}
		<div
			class="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-md bg-background/90 px-4 py-2 backdrop-blur-sm"
		>
			<h3 class="font-bold">{game.title}</h3>
			<button
				type="button"
				onclick={() => dialogEl.close()}
				aria-label="Close"
				class="-m-2 cursor-pointer p-2"
			>
				<span class="icon-[ion--close] text-lg"></span>
			</button>
		</div>
		<div class="flex flex-col gap-4 p-4">
			{#each game.zoomImages as img (img.type)}
				<figure class="flex flex-col items-center gap-1">
					<img
						src={img.url}
						alt={`${game.title} — ${img.label}`}
						loading="lazy"
						class="w-full max-w-160 rounded-md"
						onerror={handleImageFallback(img.fallbackUrl)}
					/>
					<figcaption class="text-xs text-foreground/60">{img.label}</figcaption>
				</figure>
			{/each}
		</div>
	{/if}
</dialog>
