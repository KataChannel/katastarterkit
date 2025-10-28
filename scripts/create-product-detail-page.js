#!/usr/bin/env node

/**
 * Script to create a Dynamic Product Detail Page Template
 * Usage: node scripts/create-product-detail-page.js
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

// Mutation to create a page
const CREATE_PAGE = gql`
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      id
      title
      slug
      isDynamic
      dynamicConfig
      status
    }
  }
`;

// Mutation to add blocks
const ADD_PAGE_BLOCK = gql`
  mutation AddPageBlock($input: CreatePageBlockInput!) {
    addPageBlock(input: $input) {
      id
      type
      order
    }
  }
`;

async function createProductDetailPage() {
  try {
    console.log('🚀 Creating Dynamic Product Detail Page Template...\n');

    // Step 1: Create the dynamic page
    const pageInput = {
      title: 'Chi Tiết Sản Phẩm',
      slug: 'san-pham-chi-tiet-template',
      status: 'PUBLISHED',
      isDynamic: true,
      dynamicConfig: {
        dataSource: 'product',
        slugPattern: '/san-pham/:slug',
        slugField: 'slug',
        dataBindings: [
          {
            blockId: 'product-name',
            sourceField: 'name',
            targetProperty: 'content.text',
          },
          {
            blockId: 'product-price',
            sourceField: 'price',
            targetProperty: 'content.text',
            transform: 'currency',
          },
          {
            blockId: 'product-description',
            sourceField: 'description',
            targetProperty: 'content.html',
          },
          {
            blockId: 'product-image',
            sourceField: 'images[0].url',
            targetProperty: 'content.src',
          },
        ],
      },
      seoTitle: '{{name}} - Rau Sạch Trần Gia',
      seoDescription: '{{shortDesc}}',
      seoKeywords: ['sản phẩm', 'rau sạch', '{{name}}'],
    };

    console.log('📄 Creating page:', pageInput.title);
    const { data: pageData } = await client.mutate({
      mutation: CREATE_PAGE,
      variables: { input: pageInput },
    });

    const pageId = pageData.createPage.id;
    console.log('✅ Page created with ID:', pageId);
    console.log('   Slug pattern:', pageInput.dynamicConfig.slugPattern);
    console.log('   Data source:', pageInput.dynamicConfig.dataSource);

    // Step 2: Add blocks to the page
    const blocks = [
      // Container block
      {
        pageId,
        type: 'CONTAINER',
        order: 0,
        content: {},
        style: {
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        config: {},
      },
      // Breadcrumb
      {
        pageId,
        type: 'TEXT',
        order: 1,
        content: {
          text: 'Trang chủ / Sản phẩm / {{name}}',
          tag: 'p',
        },
        style: {
          fontSize: '14px',
          color: '#666',
          marginBottom: '1rem',
        },
        config: {},
      },
      // Product Grid Layout
      {
        pageId,
        type: 'GRID',
        order: 2,
        content: {},
        style: {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
        },
        config: {
          columns: 2,
          responsive: true,
        },
      },
      // Product Image (left column)
      {
        pageId,
        type: 'IMAGE',
        order: 3,
        content: {
          src: '/placeholder-product.jpg',
          alt: 'Product Image',
        },
        style: {
          width: '100%',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        config: {
          id: 'product-image',
          objectFit: 'cover',
        },
      },
      // Product Info Container (right column)
      {
        pageId,
        type: 'CONTAINER',
        order: 4,
        content: {},
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        },
        config: {},
      },
      // Product Name
      {
        pageId,
        type: 'HEADING',
        order: 5,
        content: {
          text: 'Tên Sản Phẩm',
          level: 1,
        },
        style: {
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#333',
        },
        config: {
          id: 'product-name',
        },
      },
      // Product Price
      {
        pageId,
        type: 'TEXT',
        order: 6,
        content: {
          text: '0 đ',
          tag: 'p',
        },
        style: {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#e74c3c',
        },
        config: {
          id: 'product-price',
        },
      },
      // Product Short Description
      {
        pageId,
        type: 'TEXT',
        order: 7,
        content: {
          text: 'Mô tả ngắn sản phẩm',
          tag: 'p',
        },
        style: {
          fontSize: '1rem',
          color: '#666',
          lineHeight: '1.6',
        },
        config: {
          id: 'product-short-desc',
        },
      },
      // Stock Status
      {
        pageId,
        type: 'TEXT',
        order: 8,
        content: {
          text: 'Còn hàng',
          tag: 'p',
        },
        style: {
          fontSize: '14px',
          color: '#27ae60',
          fontWeight: '500',
        },
        config: {
          id: 'product-stock',
        },
      },
      // Add to Cart Button
      {
        pageId,
        type: 'BUTTON',
        order: 9,
        content: {
          text: 'Thêm vào giỏ hàng',
          link: '#',
        },
        style: {
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
        },
        config: {
          variant: 'primary',
        },
      },
      // Divider
      {
        pageId,
        type: 'DIVIDER',
        order: 10,
        content: {},
        style: {
          margin: '2rem 0',
          borderColor: '#e0e0e0',
        },
        config: {},
      },
      // Product Description Section
      {
        pageId,
        type: 'HEADING',
        order: 11,
        content: {
          text: 'Mô tả chi tiết',
          level: 2,
        },
        style: {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        },
        config: {},
      },
      // Product Full Description
      {
        pageId,
        type: 'HTML',
        order: 12,
        content: {
          html: '<p>Mô tả chi tiết sản phẩm sẽ được hiển thị ở đây.</p>',
        },
        style: {
          fontSize: '1rem',
          lineHeight: '1.8',
          color: '#333',
        },
        config: {
          id: 'product-description',
        },
      },
    ];

    console.log('\n📦 Adding blocks to page...');
    for (const block of blocks) {
      const { data: blockData } = await client.mutate({
        mutation: ADD_PAGE_BLOCK,
        variables: { input: block },
      });
      console.log(`   ✓ Added ${block.type} block (order: ${block.order})`);
    }

    console.log('\n✅ Dynamic Product Detail Page created successfully!');
    console.log('\n📌 Page Details:');
    console.log('   - ID:', pageId);
    console.log('   - Title:', pageInput.title);
    console.log('   - Slug Pattern:', pageInput.dynamicConfig.slugPattern);
    console.log('   - Data Source:', pageInput.dynamicConfig.dataSource);
    console.log('   - Status:', pageInput.status);
    console.log('\n📝 Data Bindings:');
    pageInput.dynamicConfig.dataBindings.forEach((binding) => {
      console.log(`   - ${binding.sourceField} → ${binding.targetProperty}`);
    });

    console.log('\n🎯 Next Steps:');
    console.log('   1. Create a dynamic route: /san-pham/[slug]/page.tsx');
    console.log('   2. Test with a real product slug, e.g., /san-pham/rau-muong');
    console.log('   3. The page will automatically populate with product data!');

  } catch (error) {
    console.error('❌ Error creating product detail page:', error);
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach((err) => {
        console.error('   GraphQL Error:', err.message);
      });
    }
    if (error.networkError) {
      console.error('   Network Error:', error.networkError.message);
    }
    process.exit(1);
  }
}

// Run the script
createProductDetailPage();
