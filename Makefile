# Timonacore Development Commands

.PHONY: help install dev build clean docker-up docker-down test lint env-check

# Default target
help:
	@echo "Timonacore Development Commands"
	@echo "============================="
	@echo "install           - Install all dependencies with Bun"
	@echo "dev               - Start development servers"
	@echo "build             - Build frontend and backend"
	@echo "test              - Run all tests"
	@echo "lint              - Run linting for all projects"
	@echo "clean             - Clean all node_modules and build files"
	@echo "env-check         - Validate environment variables"
	@echo "docker-validate   - Validate Docker environment"
	@echo "docker-up         - Start all services with Docker Compose"
	@echo "docker-down       - Stop all Docker services"
	@echo "docker-dev        - Start Docker services in development mode"
	@echo "docker-prod       - Start Docker services in production mode"
	@echo "docker-logs       - Show Docker services logs"
	@echo "docker-clean      - Clean Docker containers and volumes"
	@echo "db-migrate        - Run database migrations"
	@echo "db-seed           - Seed database with sample data"
	@echo "db-studio         - Open Prisma Studio"

# Installation
install:
	@echo "Installing dependencies with Bun..."
	bun install
	cd backend && bun install
	cd frontend && bun install

# Environment Validation
env-check:
	@echo "Checking environment variables..."
	cd backend && bun run check-env

# Docker Environment Validation
docker-validate:
	@echo "Validating Docker environment..."
	./scripts/validate-docker-env.sh

# Development
dev:
	@echo "Starting development servers..."
	bun run dev

# Build
build:
	@echo "Building all projects..."
	bun run build

# Testing
test:
	@echo "Running all tests..."
	bun run test

# Linting
lint:
	@echo "Running linting..."
	bun run lint

# Cleanup
clean:
	@echo "Cleaning up..."
	bun run clean

# Docker commands
docker-up: docker-validate
	@echo "Starting services with Docker Compose..."
	docker-compose up -d

docker-dev: docker-validate
	@echo "Starting services in development mode..."
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

docker-prod: docker-validate
	@echo "Starting services in production mode..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-logs:
	@echo "Showing Docker logs..."
	docker-compose logs -f

docker-clean:
	@echo "Cleaning Docker containers and volumes..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	@echo "Stopping Docker services..."
	docker-compose down

# Database commands
db-migrate:
	@echo "Running database migrations..."
	cd backend && bunx prisma migrate dev

db-seed:
	@echo "Seeding database..."
	cd backend && bunx prisma db seed

db-studio:
	@echo "Opening Prisma Studio..."
	cd backend && bunx prisma studio
