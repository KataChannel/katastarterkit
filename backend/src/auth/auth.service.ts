import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SocialLoginInput } from '../graphql/inputs/user.input';

// Define interfaces for the auth service
interface GoogleUserInfo {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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
      roleType: user.roleType 
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
    this.logger.log('=== VERIFYING GOOGLE TOKEN ===');
    this.logger.log(`Token: ${token.substring(0, 50)}...`);
    this.logger.log(`Environment GOOGLE_CLIENT_ID: ${this.configService.get('GOOGLE_CLIENT_ID')}`);
    this.logger.log(`Process.env GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
    
    try {
      // For Google Sign-In, the token is an ID token (JWT)
      // Use the tokeninfo endpoint with id_token parameter
      const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;
      this.logger.log(`Making request to: ${url.substring(0, 80)}...`);
      
      const response = await firstValueFrom(
        this.httpService.get(url)
      );
      
      this.logger.log(`Google response status: ${response.status}`);
      this.logger.log(`Google response data:`, response.data);
      
      if (response.data.error) {
        this.logger.error(`Google token error: ${response.data.error}`);
        throw new UnauthorizedException('Invalid Google token');
      }

      const tokenData = response.data;
      
      // Verify the audience (your Google Client ID)
      const expectedAudience = this.configService.get('GOOGLE_CLIENT_ID');
      this.logger.log(`Expected audience: ${expectedAudience}`);
      this.logger.log(`Token audience: ${tokenData.aud}`);
      
      if (expectedAudience && tokenData.aud !== expectedAudience) {
        this.logger.error('Token audience mismatch!');
        throw new UnauthorizedException('Token audience mismatch');
      }

      // Return user info from the ID token
      const userData = {
        id: tokenData.sub,
        email: tokenData.email,
        given_name: tokenData.given_name,
        family_name: tokenData.family_name,
        picture: tokenData.picture,
        email_verified: tokenData.email_verified === 'true' || tokenData.email_verified === true,
      };
      
      this.logger.log(`Extracted user data:`, userData);
      return userData;
    } catch (error) {
      this.logger.error(`Google token verification error: ${error.response?.data || error.message}`);
      this.logger.error('Full error:', error);
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

  async loginWithGoogle(input: SocialLoginInput): Promise<AuthPayload> {
    this.logger.log(`Starting Google login for token: ${input.token.substring(0, 20)}...`);
    this.logger.log(`Environment GOOGLE_CLIENT_ID exists: ${!!process.env.GOOGLE_CLIENT_ID}`);
    
    try {
      this.logger.log(`Calling verifyGoogleToken...`);
      const userInfo = await this.verifyGoogleToken(input.token);
      this.logger.log(`Google token verified for user: ${userInfo.email}`);
      
      let user = await this.prisma.user.findUnique({
        where: { email: userInfo.email },
        include: { authMethods: true }
      });
      
      if (user) {
        this.logger.log(`Existing user found: ${user.id}`);
        
        // Check if Google auth method exists
        const existingGoogleAuth = user.authMethods.find(
          auth => auth.provider === 'GOOGLE'
        );
        
        if (!existingGoogleAuth) {
          // Link Google account to existing user
          await this.prisma.authMethod.create({
            data: {
              userId: user.id,
              provider: 'GOOGLE',
              providerId: userInfo.id,
              isVerified: true
            }
          });
          this.logger.log(`Google auth method linked to existing user: ${user.id}`);
        }
      } else {
        this.logger.log(`Creating new user for: ${userInfo.email}`);
        
        // Create new user with Google auth
        user = await this.prisma.user.create({
          data: {
            email: userInfo.email,
            username: userInfo.email, // Use email as username for now
            firstName: userInfo.given_name || '',
            lastName: userInfo.family_name || '',
            avatar: userInfo.picture,
            isVerified: userInfo.email_verified || false,
            authMethods: {
              create: {
                provider: 'GOOGLE',
                providerId: userInfo.id,
                isVerified: true
              }
            }
          },
          include: { authMethods: true }
        });
        this.logger.log(`New user created: ${user.id}`);
      }
      
      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
      
      // Create audit log
      await this.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          details: `Google login for ${user.email}`,
          ipAddress: null,
          userAgent: null
        }
      });
      
      const tokens = await this.generateTokens(user);
      
      this.logger.log(`Google login successful for user: ${user.id}`);
      
      return {
        user: user as any,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    } catch (error) {
      this.logger.error(`Google login failed: ${error.message}`, error.stack);
      this.logger.error(`Error details: ${JSON.stringify(error, null, 2)}`);
      throw new BadRequestException(`Invalid Google token: ${error.message}`);
    }
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
