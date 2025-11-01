import { MenuType, MenuTarget } from '@prisma/client';
export declare class UpdateMenuDto {
    title?: string;
    slug?: string;
    description?: string;
    type?: MenuType;
    parentId?: string;
    order?: number;
    url?: string;
    route?: string;
    externalUrl?: string;
    target?: MenuTarget;
    icon?: string;
    iconType?: string;
    badge?: string;
    badgeColor?: string;
    image?: string;
    requiredPermissions?: string[];
    requiredRoles?: string[];
    isPublic?: boolean;
    isActive?: boolean;
    isVisible?: boolean;
    isProtected?: boolean;
    metadata?: Record<string, any>;
    cssClass?: string;
    customData?: Record<string, any>;
}
