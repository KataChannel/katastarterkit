/**
 * Social Authentication Helpers for Support Chat
 * Handles OAuth flows for Zalo, Facebook, and Google
 */

export interface SocialAuthResult {
  success: boolean;
  accessToken?: string;
  codeVerifier?: string; // For Zalo PKCE flow
  provider: 'ZALO' | 'FACEBOOK' | 'GOOGLE';
  error?: string;
}

// PKCE helpers for Zalo OAuth v4
const ZALO_CODE_VERIFIER_KEY = 'zalo_code_verifier';

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function saveCodeVerifier(verifier: string): void {
  try {
    sessionStorage.setItem(ZALO_CODE_VERIFIER_KEY, verifier);
  } catch (e) {
    console.warn('Failed to save code verifier to sessionStorage');
  }
}

function getCodeVerifier(): string | null {
  try {
    return sessionStorage.getItem(ZALO_CODE_VERIFIER_KEY);
  } catch (e) {
    return null;
  }
}

function clearCodeVerifier(): void {
  try {
    sessionStorage.removeItem(ZALO_CODE_VERIFIER_KEY);
  } catch (e) {
    // Ignore
  }
}

/**
 * Zalo OAuth Configuration
 */
const ZALO_CONFIG = {
  appId: process.env.NEXT_PUBLIC_ZALO_APP_ID || '',
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/oauth-callback/zalo/callback` : '',
  scope: 'id,name,picture',
};

/**
 * Facebook OAuth Configuration
 */
const FACEBOOK_CONFIG = {
  appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/oauth-callback/facebook/callback` : '',
  scope: 'public_profile,email',
};

/**
 * Google OAuth Configuration
 */
const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/oauth-callback/google/callback` : '',
  scope: 'profile email',
};

/**
 * Initialize Zalo OAuth Flow with PKCE
 */
export async function initZaloAuth(): Promise<SocialAuthResult> {
  // Validate Zalo App ID
  if (!ZALO_CONFIG.appId || ZALO_CONFIG.appId.trim() === '') {
    console.error('❌ Zalo App ID is not configured');
    throw { 
      success: false, 
      provider: 'ZALO', 
      error: 'Zalo App ID chưa được cấu hình. Vui lòng liên hệ quản trị viên.' 
    };
  }

  console.log('🔐 Initializing Zalo OAuth with PKCE...');
  console.log('📱 Zalo App ID:', ZALO_CONFIG.appId.substring(0, 10) + '...');
  console.log('🔗 Redirect URI:', ZALO_CONFIG.redirectUri);

  // Generate PKCE code verifier and challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  console.log('🔑 Generated PKCE code verifier');
  
  // Save code verifier for later use in callback
  saveCodeVerifier(codeVerifier);

  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // Generate state for CSRF protection
    const state = `support_chat_${Date.now()}`;
    
    // Zalo OAuth v4 with PKCE
    const authUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${ZALO_CONFIG.appId}&redirect_uri=${encodeURIComponent(ZALO_CONFIG.redirectUri)}&state=${state}&code_challenge=${codeChallenge}`;

    console.log('🚀 Opening Zalo login popup with PKCE...');

    const popup = window.open(
      authUrl,
      'Zalo Login',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      console.error('❌ Popup blocked by browser');
      reject({ 
        success: false, 
        provider: 'ZALO', 
        error: 'Popup bị chặn. Vui lòng cho phép popup và thử lại.' 
      });
      return;
    }

    let messageReceived = false;

    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      // Security check: only accept messages from our origin
      if (event.origin !== window.location.origin) {
        console.warn('⚠️ Ignoring message from unknown origin:', event.origin);
        return;
      }

      console.log('📨 Received message from popup:', event.data);

      if (event.data.type === 'ZALO_AUTH_SUCCESS') {
        messageReceived = true;
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        console.log('✅ Zalo authentication successful');
        
        // Include code verifier for PKCE token exchange
        const savedCodeVerifier = getCodeVerifier();
        clearCodeVerifier();
        
        resolve({
          success: true,
          provider: 'ZALO',
          accessToken: event.data.accessToken,
          codeVerifier: savedCodeVerifier || undefined,
        });
      } else if (event.data.type === 'ZALO_AUTH_ERROR') {
        messageReceived = true;
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        console.error('❌ Zalo authentication error:', event.data.error);
        reject({
          success: false,
          provider: 'ZALO',
          error: event.data.error || 'Đăng nhập Zalo thất bại',
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup was closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        
        if (!messageReceived) {
          console.warn('⚠️ Popup closed without receiving message');
          reject({ 
            success: false, 
            provider: 'ZALO', 
            error: 'Bạn đã đóng cửa sổ đăng nhập' 
          });
        }
      }
    }, 500);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!messageReceived && !popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        popup.close();
        console.error('⏱️ Zalo login timeout');
        reject({ 
          success: false, 
          provider: 'ZALO', 
          error: 'Đăng nhập hết thời gian chờ. Vui lòng thử lại.' 
        });
      }
    }, 5 * 60 * 1000);
  });
}

/**
 * Initialize Facebook OAuth Flow
 */
export function initFacebookAuth(): Promise<SocialAuthResult> {
  return new Promise((resolve, reject) => {
    // Load Facebook SDK
    if (typeof window !== 'undefined' && !(window as any).FB) {
      loadFacebookSDK().then(() => {
        performFacebookLogin(resolve, reject);
      });
    } else {
      performFacebookLogin(resolve, reject);
    }
  });
}

function performFacebookLogin(
  resolve: (value: SocialAuthResult) => void,
  reject: (reason: SocialAuthResult) => void
) {
  const FB = (window as any).FB;

  FB.login(
    (response: any) => {
      if (response.authResponse) {
        resolve({
          success: true,
          provider: 'FACEBOOK',
          accessToken: response.authResponse.accessToken,
        });
      } else {
        reject({
          success: false,
          provider: 'FACEBOOK',
          error: 'User cancelled login or did not fully authorize',
        });
      }
    },
    { scope: FACEBOOK_CONFIG.scope }
  );
}

function loadFacebookSDK(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).FB) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      (window as any).FB.init({
        appId: FACEBOOK_CONFIG.appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      });
      resolve();
    };

    document.body.appendChild(script);
  });
}

/**
 * Initialize Google OAuth Flow
 */
export function initGoogleAuth(): Promise<SocialAuthResult> {
  return new Promise((resolve, reject) => {
    // Load Google Identity Services
    if (typeof window !== 'undefined' && !(window as any).google) {
      loadGoogleSDK().then(() => {
        performGoogleLogin(resolve, reject);
      });
    } else {
      performGoogleLogin(resolve, reject);
    }
  });
}

function performGoogleLogin(
  resolve: (value: SocialAuthResult) => void,
  reject: (reason: SocialAuthResult) => void
) {
  const google = (window as any).google;

  const client = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CONFIG.clientId,
    scope: GOOGLE_CONFIG.scope,
    callback: (response: any) => {
      if (response.access_token) {
        resolve({
          success: true,
          provider: 'GOOGLE',
          accessToken: response.access_token,
        });
      } else {
        reject({
          success: false,
          provider: 'GOOGLE',
          error: response.error || 'Authentication failed',
        });
      }
    },
  });

  client.requestAccessToken();
}

function loadGoogleSDK(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve();
    };

    document.head.appendChild(script);
  });
}

/**
 * Helper to handle OAuth callback in popup
 * Use this in callback pages
 */
export function handleOAuthCallback(provider: 'ZALO' | 'FACEBOOK' | 'GOOGLE') {
  if (typeof window === 'undefined') return;

  console.log(`📡 Handling ${provider} OAuth callback...`);
  console.log('🔗 URL:', window.location.href);

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const accessToken = urlParams.get('access_token');
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');
  const state = urlParams.get('state');

  console.log('📦 Callback params:', { code, accessToken, error, errorDescription, state });

  if (!window.opener) {
    console.error('❌ No opener window found');
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Lỗi</h2>
          <p style="color: #666;">Không thể kết nối với cửa sổ chính.</p>
          <p style="color: #666; margin-top: 0.5rem;">Vui lòng đóng cửa sổ này và thử lại.</p>
        </div>
      </div>
    `;
    return;
  }

  if (error) {
    console.error(`❌ ${provider} authentication error:`, error, errorDescription);
    window.opener.postMessage(
      {
        type: `${provider}_AUTH_ERROR`,
        error: errorDescription || error || 'Authentication failed',
      },
      window.location.origin
    );
    
    // Show error message before closing
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: #ef4444; margin-bottom: 1rem;">❌ Đăng nhập thất bại</h2>
          <p style="color: #666;">${errorDescription || error}</p>
          <p style="color: #999; margin-top: 1rem; font-size: 0.875rem;">Đang đóng cửa sổ...</p>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      window.close();
    }, 2000);
  } else if (accessToken || code) {
    const token = accessToken || code || '';
    console.log(`✅ ${provider} authentication successful`);
    console.log('🔑 Token:', token.substring(0, Math.min(20, token.length)) + '...');
    
    window.opener.postMessage(
      {
        type: `${provider}_AUTH_SUCCESS`,
        accessToken: token,
      },
      window.location.origin
    );
    
    // Show success message before closing
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: #10b981; margin-bottom: 1rem;">✅ Đăng nhập thành công</h2>
          <p style="color: #666;">Đang chuyển về trang chính...</p>
          <div style="margin-top: 1.5rem;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    
    setTimeout(() => {
      window.close();
    }, 1500);
  } else {
    console.warn('⚠️ No authentication data received');
    window.opener.postMessage(
      {
        type: `${provider}_AUTH_ERROR`,
        error: 'No authentication data received',
      },
      window.location.origin
    );
    
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: #f59e0b; margin-bottom: 1rem;">⚠️ Không nhận được dữ liệu</h2>
          <p style="color: #666;">Vui lòng thử lại.</p>
          <p style="color: #999; margin-top: 1rem; font-size: 0.875rem;">Đang đóng cửa sổ...</p>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      window.close();
    }, 2000);
  }
}
