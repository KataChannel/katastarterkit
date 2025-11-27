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
    print_color $CYAN "║          🚀 RAUSACH DEVELOPMENT MENU 🚀                   ║"
    print_color $CYAN "║           Running on Port 12000/12001                     ║"
    print_color $CYAN "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_color $GREEN "📦 DEVELOPMENT:"
    echo "  1)  dev                    - Run both backend + frontend"
    echo "  2)  dev:backend            - Run backend only (Port 12001)"
    echo "  3)  dev:frontend           - Run frontend only (Port 12000)"
    echo ""
    
    print_color $CYAN "🗄️  DATABASE OPERATIONS:"
    echo "  4)  db:studio              - Open Prisma Studio"
    echo "  5)  db:migrate             - Run database migrations"
    echo "  6)  db:push                - Push database schema"
    echo "  7)  db:seed                - Seed database"
    echo "  8)  db:reset               - Reset database"
    echo ""
    
    print_color $RED "� DOCKER OPERATIONS:"
    echo "  9)  docker:dev             - Start Docker services"
    echo "  10) docker:prod            - Start Production Docker"
    echo "  11) docker:down            - Stop Docker services"
    echo ""
    
    print_color $GREEN "🔧 UTILITIES:"
    echo "  12) lint                   - Run linters"
    echo "  13) format                 - Format code"
    echo "  14) test                   - Run tests"
    echo "  15) build                  - Build project"
    echo ""
    
    print_color $RED "⚡ KILL PORTS:"
    echo "  16) kill:ports             - Kill ports 12000 & 12001"
    echo ""
    
    print_color $YELLOW "  0)  Exit"
    echo ""
    print_color $CYAN "💡 Tip: Press Ctrl+C to stop any running process"
    echo ""
    
    read -p "$(print_color $CYAN 'Select option (0-16): ')" choice
    
    case $choice in
        1)
            print_color $GREEN "🚀 Starting development (backend + frontend)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev
            ;;
        2)
            print_color $GREEN "🚀 Starting backend (Port 12001)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:backend
            ;;
        3)
            print_color $GREEN "🚀 Starting frontend (Port 12000)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:frontend
            ;;
        4)
            print_color $CYAN "🗄️  Opening Prisma Studio..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run db:studio
            ;;
        5)
            print_color $CYAN "🗄️  Running database migrations..."
            bun run db:migrate
            ;;
        6)
            print_color $CYAN "🗄️  Pushing database schema..."
            bun run db:push
            ;;
        7)
            print_color $CYAN "🗄️  Seeding database..."
            bun run db:seed
            ;;
        8)
            print_color $RED "⚠️  Resetting database..."
            bun run db:reset
            ;;
        9)
            print_color $RED "🐳 Starting Docker dev services..."
            bun run docker:dev
            ;;
        10)
            print_color $RED "🐳 Starting Docker production..."
            bun run docker:prod
            ;;
        11)
            print_color $RED "🐳 Stopping Docker services..."
            bun run docker:down
            ;;
        12)
            print_color $GREEN "🔧 Running linters..."
            bun run lint
            ;;
        13)
            print_color $GREEN "🔧 Formatting code..."
            bun run format
            ;;
        14)
            print_color $GREEN "🔧 Running tests..."
            bun run test
            ;;
        15)
            print_color $GREEN "🔧 Building project..."
            bun run build
            ;;
        16)
            print_color $RED "⚡ Killing ports 12000 & 12001..."
            bun run kill:ports
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
