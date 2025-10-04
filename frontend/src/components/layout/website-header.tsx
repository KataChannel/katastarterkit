'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

// ListItem component for navigation menu
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || "#"}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
          >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

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
            <Link
              href="/website"
              className="text-2xl font-bold text-blue-600"
              >
              <img src="https://shop.rausachtrangia.com/assets/images/logo-full.png" alt="Logo" className="max-h-20" />
            </Link>
          </div>  

        <div className="col-span-3 flex flex-col space-y-2">
          <NavigationMenu className="w-full p-4">
            <NavigationMenuList className="flex justify-evenly space-x-1 lg:space-x-2 w-full">
              <NavigationMenuItem>
                <Link href="/website" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-2 lg:px-4")}>
                    Trang Chủ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-blue-200 bg-transparent hover:bg-white/10 data-[state=open]:bg-white/20 text-sm lg:text-base px-2 lg:px-4">
                  Giới Thiệu
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/website/gioi-thieu"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Về Chúng Tôi
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Tìm hiểu thêm về công ty và các giá trị cốt lõi của chúng tôi.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                    <ListItem href="/website/gioi-thieu/ve-noom" title="Về Noom">
                      Câu chuyện thương hiệu và sứ mệnh của chúng tôi.
                    </ListItem>
                    <ListItem href="/website/gioi-thieu/tieu-chuan-chat-luong" title="Tiêu Chuẩn Chất Lượng">
                      Cam kết về chất lượng sản phẩm và dịch vụ.
                    </ListItem>
                    <ListItem href="/website/gioi-thieu/ho-so-cong-bo" title="Hồ Sơ Công Bố">
                      Thông tin pháp lý và chứng nhận chất lượng.
                    </ListItem>
                    <ListItem href="/website/gioi-thieu/quy-trinh-san-xuat" title="Quy Trình Sản Xuất">
                      Tìm hiểu về quy trình sản xuất hiện đại.
                    </ListItem>
                    <ListItem href="/website/gioi-thieu/thong-tin-tuyen-dung" title="Tuyển Dụng">
                      Cơ hội nghề nghiệp tại công ty chúng tôi.
                    </ListItem>
                    <ListItem href="/website/gioi-thieu/su-kien" title="Sự Kiện">
                      Các hoạt động và sự kiện nổi bật.
                    </ListItem>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/website/san-pham" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-2 lg:px-4")}>
                    Sản Phẩm
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/website/dia-diem-phan-phoi" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-1 lg:px-4")}>
                    <span className="hidden lg:inline">Địa Điểm Phân Phối</span>
                    <span className="lg:hidden">Phân Phối</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/website/huong-dan-su-dung" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-1 lg:px-4")}>
                    <span className="hidden lg:inline">Hướng Dẫn Sử Dụng</span>
                    <span className="lg:hidden">Hướng Dẫn</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-10 py-2 bg-white/90 backdrop-blur-sm border-white/20 focus:bg-white focus:border-blue-300 transition-all"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute inset-y-0 right-0 h-full px-3 text-gray-400 hover:text-gray-600"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>                 
         <div className="flex items-center space-x-3 text-white">
                  {/* User Profile */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full p-0 text-white"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <span className="text-white font-medium text-sm hidden md:inline">
                      {user?.username || 'Guest'}
                    </span>
                  </div>
                  
                  {/* Shopping Cart */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="relative p-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      0
                    </Badge>
                  </Button>
          </div>    
        </div>
      </div>
    </header>
  );
}
