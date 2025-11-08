'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPublicMenus } from '@/actions/menu.actions';
import { useHeaderSettings, useContactSettings, settingsToMap } from '@/hooks/useWebsiteSettings';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Phone, Search, ShoppingCart, User, LogIn } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

// ListItem component for navigation menu
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; target?: string }
>(({ className, title, children, href, target, ...props }, ref) => {
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
          target={target === 'BLANK' ? '_blank' : undefined}
          rel={target === 'BLANK' ? 'noopener noreferrer' : undefined}
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

  // ✅ Load Header Settings
  const { data: headerSettingsRaw = [], loading: headerLoading } = useHeaderSettings();
  console.log('[WebsiteHeader] headerSettingsRaw:', headerSettingsRaw.length, 'items');
  const headerSettings = useMemo(() => settingsToMap(headerSettingsRaw), [headerSettingsRaw]);

  // ✅ Load Contact Settings
  const { data: contactSettingsRaw = [], loading: contactLoading } = useContactSettings();
  console.log('[WebsiteHeader] contactSettingsRaw:', contactSettingsRaw.length, 'items');
  const contactSettings = useMemo(() => settingsToMap(contactSettingsRaw), [contactSettingsRaw]);

  // ✅ MIGRATED: Fetch header menus with Server Actions
  const [headerMenus, setHeaderMenus] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setMenuLoading(true);
        const menus = await getPublicMenus({ 
          type: 'HEADER', // Only get HEADER type menus
          isActive: true, 
          includeChildren: true 
        });
        setHeaderMenus(Array.isArray(menus) ? menus : []);
      } catch (err) {
        setMenuError(err as Error);
        console.error('[WebsiteHeader] Failed to load menu:', err);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenus();
  }, []);

  console.log('[WebsiteHeader] headerSettings:', Object.keys(headerSettings).length, 'keys');
  console.log('[WebsiteHeader] contactSettings:', Object.keys(contactSettings).length, 'keys');
  console.log('[WebsiteHeader] headerMenus:', headerMenus.length);
  
  // Debug: log actual settings when available
  useEffect(() => {
    if (Object.keys(headerSettings).length > 0) {
      console.log('[WebsiteHeader] Header settings loaded:', headerSettings);
    }
    if (Object.keys(contactSettings).length > 0) {
      console.log('[WebsiteHeader] Contact settings loaded:', contactSettings);
    }
  }, [headerSettings, contactSettings]);
  
  // Banner data
  const bannerItems = [
    {
      id: 1,
      title: "Khuyến Mãi Đặc Biệt",
      subtitle: "Giảm giá lên đến 50% cho tất cả sản phẩm",
      description: "Ưu đãi có thời hạn - Nhanh tay đặt hàng!",
      image: "/assets/images/tunongtraidenbanan.jpg",
      cta: "Mua Ngay",
      badge: "HOT",
      bgColor: ""
    },
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

  // Helper function to render menu items
  const renderMenuItem = (item: any) => {
    if (!item.isVisible || !item.isActive) return null;

    // Determine destination URL
    const href = item.route || item.url || '#';
    const isExternalLink = item.target === 'BLANK' || item.externalUrl;

    // Check if item has children with content
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;

    if (hasChildren) {
      // Has children - render as dropdown
      return (
        <NavigationMenuItem key={item.id}>
          <NavigationMenuTrigger className="text-white hover:text-blue-200 bg-transparent hover:bg-white/10 data-[state=open]:bg-white/20 text-sm lg:text-base px-2 lg:px-4">
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.title}
            {item.badge && <Badge className="ml-2 text-xs">{item.badge}</Badge>}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {item.children.map((child: any) => {
                const childHref = child.route || child.url || '#';
                return (
                  <ListItem
                    key={child.id}
                    href={childHref}
                    title={child.title}
                    target={child.target === 'BLANK' ? '_blank' : undefined}
                  >
                    {child.description || child.title}
                  </ListItem>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    } else {
      // No children - render as simple link
      return (
        <NavigationMenuItem key={item.id}>
          <NavigationMenuLink asChild>
            <Link
              href={href}
              className={cn(
                navigationMenuTriggerStyle(),
                "text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-2 lg:px-4"
              )}
              target={isExternalLink ? '_blank' : undefined}
              rel={isExternalLink ? 'noopener noreferrer' : undefined}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
              {item.badge && <Badge className="ml-2 text-xs">{item.badge}</Badge>}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      );
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Carousel Banner */}
      {headerSettings['header.banner_enabled'] && (
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
                          <div className="mx-auto">
                              <div 
                                className="hidden lg:block w-full overflow-hidden shadow-2xl flex-shrink-0"
                                style={{ height: `${headerSettings['header.banner_height'] || 208}px` }}
                              >
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
      )}
      <div className="w-full mx-auto">
        <div 
          className="grid grid-cols-6 items-center"
          style={{ backgroundColor: headerSettings['header.background_color'] || '#57A345' }}
        >
          <div className="bg-white col-span-2 flex justify-end p-4 rounded-e-full pe-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              <img 
                src={headerSettings['header.logo'] || '/assets/images/logo.svg'} 
                alt="Logo" 
                className="max-h-20" 
                style={{ 
                  height: `${headerSettings['header.logo_width'] || 80}px`,
                  maxHeight: `${headerSettings['header.logo_width'] || 80}px` 
                }}
              />
            </Link>
          </div>  

        <div className="col-span-3 flex flex-col space-y-2">
          <NavigationMenu className="w-full p-4">
            <NavigationMenuList className="flex justify-evenly space-x-1 lg:space-x-2 w-full flex-wrap">
              {/* Trang Chủ */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  {/* <Link href="/" className={cn(navigationMenuTriggerStyle(), "text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-2 lg:px-4")}>
                    Trang Chủ
                  </Link> */}
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Render menu items from database */}
              {menuLoading ? (
                <div className="text-white text-sm">Đang tải menu...</div>
              ) : menuError ? (
                <div className="text-red-200 text-sm">Lỗi tải menu</div>
              ) : (
                headerMenus
                  .filter((item: any) => (item.level === 0 || item.level === 1) && item.isActive && item.isVisible)
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((item: any) => renderMenuItem(item))
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          {headerSettings['header.show_search'] && (
            <div className="flex flex-row items-center max-w-lg mx-8 mb-2 space-x-4">
              <Phone className="w-8 h-8 text-[#FAA61A]" />
              <a 
                href={`tel:${contactSettings['contact.phone'] || '0865770009'}`} 
                className="text-[#FAA61A] font-bold text-lg"
              >
                {contactSettings['contact.phone_display'] || '0865.77.0009'}
              </a>
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
          )}
        </div>                 
         <div className="flex items-center space-x-3 text-white">
                  {/* User Profile */}
                  {headerSettings['header.show_user_menu'] && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2">
                            {isAuthenticated && user ? (
                              // Đã đăng nhập: Hiện chữ cái đầu của email
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full p-0 text-white font-semibold"
                                onClick={() => router.push('/admin')}
                              >
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                              </Button>
                            ) : (
                              // Chưa đăng nhập: Hiện icon Login
                              <Button
                                size="sm"
                                variant="ghost"
                                className="flex items-center space-x-1 px-3 py-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all"
                                onClick={() => router.push('/auth/login')}
                              >
                                <LogIn className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">Đăng nhập</span>
                              </Button>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isAuthenticated && user ? user.email : 'Đăng nhập để tiếp tục'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {/* Shopping Cart */}
                  {headerSettings['header.show_cart'] && (
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
                  )}
          </div>    
        </div>
      </div>
    </header>
  );
}
