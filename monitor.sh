#!/bin/bash
# System Monitoring Script for Low-Memory Server
# Usage: ./monitor.sh [--interval SECONDS]

INTERVAL=${1:-5}
LOG_FILE="monitor_$(date +%Y%m%d).log"

echo "🔍 InnerV2 System Monitor"
echo "========================="
echo "Interval: ${INTERVAL}s | Log: $LOG_FILE"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo "[$(date +'%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1" | tee -a "$LOG_FILE"
}

check_memory() {
    TOTAL=$(free -m | awk '/^Mem:/{print $2}')
    USED=$(free -m | awk '/^Mem:/{print $3}')
    FREE=$(free -m | awk '/^Mem:/{print $7}')
    PERCENT=$((USED * 100 / TOTAL))
    
    echo -n "Memory: ${USED}/${TOTAL}MB (${PERCENT}%) | Free: ${FREE}MB "
    
    if [ $PERCENT -gt 90 ]; then
        error "CRITICAL"
    elif [ $PERCENT -gt 80 ]; then
        warn "HIGH"
    else
        success "OK"
    fi
}

check_disk() {
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    DISK_AVAIL=$(df -h / | awk 'NR==2 {print $4}')
    
    echo -n "Disk: ${DISK_USAGE}% used | Available: ${DISK_AVAIL} "
    
    if [ $DISK_USAGE -gt 90 ]; then
        error "CRITICAL"
    elif [ $DISK_USAGE -gt 80 ]; then
        warn "HIGH"
    else
        success "OK"
    fi
}

check_cpu() {
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    echo -n "CPU: ${CPU_USAGE}% "
    
    LOAD=$(echo $CPU_USAGE | awk '{print int($1)}')
    if [ $LOAD -gt 90 ]; then
        error "HIGH"
    elif [ $LOAD -gt 70 ]; then
        warn "ELEVATED"
    else
        success "OK"
    fi
}

check_containers() {
    CONTAINERS=("innerv2-postgres" "innerv2-redis" "innerv2-minio" "innerv2-backend" "innerv2-frontend")
    
    for container in "${CONTAINERS[@]}"; do
        if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            STATUS=$(docker inspect --format='{{.State.Status}}' $container)
            HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo "none")
            
            echo -n "$container: "
            
            if [ "$STATUS" = "running" ]; then
                if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "none" ]; then
                    success "$STATUS"
                elif [ "$HEALTH" = "unhealthy" ]; then
                    error "UNHEALTHY"
                else
                    warn "$HEALTH"
                fi
            else
                error "$STATUS"
            fi
        else
            error "$container: NOT FOUND"
        fi
    done
}

check_endpoints() {
    # Backend health
    if curl -sf http://localhost:14001/health > /dev/null 2>&1; then
        success "Backend: UP"
    else
        error "Backend: DOWN"
    fi
    
    # Frontend health
    if curl -sf http://localhost:14000/api/health > /dev/null 2>&1; then
        success "Frontend: UP"
    else
        error "Frontend: DOWN"
    fi
    
    # GraphQL endpoint
    if curl -sf http://localhost:14001/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}' > /dev/null 2>&1; then
        success "GraphQL: UP"
    else
        error "GraphQL: DOWN"
    fi
}

show_docker_stats() {
    echo ""
    echo "Container Stats:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" 2>/dev/null || echo "No containers running"
}

# Main monitoring loop
clear
while true; do
    clear
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  InnerV2 System Monitor - $(date +'%Y-%m-%d %H:%M:%S')            ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    
    check_memory
    check_disk
    check_cpu
    echo ""
    
    echo "Container Status:"
    check_containers
    echo ""
    
    echo "Endpoint Health:"
    check_endpoints
    
    show_docker_stats
    
    echo ""
    echo "Press Ctrl+C to stop | Refresh: ${INTERVAL}s"
    
    sleep $INTERVAL
done
