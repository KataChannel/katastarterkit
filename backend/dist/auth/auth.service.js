"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, httpService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(emailOrUsername, password) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ],
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        return user;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            roleType: user.roleType
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '24h',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async verifyGoogleToken(token) {
        this.logger.log('=== VERIFYING GOOGLE TOKEN ===');
        this.logger.log(`Token: ${token.substring(0, 50)}...`);
        this.logger.log(`Environment GOOGLE_CLIENT_ID: ${this.configService.get('GOOGLE_CLIENT_ID')}`);
        this.logger.log(`Process.env GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
        try {
            const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;
            this.logger.log(`Making request to: ${url.substring(0, 80)}...`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            this.logger.log(`Google response status: ${response.status}`);
            this.logger.log(`Google response data:`, response.data);
            if (response.data.error) {
                this.logger.error(`Google token error: ${response.data.error}`);
                throw new common_1.UnauthorizedException('Invalid Google token');
            }
            const tokenData = response.data;
            const expectedAudience = this.configService.get('GOOGLE_CLIENT_ID');
            this.logger.log(`Expected audience: ${expectedAudience}`);
            this.logger.log(`Token audience: ${tokenData.aud}`);
            if (expectedAudience && tokenData.aud !== expectedAudience) {
                this.logger.error('Token audience mismatch!');
                throw new common_1.UnauthorizedException('Token audience mismatch');
            }
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
        }
        catch (error) {
            this.logger.error(`Google token verification error: ${error.response?.data || error.message}`);
            this.logger.error('Full error:', error);
            throw new common_1.UnauthorizedException('Failed to verify Google token');
        }
    }
    async verifyFacebookToken(token) {
        try {
            const appId = this.configService.get('FACEBOOK_APP_ID');
            const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
            if (!appId || !appSecret) {
                throw new common_1.UnauthorizedException('Facebook app credentials not configured');
            }
            const verifyResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`));
            if (!verifyResponse.data.data.is_valid) {
                throw new common_1.UnauthorizedException('Invalid Facebook token');
            }
            const userInfoResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token=${token}`));
            return {
                id: userInfoResponse.data.id,
                email: userInfoResponse.data.email,
                firstName: userInfoResponse.data.first_name,
                lastName: userInfoResponse.data.last_name,
                avatar: userInfoResponse.data.picture?.data?.url,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Failed to verify Facebook token');
        }
    }
    async loginWithGoogle(input) {
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
                const existingGoogleAuth = user.authMethods.find(auth => auth.provider === 'GOOGLE');
                if (!existingGoogleAuth) {
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
            }
            else {
                this.logger.log(`Creating new user for: ${userInfo.email}`);
                user = await this.prisma.user.create({
                    data: {
                        email: userInfo.email,
                        username: userInfo.email,
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
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() }
            });
            await this.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'LOGIN',
                    resourceType: 'user',
                    resourceId: user.id,
                    details: `Google login for ${user.email}`,
                    ipAddress: null,
                    userAgent: null
                }
            });
            const tokens = await this.generateTokens(user);
            this.logger.log(`Google login successful for user: ${user.id}`);
            return {
                user: user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        }
        catch (error) {
            this.logger.error(`Google login failed: ${error.message}`, error.stack);
            this.logger.error(`Error details: ${JSON.stringify(error, null, 2)}`);
            throw new common_1.BadRequestException(`Invalid Google token: ${error.message}`);
        }
    }
    async loginWithFacebook(token, providerId) {
        const facebookUser = await this.verifyFacebookToken(token);
        const facebookId = providerId || facebookUser.id;
        let user = null;
        const existingAuthMethod = await this.prisma.authMethod.findFirst({
            where: {
                provider: client_1.AuthProvider.FACEBOOK,
                providerId: facebookId,
            },
            include: {
                user: true,
            },
        });
        if (existingAuthMethod) {
            user = existingAuthMethod.user;
        }
        else if (facebookUser.email) {
            user = await this.prisma.user.findUnique({
                where: { email: facebookUser.email },
                include: {
                    authMethods: true,
                },
            });
            if (user) {
                await this.prisma.authMethod.create({
                    data: {
                        userId: user.id,
                        provider: client_1.AuthProvider.FACEBOOK,
                        providerId: facebookId,
                        isVerified: true,
                    },
                });
            }
        }
        if (!user && facebookUser.email) {
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
                            provider: client_1.AuthProvider.FACEBOOK,
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
            throw new common_1.UnauthorizedException('Unable to authenticate with Facebook');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                failedLoginAttempts: 0,
                lockedUntil: null,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'FACEBOOK_LOGIN',
                resourceType: 'user',
                resourceId: user.id,
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
    async loginWithPhone(phone, profile) {
        let user = await this.prisma.user.findUnique({
            where: { phone },
            include: {
                authMethods: true,
            },
        });
        if (user) {
            const phoneAuthMethod = user.authMethods.find(method => method.provider === client_1.AuthProvider.PHONE);
            if (!phoneAuthMethod) {
                await this.prisma.authMethod.create({
                    data: {
                        userId: user.id,
                        provider: client_1.AuthProvider.PHONE,
                        providerId: phone,
                        isVerified: true,
                    },
                });
            }
        }
        else {
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
                            provider: client_1.AuthProvider.PHONE,
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        axios_1.HttpService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map