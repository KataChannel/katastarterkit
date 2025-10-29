'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
import { GET_BLOGS, GET_BLOG_CATEGORIES } from '@/graphql/blog.queries';
import { Search, Calendar, User, Tag, Clock, TrendingUp } from 'lucide-react';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch blogs
  const { data, loading, error } = useQuery(GET_BLOGS, {
    variables: {
      input: {
        page,
        limit: 12,
        categoryId,
        search: searchQuery || undefined,
        sort: sortBy,
        isPublished: true,
      },
    },
  });

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_BLOG_CATEGORIES);

  const blogs = data?.getBlogs?.blogs || [];
  const total = data?.getBlogs?.total || 0;
  const hasMore = page * 12 < total;
  const categories = categoriesData?.getBlogCategories || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl opacity-90">
            Khám phá kiến thức, xu hướng và cập nhật mới nhất
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="popular">Phổ biến nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Danh mục</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCategoryId(null)}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${
                    categoryId === null
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((category: any) => (
                  <button
                    key={category.id}
                    onClick={() => setCategoryId(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${
                      categoryId === category.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Popular Tags */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Thẻ phổ biến
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Công nghệ', 'Kinh doanh', 'Marketing', 'Thiết kế', 'Đời sống'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Blog Grid */}
          <main className="flex-1">
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="bg-gray-200 h-48"></div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-200 h-4 rounded"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                Có lỗi xảy ra: {error.message}
              </div>
            )}

            {!loading && blogs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog: any) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition group overflow-hidden"
                    >
                      {/* Featured Image */}
                      {blog.featuredImage && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                          {blog.category && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                              {blog.category.name}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4">
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                          {blog.viewCount > 0 && (
                            <span>{blog.viewCount} lượt xem</span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                          {blog.title}
                        </h2>

                        {/* Excerpt */}
                        {blog.shortDescription && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {blog.shortDescription}
                          </p>
                        )}

                        {/* Author & Reading Time */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {blog.author?.fullName || blog.author?.email || 'Admin'}
                            </span>
                          </div>
                          {blog.readingTime && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{blog.readingTime} phút</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {blog.tags.slice(0, 3).map((tag: any) => (
                              <span
                                key={tag.id}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Trang {page} / {Math.ceil(total / 12)}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasMore}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Sau
                  </button>
                </div>
              </>
            )}

            {!loading && blogs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
