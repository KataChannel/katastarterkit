/**
 * SearchResultsView - Component hiển thị kết quả tìm kiếm sản phẩm
 * Optimized cho server-side search với lazy loading
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '@/graphql/product.queries';
import { normalizeImageUrl } from '@/utils/image-url';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Folder,
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
import { TreeProduct } from '@/hooks/useOptimizedProductTree';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SearchResultsViewProps {
  results: TreeProduct[];
  searchTerm: string;
  onRefetch: () => void;
}

export function SearchResultsView({
  results,
  searchTerm,
  onRefetch,
}: SearchResultsViewProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: TreeProduct | null;
  }>({ open: false, product: null });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success('Đã xóa sản phẩm');
      onRefetch();
    },
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const handleDelete = async () => {
    if (deleteDialog.product) {
      await deleteProduct({ variables: { id: deleteDialog.product.id } });
    }
    setDeleteDialog({ open: false, product: null });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-700">Đang bán</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Nháp</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge variant="destructive">Hết hàng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Hình ảnh</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead className="hidden md:table-cell">Danh mục</TableHead>
            <TableHead className="hidden sm:table-cell">Giá</TableHead>
            <TableHead className="hidden sm:table-cell">Kho</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[120px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((product) => (
            <TableRow key={product.id} className="group hover:bg-muted/50">
              {/* Thumbnail */}
              <TableCell>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {product.thumbnail ? (
                    <Image
                      src={normalizeImageUrl(product.thumbnail)}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </TableCell>

              {/* Product Info */}
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium line-clamp-1">
                    {highlightText(product.name, searchTerm)}
                  </span>
                  {product.sku && (
                    <span className="text-xs text-muted-foreground">
                      SKU: {highlightText(product.sku, searchTerm)}
                    </span>
                  )}
                  {product.isFeatured && (
                    <Badge variant="outline" className="w-fit text-xs border-yellow-400 text-yellow-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Nổi bật
                    </Badge>
                  )}
                </div>
              </TableCell>

              {/* Category */}
              <TableCell className="hidden md:table-cell">
                {product.category ? (
                  <Badge variant="outline" className="gap-1">
                    <Folder className="h-3 w-3" />
                    {highlightText(product.category.name, searchTerm)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Chưa phân loại</span>
                )}
              </TableCell>

              {/* Price */}
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  {formatPrice(product.price)}
                </div>
              </TableCell>

              {/* Stock */}
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-1">
                  {product.stock <= 0 ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Hết
                    </Badge>
                  ) : product.stock <= 10 ? (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-400 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {product.stock}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {product.stock} {product.unit || 'đơn vị'}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>{getStatusBadge(product.status)}</TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Xem chi tiết"
                    onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Chỉnh sửa"
                    onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    title="Xóa"
                    onClick={() => setDeleteDialog({ open: true, product })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, product: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa sản phẩm &quot;{deleteDialog.product?.name}&quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
