'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GET_CART, CREATE_ORDER } from '@/graphql/ecommerce.queries';
import { CreditCard, Truck, MapPin, Phone, Mail, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodBadge } from '@/components/ecommerce/PaymentMethodBadge';
import { PriceDisplay } from '@/components/ecommerce/PriceDisplay';
import { getSessionId } from '@/lib/session';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const { isAuthenticated } = useAuth();

  // Get or create session ID on mount
  useEffect(() => {
    const id = getSessionId();
    if (id) {
      setSessionId(id);
    }
  }, []);

  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(GET_CART, {
    variables: {
      sessionId: !isAuthenticated && sessionId ? sessionId : undefined,
    },
    skip: !isAuthenticated && !sessionId,
    fetchPolicy: 'network-only', // Always fetch fresh data for checkout
  });

  const [formData, setFormData] = useState({
    // Shipping Address
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    
    // Payment
    paymentMethod: 'COD',
    
    // Shipping
    shippingMethod: 'STANDARD',
    
    // Notes
    notes: '',
  });

  const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      if (data.createOrder.success) {
        const order = data.createOrder.order;
        toast({
          title: 'Thành công',
          description: 'Đặt hàng thành công!',
          type: 'success',
        });
        // Redirect to success page with order info
        router.push(
          `/thanh-toan/thanh-cong?orderNumber=${order.orderNumber}&totalAmount=${order.total}&paymentMethod=${formData.paymentMethod}`
        );
      } else {
        toast({
          title: 'Lỗi',
          description: data.createOrder.message || 'Đặt hàng thất bại',
          type: 'error',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Đặt hàng thất bại: ' + error.message,
        type: 'error',
        variant: 'destructive',
      });
    },
  });

  const cart = cartData?.cart || cartData?.getCart;
  const items = cart?.items || [];

  // Auto-redirect if cart is empty (better UX than showing empty state)
  useEffect(() => {
    // Only check after loading is complete and cart data is available
    if (!cartLoading && cartData) {
      const hasItems = items && items.length > 0;
      
      if (!hasItems) {
        toast({
          title: 'Giỏ hàng trống',
          description: 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán',
          type: 'warning',
          variant: 'default',
        });
        router.push('/san-pham');
      }
    }
  }, [cartLoading, cartData, items, router, toast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Use shipping fee from cart (calculated by backend)
  // Backend applies free shipping rules and dynamic calculations
  const shippingFee = cart?.shippingFee || 0;
  const tax = cart?.tax || 0;
  
  // Total already includes shipping and tax from backend
  const finalTotal = cart?.total || 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng điền đầy đủ thông tin giao hàng',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Giỏ hàng trống',
        description: 'Vui lòng thêm sản phẩm vào giỏ hàng',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createOrder({
        variables: {
          input: {
            shippingAddress: {
              fullName: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              city: formData.city,
              district: formData.district,
              ward: formData.ward,
            },
            paymentMethod: formData.paymentMethod,
            shippingMethod: formData.shippingMethod,
            notes: formData.notes,
            sessionId: !isAuthenticated && sessionId ? sessionId : undefined,
          },
        },
      });
    } catch (err) {
      // Error handled by onError
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-bold mb-2">Lỗi tải giỏ hàng</h2>
            <p className="text-sm">{cartError.message}</p>
          </div>
          <button
            onClick={() => router.push('/gio-hang')}
            className="text-blue-600 hover:underline"
          >
            ← Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  // This fallback should rarely be reached due to useEffect redirect
  // But kept for SSR and edge cases
  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-yellow-50 p-8 rounded-lg mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-600 mb-4">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
            </p>
          </div>
          <button
            onClick={() => router.push('/san-pham')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Khám phá sản phẩm
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/cart')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Thông tin giao hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Số nhà, tên đường"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hồ Chí Minh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Quận 1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phường Bến Nghé"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Phương thức vận chuyển
                </h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="STANDARD"
                    checked={formData.shippingMethod === 'STANDARD'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Giao hàng tiêu chuẩn</p>
                    <p className="text-sm text-gray-600">Giao trong 3-5 ngày</p>
                  </div>
                  <span className="font-bold text-gray-900">
                    {cart.total >= 500000 ? 'Miễn phí' : formatPrice(30000)}
                  </span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="EXPRESS"
                    checked={formData.shippingMethod === 'EXPRESS'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Giao hàng nhanh</p>
                    <p className="text-sm text-gray-600">Giao trong 1-2 ngày</p>
                  </div>
                  <span className="font-bold text-gray-900">
                    {cart.total >= 500000 ? 'Miễn phí' : formatPrice(50000)}
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Chuyển khoản ngân hàng</p>
                    <p className="text-sm text-gray-600">Đang cập nhật...</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">VNPay</p>
                    <p className="text-sm text-gray-600">Đang cập nhật...</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Ghi chú đơn hàng (Tùy chọn)
              </h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Đơn hàng ({cart.itemCount} sản phẩm)
              </h2>

              {/* Items List */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={item.product.thumbnail || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
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
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>

                {tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế VAT</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={creating}
                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
              >
                {creating ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>

              {/* Security Note */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                Thông tin của bạn được bảo mật an toàn
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
