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
    echo "  4. Deploy Optimized (Local Build → Server)"
    echo "  5. Show Docker Images"
    echo "  6. Cleanup Docker (Remove old images)"
    echo "  7. Rollback to Previous Version"
    echo ""
    echo "🗄️  DATABASE:"
    echo "  8. Prisma Studio"
    echo "  9. Database Migrate"
    echo ""
    echo "🛠️  UTILITIES:"
    echo "  10. Docker - Start Dev Services"
    echo "  11. Docker - Stop All Services"
    echo "  12. Kill Ports (12000-12001)"
    echo ""
    echo "  0. Exit"
    echo ""
    echo -n "Select option [0-12]: "
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

run_deploy() {
    echo ""
    echo "🚀 Running Optimized Deployment..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./deploy-optimized.sh" ]; then
        echo "❌ Error: deploy-optimized.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./deploy-optimized.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_show_images() {
    echo ""
    echo "📦 Docker Images..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./show-images.sh" ]; then
        echo "❌ Error: show-images.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./show-images.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_cleanup() {
    echo ""
    echo "🧹 Cleaning up Docker..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./cleanup-docker.sh" ]; then
        echo "❌ Error: cleanup-docker.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./cleanup-docker.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_rollback() {
    echo ""
    echo "🔄 Rolling back deployment..."
    echo "─────────────────────────────────────────────────────"
    if [ ! -f "./rollback.sh" ]; then
        echo "❌ Error: rollback.sh not found!"
        read -p "Press Enter to continue..."
        return
    fi
    ./rollback.sh
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

run_docker_start() {
    echo ""
    echo "🐳 Starting Docker Services..."
    echo "─────────────────────────────────────────────────────"
    bun run docker:dev
}

run_docker_stop() {
    echo ""
    echo "🛑 Stopping Docker Services..."
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
        4) run_deploy ;;
        5) run_show_images ;;
        6) run_cleanup ;;
        7) run_rollback ;;
        8) run_prisma_studio ;;
        9) run_db_migrate ;;
        10) run_docker_start ;;
        11) run_docker_stop ;;
        12) run_kill_ports ;;
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
