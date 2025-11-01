import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CourseCategoriesService);
    createCategory(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    }>;
    findAllCategories(): Promise<({
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
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
                description: string | null;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                parentId: string | null;
                icon: string | null;
                slug: string;
            }[];
        } & {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        })[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    })[]>;
    findOneCategory(id: string): Promise<{
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    }>;
    updateCategory(updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    }>;
    removeCategory(id: string): Promise<boolean>;
}
