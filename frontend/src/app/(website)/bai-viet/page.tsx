'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { GET_BLOGS, GET_BLOG_CATEGORIES } from '@/graphql/blog.queries';
import { Search, Calendar, User, Clock, TrendingUp, Filter, X, Home, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function BlogPageContent() {
  const searchParams = useSearchParams();
  
  // Lấy params từ URL (từ menu queryConditions)
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [categoryId, setCategoryId] = useState<string | null>(
    searchParams.get('categoryId') || null
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [limit] = useState(Number(searchParams.get('limit')) || 12);

  // Update state khi URL params thay đổi
  useEffect(() => {
    const urlCategoryId = searchParams.get('categoryId');
    const urlSearch = searchParams.get('search');
    const urlSort = searchParams.get('sort');
    const urlPage = searchParams.get('page');

    if (urlCategoryId) setCategoryId(urlCategoryId);
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlSort) setSortBy(urlSort);
    if (urlPage) setPage(Number(urlPage));
  }, [searchParams]);

  // Fetch blogs
  const { data, loading, error } = useQuery(GET_BLOGS, {
    variables: {
      page,
      limit,
      categoryId: categoryId || undefined,
      search: searchQuery || undefined,
      sort: sortBy,
    },
  });

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_BLOG_CATEGORIES);

  const blogs = data?.blogs?.items || [];
  const total = data?.blogs?.total || 0;
  const hasMore = data?.blogs?.hasMore || false;
  const totalPages = data?.blogs?.totalPages || 0;
  const categories = categoriesData?.blogCategories || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const handleClearFilters = () => {
    setCategoryId(null);
    setSearchQuery('');
    setSortBy('newest');
    setPage(1);
  };

  const activeFiltersCount = [categoryId, searchQuery !== ''].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb - Mobile First */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1 text-sm sm:text-base">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Trang chủ</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-sm sm:text-base">
                  Bài viết
                  {total > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {total}
                    </Badge>
                  )}
                </BreadcrumbPage>
              </BreadcrumbItem>
              {categoryId && categories.find((c: any) => c.id === categoryId) && (
                <>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm sm:text-base text-blue-600">
                      {categories.find((c: any) => c.id === categoryId)?.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Filters & Search - Mobile Optimized */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs sm:text-sm">
                <Filter className="h-3 w-3 mr-1" />
                {activeFiltersCount} bộ lọc
              </Badge>
              {categoryId && (
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {categories.find((c: any) => c.id === categoryId)?.name}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Mobile First Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Sidebar - Mobile: Horizontal scroll, Desktop: Fixed sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-[180px] sm:top-[160px] lg:top-[140px]">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  Danh mục
                </h3>
                
                {/* Mobile: Horizontal scrollable categories */}
                <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  <Button
                    variant={categoryId === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryId(null)}
                    className="whitespace-nowrap"
                  >
                    Tất cả
                  </Button>
                  {categories.map((category: any) => (
                    <Button
                      key={category.id}
                      variant={categoryId === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryId(category.id)}
                      className="whitespace-nowrap"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>

                {/* Desktop: Vertical list */}
                <div className="hidden lg:block space-y-2">
                  <Button
                    variant={categoryId === null ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCategoryId(null)}
                  >
                    Tất cả
                  </Button>
                  {categories.map((category: any) => (
                    <Button
                      key={category.id}
                      variant={categoryId === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCategoryId(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>

                {/* Popular Tags */}
                <div className="mt-6 sm:mt-8 hidden sm:block">
                  <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Thẻ phổ biến
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Công nghệ', 'Kinh doanh', 'Marketing', 'Thiết kế', 'Đời sống'].map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-300 transition text-xs sm:text-sm"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Blog Grid - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
          <main className="flex-1 min-w-0">
            
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(limit)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="animate-pulse">
                      <div className="bg-gray-200 aspect-video"></div>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 sm:p-6">
                  <p className="text-red-700 text-sm sm:text-base">
                    Có lỗi xảy ra: {error.message}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Blog List */}
            {!loading && blogs.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {blogs.map((blog: any) => (
                    <Link
                      key={blog.id}
                      href={`/bai-viet/${blog.slug}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        {/* Featured Image */}
                        {blog.thumbnailUrl && (
                          <div className="relative aspect-video overflow-hidden bg-gray-100">
                            <Image
                              src={blog.thumbnailUrl}
                              alt={blog.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {blog.category && (
                              <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 text-xs">
                                {blog.category.name}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <CardContent className="p-3 sm:p-4">
                          {/* Meta */}
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(blog.publishedAt || blog.createdAt)}
                            </span>
                            {blog.viewCount > 0 && (
                              <span className="hidden sm:inline">{blog.viewCount} lượt xem</span>
                            )}
                          </div>

                          {/* Title */}
                          <h2 className="font-bold text-gray-900 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                            {blog.title}
                          </h2>

                          {/* Excerpt */}
                          {blog.shortDescription && (
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 sm:line-clamp-3">
                              {blog.shortDescription}
                            </p>
                          )}

                          {/* Author & Reading Time */}
                          <div className="flex items-center justify-between pt-3 border-t text-xs sm:text-sm">
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-600 truncate">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">
                                {blog.author?.firstName && blog.author?.lastName
                                  ? `${blog.author.firstName} ${blog.author.lastName}`
                                  : blog.author?.username || 'Admin'}
                              </span>
                            </div>
                            {(blog.shortDescription || blog.excerpt) && (
                              <div className="flex items-center gap-1 text-gray-500 flex-shrink-0 ml-2">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>
                                  {calculateReadingTime(blog.shortDescription || blog.excerpt || '')} phút
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Tags - Only show on desktop */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="hidden sm:flex flex-wrap gap-2 mt-3">
                              {blog.tags.slice(0, 3).map((tag: any) => (
                                <Badge
                                  key={tag.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  #{tag.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination - Mobile Optimized */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600 order-2 sm:order-1">
                    Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} của {total} bài viết
                  </p>
                  
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    
                    {/* Page numbers - Show on desktop only */}
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className="w-9"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    {/* Current page indicator on mobile */}
                    <span className="sm:hidden px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                      {page} / {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!hasMore}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && blogs.length === 0 && (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Không tìm thấy bài viết
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4">
                      Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                    {activeFiltersCount > 0 && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        Xóa tất cả bộ lọc
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Wrapper component với Suspense boundary
export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}
