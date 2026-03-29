# jckl.dev

`jckl.dev` is my personal website and interactive portfolio.

It is not just a static landing page. The site is built like a small
progression-driven web experience: sections unlock each other, hidden systems
surface over time, puzzle pieces get dispensed and assembled, and the contact
form can branch into different endings through a D-Mail / timeline-change
mechanic.

Live site: [https://jckl.dev](https://jckl.dev)

## What This Project Is

- Personal portfolio, about page, and contact site
- Interactive web experiment built around secrets, progression, and replayable
  endings
- Astro + React app with animated section transitions, mini-systems, and a
  puzzle flow
- Netlify-hosted project with automated Vitest and Playwright coverage

## Main Experience

The homepage is a single long-form experience made up of these main sections:

- `Hero`
- `StarConstellation`
- `About`
- `CrtMission`
- `Projects`
- `Connection`
- `Call`
- `Contact`

Behind those sections is a shared progression/state system:

- bitflag-based game state in `src/stores/gameStateStore.tsx`
- ending discovery and selection in `src/stores/endingStore.ts`
- puzzle transfer/dispense/reset state in the puzzle-related stores
- a sentiment-driven ending trigger through the contact form and `/api/openai`

## Stack

- [Astro 5](https://astro.build/) for the site shell, routing, and API routes
- [React 18](https://react.dev/) for interactive sections and systems
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for motion and interaction
- [Nanostores](https://nanostores.github.io/nanostores/) for shared client
  state
- [Netlify](https://www.netlify.com/) adapter and forms
- [OpenAI](https://platform.openai.com/) for sentiment classification in the
  D-Mail flow
- [Vitest](https://vitest.dev/) + React Testing Library for unit/component
  tests
- [Playwright](https://playwright.dev/) for end-to-end coverage

## Local Development

### Install

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Scripts

### App

- `npm run dev` - start the Astro dev server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally

### Testing

- `npm run test` - run Vitest in watch mode
- `npm run test:run` - run unit/component tests once
- `npm run test:coverage` - run Vitest with V8 coverage output
- `npm run test:e2e` - run the full Playwright suite
- `npm run test:e2e:ci` - run the seeded CI-style E2E specs
- `npm run test:e2e:production` - run the production-safe smoke subset
- `npm run test:e2e:headed` - run Playwright headed for local debugging

### Asset / data generation

- `npm run fonts:convert` - convert local font assets
- `npm run images:hero` - regenerate the hero image derivatives
- `npm run trace:puzzle` - trace puzzle piece image outlines and rewrite
  `polygonCoords` in `src/data/PuzzleData.tsx`

## Project Structure

```text
.
|-- src/
|   |-- components/
|   |   |-- Sections/        # Main page sections
|   |   |-- appliance/       # CRT, email, terminal UI
|   |   |-- phone/           # Phone / PhoneWave UI
|   |   `-- puzzle/          # Puzzle board, pieces, transfers, signal board
|   |-- context/             # Shared React context
|   |-- data/                # Puzzle, image, and project data
|   |-- layouts/             # Astro layout shell
|   |-- pages/               # Index page, API routes, admin dashboard
|   |-- server/              # Server-side helpers (GitHub Actions, sentiment)
|   |-- stores/              # Nanostore-based app state
|   |-- styles/              # Global CSS
|   |-- test/                # Shared test setup, mocks, factories
|   `-- utility/             # Small app utilities and helpers
|-- e2e/                     # Playwright tests
|   `-- production/          # Production-safe smoke subset for jckl.dev
|-- scripts/                 # Local asset and data generation scripts
|-- .github/workflows/       # GitHub Actions, including nightly E2E runs
|-- public/                  # Static assets
|-- netlify/                 # Netlify-specific support files
`-- README.md
```

Generated output that does not need to be committed:

- `coverage/`
- `dist/`
- `test-results/`

## Testing

The project has three testing layers:

### 1. Unit and component tests

Vitest covers stores, utilities, React components, server helpers, and API
logic.

```bash
npm run test:run
npm run test:coverage
```

Coverage reports are written to `coverage/`.

### 2. Seeded CI Playwright regression suite

This suite runs against a fresh build and uses development-only seed helpers for
the more stateful flows.

```bash
npm run test:e2e:ci
```

Examples:

- connection / PhoneWave success and retry paths
- contact form endings
- CRT gating
- ending return and mission balloon flows

### 3. Production-safe Playwright smoke subset

This suite runs against the public site without private dev-only seed state.

```bash
npm run test:e2e:production
```

Examples:

- homepage loads
- project navigation works
- public connection flow still behaves correctly

## Nightly E2E Dashboard

This repo includes two scheduled GitHub Actions workflows:

- `.github/workflows/nightly-e2e.yml`
  Runs the seeded Playwright regression suite against a CI build.
- `.github/workflows/nightly-e2e-production.yml`
  Runs the production-safe smoke subset against `https://jckl.dev`.

The live site includes an admin dashboard for these runs:

- `/admin/tests`
- `/admin/tests?suite=ci`
- `/admin/tests?suite=production`

You can also inspect a specific GitHub run directly:

- `/admin/tests?suite=ci&run=<github-run-id>`
- `/admin/tests?suite=production&run=<github-run-id>`

The dashboard is protected with an app-level password flow so it works on the
Netlify free tier.

## Environment Variables

### Required for sentiment analysis

- `OPENAI_API_KEY`

Without this, the `/api/openai` route cannot classify D-Mail sentiment.

### Required for the admin dashboard

- `ADMIN_DASHBOARD_PASSWORD` - password used to sign into `/admin/tests`
- `ADMIN_DASHBOARD_SECRET` - cookie/session signing secret

### Optional but recommended for the admin dashboard

- `GITHUB_ACTIONS_DASHBOARD_TOKEN` - fine-grained GitHub token with `Actions:
  Read`
- `GITHUB_ACTIONS_REPO_OWNER` - defaults to `JcK-l`
- `GITHUB_ACTIONS_REPO_NAME` - defaults to `jckl.dev`
- `GITHUB_ACTIONS_WORKFLOW_FILE` - legacy fallback for the CI suite, defaults to
  `nightly-e2e.yml`
- `GITHUB_ACTIONS_CI_WORKFLOW_FILE` - defaults to `nightly-e2e.yml`
- `GITHUB_ACTIONS_PRODUCTION_WORKFLOW_FILE` - defaults to
  `nightly-e2e-production.yml`

## Deployment

The site is configured for Netlify via `@astrojs/netlify`.

Production deployment target:

- `https://jckl.dev`

Nightly browser coverage is handled through GitHub Actions, not Netlify
scheduled functions, so the test infrastructure stays separate from the app
hosting.

## Project History

The branch `pre-codex` preserves the older v1 version of the site from before I
started using Codex on this project.

That branch is mainly there as a historical baseline right now. If I decide to
host the original version separately in the future, the likely home would be:

- `old.jckl.dev`

## Notes

- The contact form has two modes: a normal contact path and a CRT/D-Mail path.
- Some E2E helpers exist only for local/CI development and are intentionally
  not part of the public production flow.
- `Carousel` is intentionally left more flexible because it is a likely future
  rewrite target.
