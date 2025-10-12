#!/bin/bash

# Script to update BlockType enum in database by recreating it

echo "🔄 Updating BlockType enum..."

docker exec -i katacore-postgres psql -U postgres -d katacore <<-EOSQL
    -- Start transaction
    BEGIN;

    -- Create new enum without COMPLETED_TASKS
    CREATE TYPE "BlockType_new" AS ENUM (
        'TEXT',
        'IMAGE',
        'HERO',
        'GALLERY',
        'VIDEO',
        'BUTTON',
        'DIVIDER',
        'SPACER',
        'COLUMN',
        'ROW',
        'CARD',
        'TESTIMONIAL',
        'FAQ',
        'CONTACT_FORM',
        'TEAM',
        'STATS',
        'CONTACT_INFO',
        'CONTAINER',
        'SECTION',
        'GRID',
        'FLEX_ROW',
        'FLEX_COLUMN',
        'DYNAMIC'
    );

    -- Update PageBlock table to use new enum
    ALTER TABLE "PageBlock" 
    ALTER COLUMN type TYPE "BlockType_new" 
    USING type::text::"BlockType_new";

    -- Drop old enum
    DROP TYPE "BlockType";

    -- Rename new enum to original name
    ALTER TYPE "BlockType_new" RENAME TO "BlockType";

    -- Commit transaction
    COMMIT;

    SELECT 'BlockType enum updated successfully!' as status;
EOSQL

echo "✅ BlockType enum updated!"
