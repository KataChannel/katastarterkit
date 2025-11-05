'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { Product, GetProductsInput } from '@/graphql/product.queries';
import { DataImportComponent } from '@/components/DataImport';
import { ImportExportDialog } from '@/components/admin/ImportExportDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  Upload,
  FileSpreadsheet,
  Info,
} from 'lucide-react';
import { useActiveCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  DRAFT: { label: 'Nháp', variant: 'secondary' },
  ACTIVE: { label: 'Đang bán', variant: 'default' },
  INACTIVE: { label: 'Ngừng bán', variant: 'outline' },
  OUT_OF_STOCK: { label: 'Hết hàng', variant: 'destructive' },
  DISCONTINUED: { label: 'Ngừng kinh doanh', variant: 'destructive' },
};

const UNIT_LABELS: Record<string, string> = {
  KG: 'kg',
  G: 'g',
  BUNDLE: 'bó',
  PIECE: 'củ',
  BAG: 'túi',
  BOX: 'hộp',
};

export default function ProductsPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<GetProductsInput>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    filters: {},
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [importExcelDialogOpen, setImportExcelDialogOpen] = React.useState(false);

  const { products, pagination, loading, error, refetch } = useProducts(filters);
  const { categories } = useActiveCategories();
  const { deleteProduct, loading: deleting } = useDeleteProduct();

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        filters: {
          ...prev.filters,
          search: searchTerm || undefined,
        },
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      filters: {
        ...prev.filters,
        [key]: value || undefined,
      },
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleDeleteClick = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      toast.success(`Đã xóa sản phẩm "${product.name}"`);
      refetch();
    } catch (error) {
      toast.error('Lỗi khi xóa sản phẩm');
      console.error(error);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (filters.filters?.categoryId) {
        queryParams.append('categoryId', filters.filters.categoryId as string);
      }
      if (filters.filters?.status) {
        queryParams.append('status', filters.filters.status as string);
      }

      const backendUrl = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.replace('/graphql', '') || 'http://localhost:12001';
      const url = `${backendUrl}/api/product-import-export/export${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `SanPham_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      toast.success('Đã export sản phẩm thành công');
    } catch (error) {
      toast.error('Không thể export sản phẩm');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách sản phẩm, giá cả và tồn kho
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportExcelDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import (Drag-Drop)
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => router.push('/admin/products/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo sản phẩm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang bán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hết hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.status === 'OUT_OF_STOCK').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nháp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {products.filter((p) => p.status === 'DRAFT').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.filters?.categoryId || 'all'}
              onValueChange={(value) =>
                handleFilterChange('categoryId', value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.filters?.status || 'all'}
              onValueChange={(value) =>
                handleFilterChange('status', value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Lỗi: {error.message}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy sản phẩm nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Ảnh</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Tồn kho</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          {product.name}
                          {product.isFeatured && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Nổi bật
                            </Badge>
                          )}
                        </div>
                        {product.sku && (
                          <div className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{product.category?.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatPrice(product.price)}
                          </div>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <div className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={
                            product.stock === 0
                              ? 'text-red-600 font-medium'
                              : product.stock <= product.minStock
                              ? 'text-yellow-600 font-medium'
                              : ''
                          }
                        >
                          {product.stock} {UNIT_LABELS[product.unit]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_LABELS[product.status].variant}>
                          {STATUS_LABELS[product.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => router.push(`/sanpham/${product.slug}`)}
                            title="Xem"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              router.push(`/admin/products/${product.id}`)
                            }
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteClick(product)}
                            title="Xóa"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} của{' '}
                  {pagination.total} sản phẩm
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Import/Export Dialog cũ (Template-based) */}
      <ImportExportDialog
        open={importExcelDialogOpen}
        onOpenChange={setImportExcelDialogOpen}
        title="Import Sản Phẩm (Template)"
        description="Tải template Excel, điền dữ liệu và upload lại để import hàng loạt"
        templateUrl="/api/product-import-export/template"
        importUrl="/api/product-import-export/import"
        onImportSuccess={() => {
          refetch();
          toast.success('Import sản phẩm thành công');
          setImportExcelDialogOpen(false);
        }}
      />

      {/* Import/Export Dialog mới với Drag-Drop Mapping */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Import Sản Phẩm với Drag-Drop Mapping
            </DialogTitle>
            <DialogDescription>
              Copy dữ liệu từ Excel, JSON hoặc Text → Preview → Drag-Drop Mapping → Import vào database
            </DialogDescription>
          </DialogHeader>
          
          {/* Quick Guide */}
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Hướng dẫn nhanh:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Copy dữ liệu từ Excel (bao gồm header) → Paste vào ô textarea</li>
                <li>Click &quot;Preview Dữ Liệu&quot; → Hệ thống load schema Product</li>
                <li><strong>Drag-Drop:</strong> Kéo field bên trái → Thả vào field bên phải</li>
                <li>Kiểm tra: Cam = Required chưa map, Xanh lá = Đã map ✓</li>
                <li>Click &quot;Import&quot; khi validation hoàn tất</li>
              </ol>
            </AlertDescription>
          </Alert>
          
          <DataImportComponent
            modelName="Product"
            onImportComplete={(result) => {
              console.log('Import result:', result);
              if (result.success) {
                refetch();
                toast.success(`Import thành công ${result.successRows || 0} sản phẩm`);
                setImportDialogOpen(false);
              } else {
                toast.error(`Import thất bại: ${result.errors?.[0] || 'Unknown error'}`);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
