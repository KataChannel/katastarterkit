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
var MinioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = __importStar(require("minio"));
let MinioService = MinioService_1 = class MinioService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MinioService_1.name);
        const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
        const endpoint = isDockerEnv
            ? this.configService.get('DOCKER_MINIO_ENDPOINT', 'minio')
            : this.configService.get('MINIO_ENDPOINT', 'localhost');
        const port = isDockerEnv
            ? parseInt(this.configService.get('DOCKER_MINIO_PORT', '9000'))
            : parseInt(this.configService.get('MINIO_PORT', '9000'));
        const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';
        const accessKey = this.configService.get('MINIO_ACCESS_KEY', 'minioadmin');
        const secretKey = this.configService.get('MINIO_SECRET_KEY', 'minioadmin');
        this.logger.log(`Connecting to Minio: endpoint=${endpoint}, port=${port}, useSSL=${useSSL}, dockerEnv=${isDockerEnv}`);
        this.minioClient = new Minio.Client({
            endPoint: endpoint,
            port: port,
            useSSL: useSSL,
            accessKey: accessKey,
            secretKey: secretKey,
        });
        this.initializeBuckets();
    }
    async initializeBuckets() {
        const buckets = ['avatars', 'posts', 'uploads'];
        for (const bucket of buckets) {
            try {
                const bucketExists = await this.minioClient.bucketExists(bucket);
                if (!bucketExists) {
                    await this.minioClient.makeBucket(bucket);
                    this.logger.log(`Created bucket: ${bucket}`);
                    const policy = {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: { AWS: ['*'] },
                                Action: ['s3:GetObject'],
                                Resource: [`arn:aws:s3:::${bucket}/*`],
                            },
                        ],
                    };
                    await this.minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
                    this.logger.log(`Set public read policy for bucket: ${bucket}`);
                }
            }
            catch (error) {
                this.logger.error(`Error initializing bucket ${bucket}:`, error);
            }
        }
    }
    async uploadFile(bucket, fileName, buffer, contentType) {
        try {
            const uploadInfo = await this.minioClient.putObject(bucket, fileName, buffer, buffer.length, {
                'Content-Type': contentType,
            });
            this.logger.log(`File uploaded successfully: ${fileName}`);
            return this.getPublicUrl(bucket, fileName);
        }
        catch (error) {
            this.logger.error('Error uploading file:', error);
            throw error;
        }
    }
    async deleteFile(bucket, fileName) {
        try {
            await this.minioClient.removeObject(bucket, fileName);
            this.logger.log(`File deleted successfully: ${fileName}`);
        }
        catch (error) {
            this.logger.error('Error deleting file:', error);
            throw error;
        }
    }
    async getPresignedUrl(bucket, fileName, expires = 24 * 60 * 60) {
        try {
            return await this.minioClient.presignedUrl('GET', bucket, fileName, expires);
        }
        catch (error) {
            this.logger.error('Error generating presigned URL:', error);
            throw error;
        }
    }
    getPublicUrl(bucket, fileName) {
        const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
        const port = this.configService.get('MINIO_PORT', '9000');
        const useSSL = this.configService.get('MINIO_USE_SSL', 'false') === 'true';
        const protocol = useSSL ? 'https' : 'http';
        return `${protocol}://${endpoint}:${port}/${bucket}/${fileName}`;
    }
    async uploadAvatar(userId, buffer, contentType) {
        const fileName = `${userId}-${Date.now()}.${this.getFileExtension(contentType)}`;
        return this.uploadFile('avatars', fileName, buffer, contentType);
    }
    async uploadPostImage(postId, buffer, contentType) {
        const fileName = `${postId}-${Date.now()}.${this.getFileExtension(contentType)}`;
        return this.uploadFile('posts', fileName, buffer, contentType);
    }
    getFileExtension(contentType) {
        const mimeTypes = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'image/svg+xml': 'svg',
        };
        return mimeTypes[contentType] || 'jpg';
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = MinioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MinioService);
//# sourceMappingURL=minio.service.js.map