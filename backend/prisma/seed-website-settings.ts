import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default website settings to seed
const defaultSettings = [
  { key: 'site.name', label: 'Tên Website', value: 'Shop Rau Sạch' },
  { key: 'site.description', label: 'Mô tả Website', value: 'Website bán rau sạch, nông sản tươi mới' },
  { key: 'site.logo', label: 'Logo', value: '/images/logo.png' },
  { key: 'site.favicon', label: 'Favicon', value: '/images/favicon.ico' },
  { key: 'site.email', label: 'Email', value: 'contact@shoprausach.com' },
  { key: 'site.phone', label: 'Số điện thoại', value: '+84123456789' },
  { key: 'site.address', label: 'Địa chỉ', value: 'Hà Nội, Việt Nam' },
  { key: 'site.theme', label: 'Chủ đề', value: 'light' },
  { key: 'site.timezone', label: 'Múi giờ', value: 'Asia/Ho_Chi_Minh' },
  { key: 'site.language', label: 'Ngôn ngữ', value: 'vi' },
  { key: 'site.offline', label: 'Chế độ offline', value: 'false' },
  { key: 'site.offline_message', label: 'Thông báo offline', value: 'Website đang bảo trì' },
  { key: 'site.homepage_url', label: 'URL trang chủ', value: '/' },
  { key: 'site.currency', label: 'Tiền tệ', value: 'VND' },
  { key: 'site.currency_symbol', label: 'Ký hiệu tiền tệ', value: '₫' },
  { key: 'ecommerce.products_per_page', label: 'Sản phẩm/trang', value: '12' },
  { key: 'ecommerce.enable_reviews', label: 'Bật đánh giá', value: 'true' },
  { key: 'ecommerce.enable_wishlist', label: 'Bật danh sách yêu thích', value: 'true' },
  { key: 'ecommerce.enable_ratings', label: 'Bật xếp hạng', value: 'true' },
  { key: 'ecommerce.tax_rate', label: 'Tỷ lệ thuế', value: '10' },
  { key: 'shipping.enabled', label: 'Bật vận chuyển', value: 'true' },
  { key: 'shipping.free_shipping_threshold', label: 'Ngưỡng vận chuyển miễn phí', value: '500000' },
  { key: 'shipping.base_fee', label: 'Phí vận chuyển cơ bản', value: '30000' },
  { key: 'payment.enabled', label: 'Bật thanh toán', value: 'true' },
  { key: 'payment.stripe_key', label: 'Stripe API Key', value: '' },
  { key: 'payment.paypal_key', label: 'PayPal Key', value: '' },
  { key: 'email.smtp_host', label: 'SMTP Host', value: 'smtp.gmail.com' },
  { key: 'email.smtp_port', label: 'SMTP Port', value: '587' },
  { key: 'email.smtp_user', label: 'SMTP User', value: '' },
  { key: 'email.smtp_password', label: 'SMTP Password', value: '' },
  { key: 'email.from_address', label: 'Từ địa chỉ email', value: 'noreply@shoprausach.com' },
  { key: 'email.from_name', label: 'Từ tên', value: 'Shop Rau Sạch' },
  { key: 'security.jwt_secret', label: 'JWT Secret', value: '' },
  { key: 'security.password_min_length', label: 'Độ dài mật khẩu tối thiểu', value: '8' },
  { key: 'security.max_login_attempts', label: 'Tối đa lần đăng nhập', value: '5' },
  { key: 'social.facebook_url', label: 'Facebook URL', value: '' },
  { key: 'social.instagram_url', label: 'Instagram URL', value: '' },
  { key: 'social.twitter_url', label: 'Twitter URL', value: '' },
  { key: 'social.youtube_url', label: 'YouTube URL', value: '' },
  { key: 'analytics.google_analytics_id', label: 'Google Analytics ID', value: '' },
  { key: 'analytics.facebook_pixel_id', label: 'Facebook Pixel ID', value: '' },
  { key: 'api.rate_limit', label: 'API Rate Limit', value: '1000' },
  { key: 'api.enable_cors', label: 'Bật CORS', value: 'true' },
  { key: 'content.posts_per_page', label: 'Bài viết/trang', value: '10' },
  { key: 'content.enable_comments', label: 'Bật bình luận', value: 'true' },
  { key: 'lms.enable_courses', label: 'Bật khóa học', value: 'true' },
  { key: 'lms.courses_per_page', label: 'Khóa học/trang', value: '6' },
];

export async function seedWebsiteSettings() {
  console.log('🌱 Seeding WebsiteSetting...');

  try {
    const existingCount = await prisma.websiteSetting.count();

    if (existingCount === 0) {
      console.log('📝 Creating default settings...\n');

      let created = 0;
      for (const setting of defaultSettings) {
        try {
          await prisma.websiteSetting.create({
            data: {
              key: setting.key,
              value: setting.value,
              label: setting.label,
            },
          });
          created++;
          console.log(`✅ Created: ${setting.key}`);
        } catch (error: any) {
          if (error.code === 'P2002') {
            // Unique constraint violation - already exists
            console.log(`⏭️  Skipped (exists): ${setting.key}`);
          } else {
            console.log(`⚠️  Error: ${setting.key}`);
          }
        }
      }

      const finalCount = await prisma.websiteSetting.count();
      console.log(`\n✅ Seeding complete: ${finalCount}/47 settings created`);
      return true;
    } else {
      console.log(`✅ WebsiteSetting already has ${existingCount} records`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error seeding WebsiteSetting:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.main) {
  seedWebsiteSettings()
    .then(() => {
      console.log('\n🎉 WebsiteSetting seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

export default seedWebsiteSettings;
