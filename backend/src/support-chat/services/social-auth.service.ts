import { Injectable, BadRequestException } from '@nestjs/common';
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
  constructor(private configService: ConfigService) {}

  /**
   * Verify Zalo OAuth token and get user info
   */
  async verifyZaloAuth(accessToken: string): Promise<SocialAuthResult> {
    try {
      // Get Zalo user info
      const response = await axios.get('https://graph.zalo.me/v2.0/me', {
        params: {
          access_token: accessToken,
          fields: 'id,name,picture',
        },
      });

      const data = response.data;

      if (!data.id) {
        throw new BadRequestException('Invalid Zalo access token');
      }

      return {
        provider: 'ZALO',
        socialId: data.id,
        name: data.name,
        avatar: data.picture?.data?.url,
        accessToken,
        profileData: data,
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify Zalo authentication');
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
