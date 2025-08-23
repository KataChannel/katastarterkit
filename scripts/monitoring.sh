#!/bin/bash

# Monitoring Stack Management Script for KataCore
# Phase 5: Prometheus & Grafana Monitoring

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Configuration
MONITORING_COMPOSE="docker-compose.monitoring.yml"
MAIN_COMPOSE="docker-compose.yml"

# Check if docker-compose is available
check_compose() {
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
}

# Start monitoring stack
start_monitoring() {
    print_step "Starting monitoring stack..."
    
    if [ ! -f "$MONITORING_COMPOSE" ]; then
        print_error "Monitoring configuration not found: $MONITORING_COMPOSE"
        exit 1
    fi
    
    # Start Prometheus
    print_step "Starting Prometheus..."
    $COMPOSE_CMD -f $MAIN_COMPOSE -f $MONITORING_COMPOSE up -d prometheus
    
    # Wait for Prometheus
    sleep 5
    
    # Start exporters
    print_step "Starting exporters..."
    $COMPOSE_CMD -f $MAIN_COMPOSE -f $MONITORING_COMPOSE up -d \
        node-exporter redis-exporter postgres-exporter
    
    # Start Grafana
    print_step "Starting Grafana..."
    $COMPOSE_CMD -f $MAIN_COMPOSE -f $MONITORING_COMPOSE up -d grafana
    
    # Wait for services to be ready
    print_step "Waiting for services to be ready..."
    sleep 10
    
    print_success "Monitoring stack started successfully"
}

# Stop monitoring stack
stop_monitoring() {
    print_step "Stopping monitoring stack..."
    
    if [ -f "$MONITORING_COMPOSE" ]; then
        $COMPOSE_CMD -f $MAIN_COMPOSE -f $MONITORING_COMPOSE down \
            prometheus grafana node-exporter redis-exporter postgres-exporter
        print_success "Monitoring stack stopped"
    else
        print_warning "Monitoring configuration not found"
    fi
}

# Check monitoring status
status_monitoring() {
    print_step "Checking monitoring services status..."
    
    services=("prometheus" "grafana" "node-exporter" "redis-exporter" "postgres-exporter")
    running_services=0
    
    for service in "${services[@]}"; do
        if docker ps --filter "name=$service" | grep -q "$service"; then
            status=$(docker ps --filter "name=$service" --format "{{.Status}}")
            print_success "$service: $status"
            ((running_services++))
        else
            print_error "$service: Not running"
        fi
    done
    
    echo ""
    echo "Running services: $running_services/${#services[@]}"
    
    if [ $running_services -eq ${#services[@]} ]; then
        print_success "All monitoring services are running"
        show_urls
    fi
}

# Show service URLs
show_urls() {
    echo ""
    echo "🌐 Monitoring URLs:"
    echo "=================="
    echo "Grafana:     http://localhost:3001 (admin/admin)"
    echo "Prometheus:  http://localhost:9090"
    echo ""
    echo "📊 Metrics Endpoints:"
    echo "===================="
    echo "Node Exporter:       http://localhost:9100/metrics"
    echo "Redis Exporter:      http://localhost:9121/metrics"
    echo "PostgreSQL Exporter: http://localhost:9187/metrics"
    echo "Backend Metrics:     http://localhost:14000/metrics"
}

# Setup Grafana dashboards
setup_dashboards() {
    print_step "Setting up Grafana dashboards..."
    
    # Check if Grafana is running
    if ! docker ps --filter "name=grafana" | grep -q "grafana"; then
        print_error "Grafana is not running. Please start monitoring stack first."
        exit 1
    fi
    
    # Wait for Grafana to be fully ready
    print_step "Waiting for Grafana to be ready..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:3001/api/health &> /dev/null; then
            break
        fi
        sleep 2
        ((timeout-=2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Grafana is not responding"
        exit 1
    fi
    
    # Add Prometheus data source
    print_step "Adding Prometheus data source..."
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Prometheus",
            "type": "prometheus",
            "url": "http://prometheus:9090",
            "access": "proxy",
            "isDefault": true
        }' \
        http://admin:admin@localhost:3001/api/datasources &> /dev/null || print_warning "Data source may already exist"
    
    print_success "Grafana setup complete"
}

# Import dashboard from Grafana.com
import_dashboard() {
    local dashboard_id=$1
    local dashboard_name=$2
    
    if [ -z "$dashboard_id" ]; then
        print_error "Usage: import_dashboard <dashboard_id> [name]"
        return 1
    fi
    
    print_step "Importing dashboard $dashboard_id..."
    
    # Download dashboard JSON
    dashboard_json=$(curl -s "https://grafana.com/api/dashboards/$dashboard_id/revisions/1/download")
    
    # Import to Grafana
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"dashboard\": $dashboard_json,
            \"overwrite\": true,
            \"inputs\": [{
                \"name\": \"DS_PROMETHEUS\",
                \"type\": \"datasource\",
                \"pluginId\": \"prometheus\",
                \"value\": \"Prometheus\"
            }]
        }" \
        http://admin:admin@localhost:3001/api/dashboards/import &> /dev/null
    
    print_success "Dashboard imported: ${dashboard_name:-$dashboard_id}"
}

# Setup recommended dashboards
setup_recommended_dashboards() {
    print_step "Setting up recommended dashboards..."
    
    # Node Exporter Full
    import_dashboard "1860" "Node Exporter Full"
    
    # Redis Dashboard
    import_dashboard "763" "Redis Dashboard"
    
    # PostgreSQL Database
    import_dashboard "9628" "PostgreSQL Database"
    
    # Docker Container & Host Metrics
    import_dashboard "179" "Docker Container & Host Metrics"
    
    print_success "Recommended dashboards imported"
}

# Test metrics collection
test_metrics() {
    print_step "Testing metrics collection..."
    
    # Test Prometheus
    if curl -s http://localhost:9090/-/ready | grep -q "Prometheus is Ready"; then
        print_success "Prometheus is ready"
    else
        print_error "Prometheus is not ready"
        return 1
    fi
    
    # Test exporters
    exporters=("9100" "9121" "9187")
    exporter_names=("Node Exporter" "Redis Exporter" "PostgreSQL Exporter")
    
    for i in "${!exporters[@]}"; do
        port=${exporters[$i]}
        name=${exporter_names[$i]}
        
        if curl -s "http://localhost:$port/metrics" | head -1 | grep -q "#"; then
            print_success "$name is working"
        else
            print_warning "$name is not responding"
        fi
    done
    
    # Test if targets are up in Prometheus
    print_step "Checking Prometheus targets..."
    targets_response=$(curl -s "http://localhost:9090/api/v1/targets")
    
    if echo "$targets_response" | grep -q '"health":"up"'; then
        print_success "Some targets are up in Prometheus"
    else
        print_warning "No targets are up in Prometheus"
    fi
}

# Show logs for monitoring services
logs_monitoring() {
    local service=${1:-""}
    
    if [ -n "$service" ]; then
        print_step "Showing logs for $service..."
        $COMPOSE_CMD -f $MAIN_COMPOSE -f $MONITORING_COMPOSE logs -f $service
    else
        print_step "Showing logs for all monitoring services..."
        $COMPOSE_CMD -f $MAIN_COMPOSE -f $MONITORING_COMPOSE logs -f \
            prometheus grafana node-exporter redis-exporter postgres-exporter
    fi
}

# Monitor metrics in real-time
monitor_metrics() {
    print_step "Starting real-time metrics monitor..."
    
    while true; do
        clear
        echo "📊 KataCore Metrics Monitor (Press Ctrl+C to exit)"
        echo "================================================="
        echo
        echo "Last updated: $(date)"
        echo
        
        # System metrics
        if docker ps --filter "name=node-exporter" | grep -q "node-exporter"; then
            echo "🖥️  System Metrics:"
            cpu_usage=$(curl -s "http://localhost:9090/api/v1/query?query=100-(avg(irate(node_cpu_seconds_total{mode=\"idle\"}[5m]))*100)" | grep -o '"value":\[[^]]*\]' | grep -o '[0-9.]*' | tail -1)
            memory_usage=$(curl -s "http://localhost:9090/api/v1/query?query=(1-(node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes))*100" | grep -o '"value":\[[^]]*\]' | grep -o '[0-9.]*' | tail -1)
            
            echo "  CPU Usage: ${cpu_usage:-N/A}%"
            echo "  Memory Usage: ${memory_usage:-N/A}%"
        fi
        
        echo
        # Service status
        echo "🔗 Service Status:"
        for service in prometheus grafana node-exporter redis-exporter postgres-exporter; do
            if docker ps --filter "name=$service" | grep -q "$service"; then
                print_success "$service: Running"
            else
                print_error "$service: Not running"
            fi
        done
        
        echo
        echo "🌐 Access URLs:"
        echo "  Grafana:    http://localhost:3001"
        echo "  Prometheus: http://localhost:9090"
        
        sleep 5
    done
}

# Backup monitoring configuration
backup_monitoring() {
    print_step "Backing up monitoring configuration..."
    
    backup_dir="backups/monitoring-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup Grafana data
    if docker ps --filter "name=grafana" | grep -q "grafana"; then
        docker exec grafana tar czf - /var/lib/grafana > "$backup_dir/grafana-data.tar.gz"
        print_success "Grafana data backed up"
    fi
    
    # Backup Prometheus data
    if docker ps --filter "name=prometheus" | grep -q "prometheus"; then
        docker exec prometheus tar czf - /prometheus > "$backup_dir/prometheus-data.tar.gz"
        print_success "Prometheus data backed up"
    fi
    
    # Backup configuration files
    cp docker/prometheus/*.yml "$backup_dir/" 2>/dev/null || true
    cp docker/grafana/provisioning/dashboards/*.json "$backup_dir/" 2>/dev/null || true
    
    print_success "Monitoring backup created: $backup_dir"
}

# Show help
show_help() {
    echo "Monitoring Stack Management Script"
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  start       - Start the monitoring stack"
    echo "  stop        - Stop the monitoring stack"
    echo "  status      - Check monitoring services status"
    echo "  setup       - Setup Grafana dashboards"
    echo "  dashboards  - Import recommended dashboards"
    echo "  test        - Test metrics collection"
    echo "  monitor     - Real-time metrics monitoring"
    echo "  logs        - Show monitoring logs"
    echo "  backup      - Backup monitoring configuration"
    echo "  help        - Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 setup"
    echo "  $0 logs grafana"
}

# Main execution
main() {
    check_compose
    
    case ${1:-""} in
        "start")
            start_monitoring
            ;;
        "stop")
            stop_monitoring
            ;;
        "status")
            status_monitoring
            ;;
        "setup")
            setup_dashboards
            ;;
        "dashboards")
            setup_dashboards
            setup_recommended_dashboards
            ;;
        "test")
            test_metrics
            ;;
        "monitor")
            monitor_metrics
            ;;
        "logs")
            logs_monitoring $2
            ;;
        "backup")
            backup_monitoring
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Handle cleanup on exit
cleanup() {
    echo ""
    print_warning "Interrupted"
    exit 1
}

trap cleanup INT TERM

# Run main function
main $@
