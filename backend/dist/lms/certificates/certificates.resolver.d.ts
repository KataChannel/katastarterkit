import { CertificatesService } from './certificates.service';
export declare class CertificatesResolver {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    generateCertificate(user: any, enrollmentId: string): Promise<{
        id: string;
        enrollmentId: string;
        certificateNumber: string;
        userId: string;
        courseId: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMyCertificates(user: any): Promise<({
        course: {
            title: string;
            slug: string;
            thumbnail: string;
        };
    } & {
        id: string;
        enrollmentId: string;
        certificateNumber: string;
        userId: string;
        courseId: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCertificate(user: any, id: string): Promise<{
        user: {
            username: string;
            firstName: string;
            lastName: string;
        };
        course: {
            title: string;
            slug: string;
            thumbnail: string;
            duration: number;
        };
    } & {
        id: string;
        enrollmentId: string;
        certificateNumber: string;
        userId: string;
        courseId: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyCertificate(certificateNumber: string): Promise<{
        valid: boolean;
        certificate: {
            user: {
                username: string;
                firstName: string;
                lastName: string;
            };
            course: {
                title: string;
                thumbnail: string;
            };
        } & {
            id: string;
            enrollmentId: string;
            certificateNumber: string;
            userId: string;
            courseId: string;
            issueDate: Date;
            courseName: string;
            instructorName: string;
            completionDate: Date;
            grade: string | null;
            verificationUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getCertificateStats(user: any): Promise<{
        total: number;
        thisMonth: number;
        thisYear: number;
    }>;
}
