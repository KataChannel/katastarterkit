'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GET_BLOG_BY_SLUG } from '@/graphql/blog.queries';
import {
  Calendar,
  User,
  Clock,
  Eye,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Fetch blog post
  const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const blog = data?.blogBySlug;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Chức năng bình luận đang được phát triển');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-16 h-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </Card>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 sm:p-8 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy bài viết
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => router.push('/bai-viet')} className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">{/* Continue with blog content */}
      {/* Hero Section */}
      {blog.featuredImage && (
        <div className="relative h-96 bg-gray-900">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              {blog.category && (
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4">
                  {blog.category.name}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {blog.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {blog.author?.fullName || blog.author?.email || 'Admin'}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {blog.readingTime} phút đọc
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {blog.viewCount} lượt xem
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Excerpt */}
              {blog.shortDescription && (
                <div className="text-xl text-gray-700 italic mb-6 pb-6 border-b">
                  {blog.shortDescription}
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 pb-6 border-t pt-6">
                  {blog.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/bai-viet?tag=${tag.slug}`}
                    >
                      <Badge variant="secondary" className="hover:bg-gray-300 transition">
                        #{tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="flex items-center gap-4 pb-6 border-b">
                <span className="font-medium text-gray-700">Chia sẻ:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  title="Chia sẻ lên Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
                  title="Chia sẻ lên Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
                  title="Chia sẻ lên LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>

              {/* Author Info */}
              {blog.author && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Về tác giả</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {blog.author.fullName || blog.author.email}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Biên tập viên tại Rau Sạch Trần Gia
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Bình luận ({blog.comments?.length || 0})
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex justify-between items-center mt-3">
                  {replyingTo && (
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Hủy trả lời
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!commentContent.trim()}
                    className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    <Send className="h-4 w-4" />
                    Gửi bình luận
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {blog.comments?.map((comment: any) => (
                  <div key={comment.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.user?.fullName || comment.authorName || 'Ẩn danh'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Trả lời
                        </button>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-8 space-y-4">
                            {comment.replies.map((reply: any) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">
                                      {reply.user?.fullName || reply.authorName || 'Ẩn danh'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(!blog.comments || blog.comments.length === 0) && (
                <p className="text-center text-gray-500 py-8">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </p>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Newsletter */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">
                  Đăng ký nhận tin
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Nhận bài viết mới nhất qua email
                </p>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm"
                />
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium">
                  Đăng ký
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
