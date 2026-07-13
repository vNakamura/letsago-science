<script lang="ts">
	import type { GameWikiData } from '$lib/types';
	import { formatOtherRegions } from '$lib/regions';

	let { game }: { game: GameWikiData } = $props();
	let aka = $derived(game.otherTitles && formatOtherRegions(game.otherTitles));
	let devs = $derived(game.developers.join(', '));
	let hasLinks = $derived(game.wikiUrl || game.retroAchievementsUrl);
</script>

<div class="flex items-center gap-2">
	{#if game.screenshotUrl}
		<img src={game.screenshotUrl} alt="" loading="lazy" class="h-16 w-auto rounded-md" />
	{/if}
	<div class="flex flex-col">
		<span class="text-md font-bold">{game.title}</span>
		{#if game.otherTitles}
			<span class="flex items-center gap-1 text-xs"
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
			<span class="flex items-center gap-2 text-xs"
				><span class="icon-[ion--link]"></span>
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
		{/if}
	</div>
</div>
