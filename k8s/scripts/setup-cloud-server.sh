#!/bin/bash

# KataCore Cloud Server Setup Script for Kubernetes Deployment
# This script sets up a fresh Ubuntu server for hosting KataCore

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

# Configuration (edit these values)
DOMAIN="your-domain.com"
EMAIL="admin@your-domain.com"
TIMEZONE="UTC"

print_step "🚀 KataCore Cloud Server Setup"
echo "================================"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "Timezone: $TIMEZONE"
echo "================================"

# Update system
print_step "Updating system packages..."
apt update && apt upgrade -y
print_success "System packages updated"

# Install essential packages
print_step "Installing essential packages..."
apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    certbot \
    nginx
print_success "Essential packages installed"

# Configure timezone
print_step "Setting timezone to $TIMEZONE..."
timedatectl set-timezone $TIMEZONE
print_success "Timezone set to $TIMEZONE"

# Configure firewall
print_step "Configuring firewall (UFW)..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# SSH
ufw allow ssh
ufw allow 22/tcp

# HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Kubernetes API
ufw allow 6443/tcp

# Application ports (for development/debugging)
ufw allow 5432/tcp comment "PostgreSQL"
ufw allow 6379/tcp comment "Redis"
ufw allow 9000/tcp comment "MinIO API"
ufw allow 9001/tcp comment "MinIO Console"
ufw allow 9090/tcp comment "Prometheus"
ufw allow 3000/tcp comment "Grafana"

# Kubernetes cluster communication
ufw allow 10250/tcp comment "Kubelet API"
ufw allow 30000:32767/tcp comment "NodePort Services"

# Enable firewall
ufw --force enable
print_success "Firewall configured and enabled"

# Configure fail2ban
print_step "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 1800

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

systemctl enable fail2ban
systemctl restart fail2ban
print_success "Fail2ban configured"

# Install Docker
print_step "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (if not root)
if [ "$USER" != "root" ]; then
    usermod -aG docker $USER
fi

systemctl enable docker
systemctl start docker
print_success "Docker installed and started"

# Install Bun.js
print_step "Installing Bun.js..."
curl -fsSL https://bun.sh/install | bash
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> /etc/profile
export PATH="$HOME/.bun/bin:$PATH"
print_success "Bun.js installed"

# Install kubectl
print_step "Installing kubectl..."
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/kubernetes-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | tee /etc/apt/sources.list.d/kubernetes.list
apt update
apt install -y kubectl
print_success "kubectl installed"

# Install k3s (lightweight Kubernetes)
print_step "Installing k3s..."
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik --disable servicelb" sh -
mkdir -p /root/.kube
cp /etc/rancher/k3s/k3s.yaml /root/.kube/config
chmod 600 /root/.kube/config

# Make kubectl work for non-root users
if [ "$USER" != "root" ]; then
    mkdir -p /home/$USER/.kube
    cp /etc/rancher/k3s/k3s.yaml /home/$USER/.kube/config
    chown $USER:$USER /home/$USER/.kube/config
    chmod 600 /home/$USER/.kube/config
fi

print_success "k3s installed and configured"

# Install Helm
print_step "Installing Helm..."
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | tee /etc/apt/sources.list.d/helm-stable-debian.list
apt update
apt install -y helm
print_success "Helm installed"

# Install NGINX Ingress Controller
print_step "Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for NGINX controller to be ready
print_step "Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s
print_success "NGINX Ingress Controller installed"

# Install cert-manager
print_step "Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for cert-manager to be ready
print_step "Waiting for cert-manager to be ready..."
kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=cert-manager \
  --timeout=300s
print_success "cert-manager installed"

# Create storage directories
print_step "Creating storage directories..."
mkdir -p /var/lib/katacore/{postgres,minio,redis/{node-1,node-2,node-3},prometheus,grafana}
chmod -R 755 /var/lib/katacore
print_success "Storage directories created"

# Configure Nginx (standalone, for health checks)
print_step "Configuring Nginx..."
cat > /etc/nginx/sites-available/default << EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    location / {
        return 200 'KataCore Server Ready\\n';
        add_header Content-Type text/plain;
    }
    
    location /health {
        return 200 'OK\\n';
        add_header Content-Type text/plain;
    }
}
EOF

systemctl enable nginx
systemctl restart nginx
print_success "Nginx configured"

# Create swap file (if not exists and less than 2GB RAM)
RAM_GB=$(free -g | awk '/^Mem:/{print $2}')
if [ $RAM_GB -lt 2 ] && [ ! -f /swapfile ]; then
    print_step "Creating swap file (server has less than 2GB RAM)..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    print_success "Swap file created"
fi

# Set up log rotation
print_step "Setting up log rotation..."
cat > /etc/logrotate.d/katacore << 'EOF'
/var/log/katacore/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 root root
    sharedscripts
    postrotate
        systemctl reload rsyslog > /dev/null 2>&1 || true
    endscript
}
EOF
print_success "Log rotation configured"

# Create KataCore deployment user
print_step "Creating deployment user..."
useradd -m -s /bin/bash katacore || true
usermod -aG docker katacore
mkdir -p /home/katacore/.kube
cp /etc/rancher/k3s/k3s.yaml /home/katacore/.kube/config
chown -R katacore:katacore /home/katacore/.kube
chmod 600 /home/katacore/.kube/config

# Add to sudoers for deployment commands
echo "katacore ALL=(ALL) NOPASSWD: /usr/local/bin/kubectl, /usr/bin/docker, /bin/systemctl" >> /etc/sudoers
print_success "Deployment user created"

# Show system information
print_step "System Information:"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "CPU: $(nproc) cores"
echo "RAM: $(free -h | awk '/^Mem:/ {print $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $4}') available"
echo "Docker: $(docker --version)"
echo "kubectl: $(kubectl version --client --short)"
echo "k3s: $(k3s --version | head -1)"
echo "Helm: $(helm version --short)"

# Show next steps
print_success "🎉 Cloud server setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update DNS records to point your domain to this server IP"
echo "2. Edit the Kubernetes manifests with your domain name"
echo "3. Update secrets with strong passwords"
echo "4. Deploy KataCore: kubectl apply -f k8s/"
echo "5. Check status: kubectl get pods -A"
echo ""
echo "🔗 Server IP: $(curl -s ifconfig.me || curl -s icanhazip.com)"
echo "🌐 Test URL: http://$(curl -s ifconfig.me || curl -s icanhazip.com)"
echo ""
echo "📝 Important Files:"
echo "- Kubernetes config: /etc/rancher/k3s/k3s.yaml"
echo "- Storage directory: /var/lib/katacore/"
echo "- Nginx config: /etc/nginx/sites-available/default"
echo "- Firewall status: ufw status"
echo ""
print_warning "⚠️  Don't forget to:"
echo "- Update domain DNS records"
echo "- Change default passwords in secrets"
echo "- Configure SSL certificates"
echo "- Set up monitoring alerts"
