'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GET_BLOGS, DELETE_BLOG } from '@/graphql/blog.queries';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBlogPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useQuery(GET_BLOGS, {
    variables: { page, limit: 20 },
  });

  const [deleteBlog] = useMutation(DELETE_BLOG, {
    onCompleted: () => {
      toast.success('Đã xóa bài viết');
      refetch();
    },
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const blogs = data?.blogs?.items || [];
  const total = data?.blogs?.total || 0;

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      await deleteBlog({ variables: { id } });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Blog</h1>
        <Link
          href="/admin/blog/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Tạo bài viết mới
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lượt xem
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs.map((blog: any) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{blog.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {blog.category?.name || '-'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      blog.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {blog.viewCount || 0}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/bai-viet/${blog.slug}`}
                      target="_blank"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/admin/blog/${blog.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Tổng {total} bài viết
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-4 py-2">Trang {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 20 >= total}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
