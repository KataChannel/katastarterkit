# Makefile for KataCore Development and Deployment

# Default shell
SHELL := /bin/bash

# Project information
PROJECT_NAME := katacore
COMPOSE_FILE := docker-compose.yml
BACKEND_DIR := backend
FRONTEND_DIR := frontend
K8S_DIR := k8s

# Color codes for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)KataCore Development Commands$(NC)"
	@echo "=============================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation targets
.PHONY: install
install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@if command -v bun >/dev/null 2>&1; then \
		echo "Installing root dependencies..."; \
		bun install; \
		echo "Installing backend dependencies..."; \
		cd $(BACKEND_DIR) && bun install; \
		echo "Installing frontend dependencies..."; \
		cd $(FRONTEND_DIR) && bun install; \
	else \
		echo "$(RED)Error: Bun.js is not installed. Please install it first: https://bun.sh$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ All dependencies installed successfully!$(NC)"

.PHONY: install-backend
install-backend: ## Install backend dependencies only
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	@cd $(BACKEND_DIR) && bun install

.PHONY: install-frontend
install-frontend: ## Install frontend dependencies only
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	@cd $(FRONTEND_DIR) && bun install

# Development targets
.PHONY: dev
dev: ## Start development servers (frontend and backend)
	@echo "$(GREEN)Starting development environment...$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend GraphQL: http://localhost:4000/graphql"
	@echo "Database Admin: http://localhost:5555"
	@echo "Press Ctrl+C to stop all services"
	@bun run dev

.PHONY: dev-backend
dev-backend: ## Start backend development server only
	@echo "$(GREEN)Starting backend development server...$(NC)"
	@cd $(BACKEND_DIR) && bun run dev

.PHONY: dev-frontend
dev-frontend: ## Start frontend development server only
	@echo "$(GREEN)Starting frontend development server...$(NC)"
	@cd $(FRONTEND_DIR) && bun run dev

# Database targets
.PHONY: db-setup
db-setup: ## Setup database (migrate and seed)
	@echo "$(GREEN)Setting up database...$(NC)"
	@cd $(BACKEND_DIR) && bun run prisma:generate
	@cd $(BACKEND_DIR) && bun run prisma:migrate
	@cd $(BACKEND_DIR) && bun run prisma:seed
	@echo "$(GREEN)✅ Database setup completed!$(NC)"

.PHONY: db-migrate
db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	@cd $(BACKEND_DIR) && bun run prisma:migrate

.PHONY: db-seed
db-seed: ## Seed database with initial data
	@echo "$(GREEN)Seeding database...$(NC)"
	@cd $(BACKEND_DIR) && bun run prisma:seed

.PHONY: db-reset
db-reset: ## Reset database (dangerous!)
	@echo "$(RED)⚠️  This will reset the database and delete all data!$(NC)"
	@read -p "Are you sure? (y/N): " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo ""; \
		echo "$(YELLOW)Resetting database...$(NC)"; \
		cd $(BACKEND_DIR) && bun run prisma:reset; \
		echo "$(GREEN)✅ Database reset completed!$(NC)"; \
	else \
		echo ""; \
		echo "$(YELLOW)Database reset cancelled.$(NC)"; \
	fi

.PHONY: db-studio
db-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	@cd $(BACKEND_DIR) && bun run prisma:studio

.PHONY: db-generate
db-generate: ## Generate Prisma client
	@echo "$(GREEN)Generating Prisma client...$(NC)"
	@cd $(BACKEND_DIR) && bun run prisma:generate

# Testing targets
.PHONY: test
test: ## Run all tests
	@echo "$(GREEN)Running all tests...$(NC)"
	@echo "Running backend tests..."
	@cd $(BACKEND_DIR) && bun run test
	@echo "Running frontend tests..."
	@cd $(FRONTEND_DIR) && bun run test

.PHONY: test-backend
test-backend: ## Run backend tests only
	@echo "$(GREEN)Running backend tests...$(NC)"
	@cd $(BACKEND_DIR) && bun run test

.PHONY: test-frontend
test-frontend: ## Run frontend tests only
	@echo "$(GREEN)Running frontend tests...$(NC)"
	@cd $(FRONTEND_DIR) && bun run test

.PHONY: test-e2e
test-e2e: ## Run end-to-end tests
	@echo "$(GREEN)Running end-to-end tests...$(NC)"
	@cd $(BACKEND_DIR) && bun run test:e2e

.PHONY: test-coverage
test-coverage: ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	@cd $(BACKEND_DIR) && bun run test:cov
	@cd $(FRONTEND_DIR) && bun run test:coverage

# Build targets
.PHONY: build
build: ## Build both frontend and backend for production
	@echo "$(GREEN)Building for production...$(NC)"
	@echo "Building backend..."
	@cd $(BACKEND_DIR) && bun run build
	@echo "Building frontend..."
	@cd $(FRONTEND_DIR) && bun run build
	@echo "$(GREEN)✅ Build completed successfully!$(NC)"

.PHONY: build-backend
build-backend: ## Build backend for production
	@echo "$(GREEN)Building backend...$(NC)"
	@cd $(BACKEND_DIR) && bun run build

.PHONY: build-frontend
build-frontend: ## Build frontend for production
	@echo "$(GREEN)Building frontend...$(NC)"
	@cd $(FRONTEND_DIR) && bun run build

# Linting and formatting targets
.PHONY: lint
lint: ## Run linting for all code
	@echo "$(GREEN)Running linters...$(NC)"
	@cd $(BACKEND_DIR) && bun run lint
	@cd $(FRONTEND_DIR) && bun run lint

.PHONY: lint-fix
lint-fix: ## Fix linting issues automatically
	@echo "$(GREEN)Fixing linting issues...$(NC)"
	@cd $(BACKEND_DIR) && bun run lint:fix
	@cd $(FRONTEND_DIR) && bun run lint:fix

.PHONY: format
format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code...$(NC)"
	@cd $(BACKEND_DIR) && bun run format
	@cd $(FRONTEND_DIR) && bun run format

.PHONY: type-check
type-check: ## Run TypeScript type checking
	@echo "$(GREEN)Running type checks...$(NC)"
	@cd $(BACKEND_DIR) && bun run type-check
	@cd $(FRONTEND_DIR) && bun run type-check

# Docker targets
.PHONY: docker-up
docker-up: ## Start Docker services
	@echo "$(GREEN)Starting Docker services...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✅ Docker services started!$(NC)"
	@echo "Services available:"
	@echo "  - PostgreSQL: localhost:5432"
	@echo "  - Redis: localhost:6379"
	@echo "  - MinIO: localhost:9000"

.PHONY: docker-down
docker-down: ## Stop Docker services
	@echo "$(GREEN)Stopping Docker services...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) down

.PHONY: docker-logs
docker-logs: ## View Docker service logs
	@docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: docker-clean
docker-clean: ## Clean up Docker resources
	@echo "$(YELLOW)Cleaning up Docker resources...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
	@docker system prune -f

.PHONY: docker-build
docker-build: ## Build Docker images for production
	@echo "$(GREEN)Building Docker images...$(NC)"
	@docker build -t katacore/backend:latest $(BACKEND_DIR)
	@docker build -t katacore/frontend:latest $(FRONTEND_DIR)

# Kubernetes deployment targets
.PHONY: k8s-deploy
k8s-deploy: ## Deploy to Kubernetes
	@echo "$(GREEN)Deploying to Kubernetes...$(NC)"
	@chmod +x $(K8S_DIR)/scripts/deploy.sh
	@$(K8S_DIR)/scripts/deploy.sh

.PHONY: k8s-status
k8s-status: ## Check Kubernetes deployment status
	@echo "$(GREEN)Checking Kubernetes status...$(NC)"
	@kubectl get all -n katacore

.PHONY: k8s-logs
k8s-logs: ## View Kubernetes pod logs
	@echo "$(GREEN)Viewing pod logs...$(NC)"
	@kubectl logs -f deployment/backend -n katacore

.PHONY: k8s-clean
k8s-clean: ## Clean up Kubernetes resources
	@echo "$(YELLOW)Cleaning up Kubernetes resources...$(NC)"
	@kubectl delete namespace katacore || true
	@kubectl delete namespace katacore-monitoring || true

# Deployment targets
.PHONY: deploy-staging
deploy-staging: ## Deploy to staging environment
	@echo "$(GREEN)Deploying to staging...$(NC)"
	@echo "$(YELLOW)Note: This requires staging Kubernetes configuration$(NC)"
	@kubectl apply -f $(K8S_DIR)/ --namespace=katacore-staging

.PHONY: deploy-production
deploy-production: ## Deploy to production environment
	@echo "$(RED)⚠️  Deploying to PRODUCTION environment!$(NC)"
	@read -p "Are you sure? (y/N): " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo ""; \
		echo "$(GREEN)Deploying to production...$(NC)"; \
		kubectl apply -f $(K8S_DIR)/ --namespace=katacore; \
		echo "$(GREEN)✅ Production deployment completed!$(NC)"; \
	else \
		echo ""; \
		echo "$(YELLOW)Production deployment cancelled.$(NC)"; \
	fi

.PHONY: verify-production
verify-production: ## Verify production deployment
	@echo "$(GREEN)Verifying production deployment...$(NC)"
	@kubectl wait --for=condition=available deployment/backend --namespace=katacore --timeout=300s
	@kubectl wait --for=condition=available deployment/frontend --namespace=katacore --timeout=300s
	@echo "$(GREEN)✅ Production deployment verified!$(NC)"

# Monitoring targets
.PHONY: logs
logs: ## View application logs
	@echo "$(GREEN)Viewing application logs...$(NC)"
	@if command -v kubectl >/dev/null 2>&1; then \
		kubectl logs -f deployment/backend -n katacore; \
	else \
		docker-compose logs -f; \
	fi

.PHONY: monitor
monitor: ## Open monitoring dashboard
	@echo "$(GREEN)Opening monitoring dashboard...$(NC)"
	@if command -v kubectl >/dev/null 2>&1; then \
		echo "Grafana should be available at: http://your-domain/grafana"; \
		kubectl port-forward svc/grafana 3001:3000 -n katacore-monitoring; \
	else \
		echo "Starting local monitoring..."; \
		echo "Grafana will be available at: http://localhost:3001"; \
	fi

# Cleanup targets
.PHONY: clean
clean: ## Clean up build artifacts and dependencies
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@rm -rf $(BACKEND_DIR)/dist
	@rm -rf $(FRONTEND_DIR)/.next
	@rm -rf $(BACKEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/node_modules
	@rm -rf node_modules
	@echo "$(GREEN)✅ Cleanup completed!$(NC)"

.PHONY: clean-all
clean-all: clean docker-clean ## Clean everything (build artifacts, dependencies, Docker)
	@echo "$(GREEN)✅ Full cleanup completed!$(NC)"

# Health check targets
.PHONY: health
health: ## Check health of all services
	@echo "$(GREEN)Checking service health...$(NC)"
	@if command -v kubectl >/dev/null 2>&1; then \
		echo "Checking Kubernetes services..."; \
		kubectl get pods -n katacore; \
		kubectl exec -n katacore deployment/backend -- curl -f http://localhost:4000/health || echo "Backend health check failed"; \
		kubectl exec -n katacore deployment/frontend -- curl -f http://localhost:3000 || echo "Frontend health check failed"; \
	else \
		echo "Checking local services..."; \
		curl -f http://localhost:4000/health || echo "Backend not running"; \
		curl -f http://localhost:3000 || echo "Frontend not running"; \
	fi

# Backup targets
.PHONY: backup-db
backup-db: ## Backup database
	@echo "$(GREEN)Creating database backup...$(NC)"
	@BACKUP_NAME="backup-$(shell date +%Y%m%d-%H%M%S)"; \
	if command -v kubectl >/dev/null 2>&1; then \
		kubectl exec -n katacore deployment/postgres -- pg_dump -U timonacore timonacore_prod > "$$BACKUP_NAME.sql"; \
	else \
		docker-compose exec postgres pg_dump -U postgres timonacore > "$$BACKUP_NAME.sql"; \
	fi; \
	echo "$(GREEN)✅ Database backup created: $$BACKUP_NAME.sql$(NC)"

# Update targets
.PHONY: update-deps
update-deps: ## Update all dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	@cd $(BACKEND_DIR) && bun update
	@cd $(FRONTEND_DIR) && bun update
	@bun update
	@echo "$(GREEN)✅ Dependencies updated!$(NC)"

# Security targets
.PHONY: security-audit
security-audit: ## Run security audit
	@echo "$(GREEN)Running security audit...$(NC)"
	@cd $(BACKEND_DIR) && bun audit || echo "Backend audit completed with issues"
	@cd $(FRONTEND_DIR) && bun audit || echo "Frontend audit completed with issues"

# Information targets
.PHONY: info
info: ## Show project information
	@echo "$(GREEN)KataCore Project Information$(NC)"
	@echo "============================"
	@echo "Project: $(PROJECT_NAME)"
	@echo "Backend: NestJS + GraphQL + Prisma"
	@echo "Frontend: Next.js + TailwindCSS"
	@echo "Runtime: Bun.js"
	@echo "Database: PostgreSQL"
	@echo "Cache: Redis"
	@echo "Deployment: Kubernetes"
	@echo ""
	@echo "Useful URLs:"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Backend API:  http://localhost:4000/graphql"
	@echo "  DB Admin:     http://localhost:5555"
	@echo "  Redis:        localhost:6379"
	@echo "  PostgreSQL:   localhost:5432"
	@echo ""
	@echo "Run 'make help' for available commands"
