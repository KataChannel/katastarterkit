'use client';

import { useEffect } from 'react';
import { handleOAuthCallback } from '@/lib/social-auth';

export default function FacebookCallbackPage() {
  useEffect(() => {
    handleOAuthCallback('FACEBOOK');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập Facebook...</p>
      </div>
    </div>
  );
}
