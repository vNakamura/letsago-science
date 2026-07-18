#!/usr/bin/env node
import { writeFileSync } from 'node:fs';

const TREE_URL =
	'https://api.github.com/repos/libretro-thumbnails/Nintendo_-_Nintendo_64/git/trees/master?recursive=1';

const SCREENSHOT_DIRS = {
	titles: 'Named_Titles/',
	boxarts: 'Named_Boxarts/',
	snaps: 'Named_Snaps/'
};

const res = await fetch(TREE_URL);
if (!res.ok) {
	throw new Error(`Failed to fetch repo tree: ${res.status} ${res.statusText}`);
}

const { tree, truncated } = await res.json();
if (truncated) {
	console.warn('Warning: GitHub tree response was truncated, some files may be missing.');
}

const blobs = tree.filter((entry) => entry.type === 'blob');

const screenshots = {};
for (const [type, dir] of Object.entries(SCREENSHOT_DIRS)) {
	screenshots[type] = blobs
		.filter((entry) => entry.path.startsWith(dir))
		.map((entry) => entry.path.slice(dir.length))
		.sort();
}

const outputPath = './src/lib/data/screenshots.json';
writeFileSync(outputPath, JSON.stringify(screenshots, null, '\t'));

for (const [type, filenames] of Object.entries(screenshots)) {
	console.log(`Wrote ${filenames.length} ${type} screenshots to ${outputPath}`);
}
