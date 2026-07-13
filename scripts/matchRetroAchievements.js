#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const games = Object.values(JSON.parse(readFileSync('./src/lib/data/games.json', 'utf-8')));
const raGames = JSON.parse(readFileSync('./src/lib/data/retroAchievements.json', 'utf-8'));

let overrides = {};
try {
	overrides = JSON.parse(readFileSync('./src/lib/data/retroAchievementsOverrides.json', 'utf-8'));
} catch {
	// No overrides file yet; that's fine.
}

/**
 * Collapse a title to a comparable form: lowercase, diacritics and apostrophes
 * removed, remaining punctuation turned into spaces.
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

const titleIndex = new Map();
for (const game of games) {
	const titles = [game.title, ...Object.values(game.otherTitles ?? {})].filter(Boolean);
	for (const title of titles) {
		const key = normalize(title);
		if (!titleIndex.has(key)) titleIndex.set(key, game.id);
	}
}

const matched = {};
const unmatched = [];

for (const raGame of raGames) {
	const gameId = overrides[raGame.title] ?? titleIndex.get(normalize(raGame.title));
	if (gameId) {
		matched[gameId] = { id: raGame.id, numAchievements: raGame.numAchievements };
	} else {
		unmatched.push(raGame.title);
	}
}

const outputPath = './src/lib/data/gameAchievements.json';
writeFileSync(outputPath, JSON.stringify(matched, null, '\t'));

const matchedGameCount = Object.keys(matched).length;
console.log(
	`Matched ${raGames.length - unmatched.length}/${raGames.length} RetroAchievements games to ${matchedGameCount}/${games.length} Wikipedia games.`
);

if (unmatched.length) {
	console.log(`\n${unmatched.length} RetroAchievements games with no match:`);
	for (const title of unmatched) console.log(`  ${title}`);
}

const unmatchedGames = games.filter((game) => !matched[game.id]);
if (unmatchedGames.length) {
	console.log(`\n${unmatchedGames.length} Wikipedia games with no matched RetroAchievements entry:`);
	for (const game of unmatchedGames) console.log(`  ${game.title} (${game.id})`);
}
