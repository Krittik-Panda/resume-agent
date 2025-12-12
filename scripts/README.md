# Scripts Documentation

This directory contains utility scripts for the AI Resume & Portfolio Agent.

## generate-summaries.ts

Fetches a GitHub user's profile and repositories, sends the combined data to the backend for AI analysis across multiple job roles, and saves the generated summaries to `data/generated/github_summary.json`.

### Usage

```bash
# Using default roles (backend-engineer, security-engineer, open-source-contributor)
npm run generate:summaries

# Using custom roles via environment variable
ROLES="frontend-engineer,devops-engineer,data-scientist" npm run generate:summaries

# Using custom roles with specific backend URL
BACKEND_URL="http://localhost:3000" ROLES="product-manager,ux-designer" npm run generate:summaries
```

### Environment Variables

- `GITHUB_USER` (required): GitHub username to analyze
- `GITHUB_TOKEN` (optional): GitHub personal access token for higher rate limits
- `BACKEND_URL` (optional): Backend API URL (defaults to `http://localhost:3000`)
- `ROLES` (optional): Comma-separated list of roles to analyze (defaults to "backend-engineer,security-engineer,open-source-contributor")

### Example Output

The script generates a JSON file at `data/generated/github_summary.json` with summaries for each role:

```json
{
  "user": "johndoe",
  "profile": { ... },
  "repositories": [ ... ],
  "summaries": {
    "frontend-engineer": {
      "summary": "John has extensive experience with React...",
      "generated_at": "2025-12-12T17:42:50.000Z",
      "input_length": 1234
    },
    "devops-engineer": {
      "summary": "John demonstrates strong DevOps skills...",
      "generated_at": "2025-12-12T17:42:51.000Z",
      "input_length": 1234
    }
  },
  "generated_at": "2025-12-12T17:42:50.000Z"
}
```

## ingest-profile.ts

Fetches a GitHub user's profile and repos, sends them to the backend AI analyzer, and prints the generated summary for quick evaluation.

### Usage

```bash
# Using default role (github-profile)
npm run ingest:profile

# Using custom role as argument
npm run ingest:profile backend-engineer

# Using custom role via environment variable
ROLE="security-engineer" npm run ingest:profile

# Using custom backend URL
BACKEND_URL="https://my-api.com" npm run ingest:profile data-scientist
```

### Environment Variables

- `GITHUB_USER` (required): GitHub username to analyze
- `GITHUB_TOKEN` (optional): GitHub personal access token for higher rate limits
- `BACKEND_URL` (optional): Backend API URL (defaults to `http://localhost:3000`)
- `ROLE` (optional): Role to analyze (defaults to "github-profile")

### Command Line Arguments

- First argument: Role to analyze (overrides `ROLE` environment variable)

### Example Output

```json
{
  "summary": "John Doe is a skilled backend engineer with expertise in Node.js, Express, and database design...",
  "inputLength": 567,
  "engine": "local-fallback",
  "timestamp": "2025-12-12T17:42:52.000Z"
}
```

## Common Environment Setup

Create a `.env` file in the project root:

```env
GITHUB_USER=your-github-username
GITHUB_TOKEN=your-github-personal-access-token
BACKEND_URL=http://localhost:3000
```

## Role Flexibility

Both scripts now support any role you want to analyze. Some common roles include:

- `backend-engineer`
- `frontend-engineer`
- `security-engineer`
- `devops-engineer`
- `data-scientist`
- `product-manager`
- `ux-designer`
- `open-source-contributor`
- `github-profile` (general profile analysis)

You can specify any custom role that makes sense for your analysis needs.
