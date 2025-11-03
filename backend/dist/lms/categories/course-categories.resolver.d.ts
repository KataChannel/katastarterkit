import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CourseCategoriesService);
    createCategory(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    findAllCategories(): Promise<({
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    })[]>;
    findCategoryTree(): Promise<({
        _count: {
            courses: number;
        };
        children: ({
            _count: {
                courses: number;
            };
            children: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                parentId: string | null;
                slug: string;
                icon: string | null;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    })[]>;
    findOneCategory(id: string): Promise<{
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    updateCategory(updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    removeCategory(id: string): Promise<boolean>;
}
