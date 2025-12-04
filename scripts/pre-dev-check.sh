#!/bin/bash

# ============================================
# Pre-Dev Check Script
# ============================================
# This script performs pre-flight checks before running dev
# - Auto-detects domain from env
# - Checks database connection
# - Offers to backup before dev
# - Shows backup status

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$ROOT_DIR/backend"
BACKUPS_DIR="$ROOT_DIR/backups"

# Detect domain from argument or env file
detect_domain() {
    if [ -n "$1" ]; then
        echo "$1"
        return
    fi
    
    if [ -f "$BACKEND_DIR/.env" ]; then
        if grep -q "rausachcore" "$BACKEND_DIR/.env" 2>/dev/null; then
            echo "rausach"
        elif grep -q "tazagroupcore" "$BACKEND_DIR/.env" 2>/dev/null; then
            echo "tazagroup"
        elif grep -q "timonacore" "$BACKEND_DIR/.env" 2>/dev/null; then
            echo "timona"
        else
            echo "default"
        fi
    else
        echo "default"
    fi
}

# Print header
print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${BOLD}🔍 PRE-DEV CHECK${NC}                                              ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Get backup stats
get_backup_stats() {
    local domain="$1"
    local backup_dir="$BACKUPS_DIR/$domain"
    
    if [ ! -d "$backup_dir" ]; then
        echo "NO_BACKUPS"
        return
    fi
    
    local count=$(ls -d "$backup_dir"/*/ 2>/dev/null | wc -l)
    
    if [ "$count" -eq 0 ]; then
        echo "NO_BACKUPS"
        return
    fi
    
    local latest=$(ls -d "$backup_dir"/*/ 2>/dev/null | sort -r | head -1)
    local latest_name=$(basename "$latest")
    local latest_size=$(du -sh "$latest" 2>/dev/null | cut -f1)
    
    echo "$count|$latest_name|$latest_size"
}

# Check database connection
check_db_connection() {
    local domain="$1"
    
    echo -e "${BLUE}📡 Checking database connection...${NC}"
    
    cd "$BACKEND_DIR"
    
    # Try to connect using prisma
    if timeout 10 bun run prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Database connected${NC}"
        return 0
    else
        echo -e "   ${RED}❌ Database connection failed${NC}"
        echo -e "   ${YELLOW}💡 Make sure docker services are running: bun run docker:dev${NC}"
        return 1
    fi
}

# Perform smart backup
do_backup() {
    local domain="$1"
    
    echo -e "\n${BLUE}📦 Starting smart backup...${NC}"
    
    cd "$BACKEND_DIR"
    bun run prisma/smart-backup.ts
    
    echo -e "${GREEN}✅ Backup completed!${NC}"
}

# Main
main() {
    local DOMAIN=$(detect_domain "$1")
    
    print_header
    
    echo -e "${BOLD}Domain:${NC} ${CYAN}$DOMAIN${NC}"
    echo ""
    
    # Get backup stats
    local stats=$(get_backup_stats "$DOMAIN")
    
    if [ "$stats" = "NO_BACKUPS" ]; then
        echo -e "${YELLOW}⚠️  No backups found for ${DOMAIN}${NC}"
        echo ""
        
        read -p "$(echo -e ${BOLD}Create a backup before dev? [Y/n]:${NC} )" -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            # Check DB first
            if check_db_connection "$DOMAIN"; then
                do_backup "$DOMAIN"
            else
                echo -e "${RED}Cannot backup without database connection${NC}"
                exit 1
            fi
        fi
    else
        IFS='|' read -r count latest_name latest_size <<< "$stats"
        
        echo -e "${BOLD}📂 Backup Status:${NC}"
        echo -e "   Total backups: ${CYAN}$count${NC}"
        echo -e "   Latest backup: ${CYAN}$latest_name${NC}"
        echo -e "   Backup size:   ${CYAN}$latest_size${NC}"
        echo ""
        
        # Calculate age of latest backup
        local latest_date="${latest_name:0:8}"
        local today=$(date +%Y%m%d)
        
        # Simple date comparison
        if [ "$latest_date" != "$today" ]; then
            echo -e "${YELLOW}⚠️  Latest backup is not from today${NC}"
            echo ""
            
            read -p "$(echo -e ${BOLD}Create a fresh backup? [Y/n]:${NC} )" -n 1 -r
            echo ""
            
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                if check_db_connection "$DOMAIN"; then
                    do_backup "$DOMAIN"
                else
                    echo -e "${RED}Cannot backup without database connection${NC}"
                fi
            fi
        else
            echo -e "${GREEN}✅ Backup is up to date${NC}"
        fi
    fi
    
    echo ""
    echo -e "${GREEN}${BOLD}🚀 Ready to start dev!${NC}"
    echo ""
    echo -e "Available commands:"
    echo -e "   ${CYAN}bun run dev:$DOMAIN${NC}       - Start dev server"
    echo -e "   ${CYAN}bun run db:backup:$DOMAIN${NC} - Create backup"
    echo -e "   ${CYAN}bun run db:restore:$DOMAIN${NC} - Restore from backup"
    echo ""
}

# Run
main "$@"
