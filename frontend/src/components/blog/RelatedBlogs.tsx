'use client';

import React, { useState, useEffect } from 'react';
import { getRelatedBlogs } from '@/actions/blog.actions';
import { BlogCard } from './BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RelatedBlogsProps {
  categoryId: string;
  excludeBlogId: string;
  limit?: number;
  title?: string;
  className?: string;
}

export function RelatedBlogs({
  categoryId,
  excludeBlogId,
  limit = 3,
  title = 'Bài viết liên quan',
  className,
}: RelatedBlogsProps) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        setLoading(true);
        const result = await getRelatedBlogs(excludeBlogId, limit);
        setBlogs(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(err as Error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [excludeBlogId, limit]);

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/website/baiviet/${blog.slug}`}>
            <BlogCard
              blog={{
                ...blog,
                excerpt: blog.shortDescription,
                shortDescription: blog.shortDescription,
                tags: [],
              }}
              showCategory={true}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
