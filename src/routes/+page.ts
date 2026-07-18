import Papa from 'papaparse';

import csvRaw from '$lib/data/list.csv?raw';
import games from '$lib/data/games.json';
import gameScreenshots from '$lib/data/gameScreenshots.json';
import gameAchievements from '$lib/data/gameAchievements.json';
import { pickRowThumbnail, buildZoomImages, type GameScreenshots } from '$lib/screenshots';
import { pickOtherRegions } from '$lib/regions';
import type { GameAchievementsEntry, GamesJsonEntry } from '$lib/types';

type CsvRow = { game: string; ep: number; ytid: string; seconds: number; wiki_id: string };

export async function load() {
	const list = Papa.parse(csvRaw, { header: true, skipEmptyLines: true, dynamicTyping: true })
		.data as CsvRow[];

	return {
		list: list.map((row, index) => {
			const gameData = games[row.wiki_id as keyof typeof games] as GamesJsonEntry | undefined;
			const shots = gameScreenshots[row.wiki_id as keyof typeof gameScreenshots] as
				GameScreenshots | undefined;
			const thumb = pickRowThumbnail(shots);
			const raEntry = gameAchievements[row.wiki_id as keyof typeof gameAchievements] as
				GameAchievementsEntry | undefined;

			return {
				rank: index + 1,
				ep: row.ep,
				ytid: row.ytid,
				seconds: row.seconds,
				game: {
					title: row.game,
					otherTitles: gameData?.otherTitles ?? null,
					developers: gameData?.developers ?? [],
					publisher: gameData?.publisher ?? null,
					otherPublishers: gameData?.otherPublishers ?? null,
					releaseDateNA: gameData?.releaseDates.na ?? null,
					otherReleaseDates: gameData ? pickOtherRegions(gameData.releaseDates, 'na') : null,
					wikiUrl: gameData?.wikiUrl ?? null,
					screenshotUrl: thumb?.url ?? null,
					screenshotFallbackUrl: thumb?.fallbackUrl ?? null,
					zoomImages: buildZoomImages(shots),
					retroAchievementsUrl: raEntry ? `https://retroachievements.org/game/${raEntry.id}` : null,
					achievementCount: raEntry?.numAchievements ?? null
				}
			};
		})
	};
}
