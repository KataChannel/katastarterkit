import { Menu } from '@prisma/client';
export declare class MenuResponseDto {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    type: string;
    parentId?: string | null;
    order: number;
    level: number;
    path?: string | null;
    url?: string | null;
    route?: string | null;
    externalUrl?: string | null;
    target: string;
    icon?: string | null;
    iconType?: string | null;
    badge?: string | null;
    badgeColor?: string | null;
    image?: string | null;
    requiredPermissions: string[];
    requiredRoles: string[];
    isPublic: boolean;
    isActive: boolean;
    isVisible: boolean;
    isProtected: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string | null;
    updatedBy?: string | null;
    static fromEntity(menu: Menu): MenuResponseDto;
    static fromEntities(menus: Menu[]): MenuResponseDto[];
}
export declare class MenuPaginationResponseDto {
    items: MenuResponseDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
}
