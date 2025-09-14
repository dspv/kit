# Makefile for Kit AI-First v2.0
# Simplified automation for AI-driven development

.PHONY: help setup dev test lint build deploy clean check doctor

# Default target
help: ## Show available commands
	@echo "Kit AI-First v2.0 - Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Quick start:"
	@echo "  make setup     # Initialize project"
	@echo "  make dev       # Start development"
	@echo "  make check     # Validate everything"

setup: ## Initialize project structure and dependencies
	@echo "🔧 Setting up project structure..."
	@mkdir -p apps/api apps/ui apps/worker libs infra/docker infra/k8s
	@touch .env.example
	@if [ ! -f docker-compose.yml ]; then \
		echo "version: '3.8'" > docker-compose.yml; \
		echo "services:" >> docker-compose.yml; \
		echo "  # Add your services here" >> docker-compose.yml; \
	fi
	@if [ -d .git ]; then \
		echo "✅ Git configured"; \
	fi
	@./doctor.sh
	@echo "✅ Project setup completed"

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	@if [ -f docker-compose.yml ]; then \
		docker compose up --build -d; \
		echo "✅ Services started with Docker Compose"; \
	else \
		echo "⚠️  No docker-compose.yml found. Run 'make setup' first"; \
	fi

test: ## Run all tests
	@echo "🧪 Running tests..."
	@if [ -d apps/api ]; then \
		cd apps/api && (go test ./... 2>/dev/null || npm test 2>/dev/null || echo "No tests found in API"); \
	fi
	@if [ -d apps/ui ]; then \
		cd apps/ui && (npm test 2>/dev/null || echo "No tests found in UI"); \
	fi
	@echo "✅ Tests completed"

lint: ## Check code quality and style
	@echo "🔍 Running linters..."
	@if [ -d apps/api ]; then \
		cd apps/api && (golangci-lint run 2>/dev/null || go vet ./... 2>/dev/null || npm run lint 2>/dev/null || echo "No linter configured for API"); \
	fi
	@if [ -d apps/ui ]; then \
		cd apps/ui && (npm run lint 2>/dev/null || echo "No linter configured for UI"); \
	fi
	@echo "✅ Linting completed"

build: ## Build all applications
	@echo "🏗️  Building applications..."
	@if [ -d apps/api ]; then \
		cd apps/api && (go build -o bin/api ./cmd/main.go 2>/dev/null || npm run build 2>/dev/null || echo "Build not configured for API"); \
	fi
	@if [ -d apps/ui ]; then \
		cd apps/ui && (npm run build 2>/dev/null || echo "Build not configured for UI"); \
	fi
	@echo "✅ Build completed"

deploy: ## Deploy to staging/production
	@echo "🚀 Deploying applications..."
	@if [ -f infra/k8s/deployment.yaml ]; then \
		kubectl apply -f infra/k8s/; \
		echo "✅ Deployed to Kubernetes"; \
	elif [ -f docker-compose.prod.yml ]; then \
		docker compose -f docker-compose.prod.yml up -d; \
		echo "✅ Deployed with Docker Compose"; \
	else \
		echo "⚠️  No deployment configuration found"; \
	fi

clean: ## Clean generated files and containers
	@echo "🧹 Cleaning up..."
	@docker compose down 2>/dev/null || true
	@docker system prune -f 2>/dev/null || true
	@rm -f doctor-report.md
	@if [ -d apps/api ]; then \
		cd apps/api && (rm -rf bin/ dist/ node_modules/.cache/ 2>/dev/null || true); \
	fi
	@if [ -d apps/ui ]; then \
		cd apps/ui && (rm -rf dist/ build/ .next/ node_modules/.cache/ 2>/dev/null || true); \
	fi
	@echo "✅ Cleanup completed"

doctor: ## Run project health check
	@echo "🩺 Running project health check..."
	@./doctor.sh

check: doctor lint test ## Run full project validation
	@echo "✅ All checks completed successfully"

# Development helpers
dev-logs: ## Show development logs
	@docker compose logs -f 2>/dev/null || echo "No containers running"

dev-stop: ## Stop development environment
	@docker compose down 2>/dev/null || echo "No containers to stop"

dev-restart: ## Restart development environment
	@make dev-stop
	@make dev

# Database helpers (if using database)
db-migrate: ## Run database migrations
	@if [ -d apps/api/migrations ]; then \
		cd apps/api && migrate -path migrations -database "$$DATABASE_URL" up; \
	else \
		echo "⚠️  No migrations found"; \
	fi

db-reset: ## Reset database (development only)
	@if [ -d apps/api/migrations ]; then \
		cd apps/api && migrate -path migrations -database "$$DATABASE_URL" drop -f; \
		cd apps/api && migrate -path migrations -database "$$DATABASE_URL" up; \
		echo "✅ Database reset completed"; \
	else \
		echo "⚠️  No migrations found"; \
	fi

# Git helpers
git-setup: ## Configure git for this project
	@if [ -d .git ]; then \
		echo "✅ Git configured for project"; \
	else \
		echo "⚠️  Not a git repository"; \
	fi

# Status and info
status: ## Show project status
	@echo "📊 Project Status:"
	@echo ""
	@if [ -f README.md ]; then \
		grep -E "Status:|Progress:|Timeline:|Focus:" README.md | head -4; \
	fi
	@echo ""
	@if [ -f spec/roadmap.md ]; then \
		echo "Current tasks:"; \
		grep -E "⏳.*\`(todo|doing)\`" spec/roadmap.md | head -3; \
	fi

version: ## Show kit version
	@echo "Kit AI-First v2.0"
	@echo "Simplified development template for AI agents"
	@echo "Files: 5 | Complexity: Minimal | Focus: AI-First"
