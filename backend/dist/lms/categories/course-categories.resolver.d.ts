import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CourseCategoriesService);
    createCategory(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    findAllCategories(): Promise<({
        _count: {
            courses: number;
        };
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                parentId: string | null;
                slug: string;
                icon: string | null;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        icon: string | null;
    })[]>;
    findOneCategory(id: string): Promise<{
        _count: {
            courses: number;
        };
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    updateCategory(updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    removeCategory(id: string): Promise<boolean>;
}
