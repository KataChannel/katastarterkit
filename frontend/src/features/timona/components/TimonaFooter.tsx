'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';

export default function TimonaFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#00256e] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#00256e] font-black text-2xl">T</span>
              </div>
              <div>
                <h3 className="font-black text-xl">TIMONA ACADEMY</h3>
                <p className="text-xs text-white/70">Học viện đào tạo thẩm mỹ quốc tế</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Timona Academy là hệ thống đào tạo nghề thẩm mỹ hàng đầu Việt Nam, 
              được cấp phép bởi Sở Lao động - Thương binh và Xã hội.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/timonaacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@timonaacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://zalo.me/timonaacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition"
                aria-label="Zalo"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm4.5 14h-9a.5.5 0 010-1h9a.5.5 0 010 1zm-4.5-3a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gioi-thieu" className="text-white/80 hover:text-white transition text-sm">
                  Về Timona Academy
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc" className="text-white/80 hover:text-white transition text-sm">
                  Các khóa học
                </Link>
              </li>
              <li>
                <Link href="/giang-vien" className="text-white/80 hover:text-white transition text-sm">
                  Đội ngũ giảng viên
                </Link>
              </li>
              <li>
                <Link href="/tuyen-dung" className="text-white/80 hover:text-white transition text-sm">
                  Cơ hội việc làm
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="text-white/80 hover:text-white transition text-sm">
                  Tin tức & Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-white/80 hover:text-white transition text-sm">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Khóa học</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/khoa-hoc/spa" className="text-white/80 hover:text-white transition text-sm">
                  Chuyên gia Spa & Chăm sóc da
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc/phun-xam" className="text-white/80 hover:text-white transition text-sm">
                  Phun xăm thẩm mỹ
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc/noi-mi" className="text-white/80 hover:text-white transition text-sm">
                  Nối mi chuyên nghiệp
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc/goi-dau" className="text-white/80 hover:text-white transition text-sm">
                  Gội đầu dưỡng sinh
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc/nail" className="text-white/80 hover:text-white transition text-sm">
                  Nail Art chuyên nghiệp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:19002109" className="text-white hover:text-yellow-400 transition font-bold">
                    19002109
                  </a>
                  <p className="text-xs text-white/60">(24/7 - Miễn phí)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@timona.edu.vn" className="text-white/80 hover:text-white transition text-sm">
                  info@timona.edu.vn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  1012-1014 Quang Trung,<br />
                  P.8, Q. Gò Vấp, TP.HCM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>© {currentYear} Timona Academy. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/chinh-sach-bao-mat" className="hover:text-white transition">
                Chính sách bảo mật
              </Link>
              <Link href="/dieu-khoan-su-dung" className="hover:text-white transition">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
