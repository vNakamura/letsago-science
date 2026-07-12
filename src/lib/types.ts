export type GamesJsonEntry = {
	id: string;
	title: string | null;
	developers: string[];
	publisher: string | null;
	releaseDates: { jp: string | null; na: string | null; pal: string | null };
	wikiUrl?: string;
	otherTitles?: Record<string, string>;
	otherPublishers?: Record<string, string>;
};

export type GameWikiData = {
	title: string;
	otherTitles: Record<string, string> | null;
	developers: string[];
	publisher: string | null;
	otherPublishers: Record<string, string> | null;
	releaseDateNA: string | null;
	otherReleaseDates: Record<string, string> | null;
	wikiUrl: string | null;
	screenshotUrl: string | null;
};
