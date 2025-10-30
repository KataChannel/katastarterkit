'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useFooterSettings, useContactSettings, useSocialSettings, settingsToMap } from '@/hooks/useWebsiteSettings';

interface VisitorStats {
  Hientai?: number;
  Ngay?: number;
  Thang?: number;
  Tong?: number;
}

interface WebsiteFooterProps {
  visitors?: VisitorStats;
  currentYear?: number;
}

export function WebsiteFooter({ visitors, currentYear = new Date().getFullYear() }: WebsiteFooterProps) {
  // ✅ Load Footer Settings
  const { data: footerSettingsRaw = [] } = useFooterSettings();
  const footerSettings = useMemo(() => settingsToMap(footerSettingsRaw), [footerSettingsRaw]);

  // ✅ Load Contact Settings
  const { data: contactSettingsRaw = [] } = useContactSettings();
  const contactSettings = useMemo(() => settingsToMap(contactSettingsRaw), [contactSettingsRaw]);

  // ✅ Load Social Settings
  const { data: socialSettingsRaw = [] } = useSocialSettings();
  const socialSettings = useMemo(() => settingsToMap(socialSettingsRaw), [socialSettingsRaw]);

  // Hàm để định dạng số
  const formatNumber = (num?: number): string => num ? num.toLocaleString('en-US') : '0';

  return (
    <footer 
      className="bottom pt-12 text-white"
      style={{ backgroundColor: footerSettings['footer.background_color'] || '#000000' }}
    >
      {/* Container chính */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-10 grid-cols-1 gap-4 pb-12">

          {/* CỘT 1: THÔNG TIN LIÊN HỆ */}
          <div className="lg:col-span-4 col-span-1 flex flex-col space-y-2">
            <div className="!font-bold !text-xl">THÔNG TIN LIÊN HỆ</div>
            <div className="flex flex-col space-y-3">
              <span className="text-lg text-[#65b009]">
                <strong>{contactSettings['contact.company_name'] || 'CTY TNHH NÔNG SẢN THỰC PHẨM TRẦN GIA'}</strong>
              </span>
              <span>
                <strong>Địa chỉ:</strong> {contactSettings['contact.address'] || 'Tầng 3, An Phú Plaza, 117-119 Lý Chính Thắng P. Võ Thị Sáu, Q.3, TPHCM'}
              </span>
              <span>
                <strong>Hotline:</strong> {contactSettings['contact.phone_display'] || '0865.77.0009'}
              </span>
              <span>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${contactSettings['contact.email'] || 'mart.rausachtrangia@gmail.com'}`}>
                  {contactSettings['contact.email'] || 'mart.rausachtrangia@gmail.com'}
                </a>
              </span>
            </div>
          </div>
          
          {/* CỘT 2: VỀ CHÚNG TÔI & Mạng xã hội */}
          <div className="lg:col-span-2 grid-cols-1 col-span-1 flex flex-col space-y-2">
            <div className="!font-bold !text-xl">VỀ CHÚNG TÔI</div>
            <div className="flex flex-col space-y-2">
              <Link href="/blog/gioi-thieu/ve-chung-toi" passHref>
                <span>GIỚI THIỆU</span>
              </Link>
              <Link href="#" passHref>
                <span>KHUYẾN MÃI</span>
              </Link>
              <Link href="#" passHref>
                <span>MÓN NGON MỖI NGÀY</span>
              </Link>
              <Link href="#" passHref>
                <span>TIN TỨC</span>
              </Link>
              <Link href="#" passHref>
                <span>LIÊN HỆ</span>
              </Link>
            </div>
            {/* Icon Mạng xã hội */}
            {footerSettings['footer.show_social_links'] && (
              <div className="flex flex-row space-x-2 p-2 bg-white rounded-lg">
                {socialSettings['social.facebook_enabled'] && socialSettings['social.facebook'] && (
                  <a href={socialSettings['social.facebook']} target="_blank" rel="noopener noreferrer">
                    <img className="w-10" src="/assets/images/facebook.png" alt="Facebook" width="40" height="40" />
                  </a>
                )}
                {socialSettings['social.tiktok_enabled'] && socialSettings['social.tiktok'] && (
                  <a title="Tiktok" href={socialSettings['social.tiktok']} target="_blank" rel="noopener noreferrer">
                    <img className="w-10" src="/assets/images/tiktok.png" alt="Tiktok" width="40" height="40" />
                  </a>
                )}
                {socialSettings['social.youtube_enabled'] && socialSettings['social.youtube'] && (
                  <a title="Youtube Channel" href={socialSettings['social.youtube']} target="_blank" rel="noopener noreferrer">
                    <img className="w-10" src="/assets/images/youtube.png" alt="Youtube" width="40" height="40" />
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* CỘT 3: CHÍNH SÁCH QUY ĐỊNH */}
          <div className="lg:col-span-2 grid-cols-1 col-span-1 flex flex-col space-y-3">
            <div className="!font-bold !text-xl">CHÍNH SÁCH QUY ĐỊNH</div>
            <Link href="/blog/chinh-sach-quy-dinh/chinh-sach-bao-mat" target="_blank" rel="noopener noreferrer" passHref>
              Chính sách bảo mật
            </Link>
            <Link href="/blog/chinh-sach-quy-dinh/chinh-sach-thanh-toan" target="_blank" rel="noopener noreferrer" passHref>
              Chính sách thanh toán
            </Link>
            <Link href="/blog/chinh-sach-quy-dinh/chinh-sach-giao-hang" target="_blank" rel="noopener noreferrer" passHref>
              Chính sách giao hàng
            </Link>
            <Link href="/blog/chinh-sach-quy-dinh/chinh-sach-doi-tra" passHref>
              Chính sách đổi trả
            </Link>
          </div>
          
          {/* CỘT 4: THỐNG KÊ TRUY CẬP */}
          {footerSettings['footer.show_visitor_stats'] && (
            <div className="lg:col-span-2 grid-cols-1 col-span-1">
              <div className="!font-bold !text-xl">THỐNG KÊ TRUY CẬP</div>
              <div className="flex flex-col space-y-3 mt-3">
                <div className="flex flex-row space-x-2 items-center">
                  <BarChart3 className="w-5 h-5 text-[#65b009]" />
                  <span>Đang truy cập:</span>
                  <span className="font-semibold">{formatNumber(visitors?.Hientai)}</span>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <BarChart3 className="w-5 h-5 text-[#65b009]" />
                  <span>Hôm nay:</span>
                  <span className="font-semibold">{formatNumber(visitors?.Ngay)}</span>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <BarChart3 className="w-5 h-5 text-[#65b009]" />
                  <span>Trong tháng:</span>
                  <span className="font-semibold">{formatNumber(visitors?.Thang)}</span>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <BarChart3 className="w-5 h-5 text-[#65b009]" />
                  <span>Tổng truy cập:</span>
                  <span className="font-semibold">{formatNumber(visitors?.Tong)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Bottom (Copyright) */}
      <div className="py-4 bg-[#d7d7d7]">
        <div className="flex justify-center items-center container mx-auto px-4">
          <div className="text-sm text-center text-black">
            <span>
              &copy; Copyright {currentYear}{' '}
              <Link href="/" passHref>
                {contactSettings['contact.company_name'] || 'CÔNG TY TNHH NÔNG SẢN THỰC PHẨM TRẦN GIA'}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}