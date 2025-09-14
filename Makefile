# Simplified Makefile for Spec-Kit v1.0
# Essential project automation

.PHONY: help check setup doctor clean

# Default target
help: ## Show available commands
	@echo "Spec-Kit v1.0 - Simplified Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

check: doctor ## Run all project health checks
	@echo "✅ All checks completed"

doctor: ## Run doctor script for project validation
	@echo "🩺 Running doctor script..."
	@./doctor.sh

setup: ## Initial project setup
	@echo "🔧 Setting up project..."
	@./doctor.sh
	@echo "✅ Project setup completed"

clean: ## Clean generated files
	@echo "🧹 Cleaning generated files..."
	@rm -f doctor-report.md
	@echo "✅ Cleanup completed"

validate: ## Validate project structure
	@echo "✅ Validating project structure..."
	@./doctor.sh

version: ## Show Spec-Kit version
	@echo "Spec-Kit v1.0 - Simplified"
	@echo "Essential project structure template"
