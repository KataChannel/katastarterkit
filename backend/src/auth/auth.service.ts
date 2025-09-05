import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(emailOrUsername: string, password: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    return user;
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      username: user.username,
      role: user.role 
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h', // 24 hours
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // 7 days
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Google token verification
  async verifyGoogleToken(token: string): Promise<any> {
    console.log('Verifying Google token:', token.substring(0, 50) + '...');
    
    try {
      // For Google Sign-In, the token is an ID token (JWT)
      // Use the tokeninfo endpoint with id_token parameter
      const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;
      console.log('Making request to:', url.substring(0, 80) + '...');
      
      const response = await firstValueFrom(
        this.httpService.get(url)
      );
      
      console.log('Google response status:', response.status);
      console.log('Google response data:', response.data);
      
      if (response.data.error) {
        console.error('Google token error:', response.data.error);
        throw new UnauthorizedException('Invalid Google token');
      }

      const tokenData = response.data;
      
      // Verify the audience (your Google Client ID)
      const expectedAudience = this.configService.get('GOOGLE_CLIENT_ID');
      console.log('Expected audience:', expectedAudience);
      console.log('Token audience:', tokenData.aud);
      
      if (expectedAudience && tokenData.aud !== expectedAudience) {
        throw new UnauthorizedException('Token audience mismatch');
      }

      // Return user info from the ID token
      const userData = {
        id: tokenData.sub,
        email: tokenData.email,
        firstName: tokenData.given_name,
        lastName: tokenData.family_name,
        avatar: tokenData.picture,
        verified: tokenData.email_verified === 'true' || tokenData.email_verified === true,
      };
      
      console.log('Extracted user data:', userData);
      return userData;
    } catch (error) {
      console.error('Google token verification error:', error.response?.data || error.message);
      console.error('Full error:', error);
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }

  // Facebook token verification
  async verifyFacebookToken(token: string): Promise<any> {
    try {
      const appId = this.configService.get('FACEBOOK_APP_ID');
      const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
      
      if (!appId || !appSecret) {
        throw new UnauthorizedException('Facebook app credentials not configured');
      }

      // Verify token with Facebook
      const verifyResponse = await firstValueFrom(
        this.httpService.get(
          `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`
        )
      );

      if (!verifyResponse.data.data.is_valid) {
        throw new UnauthorizedException('Invalid Facebook token');
      }

      // Get user info from Facebook
      const userInfoResponse = await firstValueFrom(
        this.httpService.get(
          `https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token=${token}`
        )
      );

      return {
        id: userInfoResponse.data.id,
        email: userInfoResponse.data.email,
        firstName: userInfoResponse.data.first_name,
        lastName: userInfoResponse.data.last_name,
        avatar: userInfoResponse.data.picture?.data?.url,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to verify Facebook token');
    }
  }

  async loginWithGoogle(token: string, providerId?: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Verify Google token and get user info
    const googleUser = await this.verifyGoogleToken(token);
    const googleId = providerId || googleUser.id;
    
    // 1. Kiểm tra Google ID hoặc email với hệ thống
    let user = null;
    
    // Tìm user theo Google ID trong AuthMethod
    const existingAuthMethod = await this.prisma.authMethod.findFirst({
      where: {
        provider: AuthProvider.GOOGLE,
        providerId: googleId,
      },
      include: {
        user: true,
      },
    });

    if (existingAuthMethod) {
      user = existingAuthMethod.user;
    } else if (googleUser.email) {
      // Tìm user theo email
      user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
        include: {
          authMethods: true,
        },
      });

      if (user) {
        // 2. Nếu tồn tại thì cập nhật liên kết Google ID
        await this.prisma.authMethod.create({
          data: {
            userId: user.id,
            provider: AuthProvider.GOOGLE,
            providerId: googleId,
            isVerified: true,
          },
        });
      }
    }

    if (!user && googleUser.email) {
      // 3. Nếu chưa tồn tại thì tạo mới thông tin
      const username = googleUser.email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
      
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          username,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          avatar: googleUser.avatar,
          isActive: true,
          isVerified: googleUser.verified || true,
          authMethods: {
            create: {
              provider: AuthProvider.GOOGLE,
              providerId: googleId,
              isVerified: true,
            },
          },
        },
        include: {
          authMethods: true,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Unable to authenticate with Google');
    }

    // Cập nhật last login và reset failed attempts
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'GOOGLE_LOGIN',
        details: {
          googleId,
          email: googleUser.email,
        },
      },
    });

    const tokens = await this.generateTokens(user);
    
    return {
      user,
      ...tokens,
    };
  }

  async loginWithFacebook(token: string, providerId?: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Verify Facebook token and get user info
    const facebookUser = await this.verifyFacebookToken(token);
    const facebookId = providerId || facebookUser.id;
    
    // 1. Kiểm tra Facebook ID hoặc email với hệ thống
    let user = null;
    
    // Tìm user theo Facebook ID trong AuthMethod
    const existingAuthMethod = await this.prisma.authMethod.findFirst({
      where: {
        provider: AuthProvider.FACEBOOK,
        providerId: facebookId,
      },
      include: {
        user: true,
      },
    });

    if (existingAuthMethod) {
      user = existingAuthMethod.user;
    } else if (facebookUser.email) {
      // Tìm user theo email
      user = await this.prisma.user.findUnique({
        where: { email: facebookUser.email },
        include: {
          authMethods: true,
        },
      });

      if (user) {
        // 2. Nếu tồn tại thì cập nhật liên kết Facebook ID
        await this.prisma.authMethod.create({
          data: {
            userId: user.id,
            provider: AuthProvider.FACEBOOK,
            providerId: facebookId,
            isVerified: true,
          },
        });
      }
    }

    if (!user && facebookUser.email) {
      // 3. Nếu chưa tồn tại thì tạo mới thông tin
      const username = facebookUser.email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
      
      user = await this.prisma.user.create({
        data: {
          email: facebookUser.email,
          username,
          firstName: facebookUser.firstName,
          lastName: facebookUser.lastName,
          avatar: facebookUser.avatar,
          isActive: true,
          isVerified: true,
          authMethods: {
            create: {
              provider: AuthProvider.FACEBOOK,
              providerId: facebookId,
              isVerified: true,
            },
          },
        },
        include: {
          authMethods: true,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Unable to authenticate with Facebook');
    }

    // Cập nhật last login và reset failed attempts
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'FACEBOOK_LOGIN',
        details: {
          facebookId,
          email: facebookUser.email,
        },
      },
    });

    const tokens = await this.generateTokens(user);
    
    return {
      user,
      ...tokens,
    };
  }

  async loginWithPhone(phone: string, profile?: any): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // 1. Kiểm tra phone với hệ thống
    let user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        authMethods: true,
      },
    });

    if (user) {
      // 2. Nếu tồn tại, kiểm tra xem đã có AuthMethod PHONE chưa
      const phoneAuthMethod = user.authMethods.find(method => method.provider === AuthProvider.PHONE);
      
      if (!phoneAuthMethod) {
        // Tạo AuthMethod cho PHONE nếu chưa có
        await this.prisma.authMethod.create({
          data: {
            userId: user.id,
            provider: AuthProvider.PHONE,
            providerId: phone,
            isVerified: true,
          },
        });
      }
    } else {
      // 3. Nếu chưa tồn tại thì tạo mới thông tin
      user = await this.prisma.user.create({
        data: {
          phone,
          username: 'user_' + phone.slice(-6) + '_' + Math.random().toString(36).substring(7),
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          avatar: profile?.avatar,
          isActive: true,
          isVerified: true,
          authMethods: {
            create: {
              provider: AuthProvider.PHONE,
              providerId: phone,
              isVerified: true,
            },
          },
        },
        include: {
          authMethods: true,
        },
      });
    }

    // Cập nhật last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);
    
    return {
      user,
      ...tokens,
    };
  }
}
