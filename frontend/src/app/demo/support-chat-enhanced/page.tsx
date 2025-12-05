'use client';

import SupportChatWidgetEnhanced from '@/components/support-chat/SupportChatWidgetEnhanced';

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Support Chat Widget - Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Trang demo cho tính năng support chat nâng cao với các phương thức đăng nhập:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-semibold text-gray-900">Đăng nhập với Số điện thoại</h3>
                <p className="text-sm text-gray-600">
                  Guest có thể chat bằng cách nhập tên và số điện thoại
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-semibold text-gray-900">Đăng nhập với Zalo</h3>
                <p className="text-sm text-gray-600">
                  Sử dụng tài khoản Zalo để đăng nhập nhanh chóng
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="font-semibold text-gray-900">Đăng nhập với Facebook</h3>
                <p className="text-sm text-gray-600">
                  Kết nối qua tài khoản Facebook của bạn
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="font-semibold text-gray-900">Đăng nhập với Google</h3>
                <p className="text-sm text-gray-600">
                  Sử dụng tài khoản Google để đăng nhập
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tính năng
          </h2>
          
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Real-time messaging với WebSocket</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Customer identification và tracking</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Hiển thị icon theo loại authentication</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>AI-powered suggestions cho agents</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Typing indicators</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Read receipts</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Mobile responsive design</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Chat Widget */}
      <SupportChatWidgetEnhanced
        apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001'}
        websocketUrl={process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:12001/support-chat'}
        primaryColor="#2563eb"
        position="bottom-right"
        enableZaloLogin={true}
        enableFacebookLogin={true}
        enableGoogleLogin={true}
      />
    </div>
  );
}
