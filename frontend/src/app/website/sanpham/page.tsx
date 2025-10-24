import { ProductShopPage } from '@/components/shop/ProductShopPage';
import Head from 'next/head';

export const metadata = {
  title: 'Sản Phẩm | Cửa Hàng Online',
  description: 'Duyệt và mua sắm các sản phẩm tuyệt vời từ cửa hàng của chúng tôi',
  keywords: 'sản phẩm, mua sắm, cửa hàng online',
  openGraph: {
    title: 'Sản Phẩm | Cửa Hàng Online',
    description: 'Duyệt và mua sắm các sản phẩm tuyệt vời từ cửa hàng của chúng tôi',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/website/sanpham`,
  },
};

export default function SanPhamPage() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <ProductShopPage />
    </>
  );
}
