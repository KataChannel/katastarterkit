#!/bin/bash
# PostgreSQL initialization script for low-memory optimization

set -e

echo "Optimizing PostgreSQL for low-memory environment..."

# Create additional optimization configuration
cat >> /var/lib/postgresql/data/postgresql.conf <<EOF

# Low Memory Optimization Settings
shared_buffers = 64MB
effective_cache_size = 128MB
work_mem = 4MB
maintenance_work_mem = 32MB
max_connections = 30
checkpoint_completion_target = 0.9

# Reduce WAL size
min_wal_size = 80MB
max_wal_size = 256MB

# Disable unnecessary logging
log_statement = 'none'
log_duration = off

# Autovacuum optimization
autovacuum_max_workers = 2
autovacuum_naptime = 1min

EOF

echo "PostgreSQL optimization completed"
