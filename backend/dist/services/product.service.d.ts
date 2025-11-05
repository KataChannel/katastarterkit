import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput, UpdateProductInput, GetProductsInput, CreateProductImageInput, CreateProductVariantInput, UpdateProductVariantInput } from '../graphql/inputs/product.input';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    getProducts(input: GetProductsInput): Promise<{
        items: any;
        total: any;
        page: GetProductsInput;
        limit: GetProductsInput;
        totalPages: number;
        hasMore: boolean;
    }>;
    getProductById(id: string): Promise<any>;
    getProductBySlug(slug: string): Promise<any>;
    getProductsByCategory(categoryId: string, input?: GetProductsInput): Promise<{
        items: any;
        total: any;
        page: GetProductsInput;
        limit: GetProductsInput;
        totalPages: number;
        hasMore: boolean;
    }>;
    createProduct(input: CreateProductInput): Promise<any>;
    updateProduct(input: UpdateProductInput): Promise<any>;
    deleteProduct(id: string): Promise<any>;
    addProductImage(input: CreateProductImageInput): Promise<any>;
    deleteProductImage(id: string): Promise<any>;
    addProductVariant(input: CreateProductVariantInput): Promise<any>;
    updateProductVariant(input: UpdateProductVariantInput): Promise<any>;
    deleteProductVariant(id: string): Promise<any>;
    updateStock(id: string, quantity: number): Promise<any>;
    private buildWhereClause;
}
