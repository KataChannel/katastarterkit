'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_BLOG_BY_SLUG } from '@/graphql/blog.queries';
import { BlogDetail } from '@/components/blog/BlogDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { RelatedBlogs } from '@/components/blog/RelatedBlogs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BlogBySlugData {
  blogBySlug: {
    id: string;
    title: string;
    slug: string;
    content: string;
    shortDescription: string;
    excerpt: string;
    author: string;
    thumbnailUrl: string;
    bannerUrl: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    tags: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    viewCount: number;
    publishedAt: string;
    updatedAt: string;
    isFeatured: boolean;
    isPublished: boolean;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    createdAt: string;
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<BlogBySlugData>(GET_BLOG_BY_SLUG, {
    variables: { slug },
    errorPolicy: 'all',
    skip: !slug,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <Skeleton className="h-6 w-32 mb-8" />

          {/* Blog detail skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.blogBySlug) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h2 className="font-semibold">Lỗi tải bài viết</h2>
            </div>
            <p className="text-red-600 text-sm mb-4">
              {error?.message || 'Không tìm thấy bài viết này.'}
            </p>
            <Link href="/website/baiviet" className="text-red-700 hover:underline text-sm font-medium">
              ← Quay lại blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const blog = data.blogBySlug;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/website/baiviet">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            {blog.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/website/baiviet?category=${blog.category.slug}`}>
                    {blog.category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{blog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Blog Detail */}
        <BlogDetail blog={blog as any} className="mb-16" />

        {/* Related Blogs */}
        {blog.category && (
          <RelatedBlogs
            categoryId={blog.category.id}
            excludeBlogId={blog.id}
            title="Bài viết liên quan"
          />
        )}
      </div>
    </div>
  );
}
