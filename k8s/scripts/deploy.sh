#!/bin/bash

# KataCore Kubernetes Deployment Script
# Deploys the complete KataCore application to Kubernetes

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
DOMAIN=${DOMAIN:-"your-domain.com"}
NAMESPACE="katacore"
MONITORING_NAMESPACE="katacore-monitoring"

print_step "🚀 KataCore Kubernetes Deployment"
echo "=================================="
echo "Domain: $DOMAIN"
echo "Namespace: $NAMESPACE"
echo "Monitoring: $MONITORING_NAMESPACE"
echo "=================================="

# Check prerequisites
print_step "Checking prerequisites..."

if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster"
    exit 1
fi

print_success "Prerequisites check passed"

# Function to wait for deployment
wait_for_deployment() {
    local namespace=$1
    local deployment=$2
    local timeout=${3:-300}
    
    print_step "Waiting for $deployment in $namespace to be ready..."
    if kubectl wait --namespace=$namespace \
        --for=condition=available deployment/$deployment \
        --timeout=${timeout}s; then
        print_success "$deployment is ready"
    else
        print_warning "$deployment is taking longer than expected"
    fi
}

# Function to wait for pods
wait_for_pods() {
    local namespace=$1
    local selector=$2
    local timeout=${3:-300}
    
    print_step "Waiting for pods with selector $selector in $namespace..."
    if kubectl wait --namespace=$namespace \
        --for=condition=ready pod \
        --selector=$selector \
        --timeout=${timeout}s; then
        print_success "Pods are ready"
    else
        print_warning "Some pods are taking longer than expected"
    fi
}

# Create namespaces
print_step "Creating namespaces..."
kubectl apply -f ../namespace.yaml
print_success "Namespaces created"

# Create storage
print_step "Creating persistent volumes..."
kubectl apply -f ../storage/
print_success "Storage configured"

# Create secrets and configmaps
print_step "Creating secrets and configuration..."
kubectl apply -f ../secrets/
kubectl apply -f ../configmaps/

# Check if secrets need updating
if kubectl get secret katacore-secrets -n $NAMESPACE -o yaml | grep -q "CHANGE_THIS"; then
    print_warning "⚠️  Default secrets detected! Please update secrets before production deployment"
    echo "Edit the secrets with: kubectl edit secret katacore-secrets -n $NAMESPACE"
fi

print_success "Secrets and configuration applied"

# Deploy database
print_step "Deploying PostgreSQL..."
kubectl apply -f ../database/
wait_for_deployment $NAMESPACE postgres 180
print_success "PostgreSQL deployed"

# Deploy Redis cluster
print_step "Deploying Redis cluster..."
kubectl apply -f ../redis/
# Wait for StatefulSet to be ready
print_step "Waiting for Redis cluster to be ready..."
kubectl wait --namespace=$NAMESPACE \
    --for=condition=ready pod \
    --selector=app=redis-cluster \
    --timeout=300s
print_success "Redis cluster deployed"

# Initialize Redis cluster
print_step "Initializing Redis cluster..."
kubectl wait --namespace=$NAMESPACE \
    --for=condition=complete job/redis-cluster-init \
    --timeout=300s || print_warning "Redis cluster initialization may need manual intervention"

# Deploy MinIO
print_step "Deploying MinIO..."
kubectl apply -f ../minio/
wait_for_deployment $NAMESPACE minio 180

# Setup MinIO buckets
print_step "Setting up MinIO buckets..."
kubectl wait --namespace=$NAMESPACE \
    --for=condition=complete job/minio-setup \
    --timeout=300s || print_warning "MinIO setup may need manual intervention"
print_success "MinIO deployed"

# Deploy backend
print_step "Deploying backend services..."
kubectl apply -f ../backend/
wait_for_deployment $NAMESPACE backend 300
print_success "Backend deployed"

# Deploy frontend
print_step "Deploying frontend services..."
kubectl apply -f ../frontend/
wait_for_deployment $NAMESPACE frontend 300
print_success "Frontend deployed"

# Deploy monitoring
print_step "Deploying monitoring stack..."
kubectl apply -f ../monitoring/
wait_for_deployment $MONITORING_NAMESPACE prometheus 180
wait_for_deployment $MONITORING_NAMESPACE grafana 180
wait_for_deployment $MONITORING_NAMESPACE redis-exporter 120
wait_for_deployment $MONITORING_NAMESPACE postgres-exporter 120
print_success "Monitoring stack deployed"

# Deploy ingress
print_step "Deploying ingress configuration..."
kubectl apply -f ../ingress/
print_success "Ingress deployed"

# Wait a bit for everything to settle
print_step "Allowing services to stabilize..."
sleep 30

# Show deployment status
print_step "Checking deployment status..."

echo ""
echo "📊 Deployment Status:"
echo "===================="

# Check namespaces
echo ""
echo "Namespaces:"
kubectl get namespaces | grep -E "(katacore|ingress-nginx|cert-manager)"

# Check pods in main namespace
echo ""
echo "KataCore Pods:"
kubectl get pods -n $NAMESPACE -o wide

# Check monitoring pods
echo ""
echo "Monitoring Pods:"
kubectl get pods -n $MONITORING_NAMESPACE -o wide

# Check services
echo ""
echo "Services:"
kubectl get services -n $NAMESPACE
kubectl get services -n $MONITORING_NAMESPACE

# Check ingress
echo ""
echo "Ingress:"
kubectl get ingress -A

# Check persistent volumes
echo ""
echo "Persistent Volumes:"
kubectl get pv,pvc -A

# Show service URLs
echo ""
echo "🌐 Service URLs:"
echo "==============="

# Get external IP from ingress
EXTERNAL_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Pending")

if [ "$EXTERNAL_IP" != "Pending" ] && [ "$EXTERNAL_IP" != "" ]; then
    echo "External IP: $EXTERNAL_IP"
    echo ""
    echo "Once DNS is configured:"
    echo "Frontend:    https://app.$DOMAIN"
    echo "Backend:     https://api.$DOMAIN"
    echo "GraphQL:     https://api.$DOMAIN/graphql"
    echo "MinIO:       https://minio.$DOMAIN"
    echo "Grafana:     https://monitor.$DOMAIN"
    echo "Prometheus:  https://prometheus.$DOMAIN"
else
    echo "External IP: $EXTERNAL_IP (waiting for load balancer)"
    echo ""
    echo "Service IPs (internal):"
    kubectl get svc -n $NAMESPACE -o custom-columns=NAME:.metadata.name,TYPE:.spec.type,CLUSTER-IP:.spec.clusterIP,PORT:.spec.ports[0].port
fi

# Health check
print_step "Performing health checks..."

# Check if backend is responding
if kubectl exec -n $NAMESPACE deployment/backend -- curl -s http://localhost:4000/health >/dev/null 2>&1; then
    print_success "Backend health check passed"
else
    print_warning "Backend health check failed"
fi

# Check if frontend is responding
if kubectl exec -n $NAMESPACE deployment/frontend -- curl -s http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend health check passed"
else
    print_warning "Frontend health check failed"
fi

# Check if PostgreSQL is ready
if kubectl exec -n $NAMESPACE deployment/postgres -- pg_isready >/dev/null 2>&1; then
    print_success "PostgreSQL health check passed"
else
    print_warning "PostgreSQL health check failed"
fi

# Show logs for failed pods
echo ""
echo "🔍 Checking for failed pods..."
FAILED_PODS=$(kubectl get pods -A --field-selector=status.phase!=Running,status.phase!=Succeeded -o name 2>/dev/null || true)

if [ -n "$FAILED_PODS" ]; then
    print_warning "Some pods are not running:"
    kubectl get pods -A --field-selector=status.phase!=Running,status.phase!=Succeeded
    echo ""
    echo "To check logs: kubectl logs <pod-name> -n <namespace>"
else
    print_success "All pods are running successfully"
fi

# Show next steps
print_success "🎉 KataCore deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure DNS records to point to external IP: $EXTERNAL_IP"
echo "2. Wait for SSL certificates to be issued (may take a few minutes)"
echo "3. Update monitoring auth credentials"
echo "4. Set up backup procedures"
echo "5. Configure monitoring alerts"
echo ""
echo "📝 Useful Commands:"
echo "- Check pod status: kubectl get pods -A"
echo "- View logs: kubectl logs -f deployment/<name> -n katacore"
echo "- Access services: kubectl port-forward svc/<service> <port> -n katacore"
echo "- Update deployment: kubectl rollout restart deployment/<name> -n katacore"
echo "- Check certificates: kubectl get certificates -A"
echo ""
echo "🔧 Troubleshooting:"
echo "- Pod events: kubectl describe pod <pod-name> -n <namespace>"
echo "- Service endpoints: kubectl get endpoints -n katacore"
echo "- Ingress status: kubectl describe ingress -n katacore"
echo "- Certificate status: kubectl describe certificate -A"
echo ""
if [ "$DOMAIN" = "your-domain.com" ]; then
    print_warning "⚠️  Remember to update the domain configuration!"
    echo "   1. Replace 'your-domain.com' with your actual domain"
    echo "   2. Update ingress configuration: kubectl edit ingress -n katacore"
    echo "   3. Update ClusterIssuer email: kubectl edit clusterissuer letsencrypt-prod"
fi
