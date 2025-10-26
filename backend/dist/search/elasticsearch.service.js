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
var ElasticsearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const elasticsearch_1 = require("@elastic/elasticsearch");
let ElasticsearchService = ElasticsearchService_1 = class ElasticsearchService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ElasticsearchService_1.name);
        this.isConnected = false;
        this.indexPrefix = this.configService.get('ELASTICSEARCH_INDEX_PREFIX', 'rausachcore');
        const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
        const elasticsearchUrl = isDockerEnv
            ? this.configService.get('DOCKER_ELASTICSEARCH_URL', 'http://elasticsearch:9200')
            : this.configService.get('ELASTICSEARCH_URL', 'http://116.118.49.243:12005');
        this.client = new elasticsearch_1.Client({
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
    async initializeClient() {
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
        }
        catch (error) {
            this.logger.warn('❌ Failed to connect to Elasticsearch:', error.message);
            this.logger.warn('Search functionality will be limited without Elasticsearch');
            this.isConnected = false;
        }
    }
    getConnectionStatus() {
        return this.isConnected;
    }
    async createIndicesIfNotExist() {
        const indices = ['tasks', 'users', 'projects'];
        for (const index of indices) {
            const indexName = `${this.indexPrefix}-${index}`;
            try {
                const exists = await this.client.indices.exists({ index: indexName });
                if (!exists) {
                    await this.createIndex(index);
                    this.logger.log(`Created index: ${indexName}`);
                }
            }
            catch (error) {
                this.logger.error(`Error creating index ${indexName}:`, error);
            }
        }
    }
    async createIndex(type) {
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
                        type: 'custom',
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
    async indexDocument(index, id, document) {
        try {
            const indexName = `${this.indexPrefix}-${index}`;
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
        }
        catch (error) {
            this.logger.error(`Error indexing document ${id}:`, error);
            throw error;
        }
    }
    async updateDocument(index, id, document) {
        try {
            const indexName = `${this.indexPrefix}-${index}`;
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
        }
        catch (error) {
            this.logger.error(`Error updating document ${id}:`, error);
            throw error;
        }
    }
    async getDocument(index, id) {
        try {
            const indexName = `${this.indexPrefix}-${index}`;
            const result = await this.client.get({
                index: indexName,
                id
            });
            return result._source;
        }
        catch (error) {
            if (error.meta?.statusCode === 404) {
                return null;
            }
            this.logger.error(`Error getting document ${id}:`, error);
            throw error;
        }
    }
    async deleteDocument(index, id) {
        try {
            const indexName = `${this.indexPrefix}-${index}`;
            await this.client.delete({
                index: indexName,
                id,
                refresh: 'wait_for'
            });
            this.logger.debug(`Deleted document ${id} from ${indexName}`);
        }
        catch (error) {
            if (error.meta?.statusCode !== 404) {
                this.logger.error(`Error deleting document ${id}:`, error);
                throw error;
            }
        }
    }
    async search(index, query) {
        try {
            const indexName = `${this.indexPrefix}-${index}`;
            const { q, filters, sort, pagination, facets, highlight } = query;
            const searchBody = {
                query: {
                    bool: {
                        must: [],
                        filter: []
                    }
                }
            };
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
            }
            else {
                searchBody.query.bool.must.push({ match_all: {} });
            }
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
            if (sort) {
                searchBody.sort = [{
                        [sort.field]: { order: sort.direction }
                    }];
            }
            else {
                searchBody.sort = [
                    { _score: { order: 'desc' } },
                    { updatedAt: { order: 'desc' } }
                ];
            }
            const page = pagination?.page || 1;
            const size = pagination?.size || 20;
            searchBody.from = (page - 1) * size;
            searchBody.size = size;
            if (highlight) {
                searchBody.highlight = {
                    fields: {
                        title: {},
                        description: {},
                        searchText: {}
                    }
                };
            }
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
            const result = await this.client.search({
                index: indexName,
                body: searchBody
            });
            const items = result.hits.hits.map((hit) => ({
                ...hit._source,
                _score: hit._score,
                _highlight: hit.highlight
            }));
            const processedFacets = {};
            if (result.aggregations) {
                Object.keys(result.aggregations).forEach(key => {
                    const agg = result.aggregations[key];
                    processedFacets[key] = agg.buckets?.map((bucket) => ({
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
        }
        catch (error) {
            this.logger.error(`Search error in ${index}:`, error);
            throw error;
        }
    }
    async getSuggestions(index, query, size = 5) {
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
            const suggestions = [];
            const completionOptions = result.suggest.completion_suggest?.[0]?.options;
            if (Array.isArray(completionOptions)) {
                completionOptions.forEach((option) => {
                    suggestions.push({
                        text: option.text,
                        score: option._score,
                        type: 'completion'
                    });
                });
            }
            const phraseOptions = result.suggest.phrase_suggest?.[0]?.options;
            if (Array.isArray(phraseOptions)) {
                phraseOptions.forEach((option) => {
                    suggestions.push({
                        text: option.text,
                        score: option.score,
                        type: 'phrase'
                    });
                });
            }
            return suggestions.sort((a, b) => b.score - a.score);
        }
        catch (error) {
            this.logger.error(`Error getting suggestions for ${index}:`, error);
            return [];
        }
    }
    async bulkIndex(index, documents) {
        try {
            const indexName = `${this.indexPrefix}-${index}`;
            const body = [];
            for (const { id, doc } of documents) {
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
            }
            else {
                this.logger.debug(`Bulk indexed ${documents.length} documents in ${indexName}`);
            }
        }
        catch (error) {
            this.logger.error('Bulk index error:', error);
            throw error;
        }
    }
    async getSearchAnalytics(dateRange) {
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
        }
        catch (error) {
            this.logger.error('Error getting search analytics:', error);
            return null;
        }
    }
    async logSearch(query, results, took) {
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
        }
        catch (error) {
            this.logger.error('Error logging search:', error);
        }
    }
    async healthCheck() {
        try {
            const health = await this.client.cluster.health();
            return {
                status: 'healthy',
                cluster: health
            };
        }
        catch (error) {
            this.logger.error('Elasticsearch health check failed:', error);
            return {
                status: 'unhealthy',
                cluster: null
            };
        }
    }
};
exports.ElasticsearchService = ElasticsearchService;
exports.ElasticsearchService = ElasticsearchService = ElasticsearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ElasticsearchService);
//# sourceMappingURL=elasticsearch.service.js.map