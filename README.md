# Soundpose - Music Quiz 🎵

A Vue.js application for hosting a two-team music quiz: a song plays, each team can validate the **title** and/or the **artist**, with a scoring system and cross-team locking so a team can't validate the same thing twice or block the other team from answering after them.

## Table of contents

- [How it works](#how-it-works)
- [Music files structure](#music-files-structure)
- [`song.json` format](#songjson-format)
- [Code architecture](#code-architecture)
- [Game rules](#game-rules)
- [Components](#components)
- [Composables](#composables)
- [Getting started](#getting-started)

## How it works

1. When the app loads, the playlist is fetched from `public/quiz/song.json`.
2. The first song in the list is loaded (but not played automatically).
3. The host clicks ▶ to start playback.
4. As soon as a team thinks it knows the title and/or the artist, it clicks the corresponding button:
  - The song is **paused and reset to 0:00** automatically.
  - The team's score is updated.
  - The title/artist is revealed on screen once validated.
5. Once both pieces of info are validated (by one or two different teams), the host moves to the next song with ⏭, which resets the round state (but not the scores).
6. The game ends once the last song in the playlist is reached (the ⏭ button is then disabled).

Songs are played **in the order of the JSON file** (no random shuffle).

## Music files structure

Files must be placed in the project's `public` folder, like this:

```
public/
└── quiz/
    ├── song.json
    └── songs/
        ├── piste-1.mp4
        ├── piste-2.mp4
        ├── piste-3.mp4
        └── ...
```

**Important naming rule**: each audio file must be named `piste-{id}.mp4`, where `{id}` exactly matches the `id` field of the corresponding entry in `song.json`.

For example, for the entry `{ "id": 1, "title": "I Want You Back", ... }`, the expected file is `public/quiz/songs/piste-1.mp4`.

> ℹ️ The player uses the browser's native `Audio` element, which can play the audio track of an `.mp4` file just fine — it doesn't need to be a video.

## `song.json` format

The `public/quiz/song.json` file must be a JSON array, where each entry represents a song:

```json
[
  {
    "id": 1,
    "title": "I Want You Back",
    "author": "Jackson 5",
    "year": "1969"
  },
  {
    "id": 2,
    "title": "Take on Me",
    "author": "A-ha",
    "year": "1985"
  }
]
```

| Field    | Type     | Description                                                                 |
|----------|----------|------------------------------------------------------------------------------|
| `id`     | `number` | Unique identifier, used to find the corresponding `piste-{id}.mp4` file     |
| `title`  | `string` | Song title, revealed once validated                                        |
| `author` | `string` | Artist name, revealed once validated                                       |
| `year`   | `string` | Release year (currently not displayed in the UI, but available in the data) |

**To add a song**: simply add a new entry to `song.json` with a unique `id`, and drop the matching audio file `piste-{id}.mp4` into `public/quiz/songs/`.

## Code architecture

```
src/
├── components/
│   └── Quiz/
│       ├── Container.vue   → root component, orchestrates teams + player
│       ├── Team.vue        → a team's card (score, validation buttons)
│       └── Music.vue       → player (cover, progress bar, actions, results)
├── composables/
│   ├── useQuizRound.ts     → score and title/artist validation logic
│   └── useQuizPlayer.ts    → audio playback logic (play/pause/next/prev/seek)
└── types/
    └── models.ts           → shared types (Team, Song)
```

The logic is deliberately split into two independent composables:

- **`useQuizRound`** knows nothing about audio — it only handles team scores and validation state.
- **`useQuizPlayer`** knows nothing about teams or scores — it only handles audio playback.

`Container.vue` is the one that ties the two together (for example: when a team validates, it also pauses the song). This separation makes each composable reusable and testable on its own.

## Game rules

- **Cross-team locking**: once a team has validated the title (or the artist), the other team can no longer validate it for this round — the corresponding button automatically disables on the opposing side.
- **Points**: +10 points for a validated title, +5 points for a validated artist (configurable via `POINTS` in `useQuizRound.ts`).
- **Full correct answer**: if both title **and** artist are validated (regardless of which team(s) validated them), the `good_answers` counter of the team that performed each validation is incremented.
- **Changing songs**: moving to the next/previous song automatically resets the round's validation state (`resetRound`), but keeps the accumulated scores.
- **Auto-pause on validation**: as soon as a team validates a title or an artist, the currently playing song is paused and reset to 0:00, to avoid giving an advantage to a team that would keep listening while the other team is validating.

## Components

### `Container.vue`

Root component of the quiz page. Instantiates both composables (`useQuizRound`, `useQuizPlayer`), loads the playlist on mount, and wires up the two `Team.vue` components (Team A on the left, Team B on the right) with `Music.vue` in the middle.

### `Team.vue`

Displays a team's score and number of correct answers, with two buttons:
- **Validate title** (+10 points)
- **Validate artist** (+5 points)

Each button automatically disables if already validated by this team, or if the opposing team validated it first this round.

### `Music.vue`

Displays:
- the playlist progress counter (e.g. `3 / 60`),
- the cover art,
- a playback progress bar (clickable to seek within the track),
- elapsed time / total duration,
- the ⏮ (previous), ▶/❚❚ (play/pause), ⏭ (next) buttons,
- the title and artist, hidden until validated by a team.

## Composables

### `useQuizRound.ts`

Manages the state of a round:

| Export                   | Description                                                          |
|---------------------------|------------------------------------------------------------------------|
| `teamA`, `teamB`          | Reactive state for each team (`score`, `good_answers`, etc.)          |
| `validateTitle(teamId)`   | Validates the title for a team                                        |
| `validateSinger(teamId)`  | Validates the artist for a team                                       |
| `canValidateTitle(teamId)` / `canValidateSinger(teamId)` | Whether the team can still validate |
| `isTitleValidated` / `isSingerValidated` | `true` as soon as the title/artist has been validated by any team |
| `resetRound()`            | Resets the validation state (called when changing songs)              |
| `POINTS`                  | Point values (`TITLE: 10`, `SINGER: 5`)                                |

### `useQuizPlayer.ts`

Manages audio playback via the browser's native `Audio` API:

| Export                            | Description                                                    |
|-------------------------------------|-------------------------------------------------------------------|
| `songs`, `currentSong`             | Loaded playlist and currently selected song                       |
| `isPlaying`                        | Reflects the actual player state (synced with the `Audio` element's `playing`/`pause` events) |
| `currentTime`, `duration`, `progress` | Playback position, total duration, percentage played           |
| `trackNumber`, `totalTracks`       | Position within the playlist (e.g. `3` / `60`)                    |
| `hasNext`, `hasPrev`               | Whether you can move forward/backward in the playlist             |
| `loadSongs()`                      | Fetches `song.json` and prepares the first track                  |
| `togglePlay()`                     | Starts or pauses playback                                         |
| `next()` / `prev()`                | Changes track                                                     |
| `seek(percent)`                    | Moves playback to a given percentage of the track                 |
| `pauseAndReset()`                  | Pauses and resets to 0:00 (used when a validation happens)        |

## Getting started

```bash
npm install
npm run dev
```

Before starting a game, make sure to:
1. Drop your `song.json` file into `public/quiz/`.
2. Drop your audio files `piste-{id}.mp4` into `public/quiz/songs/`.
3. Double-check that every `id` in the JSON matches an existing file, otherwise the track won't be able to load.