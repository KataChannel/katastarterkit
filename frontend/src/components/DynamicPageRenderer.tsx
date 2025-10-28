'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import type { Page, PageBlock, DynamicConfig } from '@/types/page-builder';

interface DynamicPageRendererProps {
  pageTemplate: Page;
  slug: string;
}

// GraphQL query to load product data
const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    getProductBySlug(slug: $slug) {
      id
      name
      slug
      description
      price
      compareAtPrice
      stock
      sku
      images {
        url
        alt
      }
      category {
        name
      }
    }
  }
`;

export function DynamicPageRenderer({ pageTemplate, slug }: DynamicPageRendererProps) {
  const [renderedBlocks, setRenderedBlocks] = useState<PageBlock[]>([]);

  // Load product data based on slug
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug || !pageTemplate.isDynamic,
  });

  // Apply data bindings to blocks
  useEffect(() => {
    if (!data || !pageTemplate.dynamicConfig || !pageTemplate.blocks) {
      setRenderedBlocks(pageTemplate.blocks || []);
      return;
    }

    const productData = data.getProductBySlug;
    const { dataBindings } = pageTemplate.dynamicConfig;

    // Clone blocks and apply data bindings
    const updatedBlocks = pageTemplate.blocks.map((block) => {
      const binding = dataBindings.find((b) => b.blockId === block.id);
      if (!binding) return block;

      // Get value from product data
      const value = getNestedValue(productData, binding.sourceField);
      
      // Apply transform if specified
      const transformedValue = binding.transform
        ? applyTransform(value, binding.transform)
        : value;

      // Set value to target property
      return setNestedValue(block, binding.targetProperty, transformedValue);
    });

    setRenderedBlocks(updatedBlocks);
  }, [data, pageTemplate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-2">Product not found</p>
          <p className="text-gray-600">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  // Render page with updated blocks
  // Note: You'll need to import and use your actual PageRenderer component
  return (
    <div className="dynamic-page">
      {renderedBlocks.map((block) => (
        <div key={block.id} className="block">
          {/* Render block based on type */}
          {/* This is placeholder - integrate with your actual block renderer */}
          <pre>{JSON.stringify(block, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}

// Helper: Get nested value from object
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => {
    // Handle array access: images[0].url
    const arrayMatch = prop.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      return current?.[arrayName]?.[parseInt(index)];
    }
    return current?.[prop];
  }, obj);
}

// Helper: Set nested value in object
function setNestedValue(obj: any, path: string, value: any): any {
  const clone = JSON.parse(JSON.stringify(obj));
  const parts = path.split('.');
  let current = clone;

  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }

  current[parts[parts.length - 1]] = value;
  return clone;
}

// Helper: Apply transformation
function applyTransform(value: any, transform: string): any {
  switch (transform) {
    case 'formatCurrency':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    
    case 'formatDate':
      return new Date(value).toLocaleDateString('vi-VN');
    
    case 'uppercase':
      return String(value).toUpperCase();
    
    case 'lowercase':
      return String(value).toLowerCase();
    
    default:
      return value;
  }
}

