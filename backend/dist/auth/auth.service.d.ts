import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SocialLoginInput } from '../graphql/inputs/user.input';
interface AuthPayload {
    user: User;
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, httpService: HttpService, configService: ConfigService);
    validateUser(emailOrUsername: string, password: string): Promise<User>;
    generateTokens(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyGoogleToken(token: string): Promise<any>;
    verifyFacebookToken(token: string): Promise<any>;
    loginWithGoogle(input: SocialLoginInput): Promise<AuthPayload>;
    loginWithFacebook(token: string, providerId?: string): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
    }>;
    loginWithPhone(phone: string, profile?: any): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
    }>;
}
export {};
