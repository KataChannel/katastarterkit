import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CourseCategoriesService);
    createCategory(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        };
        children: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        }[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        icon: string | null;
    }>;
    findAllCategories(): Promise<({
        _count: {
            courses: number;
        };
        parent: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        };
        children: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        }[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
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
                createdAt: Date;
                name: string;
                id: string;
                updatedAt: Date;
                slug: string;
                parentId: string | null;
                description: string | null;
                icon: string | null;
            }[];
        } & {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        })[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        icon: string | null;
    })[]>;
    findOneCategory(id: string): Promise<{
        _count: {
            courses: number;
        };
        parent: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        };
        children: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        }[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        icon: string | null;
    }>;
    updateCategory(updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        };
        children: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            parentId: string | null;
            description: string | null;
            icon: string | null;
        }[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        icon: string | null;
    }>;
    removeCategory(id: string): Promise<boolean>;
}
