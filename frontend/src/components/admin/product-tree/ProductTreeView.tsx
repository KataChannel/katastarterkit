import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '@/graphql/product.queries';
import { DELETE_CATEGORY } from '@/graphql/category.queries';
import { normalizeImageUrl } from '@/utils/image-url';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Package,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  ImageIcon,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

interface TreeNode {
  id: string;
  type: 'category';
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
  products: any[];
  data: any;
}

interface ProductTreeViewProps {
  treeData: TreeNode[];
  expandedCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  onEditCategory: (category: any) => void;
  onRefetch: () => void;
}

export function ProductTreeView({
  treeData,
  expandedCategories,
  onToggleCategory,
  onEditCategory,
  onRefetch,
}: ProductTreeViewProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'category' | 'product' | 'category-with-products';
    item: any;
    products?: any[];
  }>({ open: false, type: 'product', item: null, products: [] });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success('Đã xóa sản phẩm');
      onRefetch();
    },
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success('Đã xóa danh mục');
      onRefetch();
    },
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const handleDelete = async () => {
    try {
      if (deleteDialog.type === 'category-with-products') {
        // Xóa tất cả sản phẩm trong danh mục trước
        if (deleteDialog.products && deleteDialog.products.length > 0) {
          toast.loading('Đang xóa sản phẩm...', { id: 'deleting-products' });
          for (const product of deleteDialog.products) {
            await deleteProduct({ variables: { id: product.id } });
          }
          toast.success(`Đã xóa ${deleteDialog.products.length} sản phẩm`, { id: 'deleting-products' });
        }
        // Sau đó xóa danh mục
        await deleteCategory({ variables: { id: deleteDialog.item.id } });
        setDeleteDialog({ open: false, type: 'product', item: null, products: [] });
      } else if (deleteDialog.type === 'category') {
        await deleteCategory({ variables: { id: deleteDialog.item.id } });
        setDeleteDialog({ open: false, type: 'product', item: null, products: [] });
      } else {
        await deleteProduct({ variables: { id: deleteDialog.item.id } });
        setDeleteDialog({ open: false, type: 'product', item: null, products: [] });
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleDeleteCategory = (node: TreeNode) => {
    if (node.products.length > 0) {
      // Có sản phẩm - hiện dialog xác nhận xóa cả sản phẩm
      setDeleteDialog({
        open: true,
        type: 'category-with-products',
        item: node.data,
        products: node.products,
      });
    } else {
      // Không có sản phẩm - xóa danh mục bình thường
      setDeleteDialog({
        open: true,
        type: 'category',
        item: node.data,
        products: [],
      });
    }
  };

  const getImageUrl = (url?: string | null) => {
    if (!url) return null;
    // Use normalizeImageUrl to handle HTTP → HTTPS conversion
    if (url.startsWith('http')) return normalizeImageUrl(url);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
    return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="divide-y">
      {treeData.map((node) => (
        <div key={node.id} className="group">
          {/* Category Row */}
          <div className="flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors">
            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onToggleCategory(node.id)}
              disabled={node.products.length === 0}
            >
              {node.products.length > 0 ? (
                expandedCategories.has(node.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <div className="w-4" />
              )}
            </Button>

            {/* Folder Icon */}
            <div className="flex-shrink-0">
              {expandedCategories.has(node.id) ? (
                <FolderOpen className="h-5 w-5 text-yellow-500" />
              ) : (
                <Folder className="h-5 w-5 text-yellow-500" />
              )}
            </div>

            {/* Category Image */}
            {node.image && (
              <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 border">
                <Image
                  src={getImageUrl(node.image) || ''}
                  alt={node.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}

            {/* Category Name & Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {node.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {node.productCount} sản phẩm
                </Badge>
                {!node.isActive && (
                  <Badge variant="outline" className="text-xs">
                    Tắt
                  </Badge>
                )}
              </div>
              {node.description && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                  {node.description}
                </p>
              )}
            </div>

            {/* Category Actions */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {node.id !== 'uncategorized' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditCategory(node.data)}
                    className="h-8 w-8 p-0"
                    title="Chỉnh sửa danh mục"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(node)}
                    className="h-8 w-8 p-0"
                    title={
                      node.products.length > 0
                        ? 'Xóa danh mục và tất cả sản phẩm'
                        : 'Xóa danh mục'
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Product List (Children) */}
          {expandedCategories.has(node.id) && node.products.length > 0 && (
            <div className="bg-muted/30">
              {node.products.map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 p-3 pl-16 hover:bg-muted/70 transition-colors border-l-2 border-primary/20 group/product"
                >
                  {/* Product Icon */}
                  <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                  {/* Product Thumbnail */}
                  {product.thumbnail ? (
                    <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 border">
                      <Image
                        src={getImageUrl(product.thumbnail) || ''}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">{product.name}</span>
                      {product.isFeatured && (
                        <TrendingUp className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                      )}
                      <Badge
                        variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {product.status === 'ACTIVE' ? 'Đang bán' : product.status === 'DRAFT' ? 'Nháp' : 'Ngừng'}
                      </Badge>
                      {product.stock <= 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Hết hàng
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Tồn: {product.stock} {product.unit}
                      </span>
                      {product.sku && (
                        <span className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Actions */}
                  <div className="flex-shrink-0 opacity-0 group-hover/product:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/san-pham/${product.slug}`, '_blank')}
                      className="h-8 w-8 p-0"
                      title="Xem sản phẩm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                      className="h-8 w-8 p-0"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, type: 'product', item: product })}
                      className="h-8 w-8 p-0"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open, type: 'product', item: null, products: [] })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 text-left">
                {deleteDialog.type === 'category-with-products' ? (
                  <>
                    <p>
                      Bạn có chắc chắn muốn xóa danh mục{' '}
                      <strong className="text-foreground">&quot;{deleteDialog.item?.name}&quot;</strong>?
                    </p>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm font-semibold text-destructive mb-1">
                        ⚠️ Cảnh báo: Danh mục này chứa {deleteDialog.products?.length} sản phẩm
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tất cả sản phẩm bên trong sẽ bị xóa vĩnh viễn cùng với danh mục.
                      </p>
                    </div>
                    <p className="text-sm">
                      Hành động này <strong>không thể hoàn tác</strong>. Bạn có chắc chắn muốn tiếp tục?
                    </p>
                  </>
                ) : deleteDialog.type === 'category' ? (
                  <p>
                    Bạn có chắc chắn muốn xóa danh mục{' '}
                    <strong className="text-foreground">&quot;{deleteDialog.item?.name}&quot;</strong>?
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Hành động này không thể hoàn tác.
                    </span>
                  </p>
                ) : (
                  <p>
                    Bạn có chắc chắn muốn xóa sản phẩm{' '}
                    <strong className="text-foreground">&quot;{deleteDialog.item?.name}&quot;</strong>?
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Hành động này không thể hoàn tác.
                    </span>
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteDialog.type === 'category-with-products' 
                ? `Xóa danh mục và ${deleteDialog.products?.length} sản phẩm` 
                : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
