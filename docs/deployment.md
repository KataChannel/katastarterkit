# Deployment Guide - rausachcore

This guide covers deploying rausachcore to production using Kubernetes with comprehensive monitoring, security, and automation.

## Overview

rausachcore uses a modern Kubernetes-based deployment strategy with:
- **Container Orchestration**: k3s (lightweight Kubernetes)
- **Service Mesh**: NGINX Ingress Controller
- **SSL/TLS**: Automatic certificate management with cert-manager
- **Monitoring**: Prometheus + Grafana with custom dashboards
- **Security**: RBAC, network policies, and secrets management
- **CI/CD**: GitHub Actions for automated deployment

## Prerequisites

### Local Development
- **Bun.js** >= 1.0.0
- **Docker** >= 20.10.0
- **Docker Compose** >= 2.0.0

### Production Deployment
- **Ubuntu Server** 20.04+ (or compatible Linux distribution)
- **kubectl** >= 1.25.0
- **Domain name** with DNS control (for SSL certificates)
- **Minimum 4GB RAM, 2 CPU cores** (recommended: 8GB RAM, 4 CPU cores)

## Architecture Overview

```
Internet
    │
    ▼
NGINX Ingress Controller (SSL Termination)
    │
    ├─── Frontend (Next.js)
    ├─── Backend (NestJS + GraphQL)
    ├─── Grafana (Monitoring)
    └─── MinIO (Object Storage)
    
Data Layer:
├─── PostgreSQL (Primary Database)
├─── Redis Cluster (Caching)
└─── Persistent Volumes (Storage)

Monitoring:
├─── Prometheus (Metrics Collection)
├─── Grafana (Visualization)
├─── Node Exporter (System Metrics)
├─── Redis Exporter (Cache Metrics)
└─── PostgreSQL Exporter (Database Metrics)
```

## Deployment Options

### Option 1: Automated Cloud Server Setup (Recommended)

This is the fastest way to deploy rausachcore to a fresh Ubuntu server:

1. **Prepare your server**
   ```bash
   # On your Ubuntu server (as root)
   wget -O setup.sh https://raw.githubusercontent.com/rausachcore/rausachcore/main/k8s/scripts/setup-cloud-server.sh
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Clone and deploy**
   ```bash
   # Switch to the kata user created by the setup script
   su - kata
   
   # Clone the repository
   git clone https://github.com/rausachcore/rausachcore.git
   cd rausachcore
   
   # Deploy the application
   chmod +x k8s/scripts/deploy.sh
   ./k8s/scripts/deploy.sh
   ```

3. **Configure DNS**
   Point your domain(s) to your server's IP address:
   ```
   app.yourdomain.com    A    YOUR_SERVER_IP
   api.yourdomain.com    A    YOUR_SERVER_IP
   grafana.yourdomain.com A   YOUR_SERVER_IP
   minio.yourdomain.com  A    YOUR_SERVER_IP
   ```

### Option 2: Manual Deployment

If you prefer more control or have an existing Kubernetes cluster:

#### Step 1: Prepare Kubernetes Cluster

**Install k3s (if needed):**
```bash
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

**Install NGINX Ingress Controller:**
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

**Install cert-manager:**
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml
```

#### Step 2: Configure Secrets

**Update the secrets file:**
```bash
cp k8s/secrets/app-secrets.yaml.example k8s/secrets/app-secrets.yaml
```

Edit `k8s/secrets/app-secrets.yaml` and replace placeholders:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: rausachcore-secrets
  namespace: rausachcore
type: Opaque
stringData:
  # Database credentials
  DATABASE_URL: "postgresql://rausachcore:YOUR_DB_PASSWORD@postgres:5432/rausachcore_prod"
  POSTGRES_USER: "rausachcore"
  POSTGRES_PASSWORD: "YOUR_DB_PASSWORD"
  POSTGRES_DB: "rausachcore_prod"
  
  # JWT secrets
  JWT_SECRET: "YOUR_JWT_SECRET_KEY"
  JWT_REFRESH_SECRET: "YOUR_JWT_REFRESH_SECRET"
  
  # Redis configuration
  REDIS_PASSWORD: "YOUR_REDIS_PASSWORD"
  
  # MinIO credentials
  MINIO_ROOT_USER: "admin"
  MINIO_ROOT_PASSWORD: "YOUR_MINIO_PASSWORD"
  
  # NextAuth configuration
  NEXTAUTH_SECRET: "YOUR_NEXTAUTH_SECRET"
  NEXTAUTH_URL: "https://app.yourdomain.com"
  
  # External URLs
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: "https://api.yourdomain.com/graphql"
  NEXT_PUBLIC_APP_URL: "https://app.yourdomain.com"
```

#### Step 3: Update Domain Configuration

Edit `k8s/ingress/ingress.yaml` and replace `yourdomain.com` with your actual domain:
```yaml
spec:
  tls:
  - hosts:
    - app.yourdomain.com      # Replace with your domain
    - api.yourdomain.com      # Replace with your domain
    - grafana.yourdomain.com  # Replace with your domain
    - minio.yourdomain.com    # Replace with your domain
    secretName: rausachcore-tls
  rules:
  - host: app.yourdomain.com      # Replace with your domain
  # ... etc
```

#### Step 4: Deploy to Kubernetes

```bash
# Create namespaces
kubectl apply -f k8s/namespace.yaml

# Deploy configuration and secrets
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/

# Deploy storage
kubectl apply -f k8s/storage/

# Deploy database and cache
kubectl apply -f k8s/database/
kubectl apply -f k8s/redis/

# Wait for database to be ready
kubectl wait --for=condition=available deployment/postgres --namespace=rausachcore --timeout=300s

# Deploy application services
kubectl apply -f k8s/minio/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# Deploy monitoring
kubectl apply -f k8s/monitoring/

# Deploy ingress
kubectl apply -f k8s/ingress/

# Check deployment status
kubectl get all -n rausachcore
kubectl get all -n rausachcore-monitoring
```

## Post-Deployment Configuration

### 1. Verify Deployment

```bash
# Check pod status
kubectl get pods -n rausachcore
kubectl get pods -n rausachcore-monitoring

# Check services
kubectl get svc -n rausachcore

# Check ingress
kubectl get ingress -n rausachcore

# View logs
kubectl logs -f deployment/backend -n rausachcore
kubectl logs -f deployment/frontend -n rausachcore
```

### 2. Access Applications

Once deployed and DNS is configured:

- **Frontend**: https://app.yourdomain.com
- **Backend GraphQL**: https://api.yourdomain.com/graphql
- **Monitoring Dashboard**: https://grafana.yourdomain.com
  - Username: `admin`
  - Password: `admin123` (change after first login)
- **Object Storage**: https://minio.yourdomain.com
  - Access Key: As configured in secrets
  - Secret Key: As configured in secrets

### 3. SSL Certificate Verification

```bash
# Check certificate status
kubectl get certificaterequests -n rausachcore
kubectl get certificates -n rausachcore

# If certificates are not ready, check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager
```

### 4. Monitoring Setup

The monitoring stack includes:

- **Prometheus**: Metrics collection
- **Grafana**: Visualization with pre-configured dashboards
- **Node Exporter**: System metrics
- **Redis Exporter**: Cache performance metrics
- **PostgreSQL Exporter**: Database performance metrics

Access Grafana at `https://grafana.yourdomain.com` to view:
- Application performance metrics
- System resource usage
- Database performance
- Custom rausachcore dashboard

## Security Configuration

### 1. Update Default Passwords

**Grafana Admin Password:**
```bash
kubectl exec -it deployment/grafana -n rausachcore-monitoring -- grafana-cli admin reset-admin-password NEW_PASSWORD
```

**Database Password:**
Update the secret and restart the deployment:
```bash
kubectl patch secret rausachcore-secrets -n rausachcore -p '{"stringData":{"POSTGRES_PASSWORD":"NEW_PASSWORD"}}'
kubectl rollout restart deployment/postgres -n rausachcore
```

### 2. Network Security

The deployment includes:
- Network policies for service isolation
- RBAC for service accounts
- Security contexts for containers
- Resource limits for all pods

### 3. SSL/TLS Configuration

SSL certificates are automatically managed by cert-manager with Let's Encrypt. The configuration includes:
- Automatic certificate renewal
- HTTPS redirect for all traffic
- Security headers (HSTS, etc.)
- Strong cipher suites

## Backup and Recovery

### Database Backup

**Manual Backup:**
```bash
kubectl exec deployment/postgres -n rausachcore -- pg_dump -U rausachcore rausachcore_prod > backup-$(date +%Y%m%d).sql
```

**Automated Backup (recommended):**
```bash
# Add to crontab
0 2 * * * kubectl exec deployment/postgres -n rausachcore -- pg_dump -U rausachcore rausachcore_prod > /backups/rausachcore-$(date +%Y%m%d).sql
```

### Application Data Backup

```bash
# Backup persistent volumes
kubectl get pv
kubectl get pvc -n rausachcore

# MinIO data backup
kubectl exec deployment/minio -n rausachcore -- mc mirror /data /backup-location
```

## Scaling and Performance

### Horizontal Scaling

**Scale application pods:**
```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n rausachcore

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n rausachcore
```

**Scale Redis cluster:**
The Redis cluster is configured with 6 nodes (3 masters + 3 replicas) for high availability.

### Vertical Scaling

Update resource limits in the deployment manifests:
```yaml
resources:
  limits:
    memory: "1Gi"
    cpu: "500m"
  requests:
    memory: "512Mi"
    cpu: "250m"
```

### Performance Monitoring

Monitor performance through Grafana dashboards:
- Response time metrics
- Throughput metrics
- Error rate monitoring
- Resource utilization

## Troubleshooting

### Common Issues

**1. Pods not starting:**
```bash
kubectl describe pod POD_NAME -n rausachcore
kubectl logs POD_NAME -n rausachcore
```

**2. SSL certificates not working:**
```bash
kubectl describe certificaterequest -n rausachcore
kubectl logs -n cert-manager deployment/cert-manager
```

**3. Database connection issues:**
```bash
kubectl exec -it deployment/postgres -n rausachcore -- psql -U rausachcore -d rausachcore_prod
```

**4. Application not accessible:**
```bash
kubectl get ingress -n rausachcore
kubectl describe ingress rausachcore-ingress -n rausachcore
```

### Health Checks

**Application Health:**
```bash
kubectl exec -n rausachcore deployment/backend -- curl http://localhost:4000/health
kubectl exec -n rausachcore deployment/frontend -- curl http://localhost:3000
```

**Database Health:**
```bash
kubectl exec -n rausachcore deployment/postgres -- pg_isready -U rausachcore
```

**Redis Health:**
```bash
kubectl exec -n rausachcore deployment/redis-master -- redis-cli ping
```

## Maintenance

### Updates and Upgrades

**1. Application Updates:**
```bash
# Update image tags in manifests
sed -i 's|rausachcore/backend:latest|rausachcore/backend:v1.1.0|g' k8s/backend/backend.yaml
sed -i 's|rausachcore/frontend:latest|rausachcore/frontend:v1.1.0|g' k8s/frontend/frontend.yaml

# Apply updates
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# Monitor rollout
kubectl rollout status deployment/backend -n rausachcore
kubectl rollout status deployment/frontend -n rausachcore
```

**2. Database Migrations:**
```bash
kubectl exec -it deployment/backend -n rausachcore -- bun run prisma:migrate
```

**3. System Updates:**
```bash
# Update k3s
curl -sfL https://get.k3s.io | sh -

# Update ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

### Monitoring and Alerting

Set up alerts in Grafana for:
- High response times
- Error rates above threshold
- Resource utilization
- SSL certificate expiry
- Database performance issues

## Support and Documentation

- **GitHub Issues**: [Report issues](https://github.com/rausachcore/rausachcore/issues)
- **Documentation**: [Full docs](https://github.com/rausachcore/rausachcore/docs)
- **Security**: [security@rausachcore.dev](mailto:security@rausachcore.dev)

For additional help with deployment, monitoring, or scaling, please refer to the project documentation or open an issue on GitHub.
