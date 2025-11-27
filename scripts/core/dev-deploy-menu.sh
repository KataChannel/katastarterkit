#!/bin/bash

# ============================================================================
# Development & Deployment Menu
# Quick access to common tasks
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

show_menu() {
    clear
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║       🚀 Multi-Domain Dev & Deploy Menu                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🏢 SELECT DOMAIN:"
    echo "  R. RAUSACH (shop.rausachtrangia.com - Ports 12000-12001)"
    echo "  T. TAZAGROUP (app.tazagroup.vn - Ports 13000-13001)"
    echo "  M. TIMONA (app.timona.edu.vn - Ports 15000-15001)"
    echo ""
    echo "📦 DEVELOPMENT (cho domain đã chọn):"
    echo "  1. Dev - Full (Backend + Frontend)"
    echo "  2. Dev - Backend Only"
    echo "  3. Dev - Frontend Only"
    echo ""
    echo "🐳 DEPLOYMENT (cho domain đã chọn):"
    echo "  4. Build & Deploy App to Server"
    echo "  5. Build Docker Images Only"
    echo "  6. Deploy to Server (use existing images)"
    echo ""
    echo "🗄️  DATABASE (cho domain đã chọn):"
    echo "  7. Prisma Studio"
    echo "  8. Database Migrate"
    echo "  9. Database Push"
    echo "  10. Database Seed"
    echo ""
    echo "🛠️  UTILITIES:"
    echo "  11. Show Current Domain"
    echo "  12. Kill All Ports (12000-15001)"
    echo "  13. Docker - Start Dev Services (Local)"
    echo "  14. Docker - Stop Dev Services (Local)"
    echo "  15. Clean node_modules"
    echo "  16. Git Auto Commit & Push"
    echo "  17. SSH Key Setup (Auto Deploy)"
    echo ""
    echo "  0. Exit"
    echo ""
    if [ ! -z "$CURRENT_DOMAIN" ]; then
        echo "📍 Current Domain: $CURRENT_DOMAIN"
        echo ""
    fi
    echo -n "Select option: "
}

select_domain() {
    echo ""
    echo "🏢 Select Domain:"
    echo "  1. RAUSACH (shop.rausachtrangia.com)"
    echo "  2. TAZAGROUP (app.tazagroup.vn)"
    echo "  3. TIMONA (app.timona.edu.vn)"
    echo ""
    echo -n "Select [1-3]: "
    read domain_choice
    
    case $domain_choice in
        1)
            CURRENT_DOMAIN="rausach"
            DOMAIN_NAME="RAUSACH"
            ;;
        2)
            CURRENT_DOMAIN="tazagroup"
            DOMAIN_NAME="TAZAGROUP"
            ;;
        3)
            CURRENT_DOMAIN="timona"
            DOMAIN_NAME="TIMONA"
            ;;
        *)
            echo "❌ Invalid choice"
            sleep 2
            return 1
            ;;
    esac
    
    echo "✅ Domain set to: $DOMAIN_NAME"
    sleep 1
    return 0
}

run_dev_full() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🚀 Starting Full Development for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run dev:$CURRENT_DOMAIN
}

run_dev_backend() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🔧 Starting Backend Development for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run dev:${CURRENT_DOMAIN}:backend
}

run_dev_frontend() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🎨 Starting Frontend Development for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run dev:${CURRENT_DOMAIN}:frontend
}

run_deploy_full() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🚀 Building & Deploying $DOMAIN_NAME to Server..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run deploy:$CURRENT_DOMAIN
    echo ""
    read -p "Press Enter to continue..."
}

run_build_images() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🏗️  Building Docker Images for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run build:${CURRENT_DOMAIN}:image
    echo ""
    read -p "Press Enter to continue..."
}

run_deploy_only() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🚀 Deploying $DOMAIN_NAME to Server (using existing images)..."
    echo "─────────────────────────────────────────────────────"
    ../deploy/deploy-${CURRENT_DOMAIN}.sh
    echo ""
    read -p "Press Enter to continue..."
}

show_current_domain() {
    echo ""
    echo "📍 Current Domain Configuration:"
    echo "─────────────────────────────────────────────────────"
    if [ -z "$CURRENT_DOMAIN" ]; then
        echo "❌ No domain selected"
        echo ""
        echo "Available domains:"
        echo "  • RAUSACH (shop.rausachtrangia.com - Ports 12000-12001)"
        echo "  • TAZAGROUP (app.tazagroup.vn - Ports 13000-13001)"
        echo "  • TIMONA (app.timona.edu.vn - Ports 15000-15001)"
    else
        echo "✅ Domain: $DOMAIN_NAME ($CURRENT_DOMAIN)"
        case $CURRENT_DOMAIN in
            "rausach")
                echo "   URL: shop.rausachtrangia.com"
                echo "   Frontend: Port 12000"
                echo "   Backend: Port 12001"
                echo "   Bucket: shopuploads"
                ;;
            "tazagroup")
                echo "   URL: app.tazagroup.vn"
                echo "   Frontend: Port 13000"
                echo "   Backend: Port 13001"
                echo "   Bucket: tazagroup-uploads"
                ;;
            "timona")
                echo "   URL: app.timona.edu.vn"
                echo "   Frontend: Port 15000"
                echo "   Backend: Port 15001"
                echo "   Bucket: timona-uploads"
                ;;
        esac
    fi
    echo ""
    read -p "Press Enter to continue..."
}

run_prisma_studio() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🗄️  Opening Prisma Studio for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run db:studio:$CURRENT_DOMAIN
}

run_db_migrate() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🗄️  Running Database Migration for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run db:migrate:$CURRENT_DOMAIN
    echo ""
    read -p "Press Enter to continue..."
}

run_db_push() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🗄️  Pushing Database Schema for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run db:push:$CURRENT_DOMAIN
    echo ""
    read -p "Press Enter to continue..."
}

run_db_seed() {
    if [ -z "$CURRENT_DOMAIN" ]; then
        select_domain || return
    fi
    
    echo ""
    echo "🗄️  Seeding Database for $DOMAIN_NAME..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run db:seed:$CURRENT_DOMAIN
    echo ""
    read -p "Press Enter to continue..."
}

run_clean() {
    echo ""
    echo "🧹 Cleaning node_modules..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bun run clean
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
    echo "🔪 Killing all application ports..."
    echo "─────────────────────────────────────────────────────"
    
    for port in 12000 12001 13000 13001 15000 15001; do
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

run_git_auto() {
    echo ""
    echo "📦 Git Auto Commit & Push..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bash scripts/utils/autogit.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_ssh_setup() {
    echo ""
    echo "🔑 SSH Key Setup (Auto Deploy)..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bash scripts/utils/ssh-setup.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_git_auto() {
    echo ""
    echo "📦 Git Auto Commit & Push..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bash scripts/utils/autogit.sh
    echo ""
    read -p "Press Enter to continue..."
}

run_ssh_setup() {
    echo ""
    echo "🔑 SSH Key Setup (Auto Deploy)..."
    echo "─────────────────────────────────────────────────────"
    cd ..
    bash scripts/utils/ssh-setup.sh
    echo ""
    read -p "Press Enter to continue..."
}

# Main loop
CURRENT_DOMAIN=""
DOMAIN_NAME=""

while true; do
    show_menu
    read choice
    
    case $choice in
        [Rr]) select_domain ;;
        [Tt]) CURRENT_DOMAIN="tazagroup"; DOMAIN_NAME="TAZAGROUP"; echo "✅ Domain set to: $DOMAIN_NAME"; sleep 1 ;;
        [Mm]) CURRENT_DOMAIN="timona"; DOMAIN_NAME="TIMONA"; echo "✅ Domain set to: $DOMAIN_NAME"; sleep 1 ;;
        1) run_dev_full ;;
        2) run_dev_backend ;;
        3) run_dev_frontend ;;
        4) run_deploy_full ;;
        5) run_build_images ;;
        6) run_deploy_only ;;
        7) run_prisma_studio ;;
        8) run_db_migrate ;;
        9) run_db_push ;;
        10) run_db_seed ;;
        11) show_current_domain ;;
        12) run_kill_ports ;;
        13) run_docker_start ;;
        14) run_docker_stop ;;
        15) run_clean ;;
        16) run_git_auto ;;
        17) run_ssh_setup ;;
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
