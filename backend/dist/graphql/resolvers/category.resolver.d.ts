import { CategoryService } from '../../services/category.service';
import { CategoryType } from '../types/category.type';
import { CreateCategoryInput, UpdateCategoryInput, GetCategoriesInput } from '../inputs/category.input';
export declare class CategoryResolver {
    private categoryService;
    constructor(categoryService: CategoryService);
    getCategories(input?: GetCategoriesInput): Promise<any>;
    getCategoryTree(): Promise<any>;
    getCategory(id: string): Promise<any>;
    getCategoryBySlug(slug: string): Promise<any>;
    createCategory(input: CreateCategoryInput): Promise<any>;
    updateCategory(input: UpdateCategoryInput): Promise<any>;
    deleteCategory(id: string, deleteProducts: boolean): Promise<any>;
    productCount(category: CategoryType): Promise<any>;
}
