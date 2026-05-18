# Social Media Content Creator

A browser-based web app for designing social media posts: pick a template, upload photos, edit text, generate AI captions, and export ready-to-share images.

## Features

- **Template library** — Single-image, collage, quote cards, carousel covers, stories, announcements, and more
- **Visual editor** — Three-column layout with template picker, live preview, and text controls
- **Photo upload** — Multi-file upload with slot assignment and auto-fill for unassigned slots
- **AI captions** — Generate caption suggestions with configurable platform, tone, and length
- **Multi-provider AI** — Choose Auto (fallback), Gemini, OpenRouter, or Mock (offline)
- **Export** — Server-side PNG/JPEG export via Sharp (1080×1080)
- **Persistence** — Editor state saved to `localStorage` (template, text, assignments)

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 18, TypeScript, Tailwind CSS 3 |
| State | Zustand |
| Image export | Sharp |
| AI | Gemini API, OpenRouter (optional) |

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** (comes with Node)

## Getting started

### 1. Install dependencies

```bash
cd social-media-content-creator
npm install
```

### 2. Environment variables

Create `.env.local` in this folder (see `.env.example` patterns below). This file is gitignored.

```bash
# Optional — used when AI Provider is "Gemini" or "Auto"
GEMINI_API_KEY=your_gemini_api_key

# Optional — used when AI Provider is "OpenRouter" or "Auto"
OPENROUTER_API_KEY=your_openrouter_api_key
```

- Get a Gemini key: [Google AI Studio](https://aistudio.google.com/app/apikey)
- Get an OpenRouter key: [OpenRouter](https://openrouter.ai/)

If no keys are set, **Auto** falls back to **Mock** captions so the editor still works.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page — hero, post types, template showcase |
| `/editor` | Main editor (templates sidebar, preview, text & AI) |
| `/templates` | Browse and select a template |
| `/api/export` | POST — composite and download image |
| `/api/ai/caption` | POST — generate caption suggestions |

## Project structure

```
social-media-content-creator/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout + nav (Home, Editor, Templates)
│   │   ├── editor/page.tsx       # Editor UI
│   │   ├── templates/page.tsx    # Template grid
│   │   └── api/
│   │       ├── export/route.ts   # Image export (Sharp)
│   │       └── ai/caption/route.ts
│   ├── components/editor/
│   │   └── CanvasStage.tsx       # Preview canvas
│   └── lib/
│       ├── store/editorStore.ts  # Zustand editor state
│       └── templates/
│           ├── schema.ts         # Template types
│           └── catalog.ts        # Template definitions
├── .env.local                    # Secrets (not committed)
├── .gitignore
├── IMPLEMENTATION_PLAN.md        # Phased roadmap
└── package.json
```

## Using the editor

1. Go to **Editor** (or **Home** → Open editor).
2. Select a template from the left sidebar.
3. Upload images (**Choose files**); they auto-assign to empty slots when possible.
4. Assign photos per slot via dropdowns if needed.
5. Edit **Title**, **Subtitle**, and other text fields; preview updates in the center.
6. Optionally use **AI captions** (pick provider, topic, Generate).
7. Choose **PNG** or **JPEG** and click **Export**.

## AI providers

| Provider | Behavior |
|----------|----------|
| **Auto** | Tries Gemini → OpenRouter → Mock |
| **Gemini** | Google Generative Language API only |
| **OpenRouter** | Free-tier model (`meta-llama/llama-3.1-8b-instruct:free`) |
| **Mock** | Local placeholder captions (no API key) |

Restart the dev server after changing `.env.local`.

## What gets ignored by Git

See `.gitignore`: `node_modules/`, `.next/`, `.env*`, build output, logs, and editor caches. Do not commit API keys.

## Roadmap

See `IMPLEMENTATION_PLAN.md` for phased plans (canvas interactions, auth, saved designs, tests, deployment).

## License

Private project — add a license if you plan to open-source or distribute.
