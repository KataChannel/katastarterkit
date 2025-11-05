import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeProfileInput, UpdateEmployeeProfileInput, CreateEmploymentHistoryInput, UpdateEmploymentHistoryInput, CreateOnboardingChecklistInput, UpdateOnboardingChecklistInput, CreateOffboardingProcessInput, UpdateOffboardingProcessInput } from '../graphql/inputs/hr';
import { OnboardingStatus, OffboardingStatus, ClearanceStatus } from '../graphql/models/hr/enums.model';
export declare class HRService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createEmployeeProfile(input: CreateEmployeeProfileInput): Promise<any>;
    getEmployeeProfile(id: string): Promise<any>;
    getEmployeeProfileByUserId(userId: string): Promise<any>;
    getEmployeeProfileByCode(employeeCode: string): Promise<any>;
    listEmployeeProfiles(filters?: {
        department?: string;
        position?: string;
        isActive?: boolean;
        skip?: number;
        take?: number;
    }): Promise<{
        employees: any;
        total: any;
        hasMore: boolean;
    }>;
    updateEmployeeProfile(id: string, input: UpdateEmployeeProfileInput): Promise<any>;
    deleteEmployeeProfile(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createEmploymentHistory(input: CreateEmploymentHistoryInput): Promise<any>;
    getEmploymentHistory(employeeProfileId: string): Promise<any>;
    updateEmploymentHistory(id: string, input: UpdateEmploymentHistoryInput): Promise<any>;
    createOnboardingChecklist(input: CreateOnboardingChecklistInput): Promise<any>;
    getOnboardingChecklist(id: string): Promise<any>;
    getOnboardingChecklistByEmployee(employeeProfileId: string): Promise<any>;
    listOnboardingChecklists(filters?: {
        status?: OnboardingStatus;
        skip?: number;
        take?: number;
    }): Promise<{
        checklists: any;
        total: any;
        hasMore: boolean;
    }>;
    updateOnboardingChecklist(id: string, input: UpdateOnboardingChecklistInput): Promise<any>;
    completeOnboardingTask(checklistId: string, taskId: string, completedBy: string): Promise<any>;
    createOffboardingProcess(input: CreateOffboardingProcessInput): Promise<any>;
    getOffboardingProcess(id: string): Promise<any>;
    listOffboardingProcesses(filters?: {
        status?: OffboardingStatus;
        clearanceStatus?: ClearanceStatus;
        skip?: number;
        take?: number;
    }): Promise<{
        processes: any;
        total: any;
        hasMore: boolean;
    }>;
    updateOffboardingProcess(id: string, input: UpdateOffboardingProcessInput): Promise<any>;
    completeOffboarding(id: string, completedBy: string): Promise<any>;
    getHRStatistics(): Promise<{
        totalEmployees: any;
        activeEmployees: any;
        inactiveEmployees: number;
        onboarding: {
            pending: any;
            inProgress: any;
            total: any;
        };
        offboarding: {
            pending: any;
            inProgress: any;
            total: any;
        };
    }>;
}
