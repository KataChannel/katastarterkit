'use client';

import React from 'react';
import SupportChatWidgetSimple from '@/components/support-chat/SupportChatWidgetSimple';

export default function SupportChatSimpleDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demo: Support Chat Widget (Đơn giản - Chỉ điện thoại)
          </h1>
          <p className="text-gray-600 mb-6">
            Widget chat hỗ trợ khách hàng với xác thực số điện thoại + tên.
            Click vào nút chat ở góc dưới bên phải để bắt đầu.
          </p>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">✨ Tính năng</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Xác thực đơn giản qua số điện thoại + tên</li>
                <li>• Real-time messaging với WebSocket</li>
                <li>• Typing indicators (hiển thị đang nhập)</li>
                <li>• Read receipts (tick xanh khi đã đọc)</li>
                <li>• Quick replies (trả lời nhanh)</li>
                <li>• Mobile-first responsive design</li>
                <li>• Auto-scroll to latest message</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-2">🔧 Kỹ thuật</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Next.js 15 + React 19</li>
                <li>• Apollo Client (GraphQL)</li>
                <li>• Socket.io WebSocket</li>
                <li>• Framer Motion animations</li>
                <li>• shadcn UI components</li>
                <li>• Clean Architecture</li>
                <li>• Dialog header/footer pattern</li>
              </ul>
            </div>
          </div>

          {/* Usage Guide */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">📝 Hướng dẫn sử dụng</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li><strong>1.</strong> Click vào biểu tượng chat ở góc dưới bên phải</li>
              <li><strong>2.</strong> Nhập tên và số điện thoại của bạn</li>
              <li><strong>3.</strong> Click "Bắt đầu chat" để kết nối</li>
              <li><strong>4.</strong> Gửi tin nhắn và nhận phản hồi real-time</li>
              <li><strong>5.</strong> Sử dụng quick replies để trả lời nhanh</li>
            </ol>
          </div>
        </div>

        {/* Integration Code */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💻 Cách tích hợp</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Import component</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import SupportChatWidgetSimple from '@/components/support-chat/SupportChatWidgetSimple';`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Thêm vào layout/page</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<SupportChatWidgetSimple
  apiUrl="http://localhost:12001"
  websocketUrl="http://localhost:12001/support-chat"
  primaryColor="#2563eb"
  position="bottom-right"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Props cấu hình</h3>
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 border-b">Prop</th>
                    <th className="text-left p-3 border-b">Type</th>
                    <th className="text-left p-3 border-b">Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b font-mono text-xs">apiUrl</td>
                    <td className="p-3 border-b text-gray-600">string</td>
                    <td className="p-3 border-b">URL của GraphQL API</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b font-mono text-xs">websocketUrl</td>
                    <td className="p-3 border-b text-gray-600">string</td>
                    <td className="p-3 border-b">URL của WebSocket server</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b font-mono text-xs">primaryColor</td>
                    <td className="p-3 border-b text-gray-600">string</td>
                    <td className="p-3 border-b">Màu chủ đạo (hex color)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">position</td>
                    <td className="p-3 text-gray-600">string</td>
                    <td className="p-3">'bottom-right' hoặc 'bottom-left'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Component */}
      <SupportChatWidgetSimple
        primaryColor="#2563eb"
        position="bottom-right"
      />
    </div>
  );
}
