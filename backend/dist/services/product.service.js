"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(input) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', filters } = input;
        const skip = (page - 1) * limit;
        const where = this.buildWhereClause(filters);
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    category: true,
                    images: { orderBy: { order: 'asc' } },
                    variants: { where: { isActive: true }, orderBy: { order: 'asc' } },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        };
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: { orderBy: { order: 'asc' } },
                variants: { orderBy: { order: 'asc' } },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async getProductBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                images: { orderBy: { order: 'asc' } },
                variants: { orderBy: { order: 'asc' } },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug ${slug} not found`);
        }
        return product;
    }
    async getProductsByCategory(categoryId, input) {
        const filters = { ...input?.filters, categoryId };
        return this.getProducts({ ...input, filters });
    }
    async createProduct(input) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { slug: input.slug },
        });
        if (existingProduct) {
            throw new common_1.BadRequestException(`Product with slug ${input.slug} already exists`);
        }
        const category = await this.prisma.category.findUnique({
            where: { id: input.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${input.categoryId} not found`);
        }
        return this.prisma.product.create({
            data: {
                ...input,
            },
            include: {
                category: true,
                images: true,
                variants: true,
            },
        });
    }
    async updateProduct(input) {
        const { id, ...data } = input;
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (data.slug && data.slug !== product.slug) {
            const existingProduct = await this.prisma.product.findUnique({
                where: { slug: data.slug },
            });
            if (existingProduct) {
                throw new common_1.BadRequestException(`Product with slug ${data.slug} already exists`);
            }
        }
        if (data.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: data.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${data.categoryId} not found`);
            }
        }
        return this.prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
                images: { orderBy: { order: 'asc' } },
                variants: { orderBy: { order: 'asc' } },
            },
        });
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await Promise.all([
            this.prisma.productImage.deleteMany({ where: { productId: id } }),
            this.prisma.productVariant.deleteMany({ where: { productId: id } }),
        ]);
        return this.prisma.product.delete({ where: { id } });
    }
    async addProductImage(input) {
        const product = await this.prisma.product.findUnique({
            where: { id: input.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${input.productId} not found`);
        }
        if (input.isPrimary) {
            await this.prisma.productImage.updateMany({
                where: { productId: input.productId, isPrimary: true },
                data: { isPrimary: false },
            });
        }
        return this.prisma.productImage.create({
            data: input,
        });
    }
    async deleteProductImage(id) {
        const image = await this.prisma.productImage.findUnique({ where: { id } });
        if (!image) {
            throw new common_1.NotFoundException(`Product image with ID ${id} not found`);
        }
        return this.prisma.productImage.delete({ where: { id } });
    }
    async addProductVariant(input) {
        const product = await this.prisma.product.findUnique({
            where: { id: input.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${input.productId} not found`);
        }
        return this.prisma.productVariant.create({
            data: input,
        });
    }
    async updateProductVariant(input) {
        const { id, ...data } = input;
        const variant = await this.prisma.productVariant.findUnique({ where: { id } });
        if (!variant) {
            throw new common_1.NotFoundException(`Product variant with ID ${id} not found`);
        }
        return this.prisma.productVariant.update({
            where: { id },
            data,
        });
    }
    async deleteProductVariant(id) {
        const variant = await this.prisma.productVariant.findUnique({ where: { id } });
        if (!variant) {
            throw new common_1.NotFoundException(`Product variant with ID ${id} not found`);
        }
        return this.prisma.productVariant.delete({ where: { id } });
    }
    async updateStock(id, quantity) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        const newStock = product.stock + quantity;
        if (newStock < 0) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        return this.prisma.product.update({
            where: { id },
            data: { stock: newStock },
        });
    }
    buildWhereClause(filters) {
        if (!filters)
            return {};
        const where = {};
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { sku: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = filters.maxPrice;
            }
        }
        if (filters.isFeatured !== undefined) {
            where.isFeatured = filters.isFeatured;
        }
        if (filters.isNewArrival !== undefined) {
            where.isNewArrival = filters.isNewArrival;
        }
        if (filters.isBestSeller !== undefined) {
            where.isBestSeller = filters.isBestSeller;
        }
        if (filters.isOnSale !== undefined) {
            where.isOnSale = filters.isOnSale;
        }
        if (filters.inStock !== undefined) {
            where.stock = filters.inStock ? { gt: 0 } : { lte: 0 };
        }
        if (filters.origin) {
            where.origin = { contains: filters.origin, mode: 'insensitive' };
        }
        if (filters.units && filters.units.length > 0) {
            where.unit = { in: filters.units };
        }
        return where;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map