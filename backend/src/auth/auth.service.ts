import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

  async loginWithGoogle(googleId: string, email?: string, profile?: any): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // 1. Kiểm tra email hoặc Google ID với hệ thống
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
    } else if (email) {
      // Tìm user theo email
      user = await this.prisma.user.findUnique({
        where: { email },
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

    if (!user && email) {
      // 3. Nếu chưa tồn tại thì tạo mới thông tin
      user = await this.prisma.user.create({
        data: {
          email,
          username: email.split('@')[0] + '_' + Math.random().toString(36).substring(7),
          firstName: profile?.firstName || profile?.given_name,
          lastName: profile?.lastName || profile?.family_name,
          avatar: profile?.picture || profile?.avatar,
          isActive: true,
          isVerified: true,
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

  async loginWithFacebook(facebookId: string, email?: string, profile?: any): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // 1. Kiểm tra email hoặc Facebook ID với hệ thống
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
    } else if (email) {
      // Tìm user theo email
      user = await this.prisma.user.findUnique({
        where: { email },
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

    if (!user && email) {
      // 3. Nếu chưa tồn tại thì tạo mới thông tin
      user = await this.prisma.user.create({
        data: {
          email,
          username: email.split('@')[0] + '_' + Math.random().toString(36).substring(7),
          firstName: profile?.firstName || profile?.first_name,
          lastName: profile?.lastName || profile?.last_name,
          avatar: profile?.picture?.data?.url || profile?.avatar,
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
