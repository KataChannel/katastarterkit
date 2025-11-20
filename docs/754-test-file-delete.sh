#!/bin/bash

# File Manager GraphQL Delete Test
# This script tests the deleteFile mutation fix

echo "================================================"
echo "Testing File Manager GraphQL Delete Operations"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="${BACKEND_URL:-http://localhost:12001}"
GRAPHQL_URL="${BACKEND_URL}/graphql"

echo "Backend URL: ${GRAPHQL_URL}"
echo ""

# Check if backend is running
echo "1. Checking backend status..."
if curl -s "${BACKEND_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Please start the backend first: cd backend && bun run dev"
    exit 1
fi
echo ""

# Check GraphQL introspection for deleteFile mutation
echo "2. Checking GraphQL schema for deleteFile mutation..."
INTROSPECTION_QUERY='{"query":"{ __type(name: \"Mutation\") { fields { name args { name type { name kind ofType { name kind } } } } } }"}'

RESPONSE=$(curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d "${INTROSPECTION_QUERY}")

# Check if deleteFile exists with correct signature
if echo "$RESPONSE" | grep -q '"name":"deleteFile"'; then
    echo -e "${GREEN}✓ deleteFile mutation found${NC}"
    
    # Extract deleteFile details
    DELETE_FILE_ARGS=$(echo "$RESPONSE" | jq '.data.__type.fields[] | select(.name=="deleteFile") | .args')
    echo "  Arguments: ${DELETE_FILE_ARGS}"
    
    # Check if it has exactly one 'id' argument
    if echo "$DELETE_FILE_ARGS" | jq -e '. | length == 1 and .[0].name == "id"' > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Correct signature: deleteFile(id: ID!)${NC}"
    else
        echo -e "${RED}✗ Incorrect signature - expected deleteFile(id: ID!)${NC}"
    fi
else
    echo -e "${RED}✗ deleteFile mutation not found${NC}"
fi
echo ""

# Check for deleteProjectFile mutation (should exist)
echo "3. Checking for deleteProjectFile mutation (project files)..."
if echo "$RESPONSE" | grep -q '"name":"deleteProjectFile"'; then
    echo -e "${GREEN}✓ deleteProjectFile mutation found${NC}"
    
    # Extract deleteProjectFile details
    DELETE_PROJECT_FILE_ARGS=$(echo "$RESPONSE" | jq '.data.__type.fields[] | select(.name=="deleteProjectFile") | .args')
    echo "  Arguments: ${DELETE_PROJECT_FILE_ARGS}"
    
    # Check if it has the correct 'fileId' and 'type' arguments
    if echo "$DELETE_PROJECT_FILE_ARGS" | grep -q '"name":"fileId"' && echo "$DELETE_PROJECT_FILE_ARGS" | grep -q '"name":"type"'; then
        echo -e "${GREEN}✓ Correct signature: deleteProjectFile(fileId: ID!, type: String!)${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: Unexpected signature${NC}"
    fi
else
    echo -e "${YELLOW}⚠ deleteProjectFile mutation not found (might be OK)${NC}"
fi
echo ""

# Check for bulkDeleteFiles mutation
echo "4. Checking for bulkDeleteFiles mutation..."
if echo "$RESPONSE" | grep -q '"name":"bulkDeleteFiles"'; then
    echo -e "${GREEN}✓ bulkDeleteFiles mutation found${NC}"
    
    # Extract bulkDeleteFiles details
    BULK_DELETE_ARGS=$(echo "$RESPONSE" | jq '.data.__type.fields[] | select(.name=="bulkDeleteFiles") | .args')
    echo "  Arguments: ${BULK_DELETE_ARGS}"
else
    echo -e "${RED}✗ bulkDeleteFiles mutation not found${NC}"
fi
echo ""

# Summary
echo "================================================"
echo "Test Summary"
echo "================================================"
echo ""
echo "Expected GraphQL Mutations:"
echo "  1. deleteFile(id: ID!): Boolean"
echo "     → For File Manager single file delete"
echo ""
echo "  2. bulkDeleteFiles(input: BulkDeleteFilesInput!): Int"
echo "     → For File Manager bulk delete"
echo ""
echo "  3. deleteProjectFile(fileId: ID!, type: String!): Boolean"
echo "     → For Project/Task file attachments"
echo ""

echo "If all checks passed, the GraphQL schema is correct!"
echo ""
echo "To test in the UI:"
echo "  1. Go to http://localhost:12000/admin/filemanager"
echo "  2. Upload some files"
echo "  3. Try single delete (dropdown menu)"
echo "  4. Try bulk delete (select multiple, click 'Xóa (N)' button)"
echo ""
