# DevKit - Development Standards for AI Agents

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

**DevKit = Your development standards as code**

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
# Use DevKit as template on GitHub, then:
git clone your-new-repo
cd your-new-repo
./doctor.sh                    # Validate everything works
make setup                     # Create project structure
```

Edit `.ai/context.md` with your product details, then `make dev`.

### Option 2: Existing Project

```bash
# In your project directory:
curl -sL https://github.com/dspv/devkit/archive/main.tar.gz | tar xz --strip=1
./doctor.sh                    # Check what needs fixing
```

DevKit validates your code, docs, and commits. Fix issues, then commit.

### Option 3: Auto-Sync (Coming Soon)

Add to `.github/workflows/devkit-sync.yml`:
```yaml
name: DevKit Sync
on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly
jobs:
  sync:
    uses: dspv/devkit/.github/workflows/sync.yml@main
```

Never manually update DevKit files again.

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

DevKit enforces 4 core principles:

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
Good (DevKit way):
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

## Who Uses DevKit

### Solo Developers & Indie Hackers

**The Challenge**
Managing multiple side projects becomes chaotic. Each repo evolves differently - one uses tabs, another spaces. Documentation lives in different places. Six months later, you can't remember which project follows which conventions.

**With DevKit**
- Apply same standards to all projects in 5 minutes
- One `./doctor.sh` command validates everything
- Updates propagate automatically when you improve the framework
- Switch between projects without mental context switch

**Result**: Ship faster. Spend time building features, not remembering conventions.

---

### Development Agencies

**The Challenge**
Delivering 20+ client projects per year. Junior developers join the team. Each client repo needs to meet quality standards. Code reviews become bottlenecks - "use English comments", "no hardcoded secrets", "where's the documentation?"

**With DevKit**
- Custom company rules enforced across all client projects
- Pre-commit hooks block common mistakes before they reach review
- New developers onboard faster - standards are automated, not memorized
- Client deliverables consistently professional

**Result**: Double team capacity. Code reviews focus on architecture, not formatting. Clients receive production-ready code.

---

### Growing Startups

**The Challenge**
Started with 3 engineers, now hiring #30. Early repos are "move fast" quality. New hires ask: "Where are the coding guidelines?" "How should I structure this?" "Which naming convention do we use?" Documentation is scattered across Notion, Slack, and tribal knowledge.

**With DevKit**
- GUIDE.md becomes single source of truth for engineering standards
- All repos follow same structure - frontend, backend, infra
- AI agents (Claude Code, Cursor) get consistent context across codebase
- Standards enforced automatically, not through Slack messages

**Result**: Engineering culture scales. New engineers productive on day 1. Codebase stays clean as team grows.

---

## What's Inside

```
devkit/
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
├── DevKit files above # Standards and validation
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

DevKit recommends (override in `.ai/context.md`):

- **Backend**: Go (fast, simple deployment, strong typing)
- **Frontend**: TypeScript + React/Next.js (type safety, SEO)
- **Database**: PostgreSQL (relational data, ACID guarantees)
- **Cache**: Redis (performance)
- **Infrastructure**: Docker + Kubernetes (production-ready)

**Not opinionated**. Use Python/Node/Rust if you prefer. DevKit works with any stack.

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
- [x] DevKit v3.0 open-source release
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
Yes. AGPL-3.0 license. Use DevKit for any purpose, forever.

**What do I pay for in Pro?**
Automation. Free = manual setup/updates. Pro = auto-sync, dashboard, PR checks.

**Can I customize the rules?**
Free: Fork and modify (it's open source). Team tier: Customize via config.

**Do I need Claude Code or Cursor?**
No. DevKit works with any AI assistant (or none). Just optimized for AI workflows.

**Will this slow me down?**
Opposite. Faster development. No debates about "where should this doc go?" Clear standards = faster decisions.

**What if GitHub builds this?**
We're AI-specific. They're not. Plus we're faster and more opinionated.

---

## Built On

DevKit synthesizes best practices from leading AI development research and proven open-source patterns.

### Research & Methodology

**[Anthropic Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)** (2025)
- Token budget optimization (cached vs uncached = 10x cost difference)
- Progressive exploration (Just-In-Time context loading)
- Minimal tool sets (avoid ambiguous function names)
- Auto-compact strategy at 95% context window

**[Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)**
- Repository-specific rules (.claude.md pattern)
- File system as external memory
- Strong type signatures for AI comprehension
- Tests as living documentation

**[AGENTS.md Standard](https://www.infoq.com/news/2025/08/agents-md/)**
- AI-specific documentation format
- 20,000+ repositories adoption
- Predictable structure for agent instructions

### Core Principles

**English-Only Enforcement**
- AI models perform 20-30% better with consistent language
- Global collaboration standard
- Pre-commit hooks block violations

**Consolidated Documentation**
- One DOCS.md instead of scattered .md files
- Reduces context pollution
- Prevents "where did I document X?" confusion

**Heuristics Over Algorithms**
- Give AI reasoning framework, not step-by-step instructions
- Based on Anthropic prompt engineering research
- Allows AI autonomy while ensuring quality

**Security by Default**
- Pre-commit validation catches secrets before they ship
- English-only makes audits easier
- Prevention better than remediation

### Inspired By

**[Dependabot](https://github.com/dependabot)** - Auto-sync dependency updates
**[Renovate](https://github.com/renovatebot/renovate)** - Flexible bot-driven updates
**[GitHub Code Security](https://github.com/features/security)** - Built into workflow

---

## Community

- **GitHub Discussions** - [Ask questions, share projects](https://github.com/dspv/kit/discussions)
- **Issues** - [Report bugs, request features](https://github.com/dspv/kit/issues)
- **Contributing** - [See CONTRIBUTING.md](CONTRIBUTING.md)

**Show support**:
```markdown
[![Built with DevKit](https://img.shields.io/badge/built%20with-DevKit-blue)](https://github.com/dspv/devkit)
```

---

## License

**Open Source** (AGPL-3.0)
Free to use, modify, distribute. Keep modifications open-source.

**Pro Features** (Commercial)
GitHub Action, dashboard, analytics require paid license.

---

**DevKit v3.0** | Built for AI-First Development | [Star on GitHub →](https://github.com/dspv/devkit)
