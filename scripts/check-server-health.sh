#!/bin/bash

# ==============================================================================
# Server Health Check Script
# Purpose: Monitor server health and resource usage
# ==============================================================================

set -e

SERVER="root@116.118.48.208"
PROJECT_DIR="/root/innerv2"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_info "═══════════════════════════════════════════════════════"
log_info "Server Health Check - $(date)"
log_info "Server: 116.118.48.208"
log_info "═══════════════════════════════════════════════════════"

# 1. System Resources
log_info ""
log_info "1. System Resources:"
log_info "   Memory Usage:"
ssh $SERVER "free -h | grep -E 'Mem|Swap'"

MEMORY_USAGE=$(ssh $SERVER "free | grep Mem | awk '{printf \"%.0f\", \$3/\$2 * 100}'")
if [ "$MEMORY_USAGE" -gt 90 ]; then
    log_error "   Memory usage: ${MEMORY_USAGE}% (Critical!)"
elif [ "$MEMORY_USAGE" -gt 80 ]; then
    log_warning "   Memory usage: ${MEMORY_USAGE}% (High)"
else
    log_success "   Memory usage: ${MEMORY_USAGE}% (OK)"
fi

log_info ""
log_info "   Disk Usage:"
ssh $SERVER "df -h / | grep -v Filesystem"

DISK_USAGE=$(ssh $SERVER "df / | grep / | awk '{print \$5}' | sed 's/%//'")
if [ "$DISK_USAGE" -gt 90 ]; then
    log_error "   Disk usage: ${DISK_USAGE}% (Critical!)"
elif [ "$DISK_USAGE" -gt 80 ]; then
    log_warning "   Disk usage: ${DISK_USAGE}% (High)"
else
    log_success "   Disk usage: ${DISK_USAGE}% (OK)"
fi

# 2. Docker Containers
log_info ""
log_info "2. Docker Containers:"
CONTAINER_STATUS=$(ssh $SERVER "cd $PROJECT_DIR && docker compose ps --format json 2>/dev/null" || echo "[]")

if [ "$CONTAINER_STATUS" != "[]" ]; then
    ssh $SERVER "cd $PROJECT_DIR && docker compose ps" | while IFS= read -r line; do
        if echo "$line" | grep -q "Up"; then
            log_success "   $line"
        elif echo "$line" | grep -q "Exited"; then
            log_error "   $line"
        else
            log_info "   $line"
        fi
    done
else
    log_warning "   No containers running or docker-compose not found"
fi

# 3. Container Memory Usage
log_info ""
log_info "3. Container Memory Usage:"
ssh $SERVER "docker stats --no-stream --format 'table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}' 2>/dev/null" || log_warning "   Unable to get stats"

# 4. Service Health Checks
log_info ""
log_info "4. Service Health Checks:"

# Backend
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://api.innerbright.vn/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ __schema { queryType { name } } }"}' 2>/dev/null || echo "000")

if [ "$BACKEND_RESPONSE" = "200" ]; then
    log_success "   Backend API: Healthy (HTTP $BACKEND_RESPONSE)"
else
    log_error "   Backend API: Unhealthy (HTTP $BACKEND_RESPONSE)"
fi

# Frontend
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://innerbright.vn 2>/dev/null || echo "000")

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    log_success "   Frontend: Healthy (HTTP $FRONTEND_RESPONSE)"
else
    log_error "   Frontend: Unhealthy (HTTP $FRONTEND_RESPONSE)"
fi

# 5. SSL Certificates
log_info ""
log_info "5. SSL Certificate Status:"
CERT_EXPIRY=$(ssh $SERVER "certbot certificates 2>/dev/null | grep 'Expiry Date' | head -1" || echo "Unknown")
if [ "$CERT_EXPIRY" != "Unknown" ]; then
    log_success "   $CERT_EXPIRY"
else
    log_warning "   Unable to check certificate expiry"
fi

# 6. Recent Logs (errors)
log_info ""
log_info "6. Recent Errors (last 10 lines):"
ERROR_COUNT=$(ssh $SERVER "cd $PROJECT_DIR && docker compose logs --tail 100 2>/dev/null | grep -i error | wc -l" || echo "0")

if [ "$ERROR_COUNT" -gt 0 ]; then
    log_warning "   Found $ERROR_COUNT error(s) in recent logs"
    ssh $SERVER "cd $PROJECT_DIR && docker compose logs --tail 100 2>/dev/null | grep -i error | tail -10" || true
else
    log_success "   No recent errors found"
fi

# 7. Nginx Status
log_info ""
log_info "7. Nginx Status:"
NGINX_STATUS=$(ssh $SERVER "systemctl is-active nginx" 2>/dev/null || echo "unknown")

if [ "$NGINX_STATUS" = "active" ]; then
    log_success "   Nginx: Running"
else
    log_error "   Nginx: Not running ($NGINX_STATUS)"
fi

# 8. Network Connectivity
log_info ""
log_info "8. Network Connectivity:"

# Check DNS
if host innerbright.vn > /dev/null 2>&1; then
    IP=$(host innerbright.vn | grep "has address" | awk '{print $4}' | head -1)
    log_success "   DNS innerbright.vn → $IP"
else
    log_error "   DNS innerbright.vn resolution failed"
fi

if host api.innerbright.vn > /dev/null 2>&1; then
    IP=$(host api.innerbright.vn | grep "has address" | awk '{print $4}' | head -1)
    log_success "   DNS api.innerbright.vn → $IP"
else
    log_error "   DNS api.innerbright.vn resolution failed"
fi

# Summary
log_info ""
log_info "═══════════════════════════════════════════════════════"
log_info "Health Check Summary:"

HEALTH_SCORE=0
MAX_SCORE=8

# Calculate health score
[ "$MEMORY_USAGE" -lt 85 ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))
[ "$DISK_USAGE" -lt 85 ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))
[ "$CONTAINER_STATUS" != "[]" ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))
[ "$BACKEND_RESPONSE" = "200" ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))
[ "$FRONTEND_RESPONSE" = "200" ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))
[ "$CERT_EXPIRY" != "Unknown" ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))
[ "$ERROR_COUNT" -lt 5 ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))
[ "$NGINX_STATUS" = "active" ] && HEALTH_SCORE=$((HEALTH_SCORE + 1))

HEALTH_PERCENT=$((HEALTH_SCORE * 100 / MAX_SCORE))

if [ "$HEALTH_PERCENT" -ge 80 ]; then
    log_success "Overall Health: ${HEALTH_PERCENT}% (${HEALTH_SCORE}/${MAX_SCORE}) - Healthy"
elif [ "$HEALTH_PERCENT" -ge 60 ]; then
    log_warning "Overall Health: ${HEALTH_PERCENT}% (${HEALTH_SCORE}/${MAX_SCORE}) - Warning"
else
    log_error "Overall Health: ${HEALTH_PERCENT}% (${HEALTH_SCORE}/${MAX_SCORE}) - Critical"
fi

log_info "═══════════════════════════════════════════════════════"

# Exit with error code if health is critical
if [ "$HEALTH_PERCENT" -lt 60 ]; then
    exit 1
fi

exit 0
