# Makefile for tazagroupcore Development and Deployment

# Default shell
SHELL := /bin/bash

# Project information
PROJECT_NAME := tazagroupcore
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
	@echo "$(GREEN)tazagroupcore Development Commands$(NC)"
	@echo "=============================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation targets
.PHONY: install
install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@if command -v bun >/dev/null 2>&1; then \
		echo "Installing root dependencies..." && \
		bun install && \
		echo "Installing backend dependencies..." && \
		(cd $(BACKEND_DIR) && bun install) && \
		echo "Installing frontend dependencies..." && \
		(cd $(FRONTEND_DIR) && bun install); \
	else \
		echo "$(RED)Error: Bun.js is not installed. Please install it first: https://bun.sh$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ All dependencies installed successfully!$(NC)"

# Development targets
.PHONY: dev
dev: ## Start development servers (backend + frontend)
	@echo "$(GREEN)Starting development servers...$(NC)"
	@bun run dev

.PHONY: dev-backend
dev-backend: ## Start only backend development server
	@echo "$(GREEN)Starting backend development server...$(NC)"
	@bun run dev:backend

.PHONY: dev-frontend
dev-frontend: ## Start only frontend development server
	@echo "$(GREEN)Starting frontend development server...$(NC)"
	@bun run dev:frontend

# TailwindCSS targets
.PHONY: tailwind-test
tailwind-test: ## Test TailwindCSS compilation
	@echo "$(GREEN)Testing TailwindCSS compilation...$(NC)"
	@cd $(FRONTEND_DIR) && bun run build && echo "$(GREEN)✅ TailwindCSS working correctly!$(NC)"

# Database targets
.PHONY: db-migrate
db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	@(cd $(BACKEND_DIR) && bun prisma migrate dev)

.PHONY: db-seed
db-seed: ## Seed database with initial data
	@echo "$(GREEN)Seeding database...$(NC)"
	@(cd $(BACKEND_DIR) && bun run prisma:seed)

.PHONY: db-seed-comprehensive
db-seed-comprehensive: ## Seed database with comprehensive demo data
	@echo "$(GREEN)Seeding comprehensive data...$(NC)"
	@(cd $(BACKEND_DIR) && bun run seed:comprehensive)

.PHONY: db-studio
db-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	@(cd $(BACKEND_DIR) && bun prisma studio)

.PHONY: db-reset
db-reset: ## Reset database (dangerous!)
	@echo "$(YELLOW)⚠️  WARNING: This will reset all database data!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(GREEN)Resetting database...$(NC)"
	@(cd $(BACKEND_DIR) && bun prisma migrate reset --force)

# Docker targets
.PHONY: docker-up
docker-up: ## Start Docker services
	@echo "$(GREEN)Starting Docker services...$(NC)"
	@docker compose up -d
	@echo "$(GREEN)✅ Docker services started!$(NC)"

.PHONY: docker-down
docker-down: ## Stop Docker services
	@echo "$(GREEN)Stopping Docker services...$(NC)"
	@docker compose down
	@echo "$(GREEN)✅ Docker services stopped!$(NC)"

.PHONY: docker-logs
docker-logs: ## Show Docker logs
	@docker compose logs -f

# Build targets
.PHONY: build
build: ## Build all projects
	@echo "$(GREEN)Building all projects...$(NC)"
	@bun run build

.PHONY: build-backend
build-backend: ## Build backend
	@echo "$(GREEN)Building backend...$(NC)"
	@bun run build:backend

.PHONY: build-frontend
build-frontend: ## Build frontend
	@echo "$(GREEN)Building frontend...$(NC)"
	@bun run build:frontend

# Test targets
.PHONY: test
test: ## Run all tests
	@echo "$(GREEN)Running all tests...$(NC)"
	@bun run test

.PHONY: test-backend
test-backend: ## Run backend tests
	@echo "$(GREEN)Running backend tests...$(NC)"
	@bun run test:backend

.PHONY: test-frontend
test-frontend: ## Run frontend tests
	@echo "$(GREEN)Running frontend tests...$(NC)"
	@bun run test:frontend

# Lint targets
.PHONY: lint
lint: ## Run linting
	@echo "$(GREEN)Running linting...$(NC)"
	@bun run lint

.PHONY: format
format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	@bun run format

# Clean targets
.PHONY: clean
clean: ## Clean all dependencies and build artifacts
	@echo "$(GREEN)Cleaning dependencies and build artifacts...$(NC)"
	@bun run clean
	@echo "$(GREEN)✅ Cleanup completed!$(NC)"

# Setup targets
.PHONY: setup
setup: install docker-up db-migrate db-seed ## Complete project setup
	@echo "$(GREEN)✅ Project setup completed successfully!$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:14000$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:13000$(NC)"
	@echo "$(YELLOW)Prisma Studio: http://localhost:5555$(NC)"
