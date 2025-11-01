'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Settings, Trash2 } from 'lucide-react';
import { PageBlock, ProductCarouselBlockContent } from '@/types/page-builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDynamicQuery } from '@/lib/graphql/dynamic-hooks';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCarouselBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

interface Product {
  id: string;
  ten?: string;
  tensanpham?: string;
  gia?: number;
  dongia?: number;
  donvitinh?: string;
  hinhanh?: string;
  mota?: string;
  danhmuc?: string;
  noibat?: boolean;
  banchay?: boolean;
}

export const ProductCarouselBlock: React.FC<ProductCarouselBlockProps> = ({
  block,
  isEditable = true,
  onUpdate,
  onDelete,
}) => {
  const content = block.content as ProductCarouselBlockContent;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<ProductCarouselBlockContent>(content || {
    title: 'Sản phẩm nổi bật',
    filterType: 'all',
    itemsToShow: 8,
    showViewAllButton: true,
    viewAllLink: '/san-pham',
    autoplay: false,
    autoplayDelay: 3000,
    loop: true,
    showNavigation: true,
    responsive: {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch products using dynamic GraphQL
  const { data: productsData, loading } = useDynamicQuery('GET_ALL', 'ext_sanphamhoadon', {
    fetchPolicy: 'cache-first',
  });

  const rawProducts: Product[] = productsData?.getext_sanphamhoadons || [];

  // Filter products based on settings
  const filteredProducts = React.useMemo(() => {
    let products = [...rawProducts];

    // Apply filter type
    switch (editContent.filterType) {
      case 'featured':
        products = products.filter(p => p.noibat === true);
        break;
      case 'bestseller':
        products = products.filter(p => p.banchay === true);
        break;
      case 'category':
        if (editContent.category) {
          products = products.filter(p => p.danhmuc === editContent.category);
        }
        break;
      case 'custom':
        // Custom query would be handled differently
        break;
      default:
        // 'all' - no filter
        break;
    }

    // Limit items
    return products.slice(0, editContent.itemsToShow || 8);
  }, [rawProducts, editContent.filterType, editContent.category, editContent.itemsToShow]);

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return editContent.responsive?.desktop || 4;
    
    const width = window.innerWidth;
    if (width < 640) return editContent.responsive?.mobile || 2;
    if (width < 1024) return editContent.responsive?.tablet || 3;
    return editContent.responsive?.desktop || 4;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editContent.responsive]);

  // Autoplay
  useEffect(() => {
    if (!editContent.autoplay || isEditing) return;

    const interval = setInterval(() => {
      handleNext();
    }, editContent.autoplayDelay || 3000);

    return () => clearInterval(interval);
  }, [editContent.autoplay, editContent.autoplayDelay, currentIndex, isEditing]);

  const maxIndex = Math.max(0, filteredProducts.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(prev => {
      if (prev <= 0) {
        return editContent.loop ? maxIndex : 0;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex(prev => {
      if (prev >= maxIndex) {
        return editContent.loop ? 0 : maxIndex;
      }
      return prev + 1;
    });
  };

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const formatPrice = (price?: number) => {
    if (!price) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getProductName = (product: Product) => {
    return product.ten || product.tensanpham || 'Sản phẩm';
  };

  const getProductPrice = (product: Product) => {
    return product.gia || product.dongia || 0;
  };

  if (!isEditable) {
    // Frontend display mode
    return (
      <div className="product-carousel-block py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {editContent.title || 'Sản phẩm'}
            </h2>
            
            {editContent.showNavigation && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentIndex === 0 && !editContent.loop}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex && !editContent.loop}
                  className="rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-200">
                      {product.hinhanh ? (
                        <Image
                          src={product.hinhanh}
                          alt={getProductName(product)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ShoppingCart className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Quick View Button */}
                      <button className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                        {getProductName(product)}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(getProductPrice(product))}
                          </p>
                          {product.donvitinh && (
                            <p className="text-xs text-gray-500">/{product.donvitinh}</p>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button className="w-full" size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Mua ngay
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View All Button */}
          {editContent.showViewAllButton && editContent.viewAllLink && (
            <div className="text-center mt-6">
              <Link href={editContent.viewAllLink}>
                <Button variant="outline" size="lg">
                  Xem tất cả
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 text-gray-500">
              Đang tải sản phẩm...
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có sản phẩm nào
            </div>
          )}
        </div>
      </div>
    );
  }

  // Editor mode
  return (
    <div className="relative border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/20 group">
      {/* Control Bar */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white shadow-sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {isEditing && (
        <div className="absolute top-12 right-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-20 w-96 max-h-[80vh] overflow-y-auto">
          <h3 className="font-semibold mb-4 text-lg">Product Carousel Settings</h3>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label>Tiêu đề</Label>
              <Input
                value={editContent.title || ''}
                onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                placeholder="Sản phẩm nổi bật"
              />
            </div>

            {/* Filter Type */}
            <div>
              <Label>Loại sản phẩm</Label>
              <Select
                value={editContent.filterType || 'all'}
                onValueChange={(value: any) => setEditContent({ ...editContent, filterType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                  <SelectItem value="featured">Sản phẩm nổi bật</SelectItem>
                  <SelectItem value="bestseller">Sản phẩm bán chạy</SelectItem>
                  <SelectItem value="category">Theo danh mục</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category (if filterType is category) */}
            {editContent.filterType === 'category' && (
              <div>
                <Label>Danh mục</Label>
                <Input
                  value={editContent.category || ''}
                  onChange={(e) => setEditContent({ ...editContent, category: e.target.value })}
                  placeholder="Nhập tên danh mục"
                />
              </div>
            )}

            {/* Items to Show */}
            <div>
              <Label>Số lượng sản phẩm</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={editContent.itemsToShow || 8}
                onChange={(e) => setEditContent({ ...editContent, itemsToShow: parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">Tổng số sản phẩm hiển thị trong carousel</p>
            </div>

            {/* Responsive Settings */}
            <div className="border-t pt-4">
              <Label className="mb-3 block font-semibold">Số sản phẩm hiển thị/màn hình</Label>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">📱 Mobile (≤640px)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={editContent.responsive?.mobile || 2}
                    onChange={(e) => setEditContent({
                      ...editContent,
                      responsive: { ...editContent.responsive, mobile: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div>
                  <Label className="text-sm">💻 Tablet (641-1024px)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={editContent.responsive?.tablet || 3}
                    onChange={(e) => setEditContent({
                      ...editContent,
                      responsive: { ...editContent.responsive, tablet: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div>
                  <Label className="text-sm">🖥️ Desktop (≥1024px)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={editContent.responsive?.desktop || 4}
                    onChange={(e) => setEditContent({
                      ...editContent,
                      responsive: { ...editContent.responsive, desktop: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Label>Hiển thị nút điều hướng</Label>
              <Switch
                checked={editContent.showNavigation ?? true}
                onCheckedChange={(checked) => setEditContent({ ...editContent, showNavigation: checked })}
              />
            </div>

            {/* Autoplay */}
            <div className="flex items-center justify-between">
              <Label>Tự động chạy</Label>
              <Switch
                checked={editContent.autoplay ?? false}
                onCheckedChange={(checked) => setEditContent({ ...editContent, autoplay: checked })}
              />
            </div>

            {editContent.autoplay && (
              <div>
                <Label>Thời gian chuyển slide (ms)</Label>
                <Input
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  value={editContent.autoplayDelay || 3000}
                  onChange={(e) => setEditContent({ ...editContent, autoplayDelay: parseInt(e.target.value) })}
                />
              </div>
            )}

            {/* Loop */}
            <div className="flex items-center justify-between">
              <Label>Lặp vô hạn</Label>
              <Switch
                checked={editContent.loop ?? true}
                onCheckedChange={(checked) => setEditContent({ ...editContent, loop: checked })}
              />
            </div>

            {/* View All Button */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <Label>Nút "Xem tất cả"</Label>
                <Switch
                  checked={editContent.showViewAllButton ?? true}
                  onCheckedChange={(checked) => setEditContent({ ...editContent, showViewAllButton: checked })}
                />
              </div>

              {editContent.showViewAllButton && (
                <div>
                  <Label>Link "Xem tất cả"</Label>
                  <Input
                    value={editContent.viewAllLink || ''}
                    onChange={(e) => setEditContent({ ...editContent, viewAllLink: e.target.value })}
                    placeholder="/san-pham"
                  />
                </div>
              )}
            </div>

            {/* Preview Info */}
            <div className="border-t pt-4 bg-gray-50 p-3 rounded">
              <Label className="block mb-2">Preview Info</Label>
              <div className="text-xs space-y-1 text-gray-600">
                <div>Tổng sản phẩm: {filteredProducts.length}</div>
                <div>Mobile: {editContent.responsive?.mobile || 2} items</div>
                <div>Tablet: {editContent.responsive?.tablet || 3} items</div>
                <div>Desktop: {editContent.responsive?.desktop || 4} items</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">
                Lưu
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="pointer-events-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-700">
            {editContent.title || 'Sản phẩm'} (Preview)
          </h2>
          {editContent.showNavigation && (
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600">
            📦 {filteredProducts.length} sản phẩm • 
            {editContent.filterType === 'all' && ' Tất cả'}
            {editContent.filterType === 'featured' && ' Nổi bật'}
            {editContent.filterType === 'bestseller' && ' Bán chạy'}
            {editContent.filterType === 'category' && ` Danh mục: ${editContent.category || 'Chưa chọn'}`}
          </p>
          
          {loading && <p className="text-sm text-gray-500 mt-2">Đang tải...</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselBlock;
