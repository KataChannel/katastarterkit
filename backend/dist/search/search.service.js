"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_service_1 = require("./elasticsearch.service");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = SearchService_1 = class SearchService {
    constructor(elasticsearchService, prisma) {
        this.elasticsearchService = elasticsearchService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(SearchService_1.name);
    }
    async searchTasks(query, userId) {
        const startTime = Date.now();
        try {
            const enhancedQuery = {
                ...query,
                filters: {
                    ...query.filters,
                    ...this.addUserAccessFilter(userId, query.filters)
                }
            };
            const result = await this.elasticsearchService.search('tasks', enhancedQuery);
            const took = Date.now() - startTime;
            await this.elasticsearchService.logSearch(query, result.total, took);
            return {
                ...result,
                took
            };
        }
        catch (error) {
            this.logger.error('Error searching tasks:', error);
            throw error;
        }
    }
    async getFacetedSearch(options, userId) {
        const query = {
            q: options.query,
            filters: options.filters,
            facets: options.facets,
            pagination: { page: 1, size: 0 }
        };
        const result = await this.searchTasks(query, userId);
        return {
            facets: result.facets || {},
            total: result.total
        };
    }
    async getSearchSuggestions(query, type = 'tasks') {
        try {
            const suggestions = await this.elasticsearchService.getSuggestions(type, query, 10);
            const recentSearches = await this.getRecentSearches(5);
            return {
                suggestions,
                recent: recentSearches.filter(search => search.toLowerCase().includes(query.toLowerCase()))
            };
        }
        catch (error) {
            this.logger.error('Error getting search suggestions:', error);
            return { suggestions: [], recent: [] };
        }
    }
    async fuzzySearch(query, userId, maxEdits = 2) {
        const searchQuery = {
            q: query,
        };
        return this.searchTasks(searchQuery, userId);
    }
    async saveSearch(name, query, userId, isPublic = false) {
        return {
            id: `search_${Date.now()}`,
            name,
            query,
            userId,
            isPublic,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
    async getSavedSearches(userId) {
        return [];
    }
    async executeSavedSearch(searchId, userId, pagination) {
        throw new Error('Saved search not found');
    }
    async advancedSearch(filters, userId, pagination) {
        const searchFilters = {};
        if (filters.status?.length)
            searchFilters.status = filters.status;
        if (filters.priority?.length)
            searchFilters.priority = filters.priority;
        if (filters.assignees?.length)
            searchFilters.assigneeId = filters.assignees;
        if (filters.authors?.length)
            searchFilters.authorId = filters.authors;
        if (filters.tags?.length)
            searchFilters.tags = filters.tags;
        if (filters.dateCreated) {
            searchFilters.dateRange = {
                start: filters.dateCreated.start,
                end: filters.dateCreated.end,
                field: 'createdAt'
            };
        }
        const query = {
            q: filters.text,
            filters: searchFilters,
            pagination,
            facets: ['status', 'priority', 'assigneeId', 'authorId', 'tags'],
            highlight: !!filters.text
        };
        const result = await this.searchTasks(query, userId);
        let filteredItems = result.items;
        if (filters.hasAttachments !== undefined) {
            filteredItems = filteredItems.filter(task => filters.hasAttachments ? (task.attachments?.length > 0) : !(task.attachments?.length > 0));
        }
        if (filters.hasComments !== undefined) {
            filteredItems = filteredItems.filter(task => filters.hasComments ? (task.comments?.length > 0) : !(task.comments?.length > 0));
        }
        if (filters.isOverdue !== undefined && filters.isOverdue) {
            const now = new Date();
            filteredItems = filteredItems.filter(task => task.dueDate && new Date(task.dueDate) < now && task.status !== 'COMPLETED');
        }
        return {
            ...result,
            items: filteredItems,
            total: filteredItems.length
        };
    }
    async getSearchAnalytics(userId, dateRange) {
        try {
            const analytics = await this.elasticsearchService.getSearchAnalytics(dateRange);
            return {
                global: analytics,
                user: {
                    searchCount: 0,
                    avgResultsCount: 0,
                    topQueries: [],
                    recentSearches: []
                }
            };
        }
        catch (error) {
            this.logger.error('Error getting search analytics:', error);
            return null;
        }
    }
    async indexTask(task) {
        try {
            await this.elasticsearchService.indexDocument('tasks', task.id, {
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                tags: task.tags || [],
                authorId: task.authorId,
                assigneeId: task.assigneeId,
                projectId: task.projectId,
                teamId: task.teamId,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                dueDate: task.dueDate,
                completedAt: task.completedAt
            });
        }
        catch (error) {
            this.logger.error(`Error indexing task ${task.id}:`, error);
        }
    }
    async removeTaskFromIndex(taskId) {
        try {
            await this.elasticsearchService.deleteDocument('tasks', taskId);
        }
        catch (error) {
            this.logger.error(`Error removing task ${taskId} from index:`, error);
        }
    }
    async bulkIndexTasks(tasks) {
        try {
            const documents = tasks.map(task => ({
                id: task.id,
                doc: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    tags: task.tags || [],
                    authorId: task.authorId,
                    assigneeId: task.assigneeId,
                    projectId: task.projectId,
                    teamId: task.teamId,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                    dueDate: task.dueDate,
                    completedAt: task.completedAt
                }
            }));
            await this.elasticsearchService.bulkIndex('tasks', documents);
        }
        catch (error) {
            this.logger.error('Error bulk indexing tasks:', error);
        }
    }
    async reindexAllTasks() {
        try {
            const tasks = await this.prisma.task.findMany();
            await this.bulkIndexTasks(tasks);
            this.logger.log(`Reindexed ${tasks.length} tasks`);
        }
        catch (error) {
            this.logger.error('Error reindexing all tasks:', error);
            throw error;
        }
    }
    addUserAccessFilter(userId, existingFilters) {
        return {
            ...existingFilters
        };
    }
    async getRecentSearches(limit) {
        return [];
    }
    getTopQueries(searchHistory) {
        const queryCount = searchHistory.reduce((acc, log) => {
            if (log.query) {
                acc[log.query] = (acc[log.query] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(queryCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([query, count]) => ({ query, count: count }));
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elasticsearch_service_1.ElasticsearchService,
        prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map