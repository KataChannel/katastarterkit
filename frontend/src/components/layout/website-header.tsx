'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export function WebsiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Banner data
  const bannerItems = [
    {
      id: 1,
      title: "Khuyến Mãi Đặc Biệt",
      subtitle: "Giảm giá lên đến 50% cho tất cả sản phẩm",
      description: "Ưu đãi có thời hạn - Nhanh tay đặt hàng!",
      image: "https://placehold.co/1920x200/png/white?text=No+Image",
      cta: "Mua Ngay",
      badge: "HOT",
      bgColor: "bg-gradient-to-r from-red-500 to-pink-600"
    },
    // {
    //   id: 2,
    //   title: "Sản Phẩm Mới",
    //   subtitle: "Bộ sưu tập mới nhất 2024",
    //   description: "Khám phá những sản phẩm chất lượng cao mới nhất",
    //   image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
    //   cta: "Khám Phá",
    //   badge: "NEW",
    //   bgColor: "bg-gradient-to-r from-blue-500 to-cyan-600"
    // },
    // {
    //   id: 3,
    //   title: "Chất Lượng Đảm Bảo",
    //   subtitle: "Cam kết 100% chính hãng",
    //   description: "Sản phẩm được kiểm định chất lượng nghiêm ngặt",
    //   image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300&fit=crop",
    //   cta: "Tìm Hiểu",
    //   badge: "QUALITY",
    //   bgColor: "bg-gradient-to-r from-green-500 to-emerald-600"
    // }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const [api, setApi] = useState<any>();

  // Auto-slide functionality
  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [api]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Carousel Banner */}
      <div className="relative overflow-hidden">
        <Carousel 
          className="w-full mx-auto"
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {bannerItems.map((item, index) => (
              <CarouselItem key={item.id}>
                <div className="relative">
                  <Card className="border-0 rounded-none">
                    <CardContent className={`relative p-0 ${item.bgColor} overflow-hidden`}>
                      <div className="relative z-10 h-full flex items-center">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="hidden lg:block w-96 h-56 rounded-xl overflow-hidden shadow-2xl ml-8 flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm" />
          <CarouselNext className="right-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm" />
        </Carousel>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
              onClick={() => {
                if (api) {
                  api.scrollTo(index);
                }
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full mx-auto">
        <div className="bg-[#57A345] grid grid-cols-6 items-center py-2">
          <div className="bg-white col-span-2 flex justify-end p-4 rounded-e-full pe-8">
            <Link href="/website" className="text-2xl font-bold text-blue-600">
              <img src="https://shop.rausachtrangia.com/assets/images/logo-full.png" alt="Logo" className="max-h-20" />
            </Link>
          </div>  
          
        <div className="col-span-3 flex flex-col space-y-2">
          <nav className="text-white w-full p-4">
            <ul className="w-full flex justify-evenly space-x-8">
              <li>
                <Link href="/website" className="hover:text-blue-600 transition-colors">
                  Trang Chủ
                </Link>
              </li>
                <li className="relative group">
                <Link href="/website/gioi-thieu" className="hover:text-blue-600 transition-colors flex items-center">
                  Giới Thiệu
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                  <Link href="/website/gioi-thieu/ve-noom" className="block px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Về Noom
                  </Link>
                  <Link href="/website/gioi-thieu/tieu-chuan-chat-luong" className="block px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Tiêu Chuẩn Chất Lượng
                  </Link>
                  <Link href="/website/gioi-thieu/ho-so-cong-bo" className="block px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Hồ Sơ Công Bố
                  </Link>
                  <Link href="/website/gioi-thieu/quy-trinh-san-xuat" className="block px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Quy Trình Sản Xuất
                  </Link>
                  <Link href="/website/gioi-thieu/thong-tin-tuyen-dung" className="block px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Thông Tin Tuyển Dụng
                  </Link>
                  <Link href="/website/gioi-thieu/su-kien" className="block px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                    Sự Kiện
                  </Link>
                  </div>
                </div>
                </li>
              <li>
                <Link href="/website/san-pham" className="hover:text-blue-600 transition-colors">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link href="/website/dia-diem-phan-phoi" className="hover:text-blue-600 transition-colors">
                  Địa Điểm Phân Phối
                </Link>
              </li>
              <li>
                <Link href="/website/huong-dan-su-dung" className="hover:text-blue-600 transition-colors">
                  Hướng Dẫn Sử Dụng
                </Link>
              </li>
            </ul>
          </nav>
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
                  
                  <button className="relative p-2 hover:text-blue-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>
          </div>    
        </div>
      </div>
    </header>
  );
}
