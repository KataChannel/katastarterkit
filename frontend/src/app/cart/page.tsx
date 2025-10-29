'use client';

import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  GET_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from '@/graphql/ecommerce.queries';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();

  // Fetch cart
  const { data, loading, error } = useQuery(GET_CART);

  // Mutations
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
    refetchQueries: [{ query: GET_CART }],
    onError: (error) => toast.error('Cập nhật thất bại: ' + error.message),
  });

  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    refetchQueries: [{ query: GET_CART }],
    onCompleted: () => toast.success('Đã xóa sản phẩm'),
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const [clearCart] = useMutation(CLEAR_CART, {
    refetchQueries: [{ query: GET_CART }],
    onCompleted: () => toast.success('Đã xóa toàn bộ giỏ hàng'),
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const cart = data?.cart;
  const items = cart?.items || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem({
        variables: { itemId, quantity: newQuantity },
      });
    } catch (err) {
      // Error handled by onError
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await removeFromCart({
          variables: { itemId },
        });
      } catch (err) {
        // Error handled by onError
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      try {
        await clearCart();
      } catch (err) {
        // Error handled by onError
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Có lỗi xảy ra</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => router.push('/products')}
            className="text-blue-600 hover:underline"
          >
            ← Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
              <p className="mt-1 text-gray-600">
                {cart?.totalItems || 0} sản phẩm
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear All Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa tất cả
                </button>
              </div>

              {/* Items List */}
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden"
                  >
                    <Image
                      src={item.product.featuredImage || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>

                    {item.variant && (
                      <p className="text-sm text-gray-600 mt-1">
                        Phân loại: {item.variant.name}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Price */}
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tổng: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-50 transition"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-50 transition"
                            disabled={
                              item.quantity >= (item.variant?.stock || item.product.stock)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                          title="Xóa"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity > (item.variant?.stock || item.product.stock) && (
                      <p className="text-xs text-red-600 mt-2">
                        Chỉ còn {item.variant?.stock || item.product.stock} sản phẩm
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({cart.totalItems} sản phẩm)</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(cart.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-sm">Tính khi thanh toán</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mb-3"
                >
                  Tiến hành thanh toán
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Tiếp tục mua sắm
                </Link>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Đổi trả miễn phí trong 7 ngày</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Bảo hành chính hãng</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
