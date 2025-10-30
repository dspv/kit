# Kit - Development Standards for AI Agents

> Keep your repos clean, consistent, and AI-ready

**Built for teams using Claude Code, Cursor, GitHub Copilot**

---

## The Problem

You're building with AI agents. But every repo is different:
- Some have Russian comments, some English
- Documentation scattered across 20+ .md files
- Old repos don't follow new standards
- Manual copy-paste between projects wastes hours

**Result**: Inconsistent quality. AI agents get confused. Code reviews focus on style, not logic.

---

## The Solution

**Kit = Your development standards as code**

One framework that enforces:
- English-only code and docs (pre-commit blocks violations)
- Structured documentation (GUIDE.md + DOCS.md, not 50 scattered files)
- Security checks (no hardcoded secrets)
- AI-optimized context (designed for Claude/Cursor workflows)

**Apply once. Works everywhere. Updates automatically.**

---

## Quick Start

### Option 1: New Project

```bash
# Use Kit as template on GitHub, then:
git clone your-new-repo
cd your-new-repo
./doctor.sh                    # Validate everything works
make setup                     # Create project structure
```

Edit `.ai/context.md` with your product details, then `make dev`.

### Option 2: Existing Project

```bash
# In your project directory:
curl -sL https://github.com/dspv/kit/archive/main.tar.gz | tar xz --strip=1 kit-main
./doctor.sh                    # Check what needs fixing
```

Kit validates your code, docs, and commits. Fix issues, then commit.

### Option 3: Auto-Sync (Coming Soon)

Add to `.github/workflows/kit-sync.yml`:
```yaml
name: Kit Sync
on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly
jobs:
  sync:
    uses: dspv/kit/.github/workflows/sync.yml@main
```

Never manually update Kit files again.

---

## What You Get

### Free (Open Source)
- **GUIDE.md** - Development principles and standards
- **DOCS.md** - Living documentation template
- **Pre-commit hooks** - Block non-English text, detect secrets
- **doctor.sh** - Validate repo health anytime
- **AI-optimized** - Context management for Claude Code/Cursor
- **.ai/ templates** - Product context, task queue formats

### Pro (Coming Q1 2026)
- **GitHub Action** - Auto-sync Kit updates across all repos
- **PR validation** - Check standards on every pull request
- **Dashboard** - See compliance across all your projects
- **Priority support** - Email response in 48 hours

**Pricing**: $9/month per repo (first 5 repos), then $29/month unlimited

[Join waitlist for 50% off first 3 months →](https://github.com/dspv/kit/discussions)

---

## How It Works

Kit enforces 4 core principles:

### 1. English Only
```bash
# Pre-commit hook blocks this:
git commit -m "добавил авторизацию"  # ❌ Cyrillic detected

# Only accepts this:
git commit -m "feat: add authentication"  # ✅ Passes
```

**Why**: AI models perform better. Global collaboration. Professional standard.

### 2. Consolidated Documentation
```
Good (Kit way):
GUIDE.md           # Principles (read once, reference always)
DOCS.md            # Implementation details (grows with project)

Bad (scattered):
auth.md, api.md, deploy.md, troubleshooting.md...
```

**Why**: Context pollution. AI wastes tokens loading 50 files. Humans can't find anything.

### 3. Security by Default
```bash
./doctor.sh
# Checks:
# - No hardcoded API keys or passwords
# - No secrets in environment files
# - No .env committed
```

**Why**: Prevention better than cure. Catches mistakes before they ship.

### 4. AI-Optimized Tasks
```markdown
Bad (step-by-step):
- [ ] Create auth endpoint
- [ ] Hash password with bcrypt
- [ ] Return JWT token

Good (outcome-focused):
Goal: Users can register and login securely
Success Metrics:
- Auth response time < 200ms
- Password hashing uses bcrypt cost >= 12
- Rate limiting blocks brute force
Freedom: Choose JWT vs session, token expiration policy
```

**Why**: Gives AI autonomy while ensuring quality. Based on Anthropic research.

---

## Use Cases

**Indie Hacker with 5 Side Projects**
Problem: Each repo has different standards. Some have Russian comments.
Solution: Apply Kit to all 5. Run `./doctor.sh` to catch issues.
Result: Consistent quality. Updates sync automatically with GitHub Action.

**Agency Building Client Projects**
Problem: 20+ repos. Junior devs don't follow standards.
Solution: Kit Team tier with custom company rules.
Result: All deliverables meet agency standards. Clients get professional code.

**Startup Growing 3 → 30 Engineers**
Problem: Early repos are messy. New hires ask "where are the guidelines?"
Solution: Kit enforces standards from day 1. GUIDE.md is single source of truth.
Result: Faster onboarding. Code reviews focus on logic, not style.

---

## What's Inside

```
kit/
├── README.md          # This file
├── GUIDE.md           # Development principles (English-only, context management, etc)
├── DOCS.md            # Documentation template (grows with your project)
├── Makefile           # Automation (make dev, make build, make deploy)
├── doctor.sh          # Validation script (run anytime)
├── .ai/
│   ├── context.md     # Product context (what, why, for whom)
│   ├── tasks.md       # Task queue for AI agents
│   └── notes/         # Temporary working notes
└── spec/              # Optional: formal specifications
```

**Your project** (after `make setup`):
```
your-project/
├── Kit files above    # Standards and validation
├── apps/
│   ├── api/           # Backend (Go by default)
│   ├── ui/            # Frontend (TypeScript + React)
│   └── worker/        # Background jobs
├── libs/              # Shared libraries
└── infra/             # Infrastructure as code
```

---

## Validation

Run health check anytime:
```bash
./doctor.sh
```

**Checks**:
- ✅ Required files present (GUIDE.md, DOCS.md, .ai/context.md)
- ✅ English-only content (blocks Cyrillic, Chinese, etc)
- ✅ No emoji in technical files
- ✅ Proper commit message format
- ✅ No hardcoded secrets (API keys, passwords)

**Pre-commit hook** prevents bad commits:
```bash
git commit -m "добавил фичу"
# ❌ Found non-English (Cyrillic) text
# Please use English only in code and documentation
```

---

## Default Tech Stack

Kit recommends (override in `.ai/context.md`):

- **Backend**: Go (fast, simple deployment, strong typing)
- **Frontend**: TypeScript + React/Next.js (type safety, SEO)
- **Database**: PostgreSQL (relational data, ACID guarantees)
- **Cache**: Redis (performance)
- **Infrastructure**: Docker + Kubernetes (production-ready)

**Not opinionated**. Use Python/Node/Rust if you prefer. Kit works with any stack.

---

## Documentation

- **[GUIDE.md](GUIDE.md)** - Read this first. Core principles and standards.
- **[DOCS.md](DOCS.md)** - Template for your project documentation.
- **[.ai/context.md](.ai/context.md)** - Product context format (fill with your details).
- **[.ai/tasks.md](.ai/tasks.md)** - Task queue format for AI agents.
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and what changed.

---

## Roadmap

**Q4 2025** (Current)
- [x] Kit v3.0 open-source release
- [x] English-only enforcement
- [x] File naming conventions
- [x] PR-based workflow

**Q1 2026**
- [ ] GitHub Action (kit-sync) - free, auto-sync updates
- [ ] Pro tier MVP ($9/mo per repo)
- [ ] Dashboard (see compliance across all repos)

**Q2 2026**
- [ ] Team tier ($29/mo unlimited repos)
- [ ] Custom company rules
- [ ] Analytics and trends

**Q3 2026**
- [ ] Enterprise tier (self-hosted, SSO, SLA)
- [ ] VS Code extension
- [ ] API for integrations

[Vote on features →](https://github.com/dspv/kit/discussions)

---

## FAQ

**Is this really free?**
Yes. AGPL-3.0 license. Use Kit for any purpose, forever.

**What do I pay for in Pro?**
Automation. Free = manual setup/updates. Pro = auto-sync, dashboard, PR checks.

**Can I customize the rules?**
Free: Fork and modify (it's open source). Team tier: Customize via config.

**Do I need Claude Code or Cursor?**
No. Kit works with any AI assistant (or none). Just optimized for AI workflows.

**Will this slow me down?**
Opposite. Faster development. No debates about "where should this doc go?" Clear standards = faster decisions.

**What if GitHub builds this?**
We're AI-specific. They're not. Plus we're faster and more opinionated.

---

## Community

- **GitHub Discussions** - [Ask questions, share projects](https://github.com/dspv/kit/discussions)
- **Issues** - [Report bugs, request features](https://github.com/dspv/kit/issues)
- **Contributing** - [See CONTRIBUTING.md](CONTRIBUTING.md)

**Show support**:
```markdown
[![Built with Kit](https://img.shields.io/badge/built%20with-Kit-blue)](https://github.com/dspv/kit)
```

---

## License

**Open Source** (AGPL-3.0)
Free to use, modify, distribute. Keep modifications open-source.

**Pro Features** (Commercial)
GitHub Action, dashboard, analytics require paid license.

---

**Kit v3.0** | Built for AI-First Development | [Star on GitHub →](https://github.com/dspv/kit)
