#!/usr/bin/env node
import { writeFileSync } from 'node:fs';

const apiKey = process.env.RETRO_ACHIEVEMENTS_API_KEY;
if (!apiKey) {
	throw new Error('RETRO_ACHIEVEMENTS_API_KEY environment variable is not set.');
}

// i=2: Nintendo 64 console ID. f=1: only games with achievements. o=280: offset to
// skip most of the alphabetically-earlier Hacks/Homebrews/Prototypes/Unlicensed
// entries. c=1000: high count so the full remaining list is returned in one request.
const API_URL = `https://retroachievements.org/API/API_GetGameList.php?y=${apiKey}&i=2&f=1&o=280&c=1000`;

const res = await fetch(API_URL);
if (!res.ok) {
	throw new Error(`Failed to fetch RetroAchievements game list: ${res.status} ${res.statusText}`);
}

const games = await res.json();

// Filter out non-commercial/duplicate entries that survive the offset: Homebrews,
// Prototypes and Unlicensed games are tagged with a "~Tag~" title prefix, and
// "[Subset - ...]" entries are bonus/alternate achievement sets for a game that
// already has its own base entry.
const filtered = games.filter(
	(game) => !game.Title.startsWith('~') && !game.Title.includes('[Subset')
);

const entries = filtered.map((game) => ({
	id: game.ID,
	title: game.Title,
	numAchievements: game.NumAchievements
}));

const outputPath = './src/lib/data/retroAchievements.json';
writeFileSync(outputPath, JSON.stringify(entries, null, '\t'));
console.log(`Wrote ${entries.length} RetroAchievements games to ${outputPath}`);
