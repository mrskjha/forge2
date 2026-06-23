# Forge 2 · Edition 1 Qualifier — Tiny Kanban Board

A small Trello-style Kanban board (Laravel API + React frontend) built through a two-agent
chat loop in Slack, as required by the Forge 2 Edition 1 qualifier.

## What this app does

- Create boards, each with lists (e.g. To-Do / Doing / Done) and cards inside those lists
- Create/edit cards with a title, description, due date, and assigned member
- Move cards between lists
- Add members to a board
- Tag support (see "Known limitations" below for current status)

## Stack

| Layer    | Tech                                  |
|----------|----------------------------------------|
| Backend  | Laravel (PHP), SQLite                  |
| Frontend | React + Vite                           |
| Agents   | OpenClaw (hands) + Hermes (brain)      |
| Comms    | Slack (Socket Mode)                    |
| Models   | Google Gemini (`gemini-2.5-flash`) — primary. Groq (`llama-3.3-70b-versatile`) and local Ollama (`qwen2.5-coder`) used as fallbacks when Gemini hit per-minute/daily quota limits. |

All models used are free-tier. No paid APIs or subscriptions were used anywhere in this build.

## Why this model routing

Gemini 2.5 Flash was used as the primary model for OpenClaw because it has the most generous
free-tier context window (1M tokens) and request quota of the three free options, which matters
because OpenClaw's "coding" tool profile carries a large system prompt + tool schema overhead on
every call. Groq's `llama-3.3-70b-versatile` was kept configured as a fallback — Groq's free tier
has a much smaller tokens-per-minute (TPM) ceiling, which caused repeated `413 Request too large`
errors with larger models like `gpt-oss-120b`, so a smaller/faster Groq model was used as backup
rather than primary. Local Ollama (`qwen2.5-coder`) was used as a last-resort fallback for
unlimited, offline capacity, though it struggled with some agentic/tool-calling tasks on this
machine's available RAM.

## Run instructions

### Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
API will be available at `http://localhost:8000/api`.

### Frontend (React + Vite)
```bash
cd kanban-frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

### Agents (OpenClaw)
```bash
npm install -g openclaw@latest
openclaw onboard
openclaw plugins install @openclaw/slack
# set SLACK_APP_TOKEN, SLACK_BOT_TOKEN, GEMINI_API_KEY, GROQ_API_KEY as environment variables
openclaw gateway
```
See `openclaw.json` (secrets stripped) for the full agent configuration and `.env.example` for
the required environment variable names.

## Live URL

[ADD YOUR DEPLOYED FRONTEND URL HERE AFTER DEPLOYING]

Backend API deployed at: [ADD YOUR DEPLOYED BACKEND URL HERE]

## Known limitations

Being transparent about the current state of the build, since the qualifier explicitly rewards
honesty over a polished-looking but inaccurate submission:

- **Tags**: Tag creation/listing endpoints exist (`GET/POST /api/tags`), but the card-to-tag
  many-to-many relationship (`card_tag` pivot table + attach/detach endpoints) was still being
  built by the coding agent when free-tier rate limits across all three providers were hit in
  close succession. This feature is incomplete as of submission.
- **Member assignment on cards**: The `cards` table has a `member_id` column, but it has not been
  fully confirmed/tested that the `PUT /api/cards/{card}` endpoint correctly accepts and persists
  this field end-to-end through the UI.
- **Hermes (the "brain" agent)**: Setup was in progress at submission time. The memory-recall,
  custom SKILL.md, and autonomous cron-run requirements were not fully verified working. See
  `ARCHITECTURE.md` for what was attempted.
- Boards/Lists currently support create + read reliably; update/delete on boards specifically
  were not exhaustively tested.

## Repo structure

```
.
├── README.md
├── ARCHITECTURE.md
├── agent-log.md
├── slack-export/
├── skills/status-report/SKILL.md
├── openclaw.json
├── .env.example
├── backend/          (Laravel API)
└── kanban-frontend/  (React + Vite UI)
```