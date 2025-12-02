'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Trang chủ', href: '/timona' },
  {
    label: 'Khóa học',
    href: '/timona/khoa-hoc',
    children: [
      { label: 'Chuyên gia Spa & Chăm sóc da', href: '/timona/khoa-hoc?category=spa' },
      { label: 'Phun xăm thẩm mỹ', href: '/timona/khoa-hoc?category=phun-xam' },
      { label: 'Nối mi chuyên nghiệp', href: '/timona/khoa-hoc?category=noi-mi' },
      { label: 'Gội đầu dưỡng sinh', href: '/timona/khoa-hoc?category=goi-dau' },
    ],
  },
  { label: 'Giảng viên', href: '/timona/giang-vien' },
  { label: 'Tin tức', href: '/timona/tin-tuc' },
  { label: 'Cơ hội việc làm', href: '/timona/tuyen-dung' },
  { label: 'Liên hệ', href: '/timona/lien-he' },
];

export default function TimonaHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-[#00256e] text-white text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="tel:19002109" className="flex items-center gap-2 hover:text-yellow-400 transition">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">Hotline: 19002109</span>
                <span className="text-white/70">(24/7 - Miễn phí)</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span>Học bổng đến 50% học phí</span>
              <a
                href="#register"
                className="bg-yellow-400 text-[#00256e] px-4 py-1 rounded-full font-bold hover:bg-yellow-300 transition"
              >
                ĐĂNG KÝ NGAY
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/timona" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00256e] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-2xl">T</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-[#00256e] text-xl leading-tight">TIMONA ACADEMY</h1>
              <p className="text-xs text-gray-500">Học viện đào tạo thẩm mỹ quốc tế</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#00256e] font-semibold transition ${
                    openDropdown === item.href ? 'text-[#00256e]' : ''
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div
                    className={`absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 transition-all duration-200 ${
                      openDropdown === item.href
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#00256e] transition"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="#register"
              className="bg-[#00256e] text-white px-6 py-3 rounded-full font-bold hover:bg-[#003580] transition shadow-lg"
            >
              ĐĂNG KÝ TƯ VẤN
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#00256e] rounded-lg font-semibold transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-gray-500 hover:text-[#00256e] text-sm transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href="tel:19002109"
              className="flex items-center justify-center gap-2 bg-[#00256e] text-white px-6 py-3 rounded-full font-bold"
            >
              <Phone className="w-5 h-5" />
              Gọi ngay: 19002109
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
