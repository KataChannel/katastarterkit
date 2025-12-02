'use client';

import { useEffect, useState } from 'react';
import { handleOAuthCallback } from '@/lib/social-auth';

export default function ZaloCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Đang xử lý đăng nhập Zalo...');

  useEffect(() => {
    console.log('🔵 Zalo Callback Page loaded');
    
    // Add listener for errors
    const handleError = (error: ErrorEvent) => {
      console.error('❌ Error in callback page:', error);
      setStatus('error');
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    };

    window.addEventListener('error', handleError);

    try {
      handleOAuthCallback('ZALO');
      
      // Check URL params for debugging
      const urlParams = new URLSearchParams(window.location.search);
      const hasCode = urlParams.has('code');
      const hasToken = urlParams.has('access_token');
      const hasError = urlParams.has('error');

      console.log('📊 Callback status:', { hasCode, hasToken, hasError });

      if (hasError) {
        setStatus('error');
        setMessage('Đăng nhập thất bại');
      } else if (hasCode || hasToken) {
        setStatus('success');
        setMessage('Đăng nhập thành công!');
      }
    } catch (error) {
      console.error('❌ Error calling handleOAuthCallback:', error);
      setStatus('error');
      setMessage('Có lỗi xảy ra khi xử lý đăng nhập.');
    }

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Đang xử lý...
            </h2>
            <p className="text-gray-600">{message}</p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {message}
            </h2>
            <p className="text-gray-600">Đang chuyển về trang chính...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {message}
            </h2>
            <p className="text-gray-600">Cửa sổ sẽ tự động đóng...</p>
          </>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Powered by Zalo OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
