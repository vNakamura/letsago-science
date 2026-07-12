import Papa from 'papaparse';

import csvRaw from '$lib/data/list.csv?raw';
import games from '$lib/data/games.json';
import gameScreenshots from '$lib/data/gameScreenshots.json';
import { SCREENSHOT_BASE_URL, pickScreenshotFilename } from '$lib/screenshots';
import { pickOtherRegions } from '$lib/regions';
import type { GamesJsonEntry } from '$lib/types';

type CsvRow = { wiki_id: string };

export async function load() {
	const rankedIds = new Set(
		(
			Papa.parse(csvRaw, { header: true, skipEmptyLines: true, dynamicTyping: true })
				.data as CsvRow[]
		).map((row) => row.wiki_id)
	);

	const list = (Object.values(games) as GamesJsonEntry[])
		.filter((game) => game.releaseDates.na !== null && !rankedIds.has(game.id))
		.map((game) => {
			const screenshotFilename = pickScreenshotFilename(
				gameScreenshots[game.id as keyof typeof gameScreenshots]
			);

			return {
				id: game.id,
				game: {
					title: game.title ?? '',
					otherTitles: game.otherTitles ?? null,
					developers: game.developers,
					publisher: game.publisher ?? null,
					otherPublishers: game.otherPublishers ?? null,
					releaseDateNA: game.releaseDates.na,
					otherReleaseDates: pickOtherRegions(game.releaseDates, 'na'),
					wikiUrl: game.wikiUrl ?? null,
					screenshotUrl: screenshotFilename
						? `${SCREENSHOT_BASE_URL}${encodeURIComponent(screenshotFilename)}`
						: null
				}
			};
		})
		.sort((a, b) => a.game.title.localeCompare(b.game.title));

	return { list };
}
