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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBlogs(input) {
        const page = input.page || 1;
        const limit = input.limit || 12;
        const skip = (page - 1) * limit;
        const where = {
            isPublished: true,
        };
        if (input.search) {
            where.OR = [
                { title: { contains: input.search, mode: 'insensitive' } },
                { content: { contains: input.search, mode: 'insensitive' } },
                { shortDescription: { contains: input.search, mode: 'insensitive' } },
            ];
        }
        if (input.categoryId) {
            where.categoryId = input.categoryId;
        }
        const orderBy = {};
        switch (input.sort) {
            case 'oldest':
                orderBy.publishedAt = 'asc';
                break;
            case 'popular':
                orderBy.viewCount = 'desc';
                break;
            case 'featured':
                orderBy.isFeatured = 'desc';
                orderBy.publishedAt = 'desc';
                break;
            case 'latest':
            default:
                orderBy.publishedAt = 'desc';
                break;
        }
        const [items, total] = await Promise.all([
            this.prisma.blog.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: true,
                    tags: true,
                },
            }),
            this.prisma.blog.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;
        return {
            items,
            total,
            page,
            pageSize: limit,
            totalPages,
            hasMore,
        };
    }
    async getBlogById(id) {
        const blog = await this.prisma.blog.findUnique({
            where: { id },
            include: {
                category: true,
                tags: true,
            },
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with id ${id} not found`);
        }
        await this.prisma.blog.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        return blog;
    }
    async getBlogBySlug(slug) {
        const blog = await this.prisma.blog.findUnique({
            where: { slug },
            include: {
                category: true,
                tags: true,
            },
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with slug ${slug} not found`);
        }
        await this.prisma.blog.update({
            where: { id: blog.id },
            data: { viewCount: { increment: 1 } },
        });
        return blog;
    }
    async getFeaturedBlogs(limit = 5) {
        return this.prisma.blog.findMany({
            where: {
                isFeatured: true,
                isPublished: true,
            },
            orderBy: { publishedAt: 'desc' },
            take: limit,
            include: {
                category: true,
                tags: true,
            },
        });
    }
    async getBlogsByCategory(categoryId, page = 1, limit = 12) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.blog.findMany({
                where: {
                    categoryId,
                    isPublished: true,
                },
                orderBy: { publishedAt: 'desc' },
                skip,
                take: limit,
                include: {
                    category: true,
                    tags: true,
                },
            }),
            this.prisma.blog.count({
                where: {
                    categoryId,
                    isPublished: true,
                },
            }),
        ]);
        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;
        return {
            items,
            total,
            page,
            pageSize: limit,
            totalPages,
            hasMore,
        };
    }
    async getRelatedBlogs(categoryId, excludeBlogId, limit = 3) {
        return this.prisma.blog.findMany({
            where: {
                categoryId,
                isPublished: true,
                id: { not: excludeBlogId },
            },
            orderBy: { publishedAt: 'desc' },
            take: limit,
            include: {
                category: true,
                tags: true,
            },
        });
    }
    async createBlog(input) {
        const existingBlog = await this.prisma.blog.findUnique({
            where: { slug: input.slug },
        });
        if (existingBlog) {
            throw new common_1.BadRequestException(`Blog with slug ${input.slug} already exists`);
        }
        return this.prisma.blog.create({
            data: {
                title: input.title,
                slug: input.slug,
                content: input.content,
                shortDescription: input.shortDescription,
                excerpt: input.excerpt,
                author: input.author,
                thumbnailUrl: input.thumbnailUrl,
                bannerUrl: input.bannerUrl,
                isFeatured: input.isFeatured || false,
                isPublished: input.isPublished !== false,
                publishedAt: input.publishedAt || new Date(),
                metaTitle: input.metaTitle,
                metaDescription: input.metaDescription,
                metaKeywords: input.metaKeywords,
                ...(input.categoryId && {
                    category: { connect: { id: input.categoryId } },
                }),
                ...(input.tagIds && input.tagIds.length > 0 && {
                    tags: {
                        connect: input.tagIds.map((id) => ({ id })),
                    },
                }),
            },
            include: {
                category: true,
                tags: true,
            },
        });
    }
    async updateBlog(input) {
        const blog = await this.prisma.blog.findUnique({
            where: { id: input.id },
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with id ${input.id} not found`);
        }
        if (input.slug && input.slug !== blog.slug) {
            const existingBlog = await this.prisma.blog.findUnique({
                where: { slug: input.slug },
            });
            if (existingBlog) {
                throw new common_1.BadRequestException(`Blog with slug ${input.slug} already exists`);
            }
        }
        return this.prisma.blog.update({
            where: { id: input.id },
            data: {
                ...(input.title && { title: input.title }),
                ...(input.slug && { slug: input.slug }),
                ...(input.content && { content: input.content }),
                ...(input.shortDescription && { shortDescription: input.shortDescription }),
                ...(input.excerpt && { excerpt: input.excerpt }),
                ...(input.author && { author: input.author }),
                ...(input.thumbnailUrl && { thumbnailUrl: input.thumbnailUrl }),
                ...(input.bannerUrl && { bannerUrl: input.bannerUrl }),
                ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
                ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
                ...(input.publishedAt && { publishedAt: input.publishedAt }),
                ...(input.metaTitle && { metaTitle: input.metaTitle }),
                ...(input.metaDescription && { metaDescription: input.metaDescription }),
                ...(input.metaKeywords && { metaKeywords: input.metaKeywords }),
                ...(input.categoryId && {
                    category: { connect: { id: input.categoryId } },
                }),
                ...(input.tagIds && input.tagIds.length > 0 && {
                    tags: {
                        disconnect: (await this.prisma.blog.findUnique({
                            where: { id: input.id },
                            include: { tags: true },
                        }))?.tags,
                        connect: input.tagIds.map((id) => ({ id })),
                    },
                }),
            },
            include: {
                category: true,
                tags: true,
            },
        });
    }
    async deleteBlog(id) {
        const blog = await this.prisma.blog.findUnique({
            where: { id },
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with id ${id} not found`);
        }
        await this.prisma.blog.delete({
            where: { id },
        });
        return true;
    }
    async getCategories() {
        const categories = await this.prisma.blogCategory.findMany({
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
        });
        return categories.map((cat) => ({
            ...cat,
            postCount: cat._count.blogs,
        }));
    }
    async getCategoryById(id) {
        const category = await this.prisma.blogCategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        }
        return {
            ...category,
            postCount: category._count.blogs,
        };
    }
    async createCategory(input) {
        const existingCategory = await this.prisma.blogCategory.findUnique({
            where: { slug: input.slug },
        });
        if (existingCategory) {
            throw new common_1.BadRequestException(`Category with slug ${input.slug} already exists`);
        }
        return this.prisma.blogCategory.create({
            data: input,
        });
    }
    async updateCategory(input) {
        const category = await this.prisma.blogCategory.findUnique({
            where: { id: input.id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${input.id} not found`);
        }
        if (input.slug && input.slug !== category.slug) {
            const existingCategory = await this.prisma.blogCategory.findUnique({
                where: { slug: input.slug },
            });
            if (existingCategory) {
                throw new common_1.BadRequestException(`Category with slug ${input.slug} already exists`);
            }
        }
        return this.prisma.blogCategory.update({
            where: { id: input.id },
            data: input,
        });
    }
    async deleteCategory(id) {
        const category = await this.prisma.blogCategory.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        }
        await this.prisma.blogCategory.delete({
            where: { id },
        });
        return true;
    }
    async getTags() {
        return this.prisma.blogTag.findMany();
    }
    async createTag(input) {
        const existingTag = await this.prisma.blogTag.findUnique({
            where: { slug: input.slug },
        });
        if (existingTag) {
            throw new common_1.BadRequestException(`Tag with slug ${input.slug} already exists`);
        }
        return this.prisma.blogTag.create({
            data: input,
        });
    }
    async updateTag(input) {
        const tag = await this.prisma.blogTag.findUnique({
            where: { id: input.id },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with id ${input.id} not found`);
        }
        if (input.slug && input.slug !== tag.slug) {
            const existingTag = await this.prisma.blogTag.findUnique({
                where: { slug: input.slug },
            });
            if (existingTag) {
                throw new common_1.BadRequestException(`Tag with slug ${input.slug} already exists`);
            }
        }
        return this.prisma.blogTag.update({
            where: { id: input.id },
            data: input,
        });
    }
    async deleteTag(id) {
        const tag = await this.prisma.blogTag.findUnique({
            where: { id },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with id ${id} not found`);
        }
        await this.prisma.blogTag.delete({
            where: { id },
        });
        return true;
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map