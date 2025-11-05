import { HRService } from '../../../services/hr.service';
import { CreateEmployeeProfileInput, UpdateEmployeeProfileInput } from '../../inputs/hr/employee-profile.input';
export declare class EmployeeProfileResolver {
    private hrService;
    constructor(hrService: HRService);
    createEmployeeProfile(input: CreateEmployeeProfileInput, currentUser: any): Promise<any>;
    employeeProfile(id: string): Promise<any>;
    employeeProfileByUserId(userId: string): Promise<any>;
    employeeProfileByCode(employeeCode: string): Promise<any>;
    listEmployeeProfiles(department?: string, position?: string, isActive?: boolean, skip?: number, take?: number): Promise<any>;
    updateEmployeeProfile(id: string, input: UpdateEmployeeProfileInput, currentUser: any): Promise<any>;
    deleteEmployeeProfile(id: string): Promise<any>;
}
