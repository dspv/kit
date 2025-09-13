# START.md (v2)

This document defines **development guidelines** for AI agents and human developers.  
It is the **single source of truth** until `/spec/` is created.

## Purpose
- **NEW PROJECTS ONLY:** This file activates development in empty repositories  
- **First commit:** Move this to `/spec/GUIDE.md` + create proper README  
- **For AI agents:** Follow these rules under human supervision  
- **For existing projects:** All guidelines must be in `/spec/` folder  
- **Project requirements:** Look in existing README.md or task description  

---

## Stage Model
- **Pre-Beta:**  
  - Full freedom inside the active project folder in the monorepo.  
  - You may add, edit, remove anything to make the product run.  
  - Keep history, avoid data loss.  

- **Beta → Release:**  
  - All changes go through **Pull Requests**.  
  - Local checks (lint → build → smoke) must pass before PR.  
  - One long-lived PR is allowed if commits keep flowing.  

- **Post-Release:**  
  - Rules will be defined later.  

---

## Repository State
- The repo must always reflect the **current truth** of the project.  
- It should be clear at all times:  
  - What is **in progress**.  
  - What is **ready**.  
  - What is **not started**.  
- Parallel development must not block or break others.  
- Branches and PRs should keep work isolated until stable.  

---

## Monorepo Layout
- One repo contains everything.  
- Each service/module lives in its own folder:  
  ```
  /apps/<service-name>
  /libs/<shared-code>
  /infra/<docker,k8s,terraform>
  /spec/<product, requirements, roadmap, kpi>
  ```
- Shared rules (lint, CI, tests) apply to all apps.  
- Cross-service dependencies must be explicit and documented.  

---

## Dockerization
- **Pre-Beta:** Dockerfile required, but develop with hot reload (Air, npm dev).  
- **Beta+:** Root-level **docker-compose.yml** must run everything:  
  ```
  docker compose up --build
  ```
- Keep Compose aligned with code; never commit broken configs.  
- Example environments go into `.env.example`.  
- CI must build all Docker images successfully before merging.  

---

## Mandatory Practices
- **Language:** English everywhere (code, comments, commits, docs).  
- **Dark Theme First:** All UI starts with Dark Theme by default. Light Theme optional.  
- **Commits:**  
  - Short imperative subject.  
  - Small change → 1 bullet list (≤5 bullets).  
  - Large change → up to 3 lists (≤5 bullets each).  
  - ASCII allowed (`→`, `•`, `[x]`). No filler text.  

- **Pull Requests:**  
  - Always minimal description in bullets.  
  - Small PR → 1 list (≤5 bullets).  
  - Large PR → up to 3 lists (≤5 bullets each).  
  - No empty PRs, no fluff.  

- **README.md (main tracking file):**  
  - **Header:** Project name, status emoji, progress bar, timeline, focus  
  - **Current Status:** What's working now, what's in progress  
  - **Progress Tracking:** Daily updates with ▓▓▓░░░░░░░ bars for each feature  
  - **Scope of Work:** Major milestones, blockers, research questions  
  - **Local Development:** How to run locally + docker-compose  
  - **Testing:** How to test locally + CI commands  
  - **Link to /spec/:** If exists, always reference specification folder  
  - **Daily updates:** Features completed, current blockers, next steps  
  - **GitSpecOps approach:** Repo state = project truth  

- **Tests & CI:**  
  - Local: lint + build + smoke must pass before PR.  
  - CI (Prod): lint, build, unit (if any), smoke E2E, migrations dry-run, security scan, README diff.  
  - Without green tests, no merge to `main`.  

- **Database (if exists):**  
  - Keep `schema.sql` updated.  
  - Maintain versioned migrations (`up`/`down`).  

- **Secrets:** Never commit secrets. Provide `.env.example`; use vault/SSM in real envs.  

---

## AI Agent Role
- **Human supervision:** AI works under human control/review  
- **Full autonomy** within stage rules and assigned tasks  
- **README is king:** Update progress bars, status, blockers after each increment  
- **Test everything:** API endpoints, functionality, edge cases  
- **Visible progress:** Owner must see current state through README at all times  
- Iterations must be small, frequent, and visible  
- Always prefer working product over big refactors  

---

## Code Quality
- Small, clear functions.  
- Explicit error handling; no silent fails.  
- Validate inputs, sanitize outputs.  
- Logs: structured, no secrets/PII.  
- Pin dependencies; audit weekly.  
- Risky features → behind flags.  

---

## Commit Template
```
feat: short imperative subject

- bullet about change
- bullet about impact
- bullet about tests/risks
```

---

## PR Template
```
### Summary
- bullet 1
- bullet 2
- bullet 3

### Checks
- [ ] Lint/build passed locally
- [ ] Smoke tests passed (if exist)
- [ ] README updated (Status, Progress, What changed, Roadmap, TODO)
- [ ] Migrations updated (if DB)
```

---

## Migration to `/spec`
**After first commit, move START.md → `/spec/guide.md` and create:**  
- `/spec/product.md` – problem, solution, ICP, scope  
- `/spec/requirements.md` – features, user flows  
- `/spec/roadmap.md` – development phases, progress bars  
- `/spec/backlog.md` – detailed tasks for AI agents with priorities
- `/spec/kpi.md` – manual progress % for bars (Markdown format)  
- `README.md` – project overview + "Read everything in `/spec/` first"  

**All templates available in kit root** - copy entire kit to new project  
**README monitoring requirements migrate to `/spec/guide.md`**  
**For existing projects:** All guidelines must already be in `/spec/` folder.  

---


## Technology Stack
- **Backend:** Go (Gin/Fiber + GORM)  
- **Frontend:** TypeScript + React/Next.js + Tailwind  
- **Database:** PostgreSQL + Redis (cache)  
- **Infra:** Docker + Kubernetes + Nginx  
- **Tools:** Make, Air (hot reload), Migrate  

---

## Project Structure
```
/apps/api/          # Go backend service
/apps/ui/           # TypeScript frontend
/apps/worker/       # Go background jobs
/libs/shared/       # Common code/types
/infra/docker/      # Dockerfiles + compose
/infra/k8s/         # Kubernetes manifests
/spec/              # Product requirements
```

---

## Agent Guidelines
- **Task Format:** "Build X feature with Y functionality"  
- **Always start:** Read existing code → understand structure → implement  
- **Code first:** Working prototype → tests → docs → polish  
- **Ask when unclear:** Requirements, architecture, edge cases  
- **Update progress:** Commit + README after each working increment  

---

## Code Standards
- **Go:** Standard lib + minimal deps, explicit errors, structured logs  
- **TypeScript:** Strict mode, explicit types, functional components  
- **API:** RESTful + JSON, `/api/v1/` prefix, standard HTTP codes  
- **Database:** Migrations in `/db/migrations/`, no raw SQL in business logic  
- **Naming:** `camelCase` (TS), `snake_case` (Go), `kebab-case` (URLs)  

---

## Golden Rule
Keep it **simple, working, and visible**.  
Repo must always show **true current state**.  
