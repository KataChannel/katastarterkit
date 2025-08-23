# KataCore Kubernetes Manifests

This directory contains Kubernetes deployment manifests for the KataCore fullstack application.

## Structure

```
k8s/
├── namespace.yaml          # Namespace definition
├── configmaps/            # Configuration files
├── secrets/               # Secret configurations
├── storage/               # Persistent volumes
├── database/              # PostgreSQL deployment
├── redis/                 # Redis cluster
├── minio/                 # MinIO object storage
├── backend/               # NestJS backend
├── frontend/              # Next.js frontend
├── monitoring/            # Prometheus & Grafana
├── ingress/               # Nginx ingress configuration
└── scripts/               # Deployment scripts
```

## Prerequisites

- Kubernetes cluster (k3s recommended for cloud server)
- kubectl configured
- Docker registry access
- Domain name configured

## Quick Deploy

```bash
# Deploy entire application
kubectl apply -f k8s/

# Or deploy in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/storage/
kubectl apply -f k8s/database/
kubectl apply -f k8s/redis/
kubectl apply -f k8s/minio/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/monitoring/
kubectl apply -f k8s/ingress/
```

## Services

- **Frontend**: Next.js application with Bun.js runtime
- **Backend**: NestJS GraphQL API with Bun.js runtime
- **Database**: PostgreSQL with persistent storage
- **Cache**: Redis cluster (3 masters + 3 replicas)
- **Storage**: MinIO with HTTPS support
- **Monitoring**: Prometheus & Grafana stack
- **Ingress**: Nginx with Let's Encrypt SSL
