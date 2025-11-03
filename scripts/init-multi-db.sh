#!/bin/bash
set -e

# Create multiple databases for multi-domain deployment
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    -- Create rausach database
    CREATE DATABASE rausachcore;
    GRANT ALL PRIVILEGES ON DATABASE rausachcore TO postgres;
    
    -- Create tazagroup database
    CREATE DATABASE tazagroupcore;
    GRANT ALL PRIVILEGES ON DATABASE tazagroupcore TO postgres;
    
    -- Show created databases
    \l
EOSQL

echo "✅ Multi-domain databases created successfully!"
