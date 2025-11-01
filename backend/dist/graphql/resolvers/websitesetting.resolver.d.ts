export declare const websiteSettingResolvers: {
    Query: {
        websiteSettings: (_: any, args: any, context: any) => Promise<any>;
        publicWebsiteSettings: (_: any, args: any) => Promise<any>;
        websiteSetting: (_: any, { key }: any) => Promise<any>;
        websiteSettingsByCategory: (_: any, { category }: any) => Promise<any>;
        headerSettings: () => Promise<any>;
        footerSettings: () => Promise<any>;
        websiteSettingsMap: (_: any, args: any) => Promise<any>;
    };
    Mutation: {
        createWebsiteSetting: (_: any, { input }: any, context: any) => Promise<any>;
        updateWebsiteSetting: (_: any, { key, input }: any, context: any) => Promise<any>;
        updateWebsiteSettings: (_: any, { settings }: any, context: any) => Promise<any[]>;
        deleteWebsiteSetting: (_: any, { key }: any, context: any) => Promise<any>;
        bulkUpdateWebsiteSettings: (_: any, { data }: any, context: any) => Promise<any[]>;
    };
    WebsiteSetting: {
        creator: (parent: any) => Promise<any>;
        updater: (parent: any) => Promise<any>;
    };
};
