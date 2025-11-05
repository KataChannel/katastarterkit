import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CourseCategoriesService);
    createCategory(createCourseCategoryInput: CreateCourseCategoryInput): Promise<any>;
    findAllCategories(): Promise<any>;
    findCategoryTree(): Promise<any>;
    findOneCategory(id: string): Promise<any>;
    updateCategory(updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<any>;
    removeCategory(id: string): Promise<boolean>;
}
