import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CourseCategoriesService);
    createCategory(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    }>;
    findAllCategories(): Promise<({
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
        _count: {
            courses: number;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    })[]>;
    findCategoryTree(): Promise<({
        children: ({
            children: {
                id: string;
                parentId: string | null;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                name: string;
                icon: string | null;
            }[];
            _count: {
                courses: number;
            };
        } & {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        })[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    })[]>;
    findOneCategory(id: string): Promise<{
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
        _count: {
            courses: number;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    }>;
    updateCategory(updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    }>;
    removeCategory(id: string): Promise<boolean>;
}
