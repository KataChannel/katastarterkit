#!/bin/bash

# Docker Environment Validator Script
# Usage: ./scripts/validate-docker-env.sh

set -e

echo "🔍 Validating Docker Environment Configuration..."
echo

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📋 Please copy .env.example to .env and configure your variables"
    echo "   cp .env.example .env"
    exit 1
fi

echo "✅ .env file found"

# Load environment variables
set -a
source .env
set +a

echo "📋 Checking required environment variables..."
echo

# Required variables
required_vars=(
    "NODE_ENV"
    "POSTGRES_DB"
    "POSTGRES_USER" 
    "POSTGRES_PASSWORD"
    "JWT_SECRET"
    "MINIO_ACCESS_KEY"
    "MINIO_SECRET_KEY"
)

# Optional variables with defaults
optional_vars=(
    "PORT:4000"
    "FRONTEND_PORT:3000"
    "POSTGRES_PORT:5432"
    "REDIS_PORT:6379"
    "MINIO_PORT:9000"
    "MINIO_CONSOLE_PORT:9001"
)

missing_vars=()

# Check required variables
echo "🔥 Required Variables:"
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "   ❌ $var: NOT SET"
        missing_vars+=("$var")
    else
        # Mask sensitive variables
        if [[ "$var" == *"SECRET"* ]] || [[ "$var" == *"PASSWORD"* ]] || [[ "$var" == *"KEY"* ]]; then
            echo "   ✅ $var: ***HIDDEN***"
        else
            echo "   ✅ $var: ${!var}"
        fi
    fi
done

echo
echo "⚙️  Optional Variables (with defaults):"
for var_default in "${optional_vars[@]}"; do
    var="${var_default%:*}"
    default="${var_default#*:}"
    
    if [ -z "${!var}" ]; then
        echo "   ⚠️  $var: Using default ($default)"
    else
        echo "   ✅ $var: ${!var}"
    fi
done

echo
echo "🐳 Docker Configuration:"
echo "   Container Names:"
echo "     - Postgres: ${POSTGRES_CONTAINER_NAME:-timonacore-postgres}"
echo "     - Redis: ${REDIS_CONTAINER_NAME:-timonacore-redis}"
echo "     - Minio: ${MINIO_CONTAINER_NAME:-timonacore-minio}"
echo "     - Backend: ${BACKEND_CONTAINER_NAME:-timonacore-backend}"
echo "     - Frontend: ${FRONTEND_CONTAINER_NAME:-timonacore-frontend}"
echo "   Network: ${DOCKER_NETWORK_NAME:-timonacore-network}"

echo
echo "🌐 Port Mappings:"
echo "   - Frontend: ${FRONTEND_PORT:-3000}:3000"
echo "   - Backend: ${PORT:-4000}:4000"
echo "   - Postgres: ${POSTGRES_PORT:-5432}:5432"
echo "   - Redis: ${REDIS_PORT:-6379}:6379"
echo "   - Minio API: ${MINIO_PORT:-9000}:9000"
echo "   - Minio Console: ${MINIO_CONSOLE_PORT:-9001}:9001"

echo
echo "🔗 Internal Service URLs:"
echo "   - Database: ${DOCKER_DATABASE_URL:-postgresql://postgres:postgres@postgres:5432/timonacore}"
echo "   - Redis: ${DOCKER_REDIS_HOST:-redis}:${REDIS_PORT:-6379}"
echo "   - Minio: ${DOCKER_MINIO_ENDPOINT:-minio}:${MINIO_PORT:-9000}"

# Check for port conflicts
echo
echo "🔍 Checking for port conflicts..."

ports_to_check=(
    "${FRONTEND_PORT:-3000}"
    "${PORT:-4000}"
    "${POSTGRES_PORT:-5432}"
    "${REDIS_PORT:-6379}"
    "${MINIO_PORT:-9000}"
    "${MINIO_CONSOLE_PORT:-9001}"
)

for port in "${ports_to_check[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "   ⚠️  Port $port is already in use"
    else
        echo "   ✅ Port $port is available"
    fi
done

# Check Docker and Docker Compose
echo
echo "🐳 Checking Docker installation..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    missing_vars+=("docker")
else
    echo "✅ Docker is installed: $(docker --version)"
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed or not in PATH"
    missing_vars+=("docker-compose")
else
    if command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose is installed: $(docker-compose --version)"
    else
        echo "✅ Docker Compose is installed: $(docker compose version)"
    fi
fi

# Summary
echo
echo "$(printf '=%.0s' {1..50})"

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ All checks passed! Ready to start Docker services."
    echo
    echo "🚀 To start the services:"
    echo "   docker-compose up -d"
    echo
    echo "📊 To check service status:"
    echo "   docker-compose ps"
    echo
    echo "📝 To view logs:"
    echo "   docker-compose logs -f [service_name]"
    echo
    echo "🛑 To stop services:"
    echo "   docker-compose down"
    
    exit 0
else
    echo "❌ Validation failed! Missing required components:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo
    echo "📋 Please fix the missing components and run this script again."
    exit 1
fi
