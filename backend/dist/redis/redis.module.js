"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const redisProvider = {
    provide: ioredis_1.Redis,
    useFactory: (configService) => {
        const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
        const host = isDockerEnv
            ? configService.get('DOCKER_REDIS_HOST', 'redis')
            : configService.get('REDIS_HOST', 'localhost');
        const port = isDockerEnv
            ? configService.get('DOCKER_REDIS_PORT', 6379)
            : configService.get('REDIS_PORT', 6379);
        const password = configService.get('REDIS_PASSWORD');
        const db = configService.get('REDIS_DB', 0);
        console.log(`[Redis] Connecting to Redis: host=${host}, port=${port}, dockerEnv=${isDockerEnv}`);
        return new ioredis_1.Redis({
            host,
            port,
            password,
            db,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });
    },
    inject: [config_1.ConfigService],
};
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [redisProvider],
        exports: [redisProvider],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map