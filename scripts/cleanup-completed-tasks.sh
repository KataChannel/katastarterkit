#!/bin/bash

# Script to clean up COMPLETED_TASKS blocks from database

echo "🗑️  Cleaning up COMPLETED_TASKS blocks..."

# Delete blocks with COMPLETED_TASKS type
docker exec -i katacore-postgres psql -U postgres -d katacore <<-EOSQL
    -- Delete all PageBlocks with type COMPLETED_TASKS
    DELETE FROM "PageBlock" WHERE type = 'COMPLETED_TASKS';
    
    -- Show remaining block types
    SELECT DISTINCT type, COUNT(*) as count 
    FROM "PageBlock" 
    GROUP BY type 
    ORDER BY type;
EOSQL

echo "✅ Cleanup complete!"
echo "📊 Run Prisma migration next to update enum"
