'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Settings, Trash2, X } from 'lucide-react';
import { PageBlock, ProductCarouselBlockContent } from '@/types/page-builder';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/graphql/product.queries';
import { useDynamicQuery } from '@/lib/graphql/dynamic-hooks';
import { ProductCarouselSettingsDialog } from './ProductCarouselSettingsDialog';
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
  // Old schema (ext_sanphamhoadon)
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
  // New schema (Product table)
  name?: string;
  ten2?: string;
  ma?: string;
  price?: number;
  dgia?: number;
  unit?: string;
  dvt?: string;
  thumbnail?: string;
  image?: string;
  description?: string;
  shortDesc?: string;
  slug?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  category?: {
    id: string;
    name?: string;
    ten?: string;
  };
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
  const [imagePreview, setImagePreview] = useState<{ open: boolean; src: string; alt: string }>({
    open: false,
    src: '',
    alt: '',
  });

  // Determine data source table
  const dataSourceTable = editContent.dataSourceTable || 'ext_sanphamhoadon';
  
  // Fetch products based on data source
  // For new Product table, use GraphQL query
  const { 
    data: newProductsData, 
    loading: newProductsLoading 
  } = useQuery(GET_PRODUCTS, {
    variables: { 
      input: { 
        limit: editContent.itemsToShow || 8,
        page: 1 
      } 
    },
    skip: dataSourceTable !== 'Product',
    fetchPolicy: 'cache-first',
  });

  // For old ext_sanphamhoadon table, use dynamic query
  const { 
    data: oldProductsData, 
    loading: oldProductsLoading 
  } = useDynamicQuery('GET_ALL', dataSourceTable, {
    fetchPolicy: 'cache-first',
    skip: dataSourceTable === 'Product',
  });

  const loading = dataSourceTable === 'Product' ? newProductsLoading : oldProductsLoading;
  const productsData = dataSourceTable === 'Product' ? newProductsData : oldProductsData;

  // Extract products from response
  const rawProducts: Product[] = React.useMemo(() => {
    if (!productsData) return [];
    
    // For Product table (new schema)
    if (dataSourceTable === 'Product') {
      return productsData?.products?.items || [];
    }
    
    // For ext_sanphamhoadon table (old schema)
    if (dataSourceTable === 'ext_sanphamhoadon') {
      return productsData?.getext_sanphamhoadons || [];
    }
    
    // Generic fallback - try to find array in response
    const keys = Object.keys(productsData);
    const arrayKey = keys.find(key => Array.isArray(productsData[key]));
    return arrayKey ? productsData[arrayKey] : [];
  }, [productsData, dataSourceTable]);

  // Filter products based on settings
  const filteredProducts = React.useMemo(() => {
    let products = [...rawProducts];

    // Apply filter type
    switch (editContent.filterType) {
      case 'featured':
        products = products.filter(p => p.noibat === true || p.isFeatured === true);
        break;
      case 'bestseller':
        products = products.filter(p => p.banchay === true || p.isOnSale === true);
        break;
      case 'category':
        if (editContent.category) {
          products = products.filter(p => {
            // Old schema: danhmuc field
            if (p.danhmuc === editContent.category) return true;
            // New schema: category object
            if (p.category?.name === editContent.category || p.category?.ten === editContent.category) return true;
            if (p.category?.id === editContent.category) return true;
            return false;
          });
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
    return product.name || product.ten || product.ten2 || product.tensanpham || 'Sản phẩm';
  };

  const getProductPrice = (product: Product) => {
    return product.price || product.dgia || product.gia || product.dongia || 0;
  };

  const getProductImage = (product: Product) => {
    return product.thumbnail || product.image || product.hinhanh || '';
  };

  const getProductUnit = (product: Product) => {
    return product.unit || product.dvt || product.donvitinh || '';
  };

  const getProductSlug = (product: Product) => {
    return product.slug || product.ma || product.id;
  };

  const handleImagePreview = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview({
      open: true,
      src: getProductImage(product),
      alt: getProductName(product),
    });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to cart:', product.id, getProductName(product));
    // TODO: Implement add to cart functionality
    // You can integrate with your cart context/state here
  };

  // Debug logging
  useEffect(() => {
    console.log('[ProductCarousel] Debug Info:', {
      dataSourceTable,
      productsData,
      rawProducts: rawProducts.length,
      loading,
      editContent
    });
  }, [dataSourceTable, productsData, rawProducts, loading, editContent]);

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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">Không có sản phẩm nào</p>
              <p className="text-gray-500 text-sm mt-2">
                DataSource: {dataSourceTable} | Filter: {editContent.filterType}
              </p>
            </div>
          )}

          {/* Carousel */}
          {!loading && filteredProducts.length > 0 && (
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
                      {getProductImage(product) ? (
                        <Image
                          src={getProductImage(product)}
                          alt={getProductName(product)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ShoppingCart className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Quick View Button - Eye Icon */}
                      {getProductImage(product) && (
                        <button 
                          onClick={(e) => handleImagePreview(product, e)}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Xem ảnh lớn"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Product Name - Clickable to detail page */}
                      <Link 
                        href={`/san-pham/${getProductSlug(product)}`}
                        className="block hover:text-primary transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] hover:text-primary">
                          {getProductName(product)}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(getProductPrice(product))}
                          </p>
                          {getProductUnit(product) && (
                            <p className="text-xs text-gray-500">/{getProductUnit(product)}</p>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Mua ngay
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* View All Button */}
          {!loading && filteredProducts.length > 0 && editContent.showViewAllButton && editContent.viewAllLink && (
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
          onClick={() => setIsEditing(true)}
          className="bg-white shadow-sm hover:bg-blue-50"
        >
          <Settings className="w-4 h-4 mr-1" />
          Settings
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

      {/* Settings Dialog */}
      <ProductCarouselSettingsDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        settings={editContent}
        onSave={(newSettings) => {
          setEditContent(newSettings);
          onUpdate(newSettings);
        }}
      />

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

      {/* Image Preview Dialog */}
      <Dialog open={imagePreview.open} onOpenChange={(open) => setImagePreview({ ...imagePreview, open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setImagePreview({ open: false, src: '', alt: '' })}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng</span>
          </button>
          
          <div className="relative w-full h-[70vh]">
            {imagePreview.src && (
              <Image
                src={imagePreview.src}
                alt={imagePreview.alt}
                fill
                className="object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCarouselBlock;
