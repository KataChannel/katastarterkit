'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function WebsiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex justify-start">
            <Link href="/website" className="text-2xl font-bold text-blue-600">
              KataCore
            </Link>
          </div>            
                <div className="flex-1 max-w-lg mx-8">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase()||'A'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">{user?.username}</span>
                  </div>
                  
                  <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>    
        </div>
        <div>
          <nav className="w-full border-t border-gray-200 p-4">
            <ul className="w-full flex justify-evenly space-x-8">
              <li>
                <Link href="/website" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Trang Chủ
                </Link>
              </li>
                <li className="relative group">
                <Link href="/website/gioi-thieu" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  Giới Thiệu
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                  <Link href="/website/gioi-thieu/ve-noom" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Về Noom
                  </Link>
                  <Link href="/website/gioi-thieu/tieu-chuan-chat-luong" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Tiêu Chuẩn Chất Lượng
                  </Link>
                  <Link href="/website/gioi-thieu/ho-so-cong-bo" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Hồ Sơ Công Bố
                  </Link>
                  <Link href="/website/gioi-thieu/quy-trinh-san-xuat" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Quy Trình Sản Xuất
                  </Link>
                  <Link href="/website/gioi-thieu/thong-tin-tuyen-dung" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Thông Tin Tuyển Dụng
                  </Link>
                  <Link href="/website/gioi-thieu/su-kien" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Sự Kiện
                  </Link>
                  </div>
                </div>
                </li>
              <li>
                <Link href="/website/san-pham" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link href="/website/dia-diem-phan-phoi" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Địa Điểm Phân Phối
                </Link>
              </li>
              <li>
                <Link href="/website/huong-dan-su-dung" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Hướng Dẫn Sử Dụng
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
