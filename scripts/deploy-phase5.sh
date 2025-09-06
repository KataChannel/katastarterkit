#!/bin/bash

# Script to start the complete KataCore stack with monitoring
# Phase 5: Docker Containerization Script

set -e

echo "🐳 KataCore Phase 5: Docker Containerization"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
check_docker() {
    print_step "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is running"
}

# Check if docker-compose is available
check_compose() {
    print_step "Checking Docker Compose..."
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
    
    print_success "Docker Compose found: $COMPOSE_CMD"
}

# Generate environment file if it doesn't exist
generate_env() {
    print_step "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning "No .env file found. Creating default environment file..."
        cat > .env << EOF
# KataCore Environment Configuration
NODE_ENV=development

# Database Configuration
POSTGRES_DB=katacore
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=15432
DATABASE_URL=postgresql://postgres:postgres@localhost:15432/katacore

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=16379
REDIS_PASSWORD=

# MinIO Configuration
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_PORT=19000
MINIO_CONSOLE_PORT=19001
MINIO_USE_SSL=true
MINIO_BUCKET_NAME=uploads

# Backend Configuration
BACKEND_PORT=14000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:13000

# Frontend Configuration
FRONTEND_PORT=13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:14000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:13000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
NEXTAUTH_URL=http://localhost:13000

# AI Configuration
GROK_API_KEY=your-grok-api-key

# Monitoring Configuration
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
EOF
        print_success "Default .env file created"
    else
        print_success "Environment file found"
    fi
}

# Generate MinIO certificates
generate_certs() {
    print_step "Generating MinIO HTTPS certificates..."
    
    if [ ! -f "./docker/minio/certs/private.key" ]; then
        if [ -f "./scripts/generate-minio-certs.sh" ]; then
            chmod +x ./scripts/generate-minio-certs.sh
            ./scripts/generate-minio-certs.sh
            print_success "MinIO certificates generated"
        else
            print_warning "Certificate generation script not found. MinIO will run without HTTPS."
        fi
    else
        print_success "MinIO certificates already exist"
    fi
}

# Create Docker network
create_network() {
    print_step "Creating Docker network..."
    
    if ! docker network ls | grep -q "katacore-network"; then
        docker network create katacore-network
        print_success "Docker network created"
    else
        print_success "Docker network already exists"
    fi
}

# Start core services
start_core() {
    print_step "Starting core services (PostgreSQL, Redis, MinIO)..."
    
    $COMPOSE_CMD up -d postgres redis minio
    
    # Wait for services to be healthy
    print_step "Waiting for services to be healthy..."
    sleep 10
    
    # Check service health
    for service in postgres redis minio; do
        if docker ps --filter "name=$service" --filter "health=healthy" | grep -q $service; then
            print_success "$service is healthy"
        else
            print_warning "$service is starting... (this may take a moment)"
        fi
    done
}

# Start application services
start_apps() {
    print_step "Building and starting application services..."
    
    $COMPOSE_CMD build backend frontend
    $COMPOSE_CMD up -d backend frontend
    
    # Wait for apps to start
    print_step "Waiting for applications to start..."
    sleep 15
    
    # Check if services are running
    if curl -f http://localhost:14000/health &> /dev/null; then
        print_success "Backend is running and healthy"
    else
        print_warning "Backend is still starting..."
    fi
    
    if curl -f http://localhost:13000 &> /dev/null; then
        print_success "Frontend is running"
    else
        print_warning "Frontend is still starting..."
    fi
}

# Start monitoring services
start_monitoring() {
    print_step "Starting monitoring services..."
    
    if [ -f "docker-compose.monitoring.yml" ]; then
        $COMPOSE_CMD -f docker-compose.yml -f docker-compose.monitoring.yml up -d \
            prometheus grafana node-exporter redis-exporter postgres-exporter
        
        print_success "Monitoring services started"
        print_step "Grafana is available at: http://localhost:3001 (admin/admin)"
        print_step "Prometheus is available at: http://localhost:9090"
    else
        print_warning "Monitoring configuration not found. Skipping monitoring services."
    fi
}

# Show status and URLs
show_status() {
    echo ""
    echo "🚀 KataCore Services Status"
    echo "=========================="
    
    # Check service status
    services=("postgres" "redis" "minio" "backend" "frontend")
    for service in "${services[@]}"; do
        if docker ps --filter "name=$service" --format "table {{.Names}}\t{{.Status}}" | grep -q $service; then
            status=$(docker ps --filter "name=$service" --format "{{.Status}}")
            print_success "$service: $status"
        else
            print_error "$service: Not running"
        fi
    done
    
    echo ""
    echo "🌐 Service URLs"
    echo "==============="
    echo "Frontend:    http://localhost:13000"
    echo "Backend:     http://localhost:14000"
    echo "GraphQL:     http://localhost:14000/graphql"
    echo "Health:      http://localhost:14000/health"
    echo "MinIO:       https://localhost:19000 (admin interface)"
    echo "PostgreSQL:  localhost:15432"
    echo "Redis:       localhost:16379"
    
    if docker ps --filter "name=grafana" | grep -q grafana; then
        echo ""
        echo "📊 Monitoring URLs"
        echo "=================="
        echo "Grafana:     http://localhost:3001 (admin/admin)"
        echo "Prometheus:  http://localhost:9090"
    fi
    
    echo ""
    print_success "KataCore Phase 5 deployment complete!"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Visit http://localhost:13000 to access the application"
    echo "   2. Check http://localhost:14000/health for backend health"
    echo "   3. Monitor services at http://localhost:3001 (Grafana)"
    echo "   4. View logs with: $COMPOSE_CMD logs -f [service]"
    echo "   5. Stop services with: $COMPOSE_CMD down"
}

# Main execution
main() {
    echo "Starting KataCore Phase 5 deployment..."
    
    check_docker
    check_compose
    generate_env
    generate_certs
    create_network
    start_core
    start_apps
    start_monitoring
    show_status
}

# Handle cleanup on exit
cleanup() {
    echo ""
    print_warning "Deployment interrupted. Cleaning up..."
    $COMPOSE_CMD down
    exit 1
}

trap cleanup INT TERM

# Run main function
main
