import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthDemo: React.FC = () => {
  const {
    handleLogin,
    handleGoogleLogin,
    handleFacebookLogin,
    handlePhoneLogin,
    handleRequestOtp,
    handleRegister,
    logout,
    loginLoading,
    googleLoading,
    facebookLoading,
    phoneLoading,
    otpLoading,
    registerLoading,
  } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState('');

  // Request OTP for phone login
  const requestOtp = async () => {
    if (!phone) {
      setMessage('Vui lòng nhập số điện thoại');
      return;
    }

    const result = await handleRequestOtp({ phone });
    
    if (result.success) {
      setOtpRequested(true);
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  // Login with phone and OTP
  const loginWithPhone = async () => {
    if (!phone || !otp) {
      setMessage('Vui lòng nhập số điện thoại và mã OTP');
      return;
    }

    const result = await handlePhoneLogin({ phone, otp });
    
    if (result.success) {
      setMessage('Đăng nhập thành công!');
      console.log('User:', result.user);
    } else {
      setMessage(result.error);
    }
  };

  // Simulate Google login
  const loginWithGoogle = async () => {
    // Trong thực tế, bạn sẽ sử dụng Google SDK để lấy token
    const mockGoogleData = {
      token: 'mock_google_token',
      provider: 'GOOGLE' as const,
      email: 'user@gmail.com',
      providerId: 'google_user_id_123',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://example.com/avatar.jpg',
    };

    const result = await handleGoogleLogin(mockGoogleData);
    
    if (result.success) {
      setMessage('Đăng nhập Google thành công!');
      console.log('User:', result.user);
    } else {
      setMessage(result.error);
    }
  };

  // Simulate Facebook login
  const loginWithFacebook = async () => {
    // Trong thực tế, bạn sẽ sử dụng Facebook SDK để lấy token
    const mockFacebookData = {
      token: 'mock_facebook_token',
      provider: 'FACEBOOK' as const,
      email: 'user@facebook.com',
      providerId: 'facebook_user_id_456',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: 'https://example.com/fb-avatar.jpg',
    };

    const result = await handleFacebookLogin(mockFacebookData);
    
    if (result.success) {
      setMessage('Đăng nhập Facebook thành công!');
      console.log('User:', result.user);
    } else {
      setMessage(result.error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Demo Authentication</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
          {message}
        </div>
      )}

      {/* Phone Login Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Đăng nhập bằng số điện thoại</h3>
        
        <input
          type="tel"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        
        {!otpRequested ? (
          <button
            onClick={requestOtp}
            disabled={otpLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {otpLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={loginWithPhone}
              disabled={phoneLoading}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {phoneLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </>
        )}
      </div>

      {/* Social Login Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Đăng nhập mạng xã hội</h3>
        
        <button
          onClick={loginWithGoogle}
          disabled={googleLoading}
          className="w-full bg-red-500 text-white p-2 rounded mb-2 hover:bg-red-600 disabled:opacity-50"
        >
          {googleLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
        </button>
        
        <button
          onClick={loginWithFacebook}
          disabled={facebookLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {facebookLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Facebook'}
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default AuthDemo;
