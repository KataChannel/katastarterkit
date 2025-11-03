import { CertificatesService } from './certificates.service';
export declare class CertificatesResolver {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    generateCertificate(user: any, enrollmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
    }>;
    getMyCertificates(user: any): Promise<({
        course: {
            title: string;
            slug: string;
            thumbnail: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            courseId: string;
            issueDate: Date;
            enrollmentId: string;
            certificateNumber: string;
            courseName: string;
            instructorName: string;
            completionDate: Date;
            grade: string | null;
            verificationUrl: string | null;
        };
    }>;
    getCertificateStats(user: any): Promise<{
        total: number;
        thisMonth: number;
        thisYear: number;
    }>;
}
