<script lang="ts">
	import { page, navigating } from '$app/state';
	import { resolve } from '$app/paths';

	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import LogoSVG from '$lib/assets/LogoSVG.svelte';

	let { children } = $props();

	const mainTitle = 'Science⁶⁴';
	const navLinks = [
		{ href: resolve('/'), label: 'Ranked' },
		{ href: resolve('/remaining'), label: 'Remaining Games' },
		{ href: resolve('/about'), label: 'About' }
	];

	let title = $derived.by(() => {
		const currentLink = navLinks.find((link) => link.href === page.url.pathname);
		if (!currentLink) return mainTitle;
		return `${currentLink.label} | ${mainTitle}`;
	});

	let n64Mode = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
		rel="stylesheet"
	/>
	<meta name="color-scheme" content="dark light" />

	<title>{title}</title>
</svelte:head>
<div
	class="mx-auto flex min-h-screen w-full max-w-300 flex-col gap-4 p-2 md:p-4"
	class:n64-mode={n64Mode}
>
	<header class="flex flex-wrap items-center justify-start gap-8 py-16">
		<h1 class="w-80 text-logo" aria-label={mainTitle}>
			<LogoSVG />
		</h1>
		<nav class="flex gap-4 text-sm uppercase">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					aria-current={page.url.pathname === link.href ? 'page' : undefined}
					class="text-foreground/60 hover:text-foreground aria-[current=page]:font-bold aria-[current=page]:text-logo-number"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</header>
	<main class="grow">
		{@render children()}
	</main>
</div>
<label class="absolute top-0 right-0 cursor-pointer" title="Toggle N64 Mode">
	<img
		src="/only-for.png"
		alt="Only for Nintendo 64"
		class="w-24 opacity-10 transition-opacity hover:opacity-100 dark:opacity-5"
		class:opacity-100={n64Mode}
	/>
	<input type="checkbox" bind:checked={n64Mode} class="hidden" />
</label>
{#if navigating.to}
	<div class="loading-bar pointer-events-none fixed top-0 right-0 left-0 z-50 flex h-2"></div>
{/if}

<style>
	@keyframes loading-bar-scroll {
		from {
			background-position-x: 0;
		}
		to {
			background-position-x: 200%;
		}
	}
	.loading-bar {
		background-image: linear-gradient(
			to right,
			#01009a,
			#01009a 24.99%,
			#f5b201 25%,
			#f5b201 49.99%,
			#e10916 50%,
			#e10916 74.99%,
			#329900 75%
		);
		background-size: 200% 100%;
		animation: loading-bar-scroll 1s linear infinite;
	}
</style>
