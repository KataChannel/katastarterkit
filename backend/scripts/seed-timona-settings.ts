/**
 * Seed Script: Timona Academy Website Settings
 * 
 * This script seeds WebsiteSettings for Timona Academy domain
 * Based on: cautrucdomain.txt and WordPress configuration
 * 
 * Domain: app.timona.edu.vn
 * Backend: appapi.timona.edu.vn:15001
 * Frontend: app.timona.edu.vn:15000
 * Storage: storage.timona.edu.vn
 * 
 * Run with: cd backend && npx ts-node scripts/seed-timona-settings.ts
 */

import { PrismaClient, SettingType, SettingCategory } from '@prisma/client';

const prisma = new PrismaClient();

interface SettingData {
  key: string;
  value: string;
  type: SettingType;
  category: SettingCategory;
  label: string;
  description?: string;
  group?: string;
  order: number;
  isPublic: boolean;
}

async function seedSettings() {
  console.log('\n⚙️  Seeding Website Settings for Timona Academy...');
  
  const settings: SettingData[] = [
    // =====================
    // GENERAL SETTINGS
    // =====================
    {
      key: 'site_name',
      value: 'Timona Academy',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Tên Website',
      description: 'Tên chính của website',
      group: 'basic',
      order: 0,
      isPublic: true,
    },
    {
      key: 'site_tagline',
      value: 'Học viện Đào tạo Thẩm mỹ Quốc tế',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Slogan',
      description: 'Slogan của website',
      group: 'basic',
      order: 1,
      isPublic: true,
    },
    {
      key: 'site_description',
      value: 'Timona Academy - Học viện đào tạo nghề thẩm mỹ hàng đầu Việt Nam. Đào tạo chăm sóc da, phun xăm, nối mi, nail, makeup chuyên nghiệp với chứng chỉ quốc gia.',
      type: SettingType.TEXTAREA,
      category: SettingCategory.GENERAL,
      label: 'Mô tả Website',
      description: 'Mô tả ngắn về website (dùng cho SEO)',
      group: 'basic',
      order: 2,
      isPublic: true,
    },
    {
      key: 'site_logo',
      value: '/images/timona/logo.svg',
      type: SettingType.IMAGE,
      category: SettingCategory.GENERAL,
      label: 'Logo Website',
      description: 'Logo chính của website',
      group: 'logo',
      order: 3,
      isPublic: true,
    },
    {
      key: 'site_logo_white',
      value: '/images/timona/logo-white.svg',
      type: SettingType.IMAGE,
      category: SettingCategory.GENERAL,
      label: 'Logo Trắng',
      description: 'Logo màu trắng (dùng trên nền tối)',
      group: 'logo',
      order: 4,
      isPublic: true,
    },
    {
      key: 'site_favicon',
      value: '/images/timona/favicon.ico',
      type: SettingType.IMAGE,
      category: SettingCategory.GENERAL,
      label: 'Favicon',
      description: 'Icon hiển thị trên tab trình duyệt',
      group: 'logo',
      order: 5,
      isPublic: true,
    },
    {
      key: 'brand_color',
      value: '#00256e',
      type: SettingType.COLOR,
      category: SettingCategory.GENERAL,
      label: 'Màu thương hiệu',
      description: 'Màu chủ đạo của website',
      group: 'branding',
      order: 6,
      isPublic: true,
    },
    {
      key: 'brand_color_secondary',
      value: '#1a5f7a',
      type: SettingType.COLOR,
      category: SettingCategory.GENERAL,
      label: 'Màu phụ',
      description: 'Màu phụ của website',
      group: 'branding',
      order: 7,
      isPublic: true,
    },
    
    // =====================
    // CONTACT SETTINGS
    // =====================
    {
      key: 'contact_email',
      value: 'timonaeducation@gmail.com',
      type: SettingType.TEXT,
      category: SettingCategory.CONTACT,
      label: 'Email liên hệ',
      description: 'Email chính để khách hàng liên hệ',
      group: 'contact',
      order: 10,
      isPublic: true,
    },
    {
      key: 'contact_phone',
      value: '024 3756 8899',
      type: SettingType.TEXT,
      category: SettingCategory.CONTACT,
      label: 'Số điện thoại',
      description: 'Số điện thoại liên hệ chính',
      group: 'contact',
      order: 11,
      isPublic: true,
    },
    {
      key: 'contact_hotline',
      value: '1900 2109',
      type: SettingType.TEXT,
      category: SettingCategory.CONTACT,
      label: 'Hotline',
      description: 'Số hotline miễn phí',
      group: 'contact',
      order: 12,
      isPublic: true,
    },
    {
      key: 'contact_address',
      value: '55 Trung Văn, Nam Từ Liêm, Hà Nội',
      type: SettingType.TEXTAREA,
      category: SettingCategory.CONTACT,
      label: 'Địa chỉ',
      description: 'Địa chỉ trụ sở chính',
      group: 'contact',
      order: 13,
      isPublic: true,
    },
    {
      key: 'working_hours',
      value: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
      type: SettingType.TEXT,
      category: SettingCategory.CONTACT,
      label: 'Giờ làm việc',
      description: 'Thời gian làm việc',
      group: 'contact',
      order: 14,
      isPublic: true,
    },
    {
      key: 'zalo_number',
      value: '0901234567',
      type: SettingType.TEXT,
      category: SettingCategory.CONTACT,
      label: 'Zalo',
      description: 'Số Zalo để tư vấn',
      group: 'contact',
      order: 15,
      isPublic: true,
    },
    
    // =====================
    // SOCIAL SETTINGS
    // =====================
    {
      key: 'social_facebook',
      value: 'https://www.facebook.com/TimonaAcademy',
      type: SettingType.URL,
      category: SettingCategory.SOCIAL,
      label: 'Facebook',
      description: 'Link fanpage Facebook',
      group: 'social',
      order: 20,
      isPublic: true,
    },
    {
      key: 'social_youtube',
      value: 'https://www.youtube.com/@TimonaAcademy',
      type: SettingType.URL,
      category: SettingCategory.SOCIAL,
      label: 'YouTube',
      description: 'Link kênh YouTube',
      group: 'social',
      order: 21,
      isPublic: true,
    },
    {
      key: 'social_instagram',
      value: 'https://www.instagram.com/timonaacademy',
      type: SettingType.URL,
      category: SettingCategory.SOCIAL,
      label: 'Instagram',
      description: 'Link Instagram',
      group: 'social',
      order: 22,
      isPublic: true,
    },
    {
      key: 'social_tiktok',
      value: 'https://www.tiktok.com/@timonaacademy',
      type: SettingType.URL,
      category: SettingCategory.SOCIAL,
      label: 'TikTok',
      description: 'Link TikTok',
      group: 'social',
      order: 23,
      isPublic: true,
    },
    {
      key: 'social_zalo_oa',
      value: 'https://zalo.me/timonaacademy',
      type: SettingType.URL,
      category: SettingCategory.SOCIAL,
      label: 'Zalo OA',
      description: 'Link Zalo Official Account',
      group: 'social',
      order: 24,
      isPublic: true,
    },
    
    // =====================
    // SEO SETTINGS
    // =====================
    {
      key: 'seo_title',
      value: 'Timona Academy - Học viện Đào tạo Thẩm mỹ Quốc tế',
      type: SettingType.TEXT,
      category: SettingCategory.SEO,
      label: 'SEO Title',
      description: 'Title mặc định cho các trang',
      group: 'seo',
      order: 30,
      isPublic: true,
    },
    {
      key: 'seo_description',
      value: 'Timona Academy - Địa chỉ đào tạo nghề thẩm mỹ uy tín số 1 Việt Nam. Khóa học chăm sóc da, phun xăm, nối mi, nail chuyên nghiệp. Hotline: 1900 2109',
      type: SettingType.TEXTAREA,
      category: SettingCategory.SEO,
      label: 'SEO Description',
      description: 'Meta description mặc định',
      group: 'seo',
      order: 31,
      isPublic: true,
    },
    {
      key: 'seo_keywords',
      value: 'học spa, đào tạo spa, học phun xăm, học nối mi, học nail, timona academy, học viện thẩm mỹ, chứng chỉ spa, khóa học làm đẹp',
      type: SettingType.TEXTAREA,
      category: SettingCategory.SEO,
      label: 'SEO Keywords',
      description: 'Từ khóa SEO (cách nhau bởi dấu phẩy)',
      group: 'seo',
      order: 32,
      isPublic: true,
    },
    {
      key: 'seo_og_image',
      value: '/images/timona/og-image.jpg',
      type: SettingType.IMAGE,
      category: SettingCategory.SEO,
      label: 'OG Image',
      description: 'Ảnh thumbnail khi chia sẻ trên social',
      group: 'seo',
      order: 33,
      isPublic: true,
    },
    {
      key: 'google_site_verification',
      value: '',
      type: SettingType.TEXT,
      category: SettingCategory.SEO,
      label: 'Google Site Verification',
      description: 'Mã xác thực Google Search Console',
      group: 'seo',
      order: 34,
      isPublic: false,
    },
    {
      key: 'google_analytics_id',
      value: '',
      type: SettingType.TEXT,
      category: SettingCategory.ANALYTICS,
      label: 'Google Analytics ID',
      description: 'ID Google Analytics (GA4)',
      group: 'analytics',
      order: 35,
      isPublic: false,
    },
    {
      key: 'facebook_pixel_id',
      value: '',
      type: SettingType.TEXT,
      category: SettingCategory.ANALYTICS,
      label: 'Facebook Pixel ID',
      description: 'ID Facebook Pixel',
      group: 'analytics',
      order: 36,
      isPublic: false,
    },
    
    // =====================
    // HEADER SETTINGS
    // =====================
    {
      key: 'header_announcement',
      value: '🎉 Ưu đãi đặc biệt: Giảm 20% học phí khi đăng ký trước 31/12/2024!',
      type: SettingType.TEXT,
      category: SettingCategory.HEADER,
      label: 'Thông báo Header',
      description: 'Dòng thông báo phía trên header',
      group: 'announcement',
      order: 40,
      isPublic: true,
    },
    {
      key: 'header_announcement_enabled',
      value: 'true',
      type: SettingType.BOOLEAN,
      category: SettingCategory.HEADER,
      label: 'Bật thông báo Header',
      description: 'Hiển thị/ẩn thông báo trên header',
      group: 'announcement',
      order: 41,
      isPublic: true,
    },
    {
      key: 'header_phone_display',
      value: '1900 2109',
      type: SettingType.TEXT,
      category: SettingCategory.HEADER,
      label: 'SĐT hiển thị trên Header',
      description: 'Số điện thoại hiển thị trên thanh header',
      group: 'header',
      order: 42,
      isPublic: true,
    },
    
    // =====================
    // FOOTER SETTINGS
    // =====================
    {
      key: 'footer_copyright',
      value: '© 2024 Timona Academy. All rights reserved.',
      type: SettingType.TEXT,
      category: SettingCategory.FOOTER,
      label: 'Copyright',
      description: 'Dòng copyright ở footer',
      group: 'footer',
      order: 50,
      isPublic: true,
    },
    {
      key: 'footer_description',
      value: 'Timona Academy - Học viện đào tạo nghề thẩm mỹ hàng đầu Việt Nam với hơn 10 năm kinh nghiệm. Cam kết 100% học viên ra trường có việc làm.',
      type: SettingType.TEXTAREA,
      category: SettingCategory.FOOTER,
      label: 'Mô tả Footer',
      description: 'Đoạn mô tả ngắn ở footer',
      group: 'footer',
      order: 51,
      isPublic: true,
    },
    {
      key: 'footer_business_license',
      value: 'Giấy phép kinh doanh số: 0123456789 do Sở Kế hoạch Đầu tư TP. Hà Nội cấp ngày 01/01/2015',
      type: SettingType.TEXT,
      category: SettingCategory.FOOTER,
      label: 'Giấy phép kinh doanh',
      description: 'Thông tin giấy phép kinh doanh',
      group: 'footer',
      order: 52,
      isPublic: true,
    },
    
    // =====================
    // GENERAL - HOMEPAGE DATA (using GENERAL category)
    // =====================
    {
      key: 'hero_title',
      value: 'Timona Academy',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Hero Title',
      description: 'Tiêu đề chính trên banner',
      group: 'hero',
      order: 60,
      isPublic: true,
    },
    {
      key: 'hero_subtitle',
      value: 'Học viện Đào tạo Thẩm mỹ Quốc tế',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Hero Subtitle',
      description: 'Phụ đề trên banner',
      group: 'hero',
      order: 61,
      isPublic: true,
    },
    {
      key: 'hero_cta_text',
      value: 'Đăng ký ngay',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Hero CTA Text',
      description: 'Text nút CTA trên banner',
      group: 'hero',
      order: 62,
      isPublic: true,
    },
    {
      key: 'hero_cta_url',
      value: '/dang-ky',
      type: SettingType.URL,
      category: SettingCategory.GENERAL,
      label: 'Hero CTA URL',
      description: 'Link nút CTA trên banner',
      group: 'hero',
      order: 63,
      isPublic: true,
    },
    {
      key: 'hero_images',
      value: JSON.stringify([
        '/images/timona/hero-1.jpg',
        '/images/timona/hero-2.jpg',
        '/images/timona/hero-3.jpg',
      ]),
      type: SettingType.JSON,
      category: SettingCategory.GENERAL,
      label: 'Hero Images',
      description: 'Danh sách ảnh banner (JSON array)',
      group: 'hero',
      order: 64,
      isPublic: true,
    },
    {
      key: 'stats_students',
      value: '5000+',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Số học viên',
      description: 'Số học viên đã đào tạo',
      group: 'stats',
      order: 70,
      isPublic: true,
    },
    {
      key: 'stats_courses',
      value: '20+',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Số khóa học',
      description: 'Số khóa học đang có',
      group: 'stats',
      order: 71,
      isPublic: true,
    },
    {
      key: 'stats_instructors',
      value: '50+',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Số giảng viên',
      description: 'Số giảng viên',
      group: 'stats',
      order: 72,
      isPublic: true,
    },
    {
      key: 'stats_branches',
      value: '6',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Số chi nhánh',
      description: 'Số chi nhánh toàn quốc',
      group: 'stats',
      order: 73,
      isPublic: true,
    },
    {
      key: 'stats_years',
      value: '10+',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Số năm kinh nghiệm',
      description: 'Số năm hoạt động',
      group: 'stats',
      order: 74,
      isPublic: true,
    },
    
    // =====================
    // APPEARANCE - DOMAIN / SYSTEM SETTINGS
    // =====================
    {
      key: 'domain_frontend',
      value: 'app.timona.edu.vn',
      type: SettingType.TEXT,
      category: SettingCategory.APPEARANCE,
      label: 'Domain Frontend',
      description: 'Domain frontend (Next.js)',
      group: 'domain',
      order: 90,
      isPublic: false,
    },
    {
      key: 'domain_api',
      value: 'appapi.timona.edu.vn',
      type: SettingType.TEXT,
      category: SettingCategory.APPEARANCE,
      label: 'Domain API',
      description: 'Domain backend API (NestJS)',
      group: 'domain',
      order: 91,
      isPublic: false,
    },
    {
      key: 'domain_storage',
      value: 'storage.timona.edu.vn',
      type: SettingType.TEXT,
      category: SettingCategory.APPEARANCE,
      label: 'Domain Storage',
      description: 'Domain storage (MinIO)',
      group: 'domain',
      order: 92,
      isPublic: false,
    },
    {
      key: 'minio_bucket',
      value: 'timona-uploads',
      type: SettingType.TEXT,
      category: SettingCategory.APPEARANCE,
      label: 'MinIO Bucket',
      description: 'Tên bucket MinIO',
      group: 'storage',
      order: 93,
      isPublic: false,
    },
    {
      key: 'frontend_port',
      value: '15000',
      type: SettingType.NUMBER,
      category: SettingCategory.APPEARANCE,
      label: 'Frontend Port',
      description: 'Port frontend',
      group: 'ports',
      order: 94,
      isPublic: false,
    },
    {
      key: 'backend_port',
      value: '15001',
      type: SettingType.NUMBER,
      category: SettingCategory.APPEARANCE,
      label: 'Backend Port',
      description: 'Port backend',
      group: 'ports',
      order: 95,
      isPublic: false,
    },
    
    // =====================
    // ACADEMY SPECIFIC SETTINGS (using CONTACT category)
    // =====================
    {
      key: 'academy_registration_email',
      value: 'tuyensinh@timona.edu.vn',
      type: SettingType.TEXT,
      category: SettingCategory.CONTACT,
      label: 'Email Tuyển sinh',
      description: 'Email nhận thông tin đăng ký khóa học',
      group: 'academy',
      order: 100,
      isPublic: true,
    },
    {
      key: 'academy_consultation_phone',
      value: '1900 2109',
      type: SettingType.TEXT,
      category: SettingCategory.CONTACT,
      label: 'Hotline Tư vấn',
      description: 'Số hotline tư vấn khóa học',
      group: 'academy',
      order: 101,
      isPublic: true,
    },
    {
      key: 'academy_scholarship_enabled',
      value: 'true',
      type: SettingType.BOOLEAN,
      category: SettingCategory.GENERAL,
      label: 'Hiển thị Học bổng',
      description: 'Bật/tắt hiển thị banner học bổng',
      group: 'promotion',
      order: 102,
      isPublic: true,
    },
    {
      key: 'academy_scholarship_text',
      value: 'Học bổng lên đến 50% cho học viên đăng ký sớm',
      type: SettingType.TEXT,
      category: SettingCategory.GENERAL,
      label: 'Nội dung Học bổng',
      description: 'Text hiển thị cho banner học bổng',
      group: 'promotion',
      order: 103,
      isPublic: true,
    },
    {
      key: 'video_intro_url',
      value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: SettingType.URL,
      category: SettingCategory.GENERAL,
      label: 'Video giới thiệu',
      description: 'Link video YouTube giới thiệu academy',
      group: 'video',
      order: 104,
      isPublic: true,
    },
  ];
  
  let created = 0;
  let updated = 0;
  
  for (const setting of settings) {
    try {
      const existing = await prisma.websiteSetting.findUnique({
        where: { key: setting.key },
      });
      
      if (existing) {
        await prisma.websiteSetting.update({
          where: { key: setting.key },
          data: setting,
        });
        updated++;
        console.log(`  ↻ Updated: ${setting.key}`);
      } else {
        await prisma.websiteSetting.create({
          data: {
            ...setting,
            isActive: true,
          },
        });
        created++;
        console.log(`  ✓ Created: ${setting.key}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed: ${setting.key}`, err);
    }
  }
  
  console.log(`\n  📊 Summary: ${created} created, ${updated} updated`);
}

async function main() {
  console.log('=========================================');
  console.log('  Timona Academy Settings Seeder');
  console.log('=========================================');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    await seedSettings();
    
    console.log('\n=========================================');
    console.log('✅ Settings seeding completed!');
    console.log('=========================================');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
