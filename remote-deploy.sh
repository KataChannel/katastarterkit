#!/bin/bash

# ================================================================
# REMOTE DEPLOYMENT SCRIPT
# ================================================================
# Deploy code lên server 116.118.49.243 và chạy docker-compose
# ================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# ============ CONFIGURATION ============
REMOTE_SERVER="116.118.49.243"
REMOTE_USER="root"  # Thay đổi nếu cần
REMOTE_PORT="22"

# Remote paths
REMOTE_BASE_PATH="/opt/shoprausach"
REMOTE_PATH_RAUSACH="$REMOTE_BASE_PATH/rausach"
REMOTE_PATH_TAZAGROUP="$REMOTE_BASE_PATH/tazagroup"
REMOTE_PATH_MULTI="$REMOTE_BASE_PATH/multi-domain"

# Local path
LOCAL_PATH="$(pwd)"

# Files to exclude from sync
EXCLUDE_PATTERN="node_modules .git .env* *.log dist build .next .DS_Store"

# ============ FUNCTIONS ============

check_ssh_connection() {
    echo -e "${YELLOW}🔍 Checking SSH connection to $REMOTE_SERVER...${NC}"
    if ssh -p $REMOTE_PORT -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_SERVER "echo 'SSH OK'" &>/dev/null; then
        echo -e "${GREEN}✅ SSH connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Cannot connect to server${NC}"
        echo -e "${YELLOW}Please check:${NC}"
        echo "  1. Server IP: $REMOTE_SERVER"
        echo "  2. SSH user: $REMOTE_USER"
        echo "  3. SSH port: $REMOTE_PORT"
        echo "  4. SSH key configured or password access"
        return 1
    fi
}

sync_code_to_server() {
    local remote_path=$1
    local domain_name=$2
    
    echo ""
    echo -e "${YELLOW}📦 Syncing code to server: $remote_path${NC}"
    echo ""
    
    # Build exclude arguments
    local exclude_args=""
    for pattern in $EXCLUDE_PATTERN; do
        exclude_args="$exclude_args --exclude=$pattern"
    done
    
    # Sync with rsync
    rsync -avz --progress \
        $exclude_args \
        -e "ssh -p $REMOTE_PORT" \
        "$LOCAL_PATH/" \
        "$REMOTE_USER@$REMOTE_SERVER:$remote_path/"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Code synced successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to sync code${NC}"
        return 1
    fi
}

deploy_on_server() {
    local remote_path=$1
    local domain=$2
    local compose_file=$3
    local env_file=$4
    
    echo ""
    echo -e "${YELLOW}🚀 Deploying $domain on server...${NC}"
    echo ""
    
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_SERVER << ENDSSH
        set -e
        
        echo "📂 Navigating to: $remote_path"
        cd $remote_path
        
        echo "📋 Current directory: \$(pwd)"
        echo ""
        
        # Copy environment file if specified
        if [ -n "$env_file" ]; then
            echo "⚙️  Setting up environment..."
            if [ -f "$env_file" ]; then
                cp $env_file .env
                echo "✅ Environment file configured"
            else
                echo "⚠️  Warning: $env_file not found, using existing .env"
            fi
        fi
        
        # Check if docker-compose exists
        if command -v docker-compose &> /dev/null; then
            DOCKER_COMPOSE="docker-compose"
        else
            DOCKER_COMPOSE="docker compose"
        fi
        
        echo ""
        echo "🐳 Docker compose command: \$DOCKER_COMPOSE"
        echo ""
        
        # Stop existing containers
        echo "🛑 Stopping existing containers..."
        \$DOCKER_COMPOSE -f $compose_file down || true
        
        echo ""
        echo "🔨 Building and starting containers..."
        \$DOCKER_COMPOSE -f $compose_file up -d --build
        
        echo ""
        echo "⏳ Waiting for containers to start..."
        sleep 5
        
        echo ""
        echo "📊 Container status:"
        \$DOCKER_COMPOSE -f $compose_file ps
        
        echo ""
        echo "✅ Deployment completed!"
ENDSSH
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}   ✅ DEPLOYMENT SUCCESSFUL!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        return 0
    else
        echo ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}   ❌ DEPLOYMENT FAILED!${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        return 1
    fi
}

show_deployment_info() {
    local domain=$1
    
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}   📍 DEPLOYMENT INFORMATION${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    case $domain in
        "rausach")
            echo ""
            echo -e "${YELLOW}🌟 RAUSACH:${NC}"
            echo -e "   Frontend:  ${GREEN}http://$REMOTE_SERVER:12000${NC}"
            echo -e "   Backend:   ${GREEN}http://$REMOTE_SERVER:12001/graphql${NC}"
            echo -e "   Database:  ${GREEN}$REMOTE_SERVER:12003${NC}"
            echo -e "   PgAdmin:   ${GREEN}http://$REMOTE_SERVER:12002${NC}"
            ;;
        "tazagroup")
            echo ""
            echo -e "${YELLOW}🏢 TAZAGROUP:${NC}"
            echo -e "   Frontend:  ${GREEN}http://$REMOTE_SERVER:13000${NC}"
            echo -e "   Backend:   ${GREEN}http://$REMOTE_SERVER:13001/graphql${NC}"
            echo -e "   Database:  ${GREEN}$REMOTE_SERVER:13003${NC}"
            echo -e "   PgAdmin:   ${GREEN}http://$REMOTE_SERVER:13002${NC}"
            ;;
        "multi-domain")
            echo ""
            echo -e "${YELLOW}🌟 RAUSACH:${NC}"
            echo -e "   Frontend:  ${GREEN}http://$REMOTE_SERVER:12000${NC}"
            echo -e "   Backend:   ${GREEN}http://$REMOTE_SERVER:12001/graphql${NC}"
            echo ""
            echo -e "${YELLOW}🏢 TAZAGROUP:${NC}"
            echo -e "   Frontend:  ${GREEN}http://$REMOTE_SERVER:13000${NC}"
            echo -e "   Backend:   ${GREEN}http://$REMOTE_SERVER:13001/graphql${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${YELLOW}📍 SHARED SERVICES:${NC}"
    echo -e "   Redis:     ${GREEN}$REMOTE_SERVER:12004${NC}"
    echo -e "   Minio:     ${GREEN}$REMOTE_SERVER:12007${NC}"
    echo -e "   Console:   ${GREEN}http://$REMOTE_SERVER:12008${NC}"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# ============ MAIN SCRIPT ============

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🚀 REMOTE DEPLOYMENT TO SERVER${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Target Server: $REMOTE_SERVER${NC}"
echo -e "${CYAN}SSH User: $REMOTE_USER${NC}"
echo ""
echo -e "${YELLOW}Chọn domain để deploy:${NC}"
echo ""
echo "  1) 🌟 Rausach    (deploy to: $REMOTE_PATH_RAUSACH)"
echo "  2) 🏢 Tazagroup  (deploy to: $REMOTE_PATH_TAZAGROUP)"
echo "  3) 🔥 Multi-domain (deploy to: $REMOTE_PATH_MULTI)"
echo "  4) ⚙️  Configure server settings"
echo "  5) 🧪 Test SSH connection"
echo "  6) ❌ Exit"
echo ""
read -p "Lựa chọn của bạn [1-6]: " choice

case $choice in
    1)
        DOMAIN="rausach"
        REMOTE_PATH="$REMOTE_PATH_RAUSACH"
        COMPOSE_FILE="docker-compose.rausach.yml"
        ENV_FILE=".env.prod.rausach"
        ;;
    2)
        DOMAIN="tazagroup"
        REMOTE_PATH="$REMOTE_PATH_TAZAGROUP"
        COMPOSE_FILE="docker-compose.tazagroup.yml"
        ENV_FILE=".env.prod.tazagroup"
        ;;
    3)
        DOMAIN="multi-domain"
        REMOTE_PATH="$REMOTE_PATH_MULTI"
        COMPOSE_FILE="docker-compose.multi-domain.yml"
        ENV_FILE=""
        ;;
    4)
        echo ""
        echo -e "${YELLOW}📝 Current Configuration:${NC}"
        echo "  Server: $REMOTE_SERVER"
        echo "  User: $REMOTE_USER"
        echo "  Port: $REMOTE_PORT"
        echo "  Base Path: $REMOTE_BASE_PATH"
        echo ""
        echo -e "${CYAN}To change these values, edit this script:${NC}"
        echo "  nano $0"
        echo ""
        echo -e "${YELLOW}Look for the CONFIGURATION section at the top${NC}"
        exit 0
        ;;
    5)
        echo ""
        check_ssh_connection
        echo ""
        read -p "Press Enter to continue..."
        exit 0
        ;;
    6)
        echo -e "${YELLOW}Thoát...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Lựa chọn không hợp lệ!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🎯 DEPLOYMENT PLAN${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Domain:${NC}        $DOMAIN"
echo -e "${YELLOW}Local Path:${NC}    $LOCAL_PATH"
echo -e "${YELLOW}Remote Path:${NC}   $REMOTE_PATH"
echo -e "${YELLOW}Compose File:${NC}  $COMPOSE_FILE"
if [ -n "$ENV_FILE" ]; then
    echo -e "${YELLOW}Env File:${NC}      $ENV_FILE"
fi
echo ""
echo -e "${CYAN}Steps:${NC}"
echo "  1. Check SSH connection"
echo "  2. Sync code to server"
echo "  3. Deploy with docker-compose"
echo "  4. Show deployment info"
echo ""
read -p "Continue with deployment? (y/N): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 0
fi

# Step 1: Check SSH
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   STEP 1: SSH CONNECTION CHECK${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! check_ssh_connection; then
    echo ""
    echo -e "${RED}Cannot proceed without SSH connection.${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "  1. Test SSH manually: ssh $REMOTE_USER@$REMOTE_SERVER"
    echo "  2. Setup SSH key: ssh-copy-id $REMOTE_USER@$REMOTE_SERVER"
    echo "  3. Check firewall on server"
    echo ""
    exit 1
fi

# Step 2: Sync code
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   STEP 2: SYNC CODE TO SERVER${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! sync_code_to_server "$REMOTE_PATH" "$DOMAIN"; then
    echo ""
    echo -e "${RED}Failed to sync code. Aborting.${NC}"
    exit 1
fi

# Step 3: Deploy
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   STEP 3: DEPLOY ON SERVER${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! deploy_on_server "$REMOTE_PATH" "$DOMAIN" "$COMPOSE_FILE" "$ENV_FILE"; then
    echo ""
    echo -e "${RED}Deployment failed. Check logs above.${NC}"
    exit 1
fi

# Step 4: Show info
show_deployment_info "$DOMAIN"

echo -e "${YELLOW}💡 Useful commands:${NC}"
echo ""
echo "  View logs:"
echo "    ssh $REMOTE_USER@$REMOTE_SERVER 'cd $REMOTE_PATH && docker-compose -f $COMPOSE_FILE logs -f'"
echo ""
echo "  Restart services:"
echo "    ssh $REMOTE_USER@$REMOTE_SERVER 'cd $REMOTE_PATH && docker-compose -f $COMPOSE_FILE restart'"
echo ""
echo "  Stop services:"
echo "    ssh $REMOTE_USER@$REMOTE_SERVER 'cd $REMOTE_PATH && docker-compose -f $COMPOSE_FILE down'"
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
