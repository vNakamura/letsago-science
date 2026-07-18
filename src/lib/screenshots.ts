export type ScreenshotType = 'titles' | 'boxarts' | 'snaps';

export type GameScreenshots = Partial<Record<ScreenshotType, string[]>>;

const LIBRETRO_DIR: Record<ScreenshotType, string> = {
	titles: 'Named_Titles',
	boxarts: 'Named_Boxarts',
	snaps: 'Named_Snaps'
};

const TYPE_LABEL: Record<ScreenshotType, string> = {
	titles: 'Title Screen',
	boxarts: 'Box Art',
	snaps: 'Screenshot'
};

const TYPE_PRIORITY: ScreenshotType[] = ['titles', 'snaps', 'boxarts'];
const ROW_THUMBNAIL_PRIORITY: ScreenshotType[] = ['boxarts', 'titles', 'snaps'];

// A handful of files in the libretro-thumbnails repo are git symlinks (regional/
// revision variants deduped against a canonical image). raw.githubusercontent.com
// serves symlinks as plain text (the link target's name) instead of following them,
// so a boxart/snap/title occasionally fails to decode as an image. thumbnails.libretro.com
// resolves symlinks server-side and always returns the real file, so it's used as an
// <img onerror> fallback rather than the primary source (it's slower/less reliable to
// depend on directly for every image).
export function screenshotUrl(type: ScreenshotType, filename: string, width = 128): string {
	return `https://wsrv.nl/?w=${width}&output=webp&url=raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/refs/heads/master/${LIBRETRO_DIR[type]}/${encodeURIComponent(filename)}`;
}

export function screenshotFallbackUrl(type: ScreenshotType, filename: string, width = 128): string {
	return `https://wsrv.nl/?w=${width}&output=webp&url=thumbnails.libretro.com/${encodeURIComponent('Nintendo - Nintendo 64')}/${LIBRETRO_DIR[type]}/${encodeURIComponent(filename)}`;
}

export function handleImageFallback(fallbackUrl: string | null | undefined) {
	return (event: Event) => {
		const img = event.currentTarget as HTMLImageElement;
		if (fallbackUrl && img.src !== fallbackUrl) img.src = fallbackUrl;
	};
}

export function pickScreenshotFilename(filenames: string[] | undefined): string | null {
	if (!filenames || filenames.length === 0) return null;
	const usaFilenames = filenames.filter((name) => name.includes('(USA)'));
	const candidates = usaFilenames.length > 0 ? usaFilenames : filenames;
	return [...candidates].sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
}

export function pickRowThumbnail(
	shots: GameScreenshots | undefined
): { type: ScreenshotType; url: string; fallbackUrl: string } | null {
	for (const type of ROW_THUMBNAIL_PRIORITY) {
		const filename = pickScreenshotFilename(shots?.[type]);
		if (filename)
			return {
				type,
				url: screenshotUrl(type, filename),
				fallbackUrl: screenshotFallbackUrl(type, filename)
			};
	}
	return null;
}

export function buildZoomImages(
	shots: GameScreenshots | undefined
): { type: ScreenshotType; label: string; url: string; fallbackUrl: string }[] {
	const images = [];
	for (const type of TYPE_PRIORITY) {
		const filename = pickScreenshotFilename(shots?.[type]);
		if (filename)
			images.push({
				type,
				label: TYPE_LABEL[type],
				url: screenshotUrl(type, filename, 1280),
				fallbackUrl: screenshotFallbackUrl(type, filename, 1280)
			});
	}
	return images;
}
