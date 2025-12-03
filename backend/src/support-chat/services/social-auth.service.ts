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
   * Zalo OAuth v4 requires code exchange
   */
  private async exchangeZaloCodeForToken(code: string): Promise<string> {
    try {
      const appId = this.configService.get('ZALO_APP_ID');
      const appSecret = this.configService.get('ZALO_APP_SECRET');
      const redirectUri = this.configService.get('ZALO_REDIRECT_URI') || 
        `${this.configService.get('FRONTEND_URL')}/oauth-callback/zalo/callback`;

      if (!appId || !appSecret) {
        this.logger.warn('Zalo App ID or Secret not configured, trying to use code as token directly');
        return code; // Fallback: try using code as token (won't work but will give better error)
      }

      this.logger.log(`Exchanging Zalo code for token...`);

      // Zalo OAuth v4 token exchange
      const response = await axios.post(
        'https://oauth.zaloapp.com/v4/access_token',
        null,
        {
          params: {
            app_id: appId,
            app_secret: appSecret,
            code: code,
            grant_type: 'authorization_code',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const data = response.data;
      this.logger.log(`Zalo token exchange response: ${JSON.stringify(data)}`);

      if (data.error) {
        this.logger.error(`Zalo token exchange error: ${data.error} - ${data.error_description}`);
        throw new BadRequestException(data.error_description || 'Failed to exchange Zalo code');
      }

      if (!data.access_token) {
        throw new BadRequestException('No access token received from Zalo');
      }

      return data.access_token;
    } catch (error: any) {
      this.logger.error(`Failed to exchange Zalo code: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      // If token exchange fails, the code might already be an access token (for backward compatibility)
      this.logger.warn('Token exchange failed, trying to use code as access token directly');
      return code;
    }
  }

  /**
   * Verify Zalo OAuth token and get user info
   * Handles both authorization code and access token
   */
  async verifyZaloAuth(codeOrToken: string): Promise<SocialAuthResult> {
    try {
      this.logger.log('Verifying Zalo authentication...');
      
      // First, try to exchange code for token (if it's a code)
      let accessToken = codeOrToken;
      
      // Zalo authorization codes are typically shorter and don't contain dots
      // Access tokens from Zalo are longer JWT-like strings
      const isLikelyCode = codeOrToken.length < 100 && !codeOrToken.includes('.');
      
      if (isLikelyCode) {
        this.logger.log('Input appears to be an authorization code, attempting exchange...');
        accessToken = await this.exchangeZaloCodeForToken(codeOrToken);
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
