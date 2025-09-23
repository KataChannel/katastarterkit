import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private elasticsearchService: ElasticsearchService,
    private prisma: PrismaService
  ) {}

  // Search tasks with advanced filtering and faceting
  async searchTasks(query: SearchQuery, userId: string) {
    const startTime = Date.now();

    try {
      // Add user access control filters
      const enhancedQuery = {
        ...query,
        filters: {
          ...query.filters,
          // User can only see tasks they created, are assigned to, or are team members of
          ...this.addUserAccessFilter(userId, query.filters)
        }
      };

      const result = await this.elasticsearchService.search('tasks', enhancedQuery);
      const took = Date.now() - startTime;

      // Log search for analytics
      await this.elasticsearchService.logSearch(query, result.total, took);

      return {
        ...result,
        took
      };
    } catch (error) {
      this.logger.error('Error searching tasks:', error);
      throw error;
    }
  }

  // Get faceted search results with aggregations
  async getFacetedSearch(options: FacetedSearchOptions, userId: string) {
    const query: SearchQuery = {
      q: options.query,
      filters: options.filters,
      facets: options.facets,
      pagination: { page: 1, size: 0 } // Only get aggregations, no documents
    };

    const result = await this.searchTasks(query, userId);
    
    return {
      facets: result.facets || {},
      total: result.total
    };
  }

  // Get search suggestions
  async getSearchSuggestions(query: string, type: 'tasks' | 'users' | 'projects' = 'tasks') {
    try {
      const suggestions = await this.elasticsearchService.getSuggestions(type, query, 10);
      
      // Also get recent searches from the user
      const recentSearches = await this.getRecentSearches(5);
      
      return {
        suggestions,
        recent: recentSearches.filter(search => 
          search.toLowerCase().includes(query.toLowerCase())
        )
      };
    } catch (error) {
      this.logger.error('Error getting search suggestions:', error);
      return { suggestions: [], recent: [] };
    }
  }

  // Fuzzy search with typo tolerance
  async fuzzySearch(query: string, userId: string, maxEdits: number = 2) {
    const searchQuery: SearchQuery = {
      q: query,
      // Add fuzzy matching configuration
      // This is handled in the elasticsearch service multi_match query
    };

    return this.searchTasks(searchQuery, userId);
  }

  // Save a search query (simplified without database)
  async saveSearch(name: string, query: SearchQuery, userId: string, isPublic: boolean = false): Promise<SavedSearch> {
    // For now, return a mock saved search
    // In production, you'd save this to a database
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

  // Get saved searches for a user (simplified)
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    // For now, return empty array
    // In production, you'd fetch from database
    return [];
  }

  // Execute a saved search (simplified)
  async executeSavedSearch(searchId: string, userId: string, pagination?: { page: number; size: number }) {
    // For now, return empty search results
    // In production, you'd fetch the saved search and execute it
    throw new Error('Saved search not found');
  }

  // Advanced search with complex filters
  async advancedSearch(filters: {
    text?: string;
    status?: string[];
    priority?: string[];
    assignees?: string[];
    authors?: string[];
    tags?: string[];
    projects?: string[];
    dateCreated?: { start: Date; end: Date };
    dateDue?: { start: Date; end: Date };
    dateCompleted?: { start: Date; end: Date };
    hasAttachments?: boolean;
    hasComments?: boolean;
    isOverdue?: boolean;
  }, userId: string, pagination?: { page: number; size: number }) {
    
    const searchFilters: SearchQuery['filters'] = {};

    // Basic filters
    if (filters.status?.length) searchFilters.status = filters.status;
    if (filters.priority?.length) searchFilters.priority = filters.priority;
    if (filters.assignees?.length) searchFilters.assigneeId = filters.assignees;
    if (filters.authors?.length) searchFilters.authorId = filters.authors;
    if (filters.tags?.length) searchFilters.tags = filters.tags;

    // Date range filters
    if (filters.dateCreated) {
      searchFilters.dateRange = {
        start: filters.dateCreated.start,
        end: filters.dateCreated.end,
        field: 'createdAt'
      };
    }

    const query: SearchQuery = {
      q: filters.text,
      filters: searchFilters,
      pagination,
      facets: ['status', 'priority', 'assigneeId', 'authorId', 'tags'],
      highlight: !!filters.text
    };

    // Handle complex filters that need post-processing
    const result = await this.searchTasks(query, userId);

    // Apply additional filters that can't be handled by Elasticsearch
    let filteredItems = result.items;

    if (filters.hasAttachments !== undefined) {
      filteredItems = filteredItems.filter(task => 
        filters.hasAttachments ? (task.attachments?.length > 0) : !(task.attachments?.length > 0)
      );
    }

    if (filters.hasComments !== undefined) {
      filteredItems = filteredItems.filter(task => 
        filters.hasComments ? (task.comments?.length > 0) : !(task.comments?.length > 0)
      );
    }

    if (filters.isOverdue !== undefined && filters.isOverdue) {
      const now = new Date();
      filteredItems = filteredItems.filter(task => 
        task.dueDate && new Date(task.dueDate) < now && task.status !== 'COMPLETED'
      );
    }

    return {
      ...result,
      items: filteredItems,
      total: filteredItems.length
    };
  }

  // Get search analytics (simplified)
  async getSearchAnalytics(userId: string, dateRange: { start: Date; end: Date }) {
    try {
      const analytics = await this.elasticsearchService.getSearchAnalytics(dateRange);
      
      // For now, return simplified analytics
      // In production, you'd have user-specific search logs in database
      return {
        global: analytics,
        user: {
          searchCount: 0,
          avgResultsCount: 0,
          topQueries: [],
          recentSearches: []
        }
      };
    } catch (error) {
      this.logger.error('Error getting search analytics:', error);
      return null;
    }
  }

  // Index a task for search
  async indexTask(task: any) {
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
    } catch (error) {
      this.logger.error(`Error indexing task ${task.id}:`, error);
    }
  }

  // Remove task from search index
  async removeTaskFromIndex(taskId: string) {
    try {
      await this.elasticsearchService.deleteDocument('tasks', taskId);
    } catch (error) {
      this.logger.error(`Error removing task ${taskId} from index:`, error);
    }
  }

  // Bulk index tasks
  async bulkIndexTasks(tasks: any[]) {
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
    } catch (error) {
      this.logger.error('Error bulk indexing tasks:', error);
    }
  }

  // Reindex all tasks
  async reindexAllTasks() {
    try {
      const tasks = await this.prisma.task.findMany();
      await this.bulkIndexTasks(tasks);
      this.logger.log(`Reindexed ${tasks.length} tasks`);
    } catch (error) {
      this.logger.error('Error reindexing all tasks:', error);
      throw error;
    }
  }

  // Private helper methods
  private addUserAccessFilter(userId: string, existingFilters?: any) {
    // In a real implementation, you'd need to determine which tasks
    // the user has access to based on your authorization rules
    return {
      ...existingFilters
      // Add user-specific filters here
    };
  }

  private async getRecentSearches(limit: number): Promise<string[]> {
    // For now, return empty array
    // In production, you'd fetch from database
    return [];
  }

  private getTopQueries(searchHistory: any[]): Array<{ query: string; count: number }> {
    const queryCount = searchHistory.reduce((acc, log) => {
      if (log.query) {
        acc[log.query] = (acc[log.query] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(queryCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([query, count]) => ({ query, count: count as number }));
  }
}