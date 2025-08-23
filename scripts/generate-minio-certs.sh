#!/bin/bash

# Script to generate self-signed certificates for MinIO HTTPS

CERT_DIR="./docker/minio/certs"
mkdir -p "$CERT_DIR"

echo "🔐 Generating self-signed certificate for MinIO..."

# Generate private key
openssl genrsa -out "$CERT_DIR/private.key" 2048

# Generate certificate signing request
openssl req -new -key "$CERT_DIR/private.key" -out "$CERT_DIR/public.csr" \
  -subj "/C=US/ST=CA/L=SF/O=KataCore/CN=minio.local"

# Generate self-signed certificate
openssl x509 -req -days 365 -in "$CERT_DIR/public.csr" \
  -signkey "$CERT_DIR/private.key" -out "$CERT_DIR/public.crt" \
  -extensions v3_req -extfile <(cat <<EOF
[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = minio
DNS.2 = minio.local
DNS.3 = localhost
IP.1 = 127.0.0.1
IP.2 = 0.0.0.0
EOF
)

# Set proper permissions
chmod 600 "$CERT_DIR/private.key"
chmod 644 "$CERT_DIR/public.crt"

echo "✅ MinIO certificates generated successfully!"
echo "📁 Certificates location: $CERT_DIR"
echo "🔑 Private key: private.key"
echo "📜 Certificate: public.crt"

# Cleanup
rm "$CERT_DIR/public.csr"
