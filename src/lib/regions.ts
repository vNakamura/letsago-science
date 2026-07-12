const REGION_LABELS: Record<string, string> = { jp: 'JP', pal: 'PAL', na: 'NA' };

export function regionLabel(region: string): string {
	return REGION_LABELS[region] ?? region.toUpperCase();
}

export function formatOtherRegions(
	values: Record<string, string>,
	formatValue: (value: string) => string = (value) => value
): string {
	return Object.entries(values)
		.map(([region, value]) =>
			region === 'default' ? formatValue(value) : `${regionLabel(region)}: ${formatValue(value)}`
		)
		.join(' · ');
}

export function pickOtherRegions(
	values: Record<string, string | null>,
	primaryRegion: string
): Record<string, string> | null {
	const entries = Object.entries(values).filter(
		(entry): entry is [string, string] => entry[0] !== primaryRegion && entry[1] !== null
	);
	return entries.length ? Object.fromEntries(entries) : null;
}
