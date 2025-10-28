#!/usr/bin/env node

/**
 * Script to test if there are products in the database
 * Usage: node scripts/test-products.js
 */

const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

// GraphQL endpoint
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:12001/graphql';

// Create Apollo Client
const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    fetch,
  }),
  cache: new InMemoryCache(),
});

// Query to get products
const GET_PRODUCTS = gql`
  query GetProducts {
    products(page: 1, pageSize: 5) {
      items {
        id
        name
        slug
        price
        stock
      }
      pagination {
        totalItems
      }
    }
  }
`;

async function testProducts() {
  try {
    console.log('🔍 Checking products in database...\n');
    console.log('GraphQL Endpoint:', GRAPHQL_ENDPOINT);
    
    const { data } = await client.query({
      query: GET_PRODUCTS,
    });

    const products = data.products.items;
    const totalProducts = data.products.pagination.totalItems;

    console.log(`\n✅ Found ${totalProducts} products in database\n`);

    if (products.length > 0) {
      console.log('Sample products:');
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   - Slug: ${product.slug}`);
        console.log(`   - Price: ${product.price.toLocaleString('vi-VN')} đ`);
        console.log(`   - Stock: ${product.stock}`);
        console.log(`   - URL: /san-pham/${product.slug}`);
      });

      console.log('\n📝 You can test the product detail page with URLs like:');
      console.log(`   http://localhost:12000/san-pham/${products[0].slug}`);
    } else {
      console.log('⚠️  No products found. You may need to import product data first.');
    }

  } catch (error) {
    console.error('❌ Error checking products:', error.message);
    if (error.networkError) {
      console.error('\n💡 Make sure the backend server is running on', GRAPHQL_ENDPOINT);
    }
    process.exit(1);
  }
}

// Run the script
testProducts();
