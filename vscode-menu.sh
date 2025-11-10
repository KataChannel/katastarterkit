#!/bin/bash

# Simple Interactive Menu for VS Code Terminal
# Runs commands in current terminal session

# Colors for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored text
print_color() {
    color=$1
    shift
    echo -e "${color}$@${NC}"
}

# Clear screen
clear

# Main menu
while true; do
    print_color $CYAN "╔════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║          🚀 DEVELOPMENT SCRIPTS MENU 🚀                   ║"
    print_color $CYAN "║      (Each command opens in new VS Code terminal)        ║"
    print_color $CYAN "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_color $GREEN "📦 GENERAL DEVELOPMENT:"
    echo "  1)  dev                    - Run both backend + frontend"
    echo "  2)  dev:backend            - Run backend only"
    echo "  3)  dev:frontend           - Run frontend only"
    echo ""
    
    print_color $BLUE "🌐 RAUSACH DOMAIN (Port 12000/12001):"
    echo "  4)  dev:rausach            - Run Rausach (backend + frontend)"
    echo "  5)  dev:rausach:backend    - Run Rausach backend only"
    echo "  6)  dev:rausach:frontend   - Run Rausach frontend only"
    echo ""
    
    print_color $PURPLE "🌐 TAZAGROUP DOMAIN (Port 13000/13001):"
    echo "  7)  dev:tazagroup          - Run Tazagroup (backend + frontend)"
    echo "  8)  dev:tazagroup:backend  - Run Tazagroup backend only"
    echo "  9)  dev:tazagroup:frontend - Run Tazagroup frontend only"
    echo ""
    
    print_color $CYAN "🗄️  DATABASE OPERATIONS:"
    echo "  10) db:studio              - Open Prisma Studio"
    echo "  11) db:studio:rausach      - Open Prisma Studio (Rausach DB)"
    echo "  12) db:studio:tazagroup    - Open Prisma Studio (Tazagroup DB)"
    echo ""
    
    print_color $RED "🐳 DOCKER OPERATIONS:"
    echo "  13) docker:dev             - Start Docker services"
    echo "  14) docker:down            - Stop Docker services"
    echo ""
    
    print_color $GREEN "🔧 UTILITIES:"
    echo "  15) lint                   - Run linters"
    echo "  16) format                 - Format code"
    echo "  17) test                   - Run tests"
    echo ""
    
    print_color $RED "⚡ KILL PORTS:"
    echo "  18) kill:12000             - Kill port 12000 (Rausach frontend)"
    echo "  19) kill:12001             - Kill port 12001 (Rausach backend)"
    echo "  20) kill:13000             - Kill port 13000 (Tazagroup frontend)"
    echo "  21) kill:13001             - Kill port 13001 (Tazagroup backend)"
    echo "  22) kill:all               - Kill all dev ports"
    echo ""
    
    print_color $YELLOW "  0)  Exit"
    echo ""
    print_color $CYAN "💡 Tip: Open Command Palette (Ctrl+Shift+P) and type 'Tasks: Run Task'"
    print_color $CYAN "    to run tasks in separate terminals"
    echo ""
    
    read -p "$(print_color $CYAN 'Select option (0-22): ')" choice
    
    case $choice in
        1)
            print_color $GREEN "🚀 Starting development (backend + frontend)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev
            ;;
        2)
            print_color $GREEN "🚀 Starting backend..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:backend
            ;;
        3)
            print_color $GREEN "🚀 Starting frontend..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:frontend
            ;;
        4)
            print_color $BLUE "🌐 Starting Rausach (backend + frontend)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:rausach
            ;;
        5)
            print_color $BLUE "🌐 Starting Rausach backend..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:rausach:backend
            ;;
        6)
            print_color $BLUE "🌐 Starting Rausach frontend..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:rausach:frontend
            ;;
        7)
            print_color $PURPLE "🌐 Starting Tazagroup (backend + frontend)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:tazagroup
            ;;
        8)
            print_color $PURPLE "🌐 Starting Tazagroup backend..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:tazagroup:backend
            ;;
        9)
            print_color $PURPLE "🌐 Starting Tazagroup frontend..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:tazagroup:frontend
            ;;
        10)
            print_color $CYAN "🗄️  Opening Prisma Studio..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run db:studio
            ;;
        11)
            print_color $CYAN "🗄️  Opening Prisma Studio (Rausach)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run db:studio:rausach
            ;;
        12)
            print_color $CYAN "🗄️  Opening Prisma Studio (Tazagroup)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run db:studio:tazagroup
            ;;
        13)
            print_color $RED "🐳 Starting Docker dev services..."
            bun run docker:dev
            ;;
        14)
            print_color $RED "🐳 Stopping Docker services..."
            bun run docker:down
            ;;
        15)
            print_color $GREEN "🔧 Running linters..."
            bun run lint
            ;;
        16)
            print_color $GREEN "🔧 Formatting code..."
            bun run format
            ;;
        17)
            print_color $GREEN "🔧 Running tests..."
            bun run test
            ;;
        18)
            print_color $RED "⚡ Killing process on port 12000..."
            $(pwd)/scripts/kill-ports.sh 12000
            sleep 1
            ;;
        19)
            print_color $RED "⚡ Killing process on port 12001..."
            $(pwd)/scripts/kill-ports.sh 12001
            sleep 1
            ;;
        20)
            print_color $RED "⚡ Killing process on port 13000..."
            $(pwd)/scripts/kill-ports.sh 13000
            sleep 1
            ;;
        21)
            print_color $RED "⚡ Killing process on port 13001..."
            $(pwd)/scripts/kill-ports.sh 13001
            sleep 1
            ;;
        22)
            print_color $RED "⚡ Killing all dev ports and processes..."
            $(pwd)/scripts/kill-ports.sh
            sleep 1
            ;;
        0)
            print_color $YELLOW "👋 Goodbye!"
            exit 0
            ;;
        *)
            print_color $RED "❌ Invalid option. Please try again."
            sleep 2
            ;;
    esac
    
    echo ""
    read -p "$(print_color $CYAN 'Press Enter to return to menu...')"
    clear
done
