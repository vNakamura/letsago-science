# letsago.science

## Requirements

This project requires:

- **Node.js** (latest recommended)
- **pnpm** (latest recommended)

### Using mise (recommended)

If you have [mise](https://mise.jdx.dev/) installed, the required tools will be automatically set up from `mise.toml`:

```sh
mise install
```

### Manual installation

Alternatively, install the tools manually:

- Install Node.js from [nodejs.org](https://nodejs.org/)
- Install pnpm: `npm install -g pnpm`

## Setup

Install dependencies:

```sh
pnpm install
```

## Developing

Start the development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```

## Building

Create a production build:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

## Data Sources

Content about the games are sourced from external sources. It's results are stored in JSON files in `src/lib/data/` and used to generate the static site.
It's unlikely that the data will change, but if it does, you can regenerate the JSON files by following the instructions below.

### Game Data

Game data is sourced from Wikipedia and stored as JSON in `src/lib/data/games.json`.

#### Updating the Games Data

1. Go to the [List of Nintendo 64 games](https://en.wikipedia.org/wiki/List_of_Nintendo_64_games) on Wikipedia.
2. Open your browser's developer tools, find the `<table id="softwarelist">` element, and copy its outer HTML.
3. Replace the contents of `src/lib/data/wikiTable.html` with the copied HTML.
4. Run the parser to regenerate `games.json`:

```sh
pnpm parse-games
```

### Screenshots

Screenshot filenames are sourced from the [libretro-thumbnails Nintendo_-_Nintendo_64](https://github.com/libretro-thumbnails/Nintendo_-_Nintendo_64) repo's `Named_Titles` folder and stored as a JSON array in `src/lib/data/screenshots.json`.

The filenames are fetched via GitHub's Git Trees API (no cloning, no image downloads) and written directly to disk. To regenerate `screenshots.json`:

```sh
pnpm parse-screenshots
```

#### Matching Screenshots to Games

Screenshot filenames follow libretro/No-Intro naming conventions (e.g. `Legend of Zelda, The - Majora's Mask (USA).png`), which differ from the Wikipedia-sourced titles in `games.json`. `pnpm match-screenshots` reconstructs each filename back into a comparable title (stripping region/language/revision tags, moving a trailing `, The`/`, A`/`, An` back to the front, restoring subtitle colons) and matches it against `games.json`, limited to games that released in North America. The result is written to `src/lib/data/gameScreenshots.json`, mapping each game's `id` to its matched screenshot filename(s):

```sh
pnpm match-screenshots
```

Some titles differ too much to match automatically. These are logged to the console as `NA games with no matched screenshot`. Add manual matches to `src/lib/data/screenshotOverrides.json`, mapping the screenshot filename to the game's `id`:

```json
{
	"007 - GoldenEye (USA).png": "GoldenEye_007_(1997_video_game)"
}
```
