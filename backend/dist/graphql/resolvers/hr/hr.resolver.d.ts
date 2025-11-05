import { HRService } from '../../../services/hr.service';
import { CreateOnboardingChecklistInput, UpdateOnboardingChecklistInput } from '../../inputs/hr/onboarding-checklist.input';
import { CreateOffboardingProcessInput, UpdateOffboardingProcessInput } from '../../inputs/hr/offboarding-process.input';
import { CreateEmploymentHistoryInput, UpdateEmploymentHistoryInput } from '../../inputs/hr/employment-history.input';
import { OnboardingStatus, OffboardingStatus, ClearanceStatus } from '../../models/hr/enums.model';
export declare class OnboardingResolver {
    private hrService;
    constructor(hrService: HRService);
    createOnboardingChecklist(input: CreateOnboardingChecklistInput, currentUser: any): Promise<any>;
    onboardingChecklist(id: string): Promise<any>;
    onboardingChecklistByEmployee(employeeProfileId: string): Promise<any>;
    listOnboardingChecklists(status?: OnboardingStatus, skip?: number, take?: number): Promise<any>;
    updateOnboardingChecklist(id: string, input: UpdateOnboardingChecklistInput): Promise<any>;
    completeOnboardingTask(checklistId: string, taskId: string, currentUser: any): Promise<any>;
}
export declare class OffboardingResolver {
    private hrService;
    constructor(hrService: HRService);
    createOffboardingProcess(input: CreateOffboardingProcessInput): Promise<any>;
    offboardingProcess(id: string): Promise<any>;
    listOffboardingProcesses(status?: OffboardingStatus, clearanceStatus?: ClearanceStatus, skip?: number, take?: number): Promise<any>;
    updateOffboardingProcess(id: string, input: UpdateOffboardingProcessInput): Promise<any>;
    completeOffboarding(id: string, currentUser: any): Promise<any>;
}
export declare class EmploymentHistoryResolver {
    private hrService;
    constructor(hrService: HRService);
    createEmploymentHistory(input: CreateEmploymentHistoryInput): Promise<any>;
    employmentHistory(employeeProfileId: string): Promise<any>;
    updateEmploymentHistory(id: string, input: UpdateEmploymentHistoryInput): Promise<any>;
}
export declare class HRStatisticsResolver {
    private hrService;
    constructor(hrService: HRService);
    hrStatistics(): Promise<any>;
}
