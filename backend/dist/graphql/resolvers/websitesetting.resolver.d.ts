export declare const websiteSettingResolvers: {
    Query: {
        websiteSettings: (_: any, args: any, context: any) => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }[]>;
        publicWebsiteSettings: (_: any, args: any) => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }[]>;
        websiteSetting: (_: any, { key }: any) => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }>;
        websiteSettingsByCategory: (_: any, { category }: any) => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }[]>;
        headerSettings: () => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }[]>;
        footerSettings: () => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }[]>;
        websiteSettingsMap: (_: any, args: any) => Promise<any>;
    };
    Mutation: {
        createWebsiteSetting: (_: any, { input }: any, context: any) => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }>;
        updateWebsiteSetting: (_: any, { key, input }: any, context: any) => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }>;
        updateWebsiteSettings: (_: any, { settings }: any, context: any) => Promise<any[]>;
        deleteWebsiteSetting: (_: any, { key }: any, context: any) => Promise<{
            type: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string | null;
            group: string | null;
        }>;
        bulkUpdateWebsiteSettings: (_: any, { data }: any, context: any) => Promise<any[]>;
    };
    WebsiteSetting: {
        creator: (parent: any) => Promise<{
            password: string | null;
            id: string;
            isVerified: boolean;
            createdAt: Date;
            isActive: boolean;
            email: string | null;
            username: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
        }>;
        updater: (parent: any) => Promise<{
            password: string | null;
            id: string;
            isVerified: boolean;
            createdAt: Date;
            isActive: boolean;
            email: string | null;
            username: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
        }>;
    };
};
