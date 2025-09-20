'use client';

import { useQuery } from '@apollo/client';
import { GET_PAGE_BY_SLUG } from '@/graphql/queries/pages';
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer';
import { Page, PageStatus } from '@/types/page-builder';
import { notFound } from 'next/navigation';
import Head from 'next/head';

interface DynamicPageProps {
  params: {
    slug: string;
  };
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const { data, loading, error } = useQuery<{ getPageBySlug: Page }>(GET_PAGE_BY_SLUG, {
    variables: { slug: params.slug },
    errorPolicy: 'all'
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data?.getPageBySlug) {
    return notFound();
  }

  const page = data.getPageBySlug;

  // Don't show draft or archived pages in production
  if (process.env.NODE_ENV === 'production' && page.status !== PageStatus.PUBLISHED) {
    return notFound();
  }

  const seoTitle = page.seoTitle || page.title;
  const seoDescription = page.seoDescription || page.content;
  const seoKeywords = page.seoKeywords?.join(', ');

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        {seoDescription && <meta name="description" content={seoDescription} />}
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seoTitle} />
        {seoDescription && <meta property="og:description" content={seoDescription} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_APP_URL}/${page.slug}`} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        {seoDescription && <meta name="twitter:description" content={seoDescription} />}
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_URL}/${page.slug}`} />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Page Header (optional, can be customized) */}
        {page.title && (
          <div className="bg-gray-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {page.title}
              </h1>
              {page.content && (
                <p className="text-xl text-gray-600 max-w-3xl">
                  {page.content}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            {page.blocks && page.blocks.length > 0 ? (
              <div className="space-y-8">
                {page.blocks
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((block) => (
                    <div key={block.id} className="w-full">
                      <BlockRenderer
                        block={block}
                        isEditing={false}
                        onUpdate={() => {}} // No editing in public view
                        onDelete={() => {}} // No deletion in public view
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Page Content Coming Soon
                </h2>
                <p className="text-gray-600">
                  This page is currently being built. Please check back later.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Page Footer (optional) */}
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <p>Last updated: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}