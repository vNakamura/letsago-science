#!/usr/bin/env node
import { parse } from 'node-html-parser';
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('./src/lib/data/wikiTable.html', 'utf-8');
const root = parse(html);
const tbody = root.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

const stripTags = (str) => parse(str).text.trim();

/**
 * Normalize a region string into one or more region tags: "NA/EU" → ["na", "eu"],
 * "WW" → ["default"], "JP" → ["jp"], etc. A "/"-joined tag (e.g. "JP/NA") means the
 * same value applies to all listed regions, so every token is kept, not just the first.
 * "WW" (worldwide) is treated as default.
 */
function normalizeRegions(raw) {
	return raw
		.split('/')
		.map((token) => token.trim().toLowerCase())
		.filter(Boolean)
		.map((region) => (region === 'ww' ? 'default' : region));
}

/**
 * Parse a cell that contains region-tagged names separated by <br>.
 * Handles both title cells (<i>Name</i>) and publisher cells (text/links).
 *
 * Returns a map like { default: "...", na: "...", jp: "...", pal: "..." }
 */
function parseRegionalCell(cell) {
	const result = {};
	const chunks = cell.innerHTML.split(/<br[^>]*>/i);

	for (const chunk of chunks) {
		const supMatch = chunk.match(/<sup[^>]*>([^<]+)<\/sup>/i);
		const regions = supMatch ? normalizeRegions(supMatch[1]) : ['default'];

		// Strip the <sup> then strip all remaining tags
		const text = stripTags(chunk.replace(/<sup[^>]*>[^<]*<\/sup>/gi, ''));
		if (text) {
			for (const region of regions) {
				// If a region collides (e.g., two entries with same tag), keep first
				if (!result[region]) result[region] = text;
			}
		}
	}

	return result;
}

/**
 * Parse the developer cell: names are <br>-separated, rendered via Wikipedia's
 * {{hlist}} template as a <ul><li> list, or (rarely) just adjacent <a> tags
 * with no separator at all.
 */
function parseDeveloperCell(cell) {
	const items = cell.querySelectorAll('li');
	if (items.length) {
		return items.map((li) => stripTags(li.innerHTML)).filter(Boolean);
	}
	if (/<br[^>]*>/i.test(cell.innerHTML)) {
		return cell.innerHTML
			.split(/<br[^>]*>/i)
			.map(stripTags)
			.filter(Boolean);
	}
	if (cell.children.length > 1) {
		return cell.children.map((child) => stripTags(child.innerHTML)).filter(Boolean);
	}
	return [stripTags(cell.innerHTML)].filter(Boolean);
}

/**
 * Parse a date cell. Returns ISO date string "YYYY-MM-DD" or null.
 * "Unreleased" cells have class "table-na".
 */
function parseDateCell(cell) {
	if (cell.classList.contains('table-na')) return null;

	const span = cell.querySelector('[data-sort-value]');
	if (span) {
		const sortVal = span.getAttribute('data-sort-value') ?? '';
		const match = sortVal.match(/(\d{4}-\d{2}-\d{2})/);
		if (match) return match[1];
	}

	const text = cell.text.trim();
	return text && text !== 'Unreleased' && text !== 'N/A' ? text : null;
}

/**
 * Extract a stable ID and Wikipedia URL from the title cell.
 * ID prefers the Wikipedia article slug (URL-decoded) from the first <a href>.
 * The URL fragment (e.g. #Sequel) is included, separated by "_", to help
 * distinguish series entries that share an article.
 * Falls back to a slug derived from the raw title text.
 */
function parseTitleMeta(cell) {
	const a = cell.querySelector('a');
	if (a) {
		const href = a.getAttribute('href') ?? '';
		const wikiMatch = href.match(/\/wiki\/([^?]+)/);
		if (wikiMatch) {
			const id = decodeURIComponent(wikiMatch[1]).replace('#', '_');
			const wikiUrl = 'https:' + href;
			return { id, wikiUrl };
		}
	}
	// Fallback: use raw text content (strip tags, replace spaces with underscores)
	const text = stripTags(cell.innerHTML.replace(/<sup[^>]*>[^<]*<\/sup>/gi, ''))
		.replace(/\s+/g, '_');
	return { id: text || null, wikiUrl: null };
}

/**
 * Build the "others" map from a regional map.
 * Excludes "na" always. Excludes "default" unless hasExplicitNA is true
 * (when hasExplicitNA is false, default IS the NA value and would be redundant).
 */
function buildOthers(map, hasExplicitNA) {
	const others = {};
	for (const [region, value] of Object.entries(map)) {
		if (region === 'na') continue;
		if (region === 'default' && !hasExplicitNA) continue;
		if (value) others[region] = value;
	}
	return others;
}

const games = [];

for (const row of rows) {
	const cells = row.querySelectorAll('td');
	if (cells.length < 7) continue;

	const titleMap = parseRegionalCell(cells[0]);
	const publisherMap = parseRegionalCell(cells[2]);
	const { id, wikiUrl } = parseTitleMeta(cells[0]);

	const naTitle = titleMap.na ?? titleMap.default ?? null;
	const naPublisher = publisherMap.na ?? publisherMap.default ?? null;

	const otherTitles = buildOthers(titleMap, !!titleMap.na);
	const otherPublishers = buildOthers(publisherMap, !!publisherMap.na);

	const game = {
		id,
		title: naTitle,
		developers: parseDeveloperCell(cells[1]),
		publisher: naPublisher,
		releaseDates: {
			jp: parseDateCell(cells[4]),
			na: parseDateCell(cells[5]),
			pal: parseDateCell(cells[6])
		}
	};

	if (wikiUrl) game.wikiUrl = wikiUrl;
	if (Object.keys(otherTitles).length) game.otherTitles = otherTitles;
	if (Object.keys(otherPublishers).length) game.otherPublishers = otherPublishers;

	games.push(game);
}

// Deduplicate IDs: when multiple games still share the same ID (e.g. a series
// where all entries link to the same Wikipedia article with no fragment), append
// _2, _3, ... to the later occurrences so every ID is unique.
const idCount = {};
for (const game of games) {
	if (!game.id) continue;
	idCount[game.id] = (idCount[game.id] ?? 0) + 1;
}
const idSeen = {};
for (const game of games) {
	if (!game.id || idCount[game.id] === 1) continue;
	idSeen[game.id] = (idSeen[game.id] ?? 0) + 1;
	if (idSeen[game.id] > 1) game.id = `${game.id}_${idSeen[game.id]}`;
}

const gamesById = {};
for (const game of games) gamesById[game.id] = game;

const outputPath = './src/lib/data/games.json';
writeFileSync(outputPath, JSON.stringify(gamesById, null, '\t'));
console.log(`Wrote ${games.length} games to ${outputPath}`);
