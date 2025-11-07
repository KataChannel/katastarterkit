#!/bin/bash

# ============================================
# Infrastructure Management Script
# Quick commands to manage remote infrastructure
# ============================================

SERVER_IP="${SERVER_IP:-116.118.48.208}"
SERVER_USER="${SERVER_USER:-root}"
DEPLOY_DIR="/opt/innerv2"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

show_usage() {
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  status      - Show container status"
    echo "  logs        - Show all logs"
    echo "  logs-db     - Show PostgreSQL logs"
    echo "  logs-redis  - Show Redis logs"
    echo "  logs-minio  - Show MinIO logs"
    echo "  restart     - Restart all services"
    echo "  restart-db  - Restart PostgreSQL"
    echo "  restart-redis - Restart Redis"
    echo "  restart-minio - Restart MinIO"
    echo "  stop        - Stop all services"
    echo "  start       - Start all services"
    echo "  stats       - Show resource usage"
    echo "  backup-db   - Backup database"
    echo "  psql        - Connect to PostgreSQL"
    echo "  redis-cli   - Connect to Redis"
    echo "  update      - Update and restart services"
    echo ""
}

if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

COMMAND=$1

case $COMMAND in
    status)
        echo -e "${BLUE}Container Status:${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose ps"
        ;;
    
    logs)
        echo -e "${BLUE}Showing all logs (Ctrl+C to exit):${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose logs -f"
        ;;
    
    logs-db)
        echo -e "${BLUE}PostgreSQL logs (Ctrl+C to exit):${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose logs -f postgres"
        ;;
    
    logs-redis)
        echo -e "${BLUE}Redis logs (Ctrl+C to exit):${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose logs -f redis"
        ;;
    
    logs-minio)
        echo -e "${BLUE}MinIO logs (Ctrl+C to exit):${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose logs -f minio"
        ;;
    
    restart)
        echo -e "${YELLOW}Restarting all services...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose restart"
        echo -e "${GREEN}Services restarted${NC}"
        ;;
    
    restart-db)
        echo -e "${YELLOW}Restarting PostgreSQL...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose restart postgres"
        echo -e "${GREEN}PostgreSQL restarted${NC}"
        ;;
    
    restart-redis)
        echo -e "${YELLOW}Restarting Redis...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose restart redis"
        echo -e "${GREEN}Redis restarted${NC}"
        ;;
    
    restart-minio)
        echo -e "${YELLOW}Restarting MinIO...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose restart minio"
        echo -e "${GREEN}MinIO restarted${NC}"
        ;;
    
    stop)
        echo -e "${YELLOW}Stopping all services...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose down"
        echo -e "${GREEN}Services stopped${NC}"
        ;;
    
    start)
        echo -e "${YELLOW}Starting all services...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose up -d"
        echo -e "${GREEN}Services started${NC}"
        sleep 3
        ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_DIR} && docker-compose ps"
        ;;
    
    stats)
        echo -e "${BLUE}Resource Usage:${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "docker stats --no-stream"
        ;;
    
    backup-db)
        BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"
        echo -e "${YELLOW}Creating database backup: ${BACKUP_FILE}${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "docker exec innerv2core-postgres pg_dump -U postgres innerv2core" > "./backups/${BACKUP_FILE}"
        echo -e "${GREEN}Backup saved to: ./backups/${BACKUP_FILE}${NC}"
        ;;
    
    psql)
        echo -e "${BLUE}Connecting to PostgreSQL...${NC}"
        ssh -t ${SERVER_USER}@${SERVER_IP} "docker exec -it innerv2core-postgres psql -U postgres -d innerv2core"
        ;;
    
    redis-cli)
        echo -e "${BLUE}Connecting to Redis...${NC}"
        ssh -t ${SERVER_USER}@${SERVER_IP} "docker exec -it innerv2core-redis redis-cli -a 123456"
        ;;
    
    update)
        echo -e "${YELLOW}Updating services...${NC}"
        
        # Copy updated docker-compose.yml
        echo "Copying docker-compose.yml..."
        scp docker-compose.yml ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/
        
        # Pull new images and restart
        ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /opt/innerv2
docker-compose pull
docker-compose up -d
docker-compose ps
ENDSSH
        echo -e "${GREEN}Services updated${NC}"
        ;;
    
    *)
        echo -e "${RED}Unknown command: ${COMMAND}${NC}"
        show_usage
        exit 1
        ;;
esac
