import { PrismaService } from '../prisma/prisma.service';
import { CreateCallCenterConfigInput, UpdateCallCenterConfigInput, SyncCallCenterInput, CallCenterRecordFiltersInput } from '../graphql/inputs/callcenter.input';
import { PaginationInput } from '../graphql/models/pagination.model';
export declare class CallCenterService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getConfig(): Promise<any>;
    createConfig(input: CreateCallCenterConfigInput): Promise<any>;
    updateConfig(id: string, input: UpdateCallCenterConfigInput): Promise<any>;
    deleteConfig(id: string): Promise<any>;
    syncCallCenterData(input?: SyncCallCenterInput): Promise<{
        success: boolean;
        message: string;
        syncLogId: any;
        recordsFetched: number;
        recordsCreated: number;
        recordsUpdated: number;
    }>;
    private buildApiUrl;
    private formatDate;
    handleScheduledSync(): Promise<void>;
    getRecords(pagination: PaginationInput, filters?: CallCenterRecordFiltersInput): Promise<{
        items: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: any;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getRecordById(id: string): Promise<any>;
    getSyncLogs(pagination: PaginationInput): Promise<{
        items: any;
        total: any;
    }>;
}
