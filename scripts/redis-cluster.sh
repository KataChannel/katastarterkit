#!/bin/bash

# Redis Cluster Management Script for KataCore
# Phase 5: High-Availability Redis Cluster

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
CLUSTER_COMPOSE="docker-compose.redis-cluster.yml"
CLUSTER_NODES=(
    "redis-cluster-1:6379"
    "redis-cluster-2:6379" 
    "redis-cluster-3:6379"
    "redis-cluster-4:6379"
    "redis-cluster-5:6379"
    "redis-cluster-6:6379"
)

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

# Start Redis cluster
start_cluster() {
    print_step "Starting Redis cluster..."
    
    if [ ! -f "$CLUSTER_COMPOSE" ]; then
        print_error "Redis cluster configuration not found: $CLUSTER_COMPOSE"
        exit 1
    fi
    
    # Start all Redis nodes
    $COMPOSE_CMD -f $CLUSTER_COMPOSE up -d
    
    # Wait for nodes to start
    print_step "Waiting for Redis nodes to start..."
    sleep 10
    
    # Create the cluster
    print_step "Creating Redis cluster..."
    $COMPOSE_CMD -f $CLUSTER_COMPOSE up redis-cluster-creator
    
    print_success "Redis cluster started successfully"
}

# Stop Redis cluster
stop_cluster() {
    print_step "Stopping Redis cluster..."
    
    if [ -f "$CLUSTER_COMPOSE" ]; then
        $COMPOSE_CMD -f $CLUSTER_COMPOSE down
        print_success "Redis cluster stopped"
    else
        print_warning "Redis cluster configuration not found"
    fi
}

# Check cluster status
status_cluster() {
    print_step "Checking Redis cluster status..."
    
    # Check if cluster nodes are running
    running_nodes=0
    for i in {1..6}; do
        if docker ps --filter "name=redis-cluster-$i" | grep -q "redis-cluster-$i"; then
            ((running_nodes++))
        fi
    done
    
    echo "Running nodes: $running_nodes/6"
    
    if [ $running_nodes -eq 6 ]; then
        print_success "All Redis cluster nodes are running"
        
        # Check cluster health
        print_step "Checking cluster health..."
        if docker exec redis-cluster-1 redis-cli cluster info 2>/dev/null | grep -q "cluster_state:ok"; then
            print_success "Redis cluster is healthy"
            
            # Show cluster info
            echo ""
            echo "🔗 Cluster Information:"
            docker exec redis-cluster-1 redis-cli cluster nodes 2>/dev/null | while read line; do
                node_id=$(echo $line | cut -d' ' -f1 | cut -c1-8)
                node_ip=$(echo $line | cut -d' ' -f2)
                node_role=$(echo $line | cut -d' ' -f3)
                echo "  Node $node_id: $node_ip ($node_role)"
            done
        else
            print_warning "Redis cluster is not healthy"
        fi
    else
        print_warning "Not all Redis cluster nodes are running"
    fi
}

# Reset cluster (warning: destroys data)
reset_cluster() {
    print_warning "This will destroy all data in the Redis cluster!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Resetting Redis cluster..."
        
        # Stop cluster
        stop_cluster
        
        # Remove volumes
        docker volume rm $(docker volume ls -q | grep redis-cluster) 2>/dev/null || true
        
        # Restart cluster
        start_cluster
        
        print_success "Redis cluster reset complete"
    else
        print_step "Reset cancelled"
    fi
}

# Scale cluster (add/remove nodes)
scale_cluster() {
    local action=$1
    local node_id=$2
    
    case $action in
        "add")
            print_step "Adding node to cluster..."
            # This would require additional configuration
            print_warning "Scale up not implemented yet"
            ;;
        "remove")
            print_step "Removing node from cluster..."
            # This would require resharding
            print_warning "Scale down not implemented yet"
            ;;
        *)
            print_error "Invalid scale action. Use 'add' or 'remove'"
            ;;
    esac
}

# Test cluster performance
test_cluster() {
    print_step "Testing Redis cluster performance..."
    
    if ! docker ps --filter "name=redis-cluster-1" | grep -q "redis-cluster-1"; then
        print_error "Redis cluster is not running"
        exit 1
    fi
    
    # Test write/read operations
    print_step "Running performance test..."
    
    echo "Writing test data..."
    docker exec redis-cluster-1 redis-cli -c set test:key1 "value1" > /dev/null
    docker exec redis-cluster-1 redis-cli -c set test:key2 "value2" > /dev/null
    docker exec redis-cluster-1 redis-cli -c set test:key3 "value3" > /dev/null
    
    echo "Reading test data..."
    val1=$(docker exec redis-cluster-1 redis-cli -c get test:key1)
    val2=$(docker exec redis-cluster-1 redis-cli -c get test:key2)
    val3=$(docker exec redis-cluster-1 redis-cli -c get test:key3)
    
    if [ "$val1" = "value1" ] && [ "$val2" = "value2" ] && [ "$val3" = "value3" ]; then
        print_success "Cluster read/write test passed"
    else
        print_error "Cluster read/write test failed"
    fi
    
    # Run benchmark
    print_step "Running Redis benchmark..."
    docker exec redis-cluster-1 redis-cli --cluster call redis-cluster-1:6379 ping | head -5
    
    print_success "Performance test complete"
}

# Show cluster logs
logs_cluster() {
    local service=${1:-""}
    
    if [ -n "$service" ]; then
        print_step "Showing logs for $service..."
        $COMPOSE_CMD -f $CLUSTER_COMPOSE logs -f $service
    else
        print_step "Showing logs for all cluster nodes..."
        $COMPOSE_CMD -f $CLUSTER_COMPOSE logs -f
    fi
}

# Monitor cluster
monitor_cluster() {
    print_step "Starting Redis cluster monitor..."
    
    while true; do
        clear
        echo "🔄 Redis Cluster Monitor (Press Ctrl+C to exit)"
        echo "================================================"
        echo
        
        # Show timestamp
        echo "Last updated: $(date)"
        echo
        
        # Show cluster status
        status_cluster
        
        echo
        echo "🔗 Cluster Nodes:"
        for i in {1..6}; do
            if docker ps --filter "name=redis-cluster-$i" --format "table {{.Names}}\t{{.Status}}" | grep -q "redis-cluster-$i"; then
                status=$(docker ps --filter "name=redis-cluster-$i" --format "{{.Status}}")
                print_success "redis-cluster-$i: $status"
            else
                print_error "redis-cluster-$i: Not running"
            fi
        done
        
        echo
        echo "📊 Memory Usage:"
        for i in {1..6}; do
            if docker ps --filter "name=redis-cluster-$i" | grep -q "redis-cluster-$i"; then
                memory=$(docker exec redis-cluster-$i redis-cli info memory 2>/dev/null | grep used_memory_human | cut -d: -f2 | tr -d '\r')
                echo "  Node $i: $memory"
            fi
        done
        
        sleep 5
    done
}

# Show help
show_help() {
    echo "Redis Cluster Management Script"
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  start     - Start the Redis cluster"
    echo "  stop      - Stop the Redis cluster" 
    echo "  status    - Check cluster status and health"
    echo "  reset     - Reset cluster (destroys data)"
    echo "  test      - Test cluster performance"
    echo "  monitor   - Real-time cluster monitoring"
    echo "  logs      - Show cluster logs"
    echo "  help      - Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 status"
    echo "  $0 logs redis-cluster-1"
}

# Main execution
main() {
    check_compose
    
    case ${1:-""} in
        "start")
            start_cluster
            ;;
        "stop")
            stop_cluster
            ;;
        "status")
            status_cluster
            ;;
        "reset")
            reset_cluster
            ;;
        "test")
            test_cluster
            ;;
        "monitor")
            monitor_cluster
            ;;
        "logs")
            logs_cluster $2
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
