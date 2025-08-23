# KataCore - Complete Fullstack Project

![KataCore Logo](https://img.shields.io/badge/KataCore-Production%20Ready-green)
[![Build Status](https://github.com/katacore/katacore/workflows/CI%2FCD/badge.svg)](https://github.com/katacore/katacore/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

KataCore is a production-ready, full-stack web application built with modern technologies including NestJS, Next.js, GraphQL, and Kubernetes. This project demonstrates best practices for enterprise-level application development with comprehensive monitoring, security, and deployment automation.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    KataCore Architecture                         │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js + TailwindCSS)                              │
│  ├── React 18 with Server Components                           │
│  ├── TailwindCSS for styling                                   │
│  ├── TypeScript for type safety                                │
│  └── Bun.js runtime for performance                            │
├─────────────────────────────────────────────────────────────────┤
│  Backend (NestJS + GraphQL)                                    │
│  ├── GraphQL API with Apollo Server                            │
│  ├── JWT Authentication & Authorization                        │
│  ├── Prisma ORM for database operations                        │
│  └── Bun.js runtime for performance                            │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                     │
│  ├── PostgreSQL (Primary Database)                             │
│  ├── Redis Cluster (Caching & Sessions)                        │
│  └── MinIO (Object Storage)                                    │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure (Kubernetes)                                   │
│  ├── k3s Kubernetes Distribution                               │
│  ├── NGINX Ingress Controller                                  │
│  ├── cert-manager for SSL/TLS                                  │
│  └── Prometheus + Grafana monitoring                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Bun.js** >= 1.0.0
- **Docker** >= 20.10.0
- **Docker Compose** >= 2.0.0
- **kubectl** >= 1.25.0 (for Kubernetes deployment)
- **Git** >= 2.30.0

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/katacore/katacore.git
   cd katacore
   ```

2. **Start development environment**
   ```bash
   # Start all services with Docker Compose
   docker-compose up -d
   
   # Install dependencies
   make install
   
   # Setup database
   make db-setup
   
   # Start development servers
   make dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend GraphQL Playground: http://localhost:4000/graphql
   - Database Admin: http://localhost:5555

### Production Deployment

## 📁 Project Structure

```
katacore/
├── backend/                    # NestJS GraphQL API
│   ├── src/
│   │   ├── app.module.ts      # Main application module
│   │   ├── main.ts            # Application entry point
│   │   ├── config/            # Configuration management
│   │   └── prisma/            # Database configuration
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   └── package.json
├── frontend/                   # Next.js React application
│   ├── src/
│   │   ├── app/               # Next.js 13+ app directory
│   │   ├── components/        # Reusable UI components
│   │   └── lib/               # Utility libraries
│   ├── tailwind.config.js     # TailwindCSS configuration
│   └── package.json
├── k8s/                       # Kubernetes manifests
│   ├── namespace.yaml         # Kubernetes namespaces
│   ├── configmaps/           # Application configuration
│   ├── secrets/              # Sensitive data management
│   ├── storage/              # Persistent volume claims
│   ├── database/             # PostgreSQL deployment
│   ├── redis/                # Redis cluster setup
│   ├── minio/                # Object storage service
│   ├── backend/              # Backend service deployment
│   ├── frontend/             # Frontend service deployment
│   ├── monitoring/           # Prometheus & Grafana
│   ├── ingress/              # Load balancer & SSL
│   └── scripts/              # Deployment automation
├── docker/                    # Docker configurations
├── docs/                      # Documentation
├── scripts/                   # Utility scripts
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml         # Local development setup
├── Makefile                   # Common commands
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS 3.x
- **Language**: TypeScript 5.x
- **Runtime**: Bun.js for improved performance
- **State Management**: React Query + Zustand
- **Authentication**: NextAuth.js

### Backend
- **Framework**: NestJS 10.x
- **API**: GraphQL with Apollo Server
- **Language**: TypeScript 5.x
- **Runtime**: Bun.js for improved performance
- **Database ORM**: Prisma 5.x
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator + class-transformer

### Database & Storage
- **Primary Database**: PostgreSQL 15
- **Caching**: Redis 7.x Cluster
- **Object Storage**: MinIO (S3-compatible)
- **Search**: Elasticsearch 8.x (planned)

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (k3s)
- **Ingress**: NGINX Ingress Controller
- **SSL/TLS**: cert-manager with Let's Encrypt
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions
- **Service Mesh**: Istio (planned)

## � Development Commands

### Using Makefile (Recommended)

```bash
# Install all dependencies
make install

# Start development environment
make dev

# Run tests
make test

# Build for production
make build

# Deploy to staging
make deploy-staging

# Deploy to production
make deploy-production

# Database operations
make db-reset      # Reset database
make db-migrate    # Run migrations
make db-seed       # Seed database

# Monitoring
make logs          # View application logs
make monitor       # Open monitoring dashboard
```

### Manual Commands

#### Backend Development
```bash
cd backend

# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun run test
bun run test:e2e

# Database operations
bun run prisma:migrate
bun run prisma:generate
bun run prisma:seed

# Build for production
bun run build
```

#### Frontend Development
```bash
cd frontend

# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun run test

# Build for production
bun run build

# Start production server
bun run start
```

## 🔒 Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Input validation with class-validator
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: Content Security Policy (CSP) headers
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Rate Limiting**: API rate limiting with Redis
- **SSL/TLS**: Automatic HTTPS with Let's Encrypt
- **Secrets Management**: Kubernetes secrets for sensitive data
- **Network Policies**: Kubernetes network isolation

## 📊 Monitoring & Observability

### Metrics & Monitoring
- **Application Metrics**: Custom Prometheus metrics
- **System Metrics**: Node Exporter for system monitoring
- **Database Metrics**: PostgreSQL Exporter
- **Cache Metrics**: Redis Exporter
- **Custom Dashboards**: Grafana dashboards for visualization

### Logging
- **Structured Logging**: JSON-formatted logs with Winston
- **Log Aggregation**: Centralized logging with Kubernetes
- **Log Levels**: Configurable log levels per environment
- **Request Tracking**: Correlation IDs for request tracing

### Health Checks
- **Application Health**: Custom health check endpoints
- **Database Health**: Connection and query performance monitoring
- **Cache Health**: Redis cluster status monitoring
- **Infrastructure Health**: Kubernetes resource monitoring

## � Deployment

### Development Deployment
```bash
# Start local development environment
docker-compose up -d

# Initialize database
make db-setup

# Start development servers
make dev
```

### Staging Deployment
```bash
# Deploy to staging Kubernetes cluster
make deploy-staging

# Check deployment status
kubectl get pods -n katacore-staging

# View logs
kubectl logs -f deployment/backend -n katacore-staging
```

### Production Deployment
```bash
# Deploy to production Kubernetes cluster
make deploy-production

# Monitor deployment
kubectl rollout status deployment/backend -n katacore
kubectl rollout status deployment/frontend -n katacore

# Verify deployment
make verify-production
```

### Cloud Server Setup
```bash
# Setup cloud server (Ubuntu 20.04+)
chmod +x k8s/scripts/setup-cloud-server.sh
./k8s/scripts/setup-cloud-server.sh

# Deploy application
chmod +x k8s/scripts/deploy.sh
./k8s/scripts/deploy.sh
```

## 📚 API Documentation

### GraphQL API
- **Endpoint**: `/graphql`
- **Playground**: Available in development at `/graphql`
- **Schema**: Auto-generated from TypeScript definitions
- **Documentation**: Introspective schema with descriptions

### REST Endpoints
- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics` (Prometheus format)
- **OpenAPI**: `GET /api/docs` (Swagger UI)

### Authentication
```graphql
# Login mutation
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    refreshToken
    user {
      id
      email
      role
    }
  }
}

# Protected query example
query GetUserProfile {
  me {
    id
    email
    profile {
      firstName
      lastName
      avatar
    }
  }
}
```

## 🧪 Testing

### Backend Testing
- **Unit Tests**: Jest with comprehensive coverage
- **Integration Tests**: Database and API integration testing
- **E2E Tests**: GraphQL endpoint testing
- **Load Testing**: Performance testing with Artillery

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Isolated component testing
- **E2E Tests**: Playwright for full application testing
- **Visual Tests**: Screenshot comparison testing

### Test Commands
```bash
# Run all tests
make test

# Backend tests only
make test-backend

# Frontend tests only
make test-frontend

# E2E tests
make test-e2e

# Test coverage
make test-coverage
```

## � CI/CD Pipeline

### GitHub Actions Workflows

1. **Continuous Integration** (`.github/workflows/ci-cd.yml`)
   - Code linting and formatting
   - Unit and integration tests
   - Security vulnerability scanning
   - Docker image building and pushing

2. **Monitoring** (`.github/workflows/monitoring.yml`)
   - Infrastructure health checks
   - Performance metrics collection
   - SSL certificate monitoring
   - Automated alerting

3. **Dependency Updates** (`.github/workflows/dependency-updates.yml`)
   - Automated dependency updates
   - Security audit scanning
   - Pull request creation for updates

4. **Release Management** (`.github/workflows/release.yml`)
   - Automated release creation
   - Changelog generation
   - Production deployment
   - Release notifications

### Deployment Pipeline
```
Code Push → Tests → Build → Security Scan → Deploy Staging → Tests → Deploy Production → Monitor
```

## 🛡️ Security & Best Practices

### Code Quality
- **ESLint**: Strict linting rules for code consistency
- **Prettier**: Code formatting automation
- **Husky**: Git hooks for pre-commit validation
- **TypeScript**: Strict type checking
- **SonarQube**: Code quality analysis

### Security Scanning
- **Trivy**: Container vulnerability scanning
- **npm audit**: Dependency vulnerability scanning
- **SAST**: Static Application Security Testing
- **Dependabot**: Automated security updates

### Performance Optimization
- **Bun.js Runtime**: Improved JavaScript performance
- **Code Splitting**: Optimized bundle loading
- **Image Optimization**: Next.js image optimization
- **Caching Strategy**: Multi-layer caching with Redis
- **CDN Integration**: Static asset optimization

## 📖 Documentation

- [Backend Setup Guide](docs/backend-setup.md)
- [Frontend Setup Guide](docs/frontend-setup.md)
- [Deployment Guide](docs/deployment.md)
- [API Documentation](docs/api.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct
This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS Team** for the excellent backend framework
- **Next.js Team** for the powerful React framework
- **Prisma Team** for the outstanding database toolkit
- **Bun Team** for the fast JavaScript runtime
- **Kubernetes Community** for container orchestration
- **Open Source Community** for inspiration and tools

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/katacore/katacore/issues)
- **Discussions**: [GitHub Discussions](https://github.com/katacore/katacore/discussions)
- **Security**: [security@katacore.dev](mailto:security@katacore.dev)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=katacore/katacore&type=Date)](https://star-history.com/#katacore/katacore&Date)

---

<div align="center">
  <strong>Built with ❤️ by the KataCore Team</strong>
  <br>
  <sub>Making fullstack development accessible and scalable</sub>
</div>
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by best practices from the developer community
- Optimized for developer experience and production performance

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/KataChannel/katastarterkit/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/KataChannel/katastarterkit/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/KataChannel/katastarterkit/discussions)

---

**Happy coding! 🎉**

> **Timonacore** - Build faster, ship smarter.

⭐ **If you find this project helpful, please give it a star on GitHub!**
