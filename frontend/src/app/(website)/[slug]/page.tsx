'use client';

import { useQuery } from '@apollo/client';
import { GET_PAGE_BY_SLUG } from '@/graphql/queries/pages';
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer';
import { Page, PageStatus } from '@/types/page-builder';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface DynamicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  
  useEffect(() => {
    const resolveParams = async () => {
      try {
        // In Next.js 13+ App Router, params is always a Promise
        const resolvedParams = await params;
        console.log('Rendering page for slug:', resolvedParams);
        
        if (resolvedParams && resolvedParams.slug) {
          // Exclude reserved routes that have explicit handlers
          const reservedRoutes = ['baiviet', 'sanpham', 'website'];
          if (reservedRoutes.includes(resolvedParams.slug)) {
            console.warn(`Route "${resolvedParams.slug}" is reserved and should use specific handler`);
            setRouteError(`Route "/${resolvedParams.slug}" không được xử lý bởi dynamic page handler`);
            setSlug('');
            return;
          }
          
          // Use slug directly as stored in database
          setSlug(resolvedParams.slug);
        } else {
          console.error('No slug found in params:', resolvedParams);
          setSlug(''); // This will trigger notFound() in the query
        }
      } catch (err) {
        console.error('Error resolving params:', err);
        setRouteError('Lỗi khi xử lý tham số route');
        setSlug(''); // This will trigger notFound() in the query
      }
    };
    
    resolveParams();
  }, [params]);

  const { data, loading, error } = useQuery<{ getPageBySlug: Page }>(GET_PAGE_BY_SLUG, {
    variables: { slug: slug || '' },
    skip: slug === null, // Skip query until slug is resolved
    errorPolicy: 'all'
  });

  if (slug === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data?.getPageBySlug || slug === '') {
    return notFound();
  }

  const page = data.getPageBySlug;
  console.log('Fetched page data:', page);
  
  // Don't show draft or archived pages in production
  if (process.env.NODE_ENV === 'production' && page.status !== PageStatus.PUBLISHED) {
    return notFound();
  }

  const seoTitle = page.seoTitle || page.title;
  const seoDescription = page.seoDescription || page.content;
  const seoKeywords = page.seoKeywords?.join(', ');

  // Layout settings with defaults
  const layoutSettings = page.layoutSettings || {
    hasHeader: true,
    hasFooter: true,
    headerStyle: 'default',
    footerStyle: 'default',
  };

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

      <>
        {/* Page Content - Full width for blocks to handle their own layouts */}
        <main className="w-full">
          {page.blocks && page.blocks.length > 0 ? (
            <div>
              {[...page.blocks]
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
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Page Content Coming Soon
                </h2>
                <p className="text-gray-600">
                  This page is currently being built. Please check back later.
                </p>
              </div>
            </div>
          )}
        </main>
      </>
    </>
  );
}