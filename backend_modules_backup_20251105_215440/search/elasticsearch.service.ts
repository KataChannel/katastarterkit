import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

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
  facets?: Record<string, Array<{ key: string; count: number }>>;
  suggestions?: string[];
  aggregations?: Record<string, any>;
}

export interface SearchSuggestion {
  text: string;
  score: number;
  type: 'completion' | 'phrase' | 'term';
}

@Injectable()
export class ElasticsearchService {
  private client: Client;
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly indexPrefix: string;
  private isConnected: boolean = false;

  constructor(private configService: ConfigService) {
    this.indexPrefix = this.configService.get('ELASTICSEARCH_INDEX_PREFIX', 'rausachcore');
    
    // Detect Docker environment
    const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
    
    // Use appropriate URL based on environment
    const elasticsearchUrl = isDockerEnv
      ? this.configService.get('DOCKER_ELASTICSEARCH_URL', 'http://elasticsearch:9200')
      : this.configService.get('ELASTICSEARCH_URL', 'http://116.118.49.243:12005');
    
    this.client = new Client({
      node: elasticsearchUrl,
      auth: {
        username: this.configService.get('ELASTICSEARCH_USERNAME'),
        password: this.configService.get('ELASTICSEARCH_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: this.configService.get('NODE_ENV') === 'production',
      },
      requestTimeout: 30000,
      maxRetries: 3,
    });

    this.initializeClient();
  }

  private async initializeClient() {
    try {
      const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
      const elasticsearchUrl = isDockerEnv
        ? this.configService.get('DOCKER_ELASTICSEARCH_URL', 'http://elasticsearch:9200')
        : this.configService.get('ELASTICSEARCH_URL', 'http://localhost:12005');
      this.logger.log(`[Elasticsearch] Connecting to: ${elasticsearchUrl} (dockerEnv=${isDockerEnv})`);
      await this.client.ping();
      this.logger.log('✅ Elasticsearch client connected successfully');
      this.isConnected = true;
      await this.createIndicesIfNotExist();
    } catch (error) {
      this.logger.warn('❌ Failed to connect to Elasticsearch:', error.message);
      this.logger.warn('Search functionality will be limited without Elasticsearch');
      this.isConnected = false;
      // Don't throw error - allow app to start without Elasticsearch
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  private async createIndicesIfNotExist() {
    const indices = ['tasks', 'users', 'projects'];
    
    for (const index of indices) {
      const indexName = `${this.indexPrefix}-${index}`;
      
      try {
        const exists = await this.client.indices.exists({ index: indexName });
        
        if (!exists) {
          await this.createIndex(index);
          this.logger.log(`Created index: ${indexName}`);
        }
      } catch (error) {
        this.logger.error(`Error creating index ${indexName}:`, error);
      }
    }
  }

  private async createIndex(type: string) {
    const indexName = `${this.indexPrefix}-${type}`;
    
    const mappings = {
      tasks: {
        properties: {
          id: { type: 'keyword' },
          title: { 
            type: 'text',
            analyzer: 'standard',
            fields: {
              keyword: { type: 'keyword' },
              suggest: { type: 'completion' }
            }
          },
          description: { 
            type: 'text',
            analyzer: 'standard'
          },
          status: { type: 'keyword' },
          priority: { type: 'keyword' },
          tags: { type: 'keyword' },
          authorId: { type: 'keyword' },
          assigneeId: { type: 'keyword' },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' },
          dueDate: { type: 'date' },
          completedAt: { type: 'date' },
          projectId: { type: 'keyword' },
          teamId: { type: 'keyword' },
          // Full-text search field
          searchText: {
            type: 'text',
            analyzer: 'standard'
          }
        }
      },
      users: {
        properties: {
          id: { type: 'keyword' },
          email: { type: 'keyword' },
          name: { 
            type: 'text',
            fields: {
              keyword: { type: 'keyword' },
              suggest: { type: 'completion' }
            }
          },
          role: { type: 'keyword' },
          department: { type: 'keyword' },
          skills: { type: 'keyword' },
          createdAt: { type: 'date' }
        }
      },
      projects: {
        properties: {
          id: { type: 'keyword' },
          name: { 
            type: 'text',
            fields: {
              keyword: { type: 'keyword' },
              suggest: { type: 'completion' }
            }
          },
          description: { type: 'text' },
          status: { type: 'keyword' },
          ownerId: { type: 'keyword' },
          teamIds: { type: 'keyword' },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' }
        }
      }
    };

    const settings = {
      number_of_shards: 1,
      number_of_replicas: 0,
      analysis: {
        analyzer: {
          custom_search_analyzer: {
            type: 'custom' as const,
            tokenizer: 'standard',
            filter: ['lowercase', 'stop', 'snowball']
          }
        }
      }
    };

    await this.client.indices.create({
      index: indexName,
      body: {
        settings,
        mappings: mappings[type] || {}
      }
    });
  }

  // Index a document
  async indexDocument(index: string, id: string, document: any): Promise<void> {
    try {
      const indexName = `${this.indexPrefix}-${index}`;
      
      // Add searchText field for better full-text search
      if (index === 'tasks') {
        document.searchText = [
          document.title,
          document.description,
          ...(document.tags || []),
          document.status,
          document.priority
        ].filter(Boolean).join(' ');
      }

      await this.client.index({
        index: indexName,
        id,
        body: document,
        refresh: 'wait_for'
      });
      
      this.logger.debug(`Indexed document ${id} in ${indexName}`);
    } catch (error) {
      this.logger.error(`Error indexing document ${id}:`, error);
      throw error;
    }
  }

  // Update a document
  async updateDocument(index: string, id: string, document: Partial<any>): Promise<void> {
    try {
      const indexName = `${this.indexPrefix}-${index}`;
      
      // Update searchText for tasks
      if (index === 'tasks' && (document.title || document.description || document.tags)) {
        const existingDoc = await this.getDocument(index, id);
        if (existingDoc) {
          const merged = { ...existingDoc, ...document };
          merged.searchText = [
            merged.title,
            merged.description,
            ...(merged.tags || []),
            merged.status,
            merged.priority
          ].filter(Boolean).join(' ');
          document.searchText = merged.searchText;
        }
      }

      await this.client.update({
        index: indexName,
        id,
        body: { doc: document },
        refresh: 'wait_for'
      });
      
      this.logger.debug(`Updated document ${id} in ${indexName}`);
    } catch (error) {
      this.logger.error(`Error updating document ${id}:`, error);
      throw error;
    }
  }

  // Get a document by ID
  async getDocument(index: string, id: string): Promise<any> {
    try {
      const indexName = `${this.indexPrefix}-${index}`;
      const result = await this.client.get({
        index: indexName,
        id
      });
      
      return result._source;
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        return null;
      }
      this.logger.error(`Error getting document ${id}:`, error);
      throw error;
    }
  }

  // Delete a document
  async deleteDocument(index: string, id: string): Promise<void> {
    try {
      const indexName = `${this.indexPrefix}-${index}`;
      await this.client.delete({
        index: indexName,
        id,
        refresh: 'wait_for'
      });
      
      this.logger.debug(`Deleted document ${id} from ${indexName}`);
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        this.logger.error(`Error deleting document ${id}:`, error);
        throw error;
      }
    }
  }

  // Advanced search with filters, facets, and suggestions
  async search<T = any>(index: string, query: SearchQuery): Promise<SearchResult<T>> {
    try {
      const indexName = `${this.indexPrefix}-${index}`;
      const { q, filters, sort, pagination, facets, highlight } = query;
      
      // Build Elasticsearch query
      const searchBody: any = {
        query: {
          bool: {
            must: [],
            filter: []
          }
        }
      };

      // Text query
      if (q) {
        searchBody.query.bool.must.push({
          multi_match: {
            query: q,
            fields: index === 'tasks' 
              ? ['title^2', 'description', 'searchText', 'tags']
              : ['name^2', 'description'],
            type: 'best_fields',
            fuzziness: 'AUTO',
            minimum_should_match: '75%'
          }
        });
      } else {
        searchBody.query.bool.must.push({ match_all: {} });
      }

      // Filters
      if (filters) {
        if (filters.status?.length) {
          searchBody.query.bool.filter.push({
            terms: { status: filters.status }
          });
        }
        
        if (filters.priority?.length) {
          searchBody.query.bool.filter.push({
            terms: { priority: filters.priority }
          });
        }
        
        if (filters.assigneeId?.length) {
          searchBody.query.bool.filter.push({
            terms: { assigneeId: filters.assigneeId }
          });
        }
        
        if (filters.authorId?.length) {
          searchBody.query.bool.filter.push({
            terms: { authorId: filters.authorId }
          });
        }
        
        if (filters.tags?.length) {
          searchBody.query.bool.filter.push({
            terms: { tags: filters.tags }
          });
        }
        
        if (filters.dateRange) {
          const { start, end, field } = filters.dateRange;
          searchBody.query.bool.filter.push({
            range: {
              [field]: {
                gte: start,
                lte: end
              }
            }
          });
        }
      }

      // Sorting
      if (sort) {
        searchBody.sort = [{
          [sort.field]: { order: sort.direction }
        }];
      } else {
        // Default sort by relevance and recency
        searchBody.sort = [
          { _score: { order: 'desc' } },
          { updatedAt: { order: 'desc' } }
        ];
      }

      // Pagination
      const page = pagination?.page || 1;
      const size = pagination?.size || 20;
      searchBody.from = (page - 1) * size;
      searchBody.size = size;

      // Highlighting
      if (highlight) {
        searchBody.highlight = {
          fields: {
            title: {},
            description: {},
            searchText: {}
          }
        };
      }

      // Aggregations for facets
      if (facets?.length) {
        searchBody.aggs = {};
        facets.forEach(facet => {
          searchBody.aggs[facet] = {
            terms: {
              field: facet,
              size: 20
            }
          };
        });
      }

      // Execute search
      const result = await this.client.search({
        index: indexName,
        body: searchBody
      });

      // Process results
      const items = result.hits.hits.map((hit: any) => ({
        ...hit._source,
        _score: hit._score,
        _highlight: hit.highlight
      }));

      const processedFacets: Record<string, Array<{ key: string; count: number }>> = {};
      if (result.aggregations) {
        Object.keys(result.aggregations).forEach(key => {
          const agg = result.aggregations[key];
          processedFacets[key] = (agg as any).buckets?.map((bucket: any) => ({
            key: bucket.key,
            count: bucket.doc_count
          }));
        });
      }

      return {
        items,
        total: typeof result.hits.total === 'object' ? result.hits.total.value : result.hits.total,
        took: result.took,
        facets: Object.keys(processedFacets).length > 0 ? processedFacets : undefined,
        aggregations: result.aggregations
      };
    } catch (error) {
      this.logger.error(`Search error in ${index}:`, error);
      throw error;
    }
  }

  // Get search suggestions
  async getSuggestions(index: string, query: string, size: number = 5): Promise<SearchSuggestion[]> {
    try {
      const indexName = `${this.indexPrefix}-${index}`;
      
      const result = await this.client.search({
        index: indexName,
        body: {
          suggest: {
            text: query,
            completion_suggest: {
              completion: {
                field: index === 'tasks' ? 'title.suggest' : 'name.suggest',
                size,
                skip_duplicates: true,
                fuzzy: {
                  fuzziness: 'AUTO'
                }
              }
            },
            phrase_suggest: {
              phrase: {
                field: index === 'tasks' ? 'title' : 'name',
                size: 3,
                gram_size: 2,
                direct_generator: [{
                  field: index === 'tasks' ? 'title' : 'name',
                  suggest_mode: 'always'
                }]
              }
            }
          }
        }
      });

      const suggestions: SearchSuggestion[] = [];

      // Process completion suggestions
      const completionOptions = result.suggest.completion_suggest?.[0]?.options;
      if (Array.isArray(completionOptions)) {
        completionOptions.forEach((option: any) => {
          suggestions.push({
            text: option.text,
            score: option._score,
            type: 'completion'
          });
        });
      }

      // Process phrase suggestions
      const phraseOptions = result.suggest.phrase_suggest?.[0]?.options;
      if (Array.isArray(phraseOptions)) {
        phraseOptions.forEach((option: any) => {
          suggestions.push({
            text: option.text,
            score: option.score,
            type: 'phrase'
          });
        });
      }

      return suggestions.sort((a, b) => b.score - a.score);
    } catch (error) {
      this.logger.error(`Error getting suggestions for ${index}:`, error);
      return [];
    }
  }

  // Bulk operations for better performance
  async bulkIndex(index: string, documents: Array<{ id: string; doc: any }>): Promise<void> {
    try {
      const indexName = `${this.indexPrefix}-${index}`;
      const body = [];

      for (const { id, doc } of documents) {
        // Add searchText for tasks
        if (index === 'tasks') {
          doc.searchText = [
            doc.title,
            doc.description,
            ...(doc.tags || []),
            doc.status,
            doc.priority
          ].filter(Boolean).join(' ');
        }

        body.push({ index: { _index: indexName, _id: id } });
        body.push(doc);
      }

      const result = await this.client.bulk({
        operations: body,
        refresh: 'wait_for'
      });

      if (result.errors) {
        this.logger.error('Bulk index errors:', result.items);
      } else {
        this.logger.debug(`Bulk indexed ${documents.length} documents in ${indexName}`);
      }
    } catch (error) {
      this.logger.error('Bulk index error:', error);
      throw error;
    }
  }

  // Search analytics
  async getSearchAnalytics(dateRange: { start: Date; end: Date }): Promise<any> {
    try {
      const indexName = `${this.indexPrefix}-search-logs`;
      
      const result = await this.client.search({
        index: indexName,
        body: {
          query: {
            range: {
              timestamp: {
                gte: dateRange.start,
                lte: dateRange.end
              }
            }
          },
          aggs: {
            popular_queries: {
              terms: {
                field: 'query.keyword',
                size: 10
              }
            },
            query_performance: {
              avg: {
                field: 'took'
              }
            },
            zero_results: {
              filter: {
                term: { results_count: 0 }
              }
            }
          },
          size: 0
        }
      });

      return result.aggregations;
    } catch (error) {
      this.logger.error('Error getting search analytics:', error);
      return null;
    }
  }

  // Log search queries for analytics
  async logSearch(query: SearchQuery, results: number, took: number): Promise<void> {
    try {
      const indexName = `${this.indexPrefix}-search-logs`;
      
      await this.client.index({
        index: indexName,
        body: {
          query: query.q || '',
          filters: query.filters || {},
          results_count: results,
          took,
          timestamp: new Date()
        }
      });
    } catch (error) {
      this.logger.error('Error logging search:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; cluster: any }> {
    try {
      const health = await this.client.cluster.health();
      return {
        status: 'healthy',
        cluster: health
      };
    } catch (error) {
      this.logger.error('Elasticsearch health check failed:', error);
      return {
        status: 'unhealthy',
        cluster: null
      };
    }
  }
}