import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface SocialAuthResult {
  provider: 'ZALO' | 'FACEBOOK' | 'GOOGLE';
  socialId: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  accessToken: string;
  profileData: any;
}

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger(SocialAuthService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Exchange Zalo authorization code for access token
   * Zalo OAuth v4 requires PKCE with code_verifier
   */
  private async exchangeZaloCodeForToken(code: string, codeVerifier?: string): Promise<string> {
    try {
      const appId = this.configService.get('ZALO_APP_ID');
      const appSecret = this.configService.get('ZALO_APP_SECRET');
      const frontendUrl = this.configService.get('FRONTEND_URL') || this.configService.get('NEXT_PUBLIC_FRONTEND_URL');
      const redirectUri = this.configService.get('ZALO_REDIRECT_URI') || 
        `${frontendUrl}/oauth-callback/zalo/callback`;

      // Log env status for debugging
      this.logger.log(`Zalo Config Status:`);
      this.logger.log(`  - ZALO_APP_ID: ${appId ? `${appId.substring(0, 10)}...` : '❌ NOT SET'}`);
      this.logger.log(`  - ZALO_APP_SECRET: ${appSecret ? '✅ SET' : '❌ NOT SET'}`);
      this.logger.log(`  - FRONTEND_URL: ${frontendUrl || '❌ NOT SET'}`);
      this.logger.log(`  - Redirect URI: ${redirectUri}`);

      if (!appId || !appSecret) {
        this.logger.error('❌ Zalo credentials not configured in environment variables');
        this.logger.error('Please add ZALO_APP_ID and ZALO_APP_SECRET to .env file');
        throw new BadRequestException('Zalo chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
      }

      this.logger.log(`Exchanging Zalo code for token with PKCE...`);
      this.logger.log(`App ID: ${appId.substring(0, 10)}...`);
      this.logger.log(`Redirect URI: ${redirectUri}`);
      this.logger.log(`Code Verifier provided: ${!!codeVerifier}`);

      // Zalo OAuth v4 token exchange with PKCE
      const params: any = {
        app_id: appId,
        code: code,
        grant_type: 'authorization_code',
      };

      // Add code_verifier for PKCE flow (required by Zalo v4)
      if (codeVerifier) {
        params.code_verifier = codeVerifier;
      }

      // Note: Zalo uses secret_key in header, not in params
      const response = await axios.post(
        'https://oauth.zaloapp.com/v4/access_token',
        null,
        {
          params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'secret_key': appSecret,
          },
        },
      );

      const data = response.data;
      this.logger.log(`Zalo token exchange response: ${JSON.stringify(data)}`);

      if (data.error) {
        this.logger.error(`Zalo token exchange error: ${data.error} - ${data.error_description || data.error_name}`);
        throw new BadRequestException(data.error_description || data.error_name || 'Không thể xác thực Zalo. Vui lòng thử lại.');
      }

      if (!data.access_token) {
        this.logger.error('No access token in Zalo response');
        throw new BadRequestException('Không nhận được access token từ Zalo');
      }

      this.logger.log('✅ Successfully exchanged Zalo code for access token');
      return data.access_token;
    } catch (error: any) {
      this.logger.error(`Failed to exchange Zalo code: ${error.message}`);
      if (error.response?.data) {
        this.logger.error(`Zalo API response: ${JSON.stringify(error.response.data)}`);
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Đăng nhập Zalo thất bại. Vui lòng thử lại.');
    }
  }

  /**
   * Verify Zalo OAuth token and get user info
   * Handles both authorization code (with PKCE) and access token
   */
  async verifyZaloAuth(codeOrToken: string, codeVerifier?: string): Promise<SocialAuthResult> {
    try {
      this.logger.log('Verifying Zalo authentication...');
      this.logger.log(`Input length: ${codeOrToken.length}, Code verifier provided: ${!!codeVerifier}`);
      
      // First, try to exchange code for token (if it's a code)
      let accessToken = codeOrToken;
      
      // If code_verifier is provided, it means this is definitely an authorization code
      // Otherwise, try to detect based on format
      const isAuthorizationCode = codeVerifier || (codeOrToken.length < 200 && !codeOrToken.includes('.'));
      
      if (isAuthorizationCode) {
        this.logger.log('Input is an authorization code, exchanging for access token...');
        accessToken = await this.exchangeZaloCodeForToken(codeOrToken, codeVerifier);
      }

      // Get Zalo user info with the access token
      this.logger.log('Fetching Zalo user info...');
      const response = await axios.get('https://graph.zalo.me/v2.0/me', {
        params: {
          access_token: accessToken,
          fields: 'id,name,picture',
        },
      });

      const data = response.data;
      this.logger.log(`Zalo user info response: ${JSON.stringify(data)}`);

      // Check for error in response
      if (data.error) {
        this.logger.error(`Zalo API error: ${data.error} - ${data.message}`);
        throw new BadRequestException(data.message || 'Invalid Zalo access token');
      }

      if (!data.id) {
        throw new BadRequestException('Invalid Zalo access token - no user ID returned');
      }

      return {
        provider: 'ZALO',
        socialId: data.id,
        name: data.name || 'Zalo User',
        avatar: data.picture?.data?.url,
        accessToken,
        profileData: data,
      };
    } catch (error: any) {
      this.logger.error(`Failed to verify Zalo authentication: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to verify Zalo authentication. Please try again.');
    }
  }

  /**
   * Verify Facebook OAuth token and get user info
   */
  async verifyFacebookAuth(accessToken: string): Promise<SocialAuthResult> {
    try {
      // Verify token first
      const appId = this.configService.get('FACEBOOK_APP_ID');
      const appSecret = this.configService.get('FACEBOOK_APP_SECRET');

      const verifyResponse = await axios.get(
        'https://graph.facebook.com/debug_token',
        {
          params: {
            input_token: accessToken,
            access_token: `${appId}|${appSecret}`,
          },
        },
      );

      if (!verifyResponse.data.data.is_valid) {
        throw new BadRequestException('Invalid Facebook access token');
      }

      // Get user info
      const userResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          access_token: accessToken,
          fields: 'id,name,email,picture',
        },
      });

      const data = userResponse.data;

      return {
        provider: 'FACEBOOK',
        socialId: data.id,
        name: data.name,
        email: data.email,
        avatar: data.picture?.data?.url,
        accessToken,
        profileData: data,
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify Facebook authentication');
    }
  }

  /**
   * Verify Google OAuth token and get user info
   */
  async verifyGoogleAuth(accessToken: string): Promise<SocialAuthResult> {
    try {
      // Verify token and get user info
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = response.data;

      if (!data.id) {
        throw new BadRequestException('Invalid Google access token');
      }

      return {
        provider: 'GOOGLE',
        socialId: data.id,
        name: data.name,
        email: data.email,
        avatar: data.picture,
        accessToken,
        profileData: data,
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify Google authentication');
    }
  }

  /**
   * Generate unique customer identifier
   */
  generateCustomerIdentifier(
    authType: string,
    identifier: string,
  ): string {
    return `${authType.toLowerCase()}_${identifier}`;
  }

  /**
   * Get icon for customer auth type
   */
  getAuthIcon(authType: string): string {
    const icons = {
      GUEST: '👤',
      PHONE: '📱',
      ZALO: '💬',
      FACEBOOK: '👥',
      GOOGLE: '🔍',
      USER_ACCOUNT: '🔐',
    };
    return icons[authType] || '👤';
  }
}
