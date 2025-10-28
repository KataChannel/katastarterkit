import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { DynamicPageRenderer } from '@/components/DynamicPageRenderer';

// GraphQL query to load page template
const GET_DYNAMIC_PAGE_TEMPLATE = gql`
  query GetDynamicPageTemplate($slugPattern: String!) {
    getPageBySlugPattern(slugPattern: $slugPattern) {
      id
      title
      slug
      isDynamic
      dynamicConfig
      blocks {
        id
        type
        content
        style
        order
        isVisible
      }
      layoutSettings
      seoTitle
      seoDescription
      seoKeywords
    }
  }
`;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Load product data for SEO
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query GetProductBySlug($slug: String!) {
          getProductBySlug(slug: $slug) {
            name
            description
            images {
              url
            }
          }
        }
      `,
      variables: { slug: params.slug },
    });

    const product = data?.getProductBySlug;

    return {
      title: product?.name || 'Product',
      description: product?.description?.substring(0, 160),
      openGraph: {
        images: product?.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product',
      description: 'Product details',
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  // Load page template
  try {
    const { data } = await apolloClient.query({
      query: GET_DYNAMIC_PAGE_TEMPLATE,
      variables: { slugPattern: '/product/:productSlug' },
    });

    const pageTemplate = data?.getPageBySlugPattern;

    if (!pageTemplate) {
      return (
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Page template not found</h1>
          <p className="text-gray-600 mb-8">
            Please create a dynamic page template in the Page Builder.
          </p>
          <a href="/admin/pages/builder" className="text-blue-600 hover:underline">
            Go to Page Builder
          </a>
        </div>
      );
    }

    return <DynamicPageRenderer pageTemplate={pageTemplate} slug={params.slug} />;
  } catch (error) {
    console.error('Error loading product page:', error);
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">Failed to load product page</p>
      </div>
    );
  }
}
