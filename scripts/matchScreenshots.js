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

function matchType(filenames) {
	const matched = {};
	const unmatched = [];

	for (const filename of filenames) {
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
	return { matched, unmatched };
}

const matched = {};
const results = {};
for (const type of Object.keys(screenshots)) {
	results[type] = matchType(screenshots[type]);
	for (const [gameId, filenames] of Object.entries(results[type].matched)) {
		(matched[gameId] ??= {})[type] = filenames;
	}
}

const outputPath = './src/lib/data/gameScreenshots.json';
writeFileSync(outputPath, JSON.stringify(matched, null, '\t'));

const { matched: titlesMatched, unmatched: titlesUnmatched } = results.titles;
console.log(
	`Matched ${screenshots.titles.length - titlesUnmatched.length}/${screenshots.titles.length} titles to ${Object.keys(titlesMatched).length}/${naGames.length} NA games.`
);
for (const [type, { matched: typeMatched, unmatched: typeUnmatched }] of Object.entries(results)) {
	if (type === 'titles') continue;
	console.log(
		`Matched ${screenshots[type].length - typeUnmatched.length}/${screenshots[type].length} ${type} to ${Object.keys(typeMatched).length}/${naGames.length} NA games.`
	);
}

const unmatchedGames = naGames.filter((game) => !titlesMatched[game.id]);
if (unmatchedGames.length) {
	console.log(`\n${unmatchedGames.length} NA games with no matched title screenshot:`);
	for (const game of unmatchedGames) console.log(`  ${game.title} (${game.id})`);
}
