/**
 * Social Authentication Helpers for Support Chat
 * Handles OAuth flows for Zalo, Facebook, and Google
 */

export interface SocialAuthResult {
  success: boolean;
  accessToken?: string;
  provider: 'ZALO' | 'FACEBOOK' | 'GOOGLE';
  error?: string;
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
 * Initialize Zalo OAuth Flow
 */
export function initZaloAuth(): Promise<SocialAuthResult> {
  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const authUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${ZALO_CONFIG.appId}&redirect_uri=${encodeURIComponent(ZALO_CONFIG.redirectUri)}&state=support_chat`;

    const popup = window.open(
      authUrl,
      'Zalo Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject({ success: false, provider: 'ZALO', error: 'Popup blocked' });
      return;
    }

    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'ZALO_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        resolve({
          success: true,
          provider: 'ZALO',
          accessToken: event.data.accessToken,
        });
      } else if (event.data.type === 'ZALO_AUTH_ERROR') {
        window.removeEventListener('message', handleMessage);
        reject({
          success: false,
          provider: 'ZALO',
          error: event.data.error,
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup was closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        reject({ success: false, provider: 'ZALO', error: 'User closed popup' });
      }
    }, 1000);
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

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const accessToken = urlParams.get('access_token');
  const error = urlParams.get('error');

  if (window.opener) {
    if (error) {
      window.opener.postMessage(
        {
          type: `${provider}_AUTH_ERROR`,
          error,
        },
        window.location.origin
      );
    } else if (accessToken || code) {
      window.opener.postMessage(
        {
          type: `${provider}_AUTH_SUCCESS`,
          accessToken: accessToken || code,
        },
        window.location.origin
      );
    }
    window.close();
  }
}
