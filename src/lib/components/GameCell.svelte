<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import { formatOtherRegions } from '$lib/regions';
	import { handleImageFallback } from '$lib/screenshots';

	let { game, onZoom }: { game: GameWikiData; onZoom?: (game: GameWikiData) => void } = $props();
	let aka = $derived(game.otherTitles && formatOtherRegions(game.otherTitles));
	let devs = $derived(game.developers.join(', '));
	let hasLinks = $derived(game.wikiUrl || game.retroAchievementsUrl);
</script>

<div class="flex items-start gap-2">
	{#if game.screenshotUrl}
		<button
			type="button"
			onclick={() => onZoom?.(game)}
			class="group relative shrink-0 cursor-pointer"
			aria-label={`Zoom ${game.title} screenshots`}
		>
			<img
				src={game.screenshotUrl}
				alt=""
				loading="lazy"
				class="h-16 w-auto rounded-md"
				onerror={handleImageFallback(game.screenshotFallbackUrl)}
			/>
			<div
				class="pointer-none: absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span class="icon-[lucide--zoom-in] text-lg text-white"></span>
			</div>
		</button>
	{/if}
	<div class="flex flex-col">
		<span class="text-md font-bold">{game.title}</span>
		{#if game.otherTitles}
			<span class="flex items-center gap-1 text-xs max-md:hidden"
				><span class="icon-[ion--globe]"></span>
				<span class="text-xs text-ellipsis text-foreground/60" title={aka}>{aka}</span>
			</span>
		{/if}
		{#if game.developers.length}
			<span class="flex items-center gap-1 text-xs"
				><span class="icon-[ion--people]"></span>
				<span class="text-ellipsis text-foreground/60" title={devs}>{devs}</span></span
			>
		{/if}
		{#if hasLinks}
			<span class="flex-start flex gap-1">
				<span class="icon-[ion--link]"></span>
				<span class="flex flex-col items-start text-xs md:flex-row md:gap-2">
					{#if game.wikiUrl}
						<a
							href={game.wikiUrl}
							rel="external"
							target="_blank"
							class="flex items-center gap-1 text-foreground/60"
							><span class="icon-[ion--newspaper]"></span>Wikipedia
						</a>{/if}
					{#if game.retroAchievementsUrl}
						<a
							href={game.retroAchievementsUrl}
							rel="external"
							target="_blank"
							class="flex items-center gap-1 text-foreground/60"
						>
							<span class="icon-[ion--trophy]"></span>
							{game.achievementCount} achievements
						</a>
					{/if}
				</span>
			</span>
		{/if}
	</div>
</div>
