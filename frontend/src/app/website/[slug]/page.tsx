'use client';

import { useQuery } from '@apollo/client';
import { GET_PAGE_BY_SLUG } from '@/graphql/queries/pages';
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer';
import { Page, PageStatus } from '@/types/page-builder';
import { WebsiteHeader } from '@/components/layout/website-header';
import { WebsiteFooter } from '@/components/layout/website-footer';
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
  
  useEffect(() => {
    const resolveParams = async () => {
      try {
        // In Next.js 13+ App Router, params is always a Promise
        const resolvedParams = await params;
        console.log('Rendering page for slug:', resolvedParams);
        
        if (resolvedParams && resolvedParams.slug) {
          // Prepend 'website/' to match the database slug format
          const fullSlug = `website/${resolvedParams.slug}`;
          setSlug(fullSlug);
        } else {
          console.error('No slug found in params:', resolvedParams);
          setSlug(''); // This will trigger notFound() in the query
        }
      } catch (error) {
        console.error('Error resolving params:', error);
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

  // Header class based on style
  const getHeaderClass = () => {
    switch (layoutSettings.headerStyle) {
      case 'transparent':
        return 'absolute top-0 left-0 right-0 z-50 bg-transparent';
      case 'fixed':
        return 'fixed top-0 left-0 right-0 z-50 bg-white shadow-sm';
      case 'sticky':
        return 'sticky top-0 z-50 bg-white shadow-sm';
      default:
        return '';
    }
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

      <div className="min-h-screen bg-white">
        {/* Conditional Header */}
        {layoutSettings.hasHeader && (
          <div className={getHeaderClass()}>
            <WebsiteHeader />
          </div>
        )}
        
        {/* Page Content - Full width for blocks to handle their own layouts */}
        <main className={cn(
          "w-full",
          layoutSettings.headerStyle === 'transparent' && "pt-0",
          layoutSettings.headerStyle === 'fixed' && "pt-20",
          layoutSettings.headerStyle === 'sticky' && "pt-0"
        )}>
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
        
        {/* Conditional Footer */}
        {layoutSettings.hasFooter && <WebsiteFooter />}
      </div>
    </>
  );
}