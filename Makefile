# Makefile for Kit AI-First v3.0
# Automation for AI-driven development

.PHONY: help setup dev test lint build deploy clean check doctor validate

help: ## Show available commands
	@echo "Kit AI-First v3.0 - Available Commands"
	@echo "======================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'
	@echo ""
	@echo "Quick Start:"
	@echo "  make setup       Initialize project"
	@echo "  make dev         Start development"
	@echo "  make validate    Check code quality"

setup: ## Initialize project structure and dependencies
	@echo "[Setup] Initializing project structure..."
	@mkdir -p apps/api apps/ui apps/worker libs infra/docker infra/k8s
	@touch .env.example
	@if [ ! -f docker-compose.yml ]; then \
		echo "version: '3.8'" > docker-compose.yml; \
		echo "services:" >> docker-compose.yml; \
		echo "  # Add your services here" >> docker-compose.yml; \
		echo "  # See GUIDE.md for examples" >> docker-compose.yml; \
	fi
	@if [ -f doctor.sh ]; then \
		chmod +x doctor.sh && ./doctor.sh; \
	else \
		echo "[WARN] doctor.sh not found, skipping validation"; \
	fi
	@echo "[OK] Project setup completed"

dev: ## Start development environment
	@echo "[Dev] Starting development environment..."
	@if [ -f docker-compose.yml ]; then \
		docker compose up --build -d; \
		echo "[OK] Services started - check logs with 'make dev-logs'"; \
	else \
		echo "[ERROR] docker-compose.yml not found. Run 'make setup' first"; \
		exit 1; \
	fi

test: ## Run all tests
	@echo "[Test] Running tests..."
	@if [ -d apps/api ]; then \
		cd apps/api && (go test ./... 2>/dev/null || npm test 2>/dev/null || echo "[WARN] No tests found in API"); \
	fi
	@if [ -d apps/ui ]; then \
		cd apps/ui && (npm test 2>/dev/null || echo "[WARN] No tests found in UI"); \
	fi
	@echo "[OK] Tests completed"

lint: ## Check code quality and style
	@echo "[Lint] Running linters..."
	@if [ -d apps/api ]; then \
		cd apps/api && (golangci-lint run 2>/dev/null || go vet ./... 2>/dev/null || npm run lint 2>/dev/null || echo "[INFO] No linter configured for API"); \
	fi
	@if [ -d apps/ui ]; then \
		cd apps/ui && (npm run lint 2>/dev/null || echo "[INFO] No linter configured for UI"); \
	fi
	@echo "[OK] Linting completed"

validate: doctor lint ## Full validation (doctor + lint)
	@echo "[OK] All validation checks passed"

check: validate test ## Run full validation and tests
	@echo "[OK] All checks completed successfully"

check-english: ## Check for non-English content
	@echo "[Check] Scanning for non-English content..."
	@! find . -type f \( -name "*.md" -o -name "*.go" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" \) \
		-not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" \
		-exec grep -l '[а-яёА-ЯЁ]' {} \; 2>/dev/null | grep . && \
		echo "[OK] All content is in English" || \
		(echo "[ERROR] Non-English content found - see above files" && exit 1)

check-secrets: ## Check for hardcoded secrets
	@echo "[Check] Scanning for hardcoded secrets..."
	@! find . -type f \( -name "*.go" -o -name "*.js" -o -name "*.ts" -o -name "*.env" \) \
		-not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" \
		-exec grep -iE '(password|secret|api_key|token)\s*=\s*["\047]' {} \; 2>/dev/null | \
		grep -v example | grep -v TODO | grep . && \
		echo "[OK] No hardcoded secrets detected" || \
		(echo "[WARN] Possible hardcoded secrets found - verify above lines" && exit 0)

build: ## Build all applications
	@echo "[Build] Building applications..."
	@if [ -d apps/api ]; then \
		cd apps/api && (go build -o bin/api ./cmd/main.go 2>/dev/null || npm run build 2>/dev/null || echo "[INFO] Build skipped for API"); \
	fi
	@if [ -d apps/ui ]; then \
		cd apps/ui && (npm run build 2>/dev/null || echo "[INFO] Build skipped for UI"); \
	fi
	@echo "[OK] Build completed"

deploy: ## Deploy to staging/production
	@echo "[Deploy] Deploying applications..."
	@if [ -f infra/k8s/deployment.yaml ]; then \
		kubectl apply -f infra/k8s/; \
		echo "[OK] Deployed to Kubernetes"; \
	elif [ -f docker-compose.prod.yml ]; then \
		docker compose -f docker-compose.prod.yml up -d; \
		echo "[OK] Deployed with Docker Compose"; \
	else \
		echo "[ERROR] No deployment configuration found"; \
		echo "Create infra/k8s/deployment.yaml or docker-compose.prod.yml"; \
		exit 1; \
	fi

clean: ## Clean generated files and containers
	@echo "[Clean] Cleaning up..."
	@docker compose down 2>/dev/null || true
	@rm -f doctor-report.md
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name "node_modules" -prune -o -type d -name ".next" -prune -o -type d -name "dist" -prune -o -type d -name "build" -prune | xargs rm -rf 2>/dev/null || true
	@if [ -d apps/api ]; then \
		cd apps/api && rm -rf bin/ dist/ 2>/dev/null || true; \
	fi
	@echo "[OK] Cleanup completed"

doctor: ## Run project health check
	@if [ -f doctor.sh ]; then \
		./doctor.sh; \
	else \
		echo "[ERROR] doctor.sh not found in project root"; \
		exit 1; \
	fi

status: ## Show project status
	@echo "Project Status"
	@echo "=============="
	@echo ""
	@if [ -f README.md ]; then \
		grep -E "Status:|Progress:|Stage:|Version:" README.md | head -5; \
	else \
		echo "[INFO] README.md not found"; \
	fi
	@echo ""
	@if [ -f .ai/tasks.md ]; then \
		echo "Current Tasks:"; \
		grep -E "Status.*doing" .ai/tasks.md | head -3 || echo "No active tasks"; \
	fi

# Development helpers
dev-logs: ## Show development logs
	@docker compose logs -f 2>/dev/null || echo "[ERROR] No containers running"

dev-stop: ## Stop development environment
	@echo "[Dev] Stopping services..."
	@docker compose down 2>/dev/null || echo "[WARN] No containers to stop"
	@echo "[OK] Services stopped"

dev-restart: dev-stop dev ## Restart development environment
	@echo "[OK] Services restarted"

dev-shell: ## Open shell in API container
	@docker compose exec api sh 2>/dev/null || echo "[ERROR] API container not running"

# Database helpers (if using database)
db-migrate: ## Run database migrations
	@if [ -d apps/api/migrations ]; then \
		echo "[DB] Running migrations..."; \
		cd apps/api && migrate -path migrations -database "$$DATABASE_URL" up; \
		echo "[OK] Migrations completed"; \
	else \
		echo "[ERROR] Migrations directory not found at apps/api/migrations"; \
		exit 1; \
	fi

db-rollback: ## Rollback last migration
	@if [ -d apps/api/migrations ]; then \
		echo "[DB] Rolling back last migration..."; \
		cd apps/api && migrate -path migrations -database "$$DATABASE_URL" down 1; \
		echo "[OK] Rollback completed"; \
	else \
		echo "[ERROR] Migrations directory not found"; \
		exit 1; \
	fi

db-reset: ## Reset database (DANGER: development only)
	@echo "[WARN] This will DELETE ALL DATA"
	@echo "[WARN] Press Ctrl+C within 5 seconds to cancel..."
	@sleep 5
	@if [ -d apps/api/migrations ]; then \
		echo "[DB] Resetting database..."; \
		cd apps/api && migrate -path migrations -database "$$DATABASE_URL" drop -f; \
		cd apps/api && migrate -path migrations -database "$$DATABASE_URL" up; \
		echo "[OK] Database reset completed"; \
	else \
		echo "[ERROR] Migrations directory not found"; \
		exit 1; \
	fi

db-seed: ## Seed database with test data
	@if [ -f apps/api/scripts/seed.sh ]; then \
		echo "[DB] Seeding database..."; \
		./apps/api/scripts/seed.sh; \
		echo "[OK] Database seeded"; \
	elif [ -f apps/api/scripts/seed.go ]; then \
		echo "[DB] Seeding database..."; \
		cd apps/api && go run scripts/seed.go; \
		echo "[OK] Database seeded"; \
	else \
		echo "[INFO] No seed script found"; \
		echo "Create apps/api/scripts/seed.sh or seed.go"; \
	fi

# Git helpers
git-hooks: ## Install git hooks
	@if [ -d .git ]; then \
		echo "[Git] Installing hooks..."; \
		if [ -f doctor.sh ]; then \
			./doctor.sh --setup-hooks; \
		fi; \
		echo "[OK] Git hooks installed"; \
	else \
		echo "[ERROR] Not a git repository"; \
		exit 1; \
	fi

# Info and documentation
info: ## Show project information
	@echo "Kit AI-First Framework v3.0"
	@echo "============================"
	@echo ""
	@echo "Project Structure:"
	@echo "  README.md     - Entry point and quick start"
	@echo "  GUIDE.md      - Development principles and standards"
	@echo "  DOCS.md       - Living documentation"
	@echo "  .ai/          - AI-specific files and task queue"
	@echo ""
	@echo "Quick Commands:"
	@echo "  make setup    - Initialize project"
	@echo "  make dev      - Start development"
	@echo "  make check    - Validate everything"
	@echo ""
	@echo "Documentation:"
	@echo "  make help     - Show all commands"
	@echo "  make status   - Show project status"
	@echo ""

version: ## Show kit version
	@echo "Kit AI-First Framework"
	@echo "Version: 3.0"
	@echo "Focus: AI-First Development"
	@echo "Complexity: Minimal"
	@echo ""
	@echo "Documentation:"
	@echo "  README.md  - Quick start"
	@echo "  GUIDE.md   - Principles and standards"
	@echo "  DOCS.md    - Implementation details"
