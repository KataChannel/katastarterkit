"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcommerceModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const redis_service_1 = require("../redis/redis.service");
const cart_service_1 = require("../services/cart.service");
const order_service_1 = require("../services/order.service");
const cart_resolver_1 = require("../graphql/resolvers/cart.resolver");
const order_resolver_1 = require("../graphql/resolvers/order.resolver");
let EcommerceModule = class EcommerceModule {
};
exports.EcommerceModule = EcommerceModule;
exports.EcommerceModule = EcommerceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            redis_service_1.RedisService,
            cart_service_1.CartService,
            order_service_1.OrderService,
            cart_resolver_1.CartResolver,
            order_resolver_1.OrderResolver,
        ],
        exports: [cart_service_1.CartService, order_service_1.OrderService],
    })
], EcommerceModule);
//# sourceMappingURL=ecommerce.module.js.map