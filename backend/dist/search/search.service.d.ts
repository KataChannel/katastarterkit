import { ElasticsearchService, SearchQuery } from './elasticsearch.service';
import { PrismaService } from '../prisma/prisma.service';
export interface SavedSearch {
    id: string;
    name: string;
    query: SearchQuery;
    userId: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface FacetedSearchOptions {
    facets: string[];
    filters?: Record<string, string[]>;
    query?: string;
}
export declare class SearchService {
    private elasticsearchService;
    private prisma;
    private readonly logger;
    constructor(elasticsearchService: ElasticsearchService, prisma: PrismaService);
    searchTasks(query: SearchQuery, userId: string): Promise<{
        took: number;
        items: any[];
        total: number;
        facets?: Record<string, Array<{
            key: string;
            count: number;
        }>>;
        suggestions?: string[];
        aggregations?: Record<string, any>;
    }>;
    getFacetedSearch(options: FacetedSearchOptions, userId: string): Promise<{
        facets: Record<string, {
            key: string;
            count: number;
        }[]>;
        total: number;
    }>;
    getSearchSuggestions(query: string, type?: 'tasks' | 'users' | 'projects'): Promise<{
        suggestions: import("./elasticsearch.service").SearchSuggestion[];
        recent: string[];
    }>;
    fuzzySearch(query: string, userId: string, maxEdits?: number): Promise<{
        took: number;
        items: any[];
        total: number;
        facets?: Record<string, Array<{
            key: string;
            count: number;
        }>>;
        suggestions?: string[];
        aggregations?: Record<string, any>;
    }>;
    saveSearch(name: string, query: SearchQuery, userId: string, isPublic?: boolean): Promise<SavedSearch>;
    getSavedSearches(userId: string): Promise<SavedSearch[]>;
    executeSavedSearch(searchId: string, userId: string, pagination?: {
        page: number;
        size: number;
    }): Promise<void>;
    advancedSearch(filters: {
        text?: string;
        status?: string[];
        priority?: string[];
        assignees?: string[];
        authors?: string[];
        tags?: string[];
        projects?: string[];
        dateCreated?: {
            start: Date;
            end: Date;
        };
        dateDue?: {
            start: Date;
            end: Date;
        };
        dateCompleted?: {
            start: Date;
            end: Date;
        };
        hasAttachments?: boolean;
        hasComments?: boolean;
        isOverdue?: boolean;
    }, userId: string, pagination?: {
        page: number;
        size: number;
    }): Promise<{
        items: any[];
        total: number;
        took: number;
        facets?: Record<string, Array<{
            key: string;
            count: number;
        }>>;
        suggestions?: string[];
        aggregations?: Record<string, any>;
    }>;
    getSearchAnalytics(userId: string, dateRange: {
        start: Date;
        end: Date;
    }): Promise<{
        global: any;
        user: {
            searchCount: number;
            avgResultsCount: number;
            topQueries: any[];
            recentSearches: any[];
        };
    }>;
    indexTask(task: any): Promise<void>;
    removeTaskFromIndex(taskId: string): Promise<void>;
    bulkIndexTasks(tasks: any[]): Promise<void>;
    reindexAllTasks(): Promise<void>;
    private addUserAccessFilter;
    private getRecentSearches;
    private getTopQueries;
}
