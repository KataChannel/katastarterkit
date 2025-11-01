import { ConfigService } from '@nestjs/config';
export interface SearchQuery {
    q?: string;
    filters?: {
        status?: string[];
        priority?: string[];
        assigneeId?: string[];
        authorId?: string[];
        tags?: string[];
        dateRange?: {
            start: Date;
            end: Date;
            field: 'createdAt' | 'updatedAt' | 'dueDate';
        };
    };
    sort?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    pagination?: {
        page: number;
        size: number;
    };
    facets?: string[];
    highlight?: boolean;
}
export interface SearchResult<T> {
    items: T[];
    total: number;
    took: number;
    facets?: Record<string, Array<{
        key: string;
        count: number;
    }>>;
    suggestions?: string[];
    aggregations?: Record<string, any>;
}
export interface SearchSuggestion {
    text: string;
    score: number;
    type: 'completion' | 'phrase' | 'term';
}
export declare class ElasticsearchService {
    private configService;
    private client;
    private readonly logger;
    private readonly indexPrefix;
    private isConnected;
    constructor(configService: ConfigService);
    private initializeClient;
    getConnectionStatus(): boolean;
    private createIndicesIfNotExist;
    private createIndex;
    indexDocument(index: string, id: string, document: any): Promise<void>;
    updateDocument(index: string, id: string, document: Partial<any>): Promise<void>;
    getDocument(index: string, id: string): Promise<any>;
    deleteDocument(index: string, id: string): Promise<void>;
    search<T = any>(index: string, query: SearchQuery): Promise<SearchResult<T>>;
    getSuggestions(index: string, query: string, size?: number): Promise<SearchSuggestion[]>;
    bulkIndex(index: string, documents: Array<{
        id: string;
        doc: any;
    }>): Promise<void>;
    getSearchAnalytics(dateRange: {
        start: Date;
        end: Date;
    }): Promise<any>;
    logSearch(query: SearchQuery, results: number, took: number): Promise<void>;
    healthCheck(): Promise<{
        status: string;
        cluster: any;
    }>;
}
