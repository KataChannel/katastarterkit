import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductType } from '../types/product.type';
import { CreateProductInput, UpdateProductInput, GetProductsInput, CreateProductImageInput, CreateProductVariantInput, UpdateProductVariantInput } from '../inputs/product.input';
export declare class ProductResolver {
    private productService;
    private categoryService;
    constructor(productService: ProductService, categoryService: CategoryService);
    getProducts(input?: GetProductsInput): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getProduct(id: string): Promise<any>;
    getProductBySlug(slug: string): Promise<any>;
    getProductsByCategory(categoryId: string, input?: GetProductsInput): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    createProduct(input: CreateProductInput): Promise<any>;
    updateProduct(input: UpdateProductInput): Promise<any>;
    deleteProduct(id: string): Promise<any>;
    addProductImage(input: CreateProductImageInput): Promise<any>;
    deleteProductImage(id: string): Promise<boolean>;
    addProductVariant(input: CreateProductVariantInput): Promise<any>;
    updateProductVariant(input: UpdateProductVariantInput): Promise<any>;
    deleteProductVariant(id: string): Promise<boolean>;
    updateProductStock(id: string, quantity: number): Promise<any>;
    category(product: ProductType): Promise<any>;
    discountPercentage(product: ProductType): Promise<number>;
    profitMargin(product: ProductType): Promise<number>;
}
