#!/usr/bin/env node
import { writeFileSync } from 'node:fs';

const TREE_URL =
	'https://api.github.com/repos/libretro-thumbnails/Nintendo_-_Nintendo_64/git/trees/master?recursive=1';
const SNAPS_DIR = 'Named_Titles/';

const res = await fetch(TREE_URL);
if (!res.ok) {
	throw new Error(`Failed to fetch repo tree: ${res.status} ${res.statusText}`);
}

const { tree, truncated } = await res.json();
if (truncated) {
	console.warn('Warning: GitHub tree response was truncated, some files may be missing.');
}

const filenames = tree
	.filter((entry) => entry.type === 'blob' && entry.path.startsWith(SNAPS_DIR))
	.map((entry) => entry.path.slice(SNAPS_DIR.length))
	.sort();

const outputPath = './src/lib/data/screenshots.json';
writeFileSync(outputPath, JSON.stringify(filenames, null, '\t'));
console.log(`Wrote ${filenames.length} screenshots to ${outputPath}`);
