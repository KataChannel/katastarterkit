# 🚀 KataCore - Modern Fullstack Starter Kit

![KataCore](https://img.shields.io/badge/KataCore-Starter%20Kit-blue)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.1.6-red)](https://nestjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.1.12-38B2AC)](https://tailwindcss.com/)

A modern, production-ready fullstack starter kit built with the latest technologies. Get your project up and running in minutes with best practices, modern tooling, and comprehensive features out of the box.

## ✨ Features

### 🎯 **Frontend (Next.js 15 + React 19)**
- ⚡ **Next.js 15** with App Router
- ⚛️ **React 19** with latest features
- 🎨 **TailwindCSS v4** with latest improvements
- 📱 **Responsive Design** with mobile-first approach
- 🔒 **NextAuth.js** authentication
- 📊 **Apollo Client** for GraphQL
- 🧪 **Comprehensive Testing** (Jest + Cypress)

### 🏗️ **Backend (NestJS + GraphQL)**
- 🚀 **NestJS 11** with modern architecture
- 🔗 **GraphQL API** with Apollo Server
- 🗄️ **Prisma ORM** with PostgreSQL
- 🔐 **JWT Authentication** & authorization
- ⚡ **Redis** for caching and sessions
- 📦 **File Upload** with MinIO
- 🛡️ **Security** best practices
- 📈 **Health Checks** and monitoring

### 🛠️ **Developer Experience**
- 🏃‍♂️ **Bun.js** for ultra-fast package management
- 🐳 **Docker** containerization
- � **TypeScript** throughout the stack
- 📝 **ESLint** and **Prettier** configured
- 🧪 **Testing** setup for both frontend and backend
- 📚 **Comprehensive documentation**

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/katacore/katacore.git
   cd katacore
   ```

2. **Start development environment**
## 🏗️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | Next.js | 15.5.0 | React framework |
| **Frontend** | React | 19.1.1 | UI library |
| **Frontend** | TailwindCSS | 4.1.12 | CSS framework |
| **Backend** | NestJS | 11.1.6 | Node.js framework |
| **Database** | PostgreSQL | 16+ | Primary database |
| **Cache** | Redis | 7+ | Caching and sessions |
| **Storage** | MinIO | Latest | Object storage |
| **ORM** | Prisma | 6+ | Database toolkit |
| **API** | GraphQL | 16+ | Query language |
| **Runtime** | Bun.js | 1.0+ | JavaScript runtime |
| **Container** | Docker | 20+ | Containerization |

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/KataChannel/katastarterkit.git
cd katastarterkit
```

### 2. Install Dependencies

```bash
# Install root dependencies
bun install

# Install backend dependencies
cd backend && bun install

# Install frontend dependencies
cd ../frontend && bun install && cd ..
```

### 3. Setup Environment

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local

# Edit environment variables as needed
nano .env
```

### 4. Start Infrastructure

```bash
# Start PostgreSQL, Redis, and MinIO
docker-compose up -d

# Wait for services to be ready
sleep 10
```

### 5. Setup Database

```bash
# Generate Prisma client
cd backend && bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# Seed the database (optional)
bunx prisma db seed
```

### 6. Start Development Servers

```bash
# Start both frontend and backend
bun run dev

# Or start them separately:
# bun run dev:backend  # http://localhost:14000
# bun run dev:frontend # http://localhost:13000
```

### 7. Access Your Application

- **Frontend**: http://localhost:13000
- **Backend API**: http://localhost:14000
- **GraphQL Playground**: http://localhost:14000/graphql
- **MinIO Console**: http://localhost:9001

## 📁 Project Structure

```
katacore/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   └── pages/           # Pages router (optional)
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── graphql/         # GraphQL resolvers
│   │   ├── prisma/          # Database service
│   │   └── main.ts          # Application entry
│   ├── prisma/              # Database schema
│   └── package.json
├── docker/                   # Docker configurations
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
├── docker-compose.yml        # Development services
└── package.json             # Root workspace
```

## 🛠️ Available Scripts

### Root Commands
```bash
bun run dev          # Start both frontend and backend
bun run build        # Build both applications
bun run test         # Run all tests
bun run lint         # Lint all code
bun run format       # Format all code
bun run clean        # Clean dependencies
```

### Backend Commands
```bash
cd backend
bun run dev          # Start development server
bun run build        # Build for production
bun run test         # Run tests
bun run db:migrate   # Run database migrations
bun run db:seed      # Seed database
bun run db:studio    # Open Prisma Studio
```

### Frontend Commands
```bash
cd frontend
bun run dev          # Start development server
bun run build        # Build for production
bun run test         # Run tests
bun run test:e2e     # Run E2E tests
bun run storybook    # Start Storybook
```

## 🔧 Configuration

### Environment Variables

The starter kit uses environment variables for configuration. Key variables include:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key

# MinIO
MINIO_ENDPOINT=localhost
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Frontend
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:14000/graphql
NEXTAUTH_SECRET=your-nextauth-secret
```

### Database Schema

The project includes a complete database schema with:
- User management
- Authentication tables
- File upload tracking
- Audit logs

Customize the schema in `backend/prisma/schema.prisma`.

## 🧪 Testing

### Backend Testing
```bash
cd backend
bun test              # Unit tests
bun run test:e2e      # E2E tests
bun run test:cov      # Coverage report
```

### Frontend Testing
```bash
cd frontend
bun test              # Unit tests with Jest
bun run test:e2e      # E2E tests with Cypress
```

## 🚀 Production Deployment

### Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Build applications: `bun run build`
2. Setup production database
3. Configure environment variables
4. Deploy to your hosting platform

## 📚 Documentation

- [**Getting Started**](docs/getting-started.md) - Detailed setup guide
- [**Frontend Guide**](docs/frontend-setup.md) - Frontend development
- [**Backend Guide**](docs/backend-setup.md) - Backend development
- [**API Documentation**](docs/api.md) - GraphQL API reference
- [**Deployment Guide**](docs/deployment.md) - Production deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

## 🔗 Links

- [GitHub Repository](https://github.com/KataChannel/katastarterkit)
- [Issue Tracker](https://github.com/KataChannel/katastarterkit/issues)
- [Discussions](https://github.com/KataChannel/katastarterkit/discussions)

---

**Happy coding! 🎉**

> **KataCore** - Build faster, ship smarter.
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
