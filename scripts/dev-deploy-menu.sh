#!/bin/bash

# ============================================================================
# Development & Deployment Menu
# Quick access to common tasks
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

show_menu() {
    clear
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║        🚀 Rausach - Dev & Deploy Menu                 ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "📦 DEVELOPMENT:"
    echo "  1. Dev - Full (Backend + Frontend)"
    echo "  2. Dev - Backend Only"
    echo "  3. Dev - Frontend Only"
    echo ""
    echo "🐳 DEPLOYMENT:"
    echo "  4. Deploy Infrastructure to Server (Postgres, Redis, Minio)"
    echo "  5. Deploy App to Server (Backend + Frontend)"
    echo "  6. Stop Services (App/Infrastructure/All)"
    echo "  7. Show Docker Images"
    echo "  8. Cleanup Docker (Remove old images)"
    echo "  9. Rollback to Previous Version"
    echo ""
    echo "🗄️  DATABASE:"
    echo "  10. Prisma Studio"
    echo "  11. Database Migrate"
    echo ""
    echo "🛠️  UTILITIES:"
    echo "  12. Test Build Frontend (Production)"
    echo "  13. Check Deployment Status"
    echo "  14. Docker - Start Dev Services (Local)"
    echo "  15. Docker - Stop Dev Services (Local)"
    echo "  16. Kill Ports (12000-12001)"
    echo ""
    echo "  0. Exit"
    echo ""
    echo -n "Select option [0-16]: "
}

run_dev_full() {
    echo ""
    echo "🚀 Starting Full Development (Backend + Frontend)..."
    echo "─────────────────────────────────────────────────────"
    bun run dev:full
}

run_dev_backend() {
    echo ""
    echo "🔧 Starting Backend Development..."
    echo "─────────────────────────────────────────────────────"
    bun run dev:backend
}

run_dev_frontend() {
    echo ""
    echo "🎨 Starting Frontend Development..."
    echo "─────────────────────────────────────────────────────"
    bun run dev:frontend
}

run_deploy_infrastructure() {
    echo ""
    echo "🗄️  Deploying Infrastructure to Server..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./deployment/deploy-infrastructure.sh" ]; then
        echo "❌ Error: deploy-infrastructure.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./deployment/deploy-infrastructure.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_stop_services() {
    echo ""
    echo "🛑 Stop Services..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./deployment/stop-services.sh" ]; then
        echo "❌ Error: stop-services.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./deployment/stop-services.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_deploy_app() {
    echo ""
    echo "🚀 Deploying Application (Backend + Frontend)..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./deployment/deploy-optimized.sh" ]; then
        echo "❌ Error: deploy-optimized.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./deployment/deploy-optimized.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_show_images() {
    echo ""
    echo "📦 Docker Images on Server..."
    echo "─────────────────────────────────────────────────────"
    ssh root@116.118.49.243 "docker images | grep -E 'REPOSITORY|rausach|postgres|redis|minio'"
    echo ""
    read -p "Press Enter to continue..."
}

run_cleanup() {
    echo ""
    echo "🧹 Cleaning up Docker on Server..."
    echo "─────────────────────────────────────────────────────"
    echo "This will remove dangling images and unused containers"
    read -p "Continue? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        ssh root@116.118.49.243 "docker system prune -f"
        echo "✅ Cleanup completed"
    fi
    echo ""
    read -p "Press Enter to continue..."
}

run_rollback() {
    echo ""
    echo "🔄 Rolling back to previous version..."
    echo "─────────────────────────────────────────────────────"
    ssh root@116.118.49.243 << 'ENDSSH'
        cd /root/shoprausach
        
        echo "Checking for previous images..."
        if docker images | grep -q "rausach-backend:previous"; then
            echo "→ Tagging previous backend as latest..."
            docker tag rausach-backend:previous rausach-backend:latest
        fi
        
        if docker images | grep -q "rausach-frontend:previous"; then
            echo "→ Tagging previous frontend as latest..."
            docker tag rausach-frontend:previous rausach-frontend:latest
        fi
        
        echo "→ Restarting app services..."
        docker compose -f docker-compose.app.yml down
        docker compose -f docker-compose.app.yml up -d --force-recreate
        
        echo "✅ Rollback completed"
ENDSSH
    echo ""
    read -p "Press Enter to continue..."
}

run_prisma_studio() {
    echo ""
    echo "🗄️  Opening Prisma Studio..."
    echo "─────────────────────────────────────────────────────"
    bun run db:studio
}

run_db_migrate() {
    echo ""
    echo "🗄️  Running Database Migration..."
    echo "─────────────────────────────────────────────────────"
    cd backend
    bunx prisma migrate dev
    cd ..
    echo ""
    read -p "Press Enter to continue..."
}

run_test_build() {
    echo ""
    echo "🏗️  Testing Production Build..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./setup/build-frontend-prod.sh" ]; then
        echo "❌ Error: build-frontend-prod.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./setup/build-frontend-prod.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_check_status() {
    echo ""
    echo "📊 Checking Deployment Status..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./infrastructure/check-deployment-status.sh" ]; then
        echo "❌ Error: check-deployment-status.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./infrastructure/check-deployment-status.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_docker_start() {
    echo ""
    echo "🐳 Starting Docker Services (Local)..."
    echo "─────────────────────────────────────────────────────"
    bun run docker:dev
}

run_docker_stop() {
    echo ""
    echo "🛑 Stopping Docker Services (Local)..."
    echo "─────────────────────────────────────────────────────"
    bun run docker:down
    echo ""
    read -p "Press Enter to continue..."
}

run_kill_ports() {
    echo ""
    echo "🔪 Killing ports 12000-12001..."
    echo "─────────────────────────────────────────────────────"
    
    for port in 12000 12001; do
        PID=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$PID" ]; then
            kill -9 $PID 2>/dev/null
            echo "  ✓ Killed process on port $port (PID: $PID)"
        else
            echo "  • Port $port is free"
        fi
    done
    
    echo ""
    read -p "Press Enter to continue..."
}

# Main loop
while true; do
    show_menu
    read choice
    
    case $choice in
        1) run_dev_full ;;
        2) run_dev_backend ;;
        3) run_dev_frontend ;;
        4) run_deploy_infrastructure ;;
        5) run_deploy_app ;;
        6) run_stop_services ;;
        7) run_show_images ;;
        8) run_cleanup ;;
        9) run_rollback ;;
        10) run_prisma_studio ;;
        11) run_db_migrate ;;
        12) run_test_build ;;
        13) run_check_status ;;
        14) run_docker_start ;;
        15) run_docker_stop ;;
        16) run_kill_ports ;;
        0) 
            echo ""
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo ""
            echo "❌ Invalid option. Please try again."
            sleep 2
            ;;
    esac
done
