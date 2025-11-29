#!/bin/bash

echo "🧪 Testing GraphQL Filter..."
echo ""

# Test with filter
echo "📝 Test 1: Filter with IMAGE type + categoryId + userId"
curl -s -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetSourceDocuments($filter: SourceDocumentFilterInput, $page: Int, $limit: Int) { sourceDocuments(filter: $filter, page: $page, limit: $limit) { items { id title type categoryId userId } total page limit totalPages } }",
    "variables": {
      "filter": {
        "types": ["IMAGE"],
        "categoryId": "06f27bd8-4b0f-4fe4-ba4f-3d3072d66577",
        "userId": "98e0649a-62e5-4bb1-8b55-dc2f4fc9b960"
      },
      "page": 1,
      "limit": 12
    }
  }' | python3 -m json.tool

echo ""
echo "---"
echo ""

# Test without filter
echo "📝 Test 2: No filter (should return all documents)"
curl -s -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetSourceDocuments($page: Int, $limit: Int) { sourceDocuments(page: $page, limit: $limit) { items { id type } total } }",
    "variables": {
      "page": 1,
      "limit": 5
    }
  }' | python3 -m json.tool

echo ""
echo "---"
echo ""

# Test with only IMAGE type
echo "📝 Test 3: Filter with only IMAGE type (should return 1 document)"
curl -s -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetSourceDocuments($filter: SourceDocumentFilterInput, $page: Int, $limit: Int) { sourceDocuments(filter: $filter, page: $page, limit: $limit) { items { id title type userId } total } }",
    "variables": {
      "filter": {
        "types": ["IMAGE"]
      },
      "page": 1,
      "limit": 12
    }
  }' | python3 -m json.tool
