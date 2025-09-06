#!/bin/bash

# Production Deployment Script for KataCore
# Phase 5: Production-Ready Container Deployment

set -e

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

# Configuration
PROD_ENV_FILE=".env.production"
PROD_COMPOSE="docker-compose.prod.yml"

# Check prerequisites
check_prerequisites() {
    print_step "Checking production prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose is not available"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Please run this script from the KataCore root directory"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Generate production environment
generate_prod_env() {
    print_step "Generating production environment configuration..."
    
    if [ -f "$PROD_ENV_FILE" ]; then
        read -p "Production environment file exists. Overwrite? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Using existing production environment file"
            return
        fi
    fi
    
    cat > $PROD_ENV_FILE << 'EOF'
# KataCore Production Environment Configuration
NODE_ENV=production

# Domain Configuration
DOMAIN=your-domain.com
SUBDOMAIN_BACKEND=api
SUBDOMAIN_FRONTEND=app

# SSL Configuration
SSL_EMAIL=admin@your-domain.com
USE_SSL=true

# Database Configuration (Production)
POSTGRES_DB=katacore_prod
POSTGRES_USER=katacore
POSTGRES_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
POSTGRES_PORT=5432
DATABASE_URL=postgresql://katacore:CHANGE_THIS_STRONG_PASSWORD@postgres:5432/katacore_prod

# Redis Configuration (Production)
REDIS_HOST=redis-cluster
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_THIS_REDIS_PASSWORD

# MinIO Configuration (Production)
MINIO_ACCESS_KEY=CHANGE_THIS_MINIO_ACCESS_KEY
MINIO_SECRET_KEY=CHANGE_THIS_MINIO_SECRET_KEY_MINIMUM_32_CHARS
MINIO_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_USE_SSL=true
MINIO_BUCKET_NAME=uploads

# Backend Configuration (Production)
BACKEND_PORT=4000
JWT_SECRET=CHANGE_THIS_TO_A_VERY_STRONG_SECRET_AT_LEAST_32_CHARACTERS
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://app.your-domain.com
CORS_ORIGIN=https://app.your-domain.com

# Frontend Configuration (Production)
FRONTEND_PORT=3000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.your-domain.com/graphql
NEXT_PUBLIC_APP_URL=https://app.your-domain.com
NEXTAUTH_SECRET=CHANGE_THIS_NEXTAUTH_SECRET_MINIMUM_32_CHARACTERS
NEXTAUTH_URL=https://app.your-domain.com

# AI Configuration
GROK_API_KEY=your-production-grok-api-key

# Monitoring Configuration (Production)
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=CHANGE_THIS_GRAFANA_PASSWORD

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=CHANGE_THIS_SESSION_SECRET_MINIMUM_32_CHARACTERS

# Logging Configuration
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_MAX_FILES=10
LOG_MAX_SIZE=10m

# Performance Configuration
MAX_MEMORY_RESTART=1024M
INSTANCES=2
EXEC_MODE=cluster

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_ENCRYPTION_KEY=CHANGE_THIS_BACKUP_ENCRYPTION_KEY
EOF
    
    print_success "Production environment file created: $PROD_ENV_FILE"
    print_warning "IMPORTANT: Please update all CHANGE_THIS_* values with secure credentials!"
}

# Validate production environment
validate_prod_env() {
    print_step "Validating production environment..."
    
    if [ ! -f "$PROD_ENV_FILE" ]; then
        print_error "Production environment file not found: $PROD_ENV_FILE"
        exit 1
    fi
    
    # Check for default values that need to be changed
    default_values=(
        "CHANGE_THIS_STRONG_PASSWORD"
        "CHANGE_THIS_REDIS_PASSWORD"
        "CHANGE_THIS_MINIO_ACCESS_KEY"
        "CHANGE_THIS_MINIO_SECRET_KEY_MINIMUM_32_CHARS"
        "CHANGE_THIS_TO_A_VERY_STRONG_SECRET_AT_LEAST_32_CHARACTERS"
        "CHANGE_THIS_NEXTAUTH_SECRET_MINIMUM_32_CHARACTERS"
        "CHANGE_THIS_GRAFANA_PASSWORD"
        "CHANGE_THIS_SESSION_SECRET_MINIMUM_32_CHARACTERS"
        "CHANGE_THIS_BACKUP_ENCRYPTION_KEY"
        "your-domain.com"
        "admin@your-domain.com"
    )
    
    issues_found=0
    for value in "${default_values[@]}"; do
        if grep -q "$value" "$PROD_ENV_FILE"; then
            print_error "Default value found: $value"
            ((issues_found++))
        fi
    done
    
    if [ $issues_found -gt 0 ]; then
        print_error "Please update the default values in $PROD_ENV_FILE before deploying to production"
        exit 1
    fi
    
    print_success "Production environment validation passed"
}

# Build production images
build_prod_images() {
    print_step "Building production Docker images..."
    
    # Build backend image
    print_step "Building backend production image..."
    $COMPOSE_CMD -f docker-compose.yml --env-file $PROD_ENV_FILE build --no-cache backend
    
    # Build frontend image
    print_step "Building frontend production image..."
    $COMPOSE_CMD -f docker-compose.yml --env-file $PROD_ENV_FILE build --no-cache frontend
    
    print_success "Production images built successfully"
}

# Deploy to production
deploy_prod() {
    print_step "Deploying to production..."
    
    # Create production network
    if ! docker network ls | grep -q "katacore-prod"; then
        docker network create katacore-prod
        print_success "Production network created"
    fi
    
    # Start core services
    print_step "Starting core production services..."
    $COMPOSE_CMD -f docker-compose.yml -f $PROD_COMPOSE --env-file $PROD_ENV_FILE up -d \
        postgres redis-cluster-1 redis-cluster-2 redis-cluster-3 \
        redis-cluster-4 redis-cluster-5 redis-cluster-6 minio
    
    # Wait for core services
    print_step "Waiting for core services to be ready..."
    sleep 30
    
    # Initialize Redis cluster
    print_step "Initializing Redis cluster..."
    $COMPOSE_CMD -f docker-compose.yml -f $PROD_COMPOSE --env-file $PROD_ENV_FILE up redis-cluster-creator
    
    # Start application services
    print_step "Starting application services..."
    $COMPOSE_CMD -f docker-compose.yml -f $PROD_COMPOSE --env-file $PROD_ENV_FILE up -d \
        backend frontend
    
    # Start monitoring
    print_step "Starting monitoring services..."
    $COMPOSE_CMD -f docker-compose.yml -f docker-compose.monitoring.yml -f $PROD_COMPOSE --env-file $PROD_ENV_FILE up -d \
        prometheus grafana node-exporter redis-exporter postgres-exporter
    
    # Start reverse proxy (if configured)
    if grep -q "nginx" $PROD_COMPOSE; then
        print_step "Starting reverse proxy..."
        $COMPOSE_CMD -f docker-compose.yml -f $PROD_COMPOSE --env-file $PROD_ENV_FILE up -d nginx
    fi
    
    print_success "Production deployment completed"
}

# Health check
health_check() {
    print_step "Performing production health check..."
    
    # Check backend health
    backend_url="http://localhost:4000/health"
    if curl -f "$backend_url" &> /dev/null; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
    fi
    
    # Check frontend
    frontend_url="http://localhost:3000"
    if curl -f "$frontend_url" &> /dev/null; then
        print_success "Frontend is accessible"
    else
        print_error "Frontend health check failed"
    fi
    
    # Check database
    if docker exec postgres pg_isready -U katacore &> /dev/null; then
        print_success "Database is ready"
    else
        print_error "Database health check failed"
    fi
    
    # Check Redis cluster
    if docker exec redis-cluster-1 redis-cli cluster info | grep -q "cluster_state:ok"; then
        print_success "Redis cluster is healthy"
    else
        print_error "Redis cluster health check failed"
    fi
    
    # Check monitoring
    if curl -f "http://localhost:9090/-/ready" &> /dev/null; then
        print_success "Prometheus is ready"
    else
        print_warning "Prometheus is not ready"
    fi
    
    if curl -f "http://localhost:3000/api/health" &> /dev/null; then
        print_success "Grafana is ready"
    else
        print_warning "Grafana is not ready"
    fi
}

# Setup SSL certificates (Let's Encrypt)
setup_ssl() {
    print_step "Setting up SSL certificates..."
    
    # This would typically use certbot for Let's Encrypt
    print_warning "SSL setup requires manual configuration with your domain provider"
    print_step "For Let's Encrypt certificates, run:"
    echo "  sudo certbot --nginx -d your-domain.com -d api.your-domain.com -d app.your-domain.com"
}

# Backup production data
backup_prod() {
    print_step "Creating production backup..."
    
    timestamp=$(date +%Y%m%d-%H%M%S)
    backup_dir="backups/production-$timestamp"
    mkdir -p "$backup_dir"
    
    # Backup database
    print_step "Backing up database..."
    docker exec postgres pg_dump -U katacore katacore_prod > "$backup_dir/database.sql"
    
    # Backup MinIO data
    print_step "Backing up MinIO data..."
    docker exec minio tar czf - /data > "$backup_dir/minio-data.tar.gz"
    
    # Backup Redis data
    print_step "Backing up Redis data..."
    for i in {1..6}; do
        docker exec redis-cluster-$i redis-cli BGSAVE
        docker cp redis-cluster-$i:/data/dump.rdb "$backup_dir/redis-cluster-$i.rdb"
    done
    
    # Backup configuration
    cp $PROD_ENV_FILE "$backup_dir/"
    cp docker-compose*.yml "$backup_dir/"
    
    print_success "Production backup created: $backup_dir"
}

# Show production status
show_prod_status() {
    print_step "Production deployment status..."
    
    echo ""
    echo "🚀 Production Services Status"
    echo "=============================="
    
    services=(
        "postgres"
        "redis-cluster-1" "redis-cluster-2" "redis-cluster-3"
        "redis-cluster-4" "redis-cluster-5" "redis-cluster-6"
        "minio"
        "backend"
        "frontend"
        "prometheus"
        "grafana"
    )
    
    for service in "${services[@]}"; do
        if docker ps --filter "name=$service" --format "table {{.Names}}\t{{.Status}}" | grep -q "$service"; then
            status=$(docker ps --filter "name=$service" --format "{{.Status}}")
            print_success "$service: $status"
        else
            print_error "$service: Not running"
        fi
    done
    
    echo ""
    echo "🌐 Production URLs"
    echo "=================="
    
    if [ -f "$PROD_ENV_FILE" ]; then
        domain=$(grep "DOMAIN=" "$PROD_ENV_FILE" | cut -d= -f2)
        if [ "$domain" != "your-domain.com" ]; then
            echo "Frontend:    https://app.$domain"
            echo "Backend:     https://api.$domain"
            echo "GraphQL:     https://api.$domain/graphql"
            echo "MinIO:       https://minio.$domain"
            echo "Grafana:     https://monitor.$domain"
        else
            echo "Frontend:    http://localhost:3000"
            echo "Backend:     http://localhost:4000"
            echo "GraphQL:     http://localhost:4000/graphql"
            echo "MinIO:       http://localhost:9001"
            echo "Grafana:     http://localhost:3000"
        fi
    fi
}

# Stop production deployment
stop_prod() {
    print_step "Stopping production deployment..."
    
    # Stop all services
    $COMPOSE_CMD -f docker-compose.yml -f docker-compose.monitoring.yml -f $PROD_COMPOSE --env-file $PROD_ENV_FILE down
    
    print_success "Production deployment stopped"
}

# Show help
show_help() {
    echo "Production Deployment Script for KataCore"
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  setup       - Generate production environment file"
    echo "  validate    - Validate production configuration"
    echo "  build       - Build production Docker images"
    echo "  deploy      - Deploy to production"
    echo "  health      - Check production health"
    echo "  ssl         - Setup SSL certificates"
    echo "  backup      - Create production backup"
    echo "  status      - Show production status"
    echo "  stop        - Stop production deployment"
    echo "  help        - Show this help message"
    echo
    echo "Production Deployment Flow:"
    echo "  1. $0 setup      # Generate production environment"
    echo "  2. Edit $PROD_ENV_FILE with your values"
    echo "  3. $0 validate   # Validate configuration"
    echo "  4. $0 build      # Build production images"
    echo "  5. $0 deploy     # Deploy to production"
    echo "  6. $0 health     # Verify deployment"
    echo "  7. $0 ssl        # Setup SSL (manual)"
}

# Main execution
main() {
    check_prerequisites
    
    case ${1:-""} in
        "setup")
            generate_prod_env
            ;;
        "validate")
            validate_prod_env
            ;;
        "build")
            validate_prod_env
            build_prod_images
            ;;
        "deploy")
            validate_prod_env
            build_prod_images
            deploy_prod
            health_check
            show_prod_status
            ;;
        "health")
            health_check
            ;;
        "ssl")
            setup_ssl
            ;;
        "backup")
            backup_prod
            ;;
        "status")
            show_prod_status
            ;;
        "stop")
            stop_prod
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Handle cleanup on exit
cleanup() {
    echo ""
    print_warning "Deployment interrupted"
    exit 1
}

trap cleanup INT TERM

# Run main function
main $@
