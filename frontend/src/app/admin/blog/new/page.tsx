/**
 * New Blog Post Page
 * URL: /admin/blog/new
 */

import BlogPostForm from '@/components/admin/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">✍️ Create New Blog Post</h1>
      <div className="bg-white border rounded-lg p-6">
        <BlogPostForm />
      </div>
    </div>
  )
}
