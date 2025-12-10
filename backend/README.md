Backend for resume-agent

Environment
- Create a `.env` file at the repository root with:

```
PORT=3000
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=mistralai/mistral-7b-instruct
```

- Get a free OpenRouter API key at https://openrouter.ai (includes free credits for testing)

Usage
- Development (run in place using `tsx`):

```
npm run dev
```

- Build and run:

```
npm run build
npm start
```

Endpoints
- `GET /health` — health check
- `POST /api/resume/analyze` — body: `{ text: string, kind?: string }` returns `{ summary, inputLength, engine, timestamp }`
- `POST /api/llm/test` — body: `{ input: string, instruction?: string, apiKey?: string, model?: string }` returns `{ result }` (test OpenRouter LLM endpoint)

Notes
 - If `OPENROUTER_API_KEY` is set in the environment, the resume summarizer will call OpenRouter LLM. Otherwise, a local heuristic summarizer is used.
 - OpenRouter offers free tier credits (~$5 free) on signup — perfect for testing without cost.
 - The adapter supports custom models; set `OPENROUTER_MODEL` to use different LLMs (e.g., `meta-llama/llama-2-7b-chat`, `openai/gpt-3.5-turbo`).

OpenRouter LLM test
 - POST `/api/llm/test` — body: `{ input: string, instruction?: string, kind?: string }` returns `{ result: string }`. Use this to verify your OpenRouter endpoint and key.

Example:
```
curl -X POST http://localhost:3000/api/llm/test \
	-H "Content-Type: application/json" \
	-d '{"input":"Hello world. This is a test.", "instruction":"Summarize in one sentence."}'
```

Local mock server
 - You can run a local mock OpenRouter server for testing: `npm run mock:llm` (starts at `http://localhost:4000/api/v1/chat/completions`).
 - Then either set `OPENROUTER_API_URL=http://localhost:4000/api/v1/chat/completions` and `OPENROUTER_API_KEY=mock` and restart the backend, or call the test route with `apiUrl`/`apiKey` in the request body (useful when you don't want to restart the backend):

Example using per-request `apiUrl`/`apiKey` (no backend restart required):
```
curl -X POST http://localhost:3000/api/llm/test \
	-H "Content-Type: application/json" \
	-d '{"input":"Hello world.", "instruction":"Summarize.", "apiUrl":"http://localhost:4000/api/v1/chat/completions", "apiKey":"mock"}'
```

Hackathon tool integrations
- `OpenRouter`: used as the primary LLM. Configure `OPENROUTER_API_URL` and `OPENROUTER_API_KEY`.
- `CodeRabbit`: optional PR review integration — set `CODE_RABBIT_API_URL` and `CODE_RABBIT_API_KEY` to enable programmatic reviews.
- `Oumi`: optional ranking/evaluation endpoint — set `OUMI_API_URL`/`OUMI_API_KEY` to enable.
- `Cline`: optional autonomous coding workflow runner — set `CLINE_API_URL`/`CLINE_API_KEY` to enable remote task triggers.
- `Kestra`: workflow definitions are included under `kestra/` — set `KESTRA_URL`/`KESTRA_API_KEY` to trigger workflows programmatically.
- `Vercel`: `vercel.json` added for quick deployment; the backend is written to be deployable on Vercel's Node runtimes.

Usage notes for integrations
- All integrations are defensive: nothing is called unless the corresponding `*_API_URL` (and where applicable `*_API_KEY`) env vars are present.
- A GitHub profile ingestion script is available at `scripts/ingest-profile.ts` — this can be wired into a Kestra workflow or run directly to send a profile summary to the backend.
