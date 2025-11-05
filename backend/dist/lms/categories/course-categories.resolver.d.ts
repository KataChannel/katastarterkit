import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CourseCategoriesService);
    createCategory(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    }>;
    findAllCategories(): Promise<({
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    })[]>;
    findCategoryTree(): Promise<({
        children: ({
            children: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                parentId: string | null;
                icon: string | null;
            }[];
            _count: {
                courses: number;
            };
        } & {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        })[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    })[]>;
    findOneCategory(id: string): Promise<{
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    }>;
    updateCategory(updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    }>;
    removeCategory(id: string): Promise<boolean>;
}
