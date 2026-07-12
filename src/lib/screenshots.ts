export const SCREENSHOT_BASE_URL =
	'https://wsrv.nl/?h=120&output=webp&url=raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/refs/heads/master/Named_Titles/';

export function pickScreenshotFilename(filenames: string[] | undefined): string | null {
	if (!filenames || filenames.length === 0) return null;
	const usaFilenames = filenames.filter((name) => name.includes('(USA)'));
	const candidates = usaFilenames.length > 0 ? usaFilenames : filenames;
	return [...candidates].sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
}
