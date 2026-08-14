# Contributing to Latchpoint

Quick rules so 4 people don't end up with 4 different habits.

## Branch Naming

Format: `<type>/<short-description>`

- `feature/mfa-login` — new functionality
- `fix/session-timeout-bug` — bug fix
- `docs/api-contract-update` — documentation only
- `chore/docker-setup` — tooling/config, no app logic

Never commit directly to `main`. Every change goes through a branch → PR → review → merge.

## Commit Messages

Format: `<type>: <short summary>`

Examples:
```
feat: add MFA verification endpoint
fix: correct session expiry calculation
docs: update API contract with pagination
chore: add .env.example
```

Keep the summary under ~60 characters. Add detail in the commit body if needed, not the subject line.

## Pull Requests

- One PR per feature/fix — don't bundle unrelated changes
- PR title should match the branch's intent (e.g. "Add MFA verification endpoint")
- Fill in: what changed, why, and how you tested it (even just "ran locally with `docker-compose up`")
- **At least one other team member reviews before merging** — even a quick skim catches things
- Delete the branch after merging to keep things tidy

## Before You Push

- Run the app locally and confirm it still starts (`docker-compose up --build` for backend, `npm start` / `expo start` for mobile)
- Check you haven't committed anything in `.gitignore` (no `.env`, no `node_modules/`, no `target/`)
- If you touched an API endpoint, update `docs/api-contract.md` in the same PR — don't let the docs drift from the code

## Code Ownership (current split)

| Area | Owner(s) |
|---|---|
| `auth-core` | Person A, Person B |
| `adapter-layer` | Person C |
| `docker-compose.yml` / Docker setup | Person C |
| `mobile-app` | Person D |

If you're touching someone else's area, ping them first — not a hard rule, just avoids stepping on toes mid-build.

## Questions / Blockers

Raise it in the group chat immediately, don't sit on it — `auth-core` in particular is a dependency for both `adapter-layer` and `mobile-app`, so a silent delay there stalls everyone.