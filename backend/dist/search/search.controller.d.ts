import { SearchService } from './search.service';
import { SearchQuery } from './elasticsearch.service';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    searchTasks(query?: string, status?: string, priority?: string, assignee?: string, author?: string, tags?: string, page?: string, size?: string, sort?: string, sortOrder?: 'asc' | 'desc', req?: any): Promise<{
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
    advancedSearchTasks(filters: {
        text?: string;
        status?: string[];
        priority?: string[];
        assignees?: string[];
        authors?: string[];
        tags?: string[];
        projects?: string[];
        dateCreated?: {
            start: string;
            end: string;
        };
        dateDue?: {
            start: string;
            end: string;
        };
        dateCompleted?: {
            start: string;
            end: string;
        };
        hasAttachments?: boolean;
        hasComments?: boolean;
        isOverdue?: boolean;
    }, page?: string, size?: string, req?: any): Promise<{
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
    getSearchSuggestions(query: string, type?: 'tasks' | 'users' | 'projects'): Promise<{
        suggestions: import("./elasticsearch.service").SearchSuggestion[];
        recent: string[];
    }>;
    getFacetedSearch(facets?: string, query?: string, filters?: Record<string, string>, req?: any): Promise<{
        facets: Record<string, {
            key: string;
            count: number;
        }[]>;
        total: number;
    }>;
    saveSearch(body: {
        name: string;
        query: SearchQuery;
        isPublic?: boolean;
    }, req?: any): Promise<import("./search.service").SavedSearch>;
    getSavedSearches(req?: any): Promise<import("./search.service").SavedSearch[]>;
    executeSavedSearch(searchId: string, page?: string, size?: string, req?: any): Promise<void>;
    getSearchAnalytics(startDate?: string, endDate?: string, req?: any): Promise<{
        global: any;
        user: {
            searchCount: number;
            avgResultsCount: number;
            topQueries: any[];
            recentSearches: any[];
        };
    }>;
    reindexTasks(req?: any): Promise<void>;
    fuzzySearch(query: string, maxEdits?: string, req?: any): Promise<{
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
}
