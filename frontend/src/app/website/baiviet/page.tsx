import { BlogListPage } from '@/components/blog/BlogListPage';
import Head from 'next/head';

export const metadata = {
  title: 'Bài viết | Blog',
  description: 'Đọc các bài viết hữu ích và mẹo vặt từ blog của chúng tôi',
  keywords: 'blog, bài viết, tin tức, mẹo vặt',
  openGraph: {
    title: 'Bài viết | Blog',
    description: 'Đọc các bài viết hữu ích và mẹo vặt từ blog của chúng tôi',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/website/baiviet`,
  },
};

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <BlogListPage />
    </>
  );
}
