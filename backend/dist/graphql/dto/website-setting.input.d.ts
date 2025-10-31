export declare enum SettingCategory {
    GENERAL = "GENERAL",
    HEADER = "HEADER",
    FOOTER = "FOOTER",
    SEO = "SEO",
    SOCIAL = "SOCIAL",
    CONTACT = "CONTACT",
    SUPPORT_CHAT = "SUPPORT_CHAT"
}
export declare enum SettingType {
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    SELECT = "SELECT",
    JSON = "JSON",
    COLOR = "COLOR",
    IMAGE = "IMAGE"
}
export declare class CreateWebsiteSettingInput {
    key: string;
    label: string;
    value?: string;
    description?: string;
    type: SettingType;
    category: SettingCategory;
    group?: string;
    order?: number;
    options?: any;
    validation?: any;
    isActive?: boolean;
    isPublic?: boolean;
    createdBy?: string;
    updatedBy?: string;
}
export declare class UpdateWebsiteSettingInput {
    label?: string;
    value?: string;
    description?: string;
    type?: SettingType;
    category?: SettingCategory;
    group?: string;
    order?: number;
    options?: any;
    validation?: any;
    isActive?: boolean;
    isPublic?: boolean;
    updatedBy?: string;
}
