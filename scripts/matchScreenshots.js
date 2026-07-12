#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const games = Object.values(JSON.parse(readFileSync('./src/lib/data/games.json', 'utf-8')));
const screenshots = JSON.parse(readFileSync('./src/lib/data/screenshots.json', 'utf-8'));

let overrides = {};
try {
	overrides = JSON.parse(readFileSync('./src/lib/data/screenshotOverrides.json', 'utf-8'));
} catch {
	// No overrides file yet; that's fine.
}

/**
 * Collapse a title to a comparable form: lowercase, diacritics and apostrophes
 * removed, remaining punctuation (including "&", "_" and "/" — libretro uses
 * "_" and "-" as filesystem-safe stand-ins for "&" and "/") turned into spaces.
 */
function normalize(str) {
	return str
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/['’]/g, '')
		.replace(/[:,/_&\-!?.]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Reverse libretro/No-Intro filename conventions to approximate the real title:
 * strip the extension, strip trailing "(...)" region/language/revision tags,
 * move a trailing ", The"/", A"/", An" back to the front, and turn the
 * "Main - Subtitle" separator back into "Main: Subtitle".
 */
function reconstructTitle(filename) {
	let name = filename.replace(/\.[^.]+$/, '');

	while (/\s*\([^()]*\)\s*$/.test(name)) {
		name = name.replace(/\s*\([^()]*\)\s*$/, '');
	}
	name = name.trim();

	const sepIndex = name.indexOf(' - ');
	let main = sepIndex === -1 ? name : name.slice(0, sepIndex);
	const subtitle = sepIndex === -1 ? null : name.slice(sepIndex + 3);

	const articleMatch = main.match(/^(.*), (The|A|An)$/i);
	if (articleMatch) main = `${articleMatch[2]} ${articleMatch[1]}`;

	return subtitle ? `${main}: ${subtitle}` : main;
}

// Only match against games that actually released in North America.
const naGames = games.filter((game) => game.releaseDates.na);

const titleIndex = new Map();
for (const game of naGames) {
	const titles = [game.title, ...Object.values(game.otherTitles ?? {})];
	for (const title of titles) {
		const key = normalize(title);
		if (!titleIndex.has(key)) titleIndex.set(key, game.id);
	}
}

const matched = {};
const unmatched = [];

for (const filename of screenshots) {
	if (overrides[filename]) {
		(matched[overrides[filename]] ??= []).push(filename);
		continue;
	}

	const key = normalize(reconstructTitle(filename));
	const gameId = titleIndex.get(key);
	if (gameId) {
		(matched[gameId] ??= []).push(filename);
	} else {
		unmatched.push(filename);
	}
}

for (const list of Object.values(matched)) list.sort();

const outputPath = './src/lib/data/gameScreenshots.json';
writeFileSync(outputPath, JSON.stringify(matched, null, '\t'));

const matchedGameCount = Object.keys(matched).length;
console.log(
	`Matched ${screenshots.length - unmatched.length}/${screenshots.length} screenshots to ${matchedGameCount}/${naGames.length} NA games.`
);

const unmatchedGames = naGames.filter((game) => !matched[game.id]);
if (unmatchedGames.length) {
	console.log(`\n${unmatchedGames.length} NA games with no matched screenshot:`);
	for (const game of unmatchedGames) console.log(`  ${game.title} (${game.id})`);
}
