# Makefile for Spec-Kit v1.0
# Language-agnostic project automation

.PHONY: help check setup doctor pre-commit clean install

# Default target
help: ## Show this help message
	@echo "Spec-Kit v1.0 - Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make check     # Run all project checks"
	@echo "  make setup     # Initial project setup"
	@echo "  make doctor    # Run doctor script"

check: doctor ## Run all project health checks
	@echo "✅ All checks completed"

doctor: ## Run doctor script for project validation
	@echo "🩺 Running doctor script..."
	@./doctor.sh

setup: ## Initial project setup (git hooks, templates)
	@echo "🔧 Setting up project..."
	@./doctor.sh
	@if [ -d .git ]; then \
		git config commit.template .gitmessage; \
		echo "✅ Git commit template configured"; \
	fi
	@echo "✅ Project setup completed"

pre-commit: ## Run pre-commit checks (non-blocking)
	@echo "🔍 Running pre-commit checks..."
	@./doctor.sh --pre-commit

clean: ## Clean generated files
	@echo "🧹 Cleaning generated files..."
	@rm -f doctor-report.md
	@echo "✅ Cleanup completed"

install: setup ## Install and configure everything
	@echo "📦 Installing Spec-Kit..."
	@make setup
	@echo ""
	@echo "🎉 Spec-Kit v1.0 installed successfully!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Customize spec/ files for your project"
	@echo "2. Replace README.md with your project description"
	@echo "3. Run 'make check' to validate setup"

# Development helpers
dev-check: ## Quick development checks
	@echo "🚀 Development checks..."
	@./doctor.sh --pre-commit

validate: ## Validate project structure
	@echo "✅ Validating project structure..."
	@./doctor.sh

# Version info
version: ## Show Spec-Kit version
	@echo "Spec-Kit v1.0"
	@echo "Language-agnostic project structure and automation"

# File operations
update-briefs: ## Update brief summaries
	@echo "📝 Updating briefs..."
	@./doctor.sh
	@echo "✅ Briefs updated"

# Git operations (if in git repo)
git-setup: ## Configure git for this project
	@if [ -d .git ]; then \
		git config commit.template .gitmessage; \
		echo "✅ Git configured for Spec-Kit"; \
	else \
		echo "⚠️  Not a git repository"; \
	fi
